import { useState, useEffect } from 'react';
import { Send, FileText, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  AppraisalCycle, 
  Appraisal, 
  SelfAssessment,
  getAppraisalCycles, 
  getAppraisalByEmployeeAndCycle,
  createOrUpdateAppraisal,
  calculateAttendanceSummary,
} from '@/lib/appraisalData';
import { addAuditLog } from '@/lib/storage';
import { toast } from 'sonner';

export default function MyAppraisal() {
  const { user } = useAuth();
  const [activeCycle, setActiveCycle] = useState<AppraisalCycle | null>(null);
  const [appraisal, setAppraisal] = useState<Appraisal | null>(null);
  const [selfAssessments, setSelfAssessments] = useState<SelfAssessment[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState<Appraisal['attendanceSummary']>();

  useEffect(() => {
    const cycles = getAppraisalCycles();
    const active = cycles.find(c => c.status === 'Active');
    setActiveCycle(active || null);

    if (active && user) {
      const existing = getAppraisalByEmployeeAndCycle(user.id, active.id);
      if (existing) {
        setAppraisal(existing);
        setSelfAssessments(existing.selfAssessments || []);
        setAttendanceSummary(existing.attendanceSummary);
      } else {
        // Initialize empty assessments
        const initialAssessments = active.criteria.map(c => ({
          criterionId: c.id,
          criterionName: c.name,
          score: 5,
          comments: '',
        }));
        setSelfAssessments(initialAssessments);
        setAttendanceSummary(calculateAttendanceSummary(user.id));
      }
    }
  }, [user]);

  const handleScoreChange = (criterionId: string, score: number) => {
    setSelfAssessments(prev => prev.map(a => 
      a.criterionId === criterionId ? { ...a, score } : a
    ));
  };

  const handleCommentsChange = (criterionId: string, comments: string) => {
    setSelfAssessments(prev => prev.map(a => 
      a.criterionId === criterionId ? { ...a, comments } : a
    ));
  };

  const handleSaveDraft = () => {
    if (!activeCycle || !user) return;

    const appraisalData: Omit<Appraisal, 'id'> & { id?: string } = {
      id: appraisal?.id,
      cycleId: activeCycle.id,
      cycleName: activeCycle.name,
      employeeId: user.id,
      employeeName: user.name,
      department: 'Faculty', // Would come from employee data
      status: 'Self Assessment',
      selfAssessments,
      reviewerAssessments: [],
      attendanceSummary,
    };

    const saved = createOrUpdateAppraisal(appraisalData);
    setAppraisal(saved);
    toast.success('Draft saved successfully');
  };

  const handleSubmit = () => {
    if (!activeCycle || !user) return;

    // Validate all fields
    const incomplete = selfAssessments.filter(a => !a.comments.trim());
    if (incomplete.length > 0) {
      toast.error('Please provide comments for all criteria');
      return;
    }

    const appraisalData: Omit<Appraisal, 'id'> & { id?: string } = {
      id: appraisal?.id,
      cycleId: activeCycle.id,
      cycleName: activeCycle.name,
      employeeId: user.id,
      employeeName: user.name,
      department: 'Faculty',
      status: 'Submitted',
      selfAssessments,
      reviewerAssessments: [],
      submittedAt: new Date().toISOString(),
      attendanceSummary,
    };

    createOrUpdateAppraisal(appraisalData);
    addAuditLog('Submitted', 'Appraisal', `${user.name} submitted self-appraisal for ${activeCycle.name}`);
    setAppraisal({ ...appraisalData, id: appraisal?.id || Date.now().toString() } as Appraisal);
    toast.success('Appraisal submitted successfully');
  };

  const getStatusInfo = () => {
    if (!appraisal) return { label: 'Not Started', color: 'bg-gray-100 text-gray-800', icon: Clock };
    switch (appraisal.status) {
      case 'Self Assessment':
        return { label: 'Draft', color: 'bg-yellow-100 text-yellow-800', icon: FileText };
      case 'Submitted':
        return { label: 'Submitted - Pending Review', color: 'bg-blue-100 text-blue-800', icon: Clock };
      case 'Reviewed':
        return { label: 'Reviewed', color: 'bg-purple-100 text-purple-800', icon: CheckCircle };
      case 'Completed':
        return { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      default:
        return { label: appraisal.status, color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const isEditable = !appraisal || appraisal.status === 'Self Assessment' || appraisal.status === 'Not Started';
  const statusInfo = getStatusInfo();

  if (!activeCycle) {
    return (
      <AppLayout>
        <div className="page-header">
          <h1 className="page-title">My Appraisal</h1>
          <p className="page-description">Complete your self-assessment</p>
        </div>
        <Card className="mt-6">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No Active Appraisal Cycle</p>
            <p className="text-muted-foreground mt-2">
              There is no active appraisal cycle at the moment. Please check back later.
            </p>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">My Appraisal</h1>
          <p className="page-description">Complete your self-assessment for {activeCycle.name}</p>
        </div>
        <Badge className={statusInfo.color}>
          <statusInfo.icon className="w-3 h-3 mr-1" />
          {statusInfo.label}
        </Badge>
      </div>

      {/* Cycle Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {activeCycle.name}
          </CardTitle>
          <CardDescription>
            Evaluation Period: {activeCycle.startDate} to {activeCycle.endDate}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="assessment" className="space-y-6">
        <TabsList>
          <TabsTrigger value="assessment">Self Assessment</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Summary</TabsTrigger>
          {appraisal?.status === 'Completed' && (
            <TabsTrigger value="results">Final Results</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="assessment" className="space-y-4">
          {activeCycle.criteria.map((criterion) => {
            const assessment = selfAssessments.find(a => a.criterionId === criterion.id);
            const isAttendance = criterion.id === 'attendance';
            
            return (
              <Card key={criterion.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{criterion.name}</CardTitle>
                      <CardDescription>{criterion.description}</CardDescription>
                    </div>
                    <Badge variant="outline">Weight: {criterion.weightage}%</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Your Score</Label>
                      <span className="text-2xl font-bold">{assessment?.score || 5}/10</span>
                    </div>
                    {isEditable ? (
                      <Slider
                        value={[assessment?.score || 5]}
                        onValueChange={(v) => handleScoreChange(criterion.id, v[0])}
                        min={1}
                        max={10}
                        step={1}
                        className="py-4"
                        disabled={isAttendance}
                      />
                    ) : (
                      <Progress value={(assessment?.score || 5) * 10} className="h-2" />
                    )}
                    {isAttendance && (
                      <p className="text-xs text-muted-foreground">
                        * Attendance score is derived from your attendance records
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Comments & Supporting Evidence</Label>
                    <Textarea
                      value={assessment?.comments || ''}
                      onChange={(e) => handleCommentsChange(criterion.id, e.target.value)}
                      placeholder={`Describe your achievements and evidence for ${criterion.name.toLowerCase()}...`}
                      rows={3}
                      disabled={!isEditable}
                    />
                  </div>
                  {isEditable && !isAttendance && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      <span>Upload supporting documents (UI only)</span>
                      <Button variant="ghost" size="sm">Browse</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {isEditable && (
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" onClick={handleSaveDraft}>
                Save Draft
              </Button>
              <Button onClick={handleSubmit}>
                <Send className="w-4 h-4 mr-2" />
                Submit Appraisal
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>
                Your attendance record for the evaluation period (read-only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceSummary ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <p className="text-3xl font-bold">{attendanceSummary.totalWorkingDays}</p>
                    <p className="text-sm text-muted-foreground">Total Working Days</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-50">
                    <p className="text-3xl font-bold text-green-600">{attendanceSummary.presentDays}</p>
                    <p className="text-sm text-muted-foreground">Present Days</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-red-50">
                    <p className="text-3xl font-bold text-red-600">{attendanceSummary.absentDays}</p>
                    <p className="text-sm text-muted-foreground">Absent Days</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-yellow-50">
                    <p className="text-3xl font-bold text-yellow-600">{attendanceSummary.leaveDays}</p>
                    <p className="text-sm text-muted-foreground">Leave Days</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-orange-50">
                    <p className="text-3xl font-bold text-orange-600">{attendanceSummary.lateCount}</p>
                    <p className="text-sm text-muted-foreground">Late Arrivals</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50">
                    <p className="text-3xl font-bold text-blue-600">{attendanceSummary.attendancePercentage}%</p>
                    <p className="text-sm text-muted-foreground">Attendance Rate</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Attendance data will be loaded from the attendance module.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {appraisal?.status === 'Completed' && (
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Final Appraisal Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 rounded-lg border">
                    <p className="text-4xl font-bold">{appraisal.finalScore?.toFixed(1)}</p>
                    <p className="text-muted-foreground">Final Score</p>
                  </div>
                  <div className="text-center p-6 rounded-lg border">
                    <Badge className={
                      appraisal.performanceCategory === 'Excellent' ? 'bg-green-100 text-green-800' :
                      appraisal.performanceCategory === 'Good' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    } variant="outline">
                      {appraisal.performanceCategory}
                    </Badge>
                    <p className="text-muted-foreground mt-2">Performance Category</p>
                  </div>
                </div>

                {appraisal.aiInsights && (
                  <div className="space-y-4 p-4 rounded-lg bg-muted/50 border">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">AI-ASSISTED (Demo)</Badge>
                      <span className="text-sm text-muted-foreground">System-Generated Insights</span>
                    </div>
                    <p className="text-sm">{appraisal.aiInsights.overallSummary}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </AppLayout>
  );
}
