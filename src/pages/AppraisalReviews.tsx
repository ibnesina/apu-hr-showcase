import { useState, useEffect } from 'react';
import { Eye, Send, CheckCircle, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Appraisal, 
  ReviewerAssessment,
  getAppraisals, 
  getAppraisalCycles,
  createOrUpdateAppraisal,
  generateAIInsights,
  calculateAttendanceScore,
} from '@/lib/appraisalData';
import { addAuditLog } from '@/lib/storage';
import { toast } from 'sonner';

export default function AppraisalReviews() {
  const { user, isAdmin } = useAuth();
  const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
  const [selectedAppraisal, setSelectedAppraisal] = useState<Appraisal | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isFinalizeDialogOpen, setIsFinalizeDialogOpen] = useState(false);
  const [reviewerAssessments, setReviewerAssessments] = useState<ReviewerAssessment[]>([]);

  useEffect(() => {
    loadAppraisals();
  }, []);

  const loadAppraisals = () => {
    const all = getAppraisals();
    // Filter to show submitted and reviewed appraisals
    const filtered = all.filter(a => 
      a.status === 'Submitted' || a.status === 'Reviewed' || a.status === 'Completed'
    );
    setAppraisals(filtered);
  };

  const handleStartReview = (appraisal: Appraisal) => {
    setSelectedAppraisal(appraisal);
    
    // Initialize reviewer assessments from self-assessments
    const cycles = getAppraisalCycles();
    const cycle = cycles.find(c => c.id === appraisal.cycleId);
    
    const initial: ReviewerAssessment[] = appraisal.selfAssessments.map(sa => {
      const isAttendance = sa.criterionId === 'attendance';
      const suggestedScore = isAttendance && appraisal.attendanceSummary 
        ? calculateAttendanceScore(appraisal.attendanceSummary) 
        : sa.score;
      
      return {
        criterionId: sa.criterionId,
        criterionName: sa.criterionName,
        selfScore: sa.score,
        reviewerScore: suggestedScore,
        reviewerComments: '',
        isAttendanceAutoSuggested: isAttendance,
        attendanceAdjusted: false,
      };
    });
    
    setReviewerAssessments(initial);
    setIsReviewDialogOpen(true);
  };

  const handleReviewerScoreChange = (criterionId: string, score: number) => {
    setReviewerAssessments(prev => prev.map(a => 
      a.criterionId === criterionId ? { 
        ...a, 
        reviewerScore: score,
        attendanceAdjusted: a.isAttendanceAutoSuggested ? true : a.attendanceAdjusted 
      } : a
    ));
  };

  const handleReviewerCommentsChange = (criterionId: string, comments: string) => {
    setReviewerAssessments(prev => prev.map(a => 
      a.criterionId === criterionId ? { ...a, reviewerComments: comments } : a
    ));
  };

  const handleSubmitReview = () => {
    if (!selectedAppraisal) return;

    // Validate attendance adjustment comment
    const attendanceAssessment = reviewerAssessments.find(a => a.isAttendanceAutoSuggested && a.attendanceAdjusted);
    if (attendanceAssessment && !attendanceAssessment.reviewerComments.trim()) {
      toast.error('Please provide a comment for adjusted attendance score');
      return;
    }

    // Generate AI insights
    const updatedAppraisal = {
      ...selectedAppraisal,
      reviewerAssessments,
      reviewerId: user?.id,
      reviewerName: user?.name,
      status: 'Reviewed' as const,
      reviewedAt: new Date().toISOString(),
    };

    const aiInsights = generateAIInsights(updatedAppraisal);
    updatedAppraisal.aiInsights = aiInsights;

    createOrUpdateAppraisal(updatedAppraisal);
    addAuditLog('Reviewed', 'Appraisal', `${user?.name} reviewed appraisal for ${selectedAppraisal.employeeName}`);
    
    loadAppraisals();
    setIsReviewDialogOpen(false);
    setSelectedAppraisal(null);
    toast.success('Review submitted successfully');
  };

  const handleViewDetails = (appraisal: Appraisal) => {
    setSelectedAppraisal(appraisal);
    setIsFinalizeDialogOpen(true);
  };

  const [finalScore, setFinalScore] = useState(0);
  const [performanceCategory, setPerformanceCategory] = useState<'Excellent' | 'Good' | 'Needs Improvement'>('Good');
  const [finalRecommendations, setFinalRecommendations] = useState('');

  const handleFinalizeAppraisal = () => {
    if (!selectedAppraisal) return;

    const updatedAppraisal = {
      ...selectedAppraisal,
      status: 'Completed' as const,
      completedAt: new Date().toISOString(),
      finalScore,
      performanceCategory,
      finalRecommendations,
    };

    createOrUpdateAppraisal(updatedAppraisal);
    addAuditLog('Finalized', 'Appraisal', `HR finalized appraisal for ${selectedAppraisal.employeeName} - ${performanceCategory}`);
    
    loadAppraisals();
    setIsFinalizeDialogOpen(false);
    setSelectedAppraisal(null);
    toast.success('Appraisal finalized successfully');
  };

  useEffect(() => {
    if (selectedAppraisal?.reviewerAssessments) {
      const avgScore = selectedAppraisal.reviewerAssessments.reduce((sum, a) => sum + a.reviewerScore, 0) / 
        selectedAppraisal.reviewerAssessments.length;
      setFinalScore(Math.round(avgScore * 10) / 10);
      setPerformanceCategory(avgScore >= 8 ? 'Excellent' : avgScore >= 6 ? 'Good' : 'Needs Improvement');
    }
  }, [selectedAppraisal]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Submitted':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending Review</Badge>;
      case 'Reviewed':
        return <Badge className="bg-purple-100 text-purple-800"><CheckCircle className="w-3 h-3 mr-1" />Reviewed</Badge>;
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">Appraisal Reviews</h1>
        <p className="page-description">Review faculty self-assessments and finalize appraisals</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">
              {appraisals.filter(a => a.status === 'Submitted').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              {appraisals.filter(a => a.status === 'Reviewed').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {appraisals.filter(a => a.status === 'Completed').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Appraisals Table */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Cycle</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appraisals.map((appraisal) => (
              <TableRow key={appraisal.id}>
                <TableCell className="font-medium">{appraisal.employeeName}</TableCell>
                <TableCell>{appraisal.department}</TableCell>
                <TableCell>{appraisal.cycleName}</TableCell>
                <TableCell>{appraisal.submittedAt?.split('T')[0]}</TableCell>
                <TableCell>{getStatusBadge(appraisal.status)}</TableCell>
                <TableCell className="text-right">
                  {appraisal.status === 'Submitted' && (
                    <Button size="sm" onClick={() => handleStartReview(appraisal)}>
                      Start Review
                    </Button>
                  )}
                  {(appraisal.status === 'Reviewed' || appraisal.status === 'Completed') && (
                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(appraisal)}>
                      <Eye className="w-4 h-4 mr-1" />
                      {appraisal.status === 'Reviewed' ? 'Finalize' : 'View'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {appraisals.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No appraisals to review at this time.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Appraisal - {selectedAppraisal?.employeeName}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="assessment" className="space-y-4">
            <TabsList>
              <TabsTrigger value="assessment">Assessment Review</TabsTrigger>
              <TabsTrigger value="attendance">Attendance Data</TabsTrigger>
            </TabsList>

            <TabsContent value="assessment" className="space-y-4">
              {reviewerAssessments.map((assessment) => (
                <Card key={assessment.criterionId}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{assessment.criterionName}</CardTitle>
                      {assessment.isAttendanceAutoSuggested && (
                        <Badge variant="outline" className="text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />Auto-suggested
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label className="text-muted-foreground">Self Score</Label>
                        <div className="mt-2">
                          <Progress value={assessment.selfScore * 10} className="h-2" />
                          <p className="text-right text-sm mt-1">{assessment.selfScore}/10</p>
                        </div>
                      </div>
                      <div>
                        <Label>Reviewer Score</Label>
                        <div className="mt-2">
                          <Slider
                            value={[assessment.reviewerScore]}
                            onValueChange={(v) => handleReviewerScoreChange(assessment.criterionId, v[0])}
                            min={1}
                            max={10}
                            step={1}
                          />
                          <p className="text-right text-sm mt-1 font-bold">{assessment.reviewerScore}/10</p>
                        </div>
                      </div>
                    </div>
                    
                    {assessment.isAttendanceAutoSuggested && assessment.attendanceAdjusted && (
                      <div className="flex items-start gap-2 p-2 rounded bg-yellow-50 border border-yellow-200">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <p className="text-xs text-yellow-800">
                          Attendance score adjusted from system suggestion. Comment required.
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Reviewer Comments</Label>
                      <Textarea
                        value={assessment.reviewerComments}
                        onChange={(e) => handleReviewerCommentsChange(assessment.criterionId, e.target.value)}
                        placeholder="Add your review comments..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="attendance">
              {selectedAppraisal?.attendanceSummary && (
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-muted">
                        <p className="text-2xl font-bold">{selectedAppraisal.attendanceSummary.totalWorkingDays}</p>
                        <p className="text-xs text-muted-foreground">Working Days</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-50">
                        <p className="text-2xl font-bold text-green-600">{selectedAppraisal.attendanceSummary.presentDays}</p>
                        <p className="text-xs text-muted-foreground">Present</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-blue-50">
                        <p className="text-2xl font-bold text-blue-600">{selectedAppraisal.attendanceSummary.attendancePercentage}%</p>
                        <p className="text-xs text-muted-foreground">Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitReview}>
              <Send className="w-4 h-4 mr-2" />Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Finalize Dialog */}
      <Dialog open={isFinalizeDialogOpen} onOpenChange={setIsFinalizeDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAppraisal?.status === 'Completed' ? 'Appraisal Details' : 'Finalize Appraisal'} - {selectedAppraisal?.employeeName}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
              <TabsTrigger value="details">Full Details</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Average Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{finalScore.toFixed(1)}/10</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Performance Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <select 
                      className="text-xl font-bold bg-transparent border-none p-0"
                      value={performanceCategory}
                      onChange={(e) => setPerformanceCategory(e.target.value as typeof performanceCategory)}
                      disabled={selectedAppraisal?.status === 'Completed'}
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Needs Improvement">Needs Improvement</option>
                    </select>
                  </CardContent>
                </Card>
              </div>

              {selectedAppraisal?.status !== 'Completed' && (
                <div className="space-y-2">
                  <Label>Final Recommendations</Label>
                  <Textarea
                    value={finalRecommendations}
                    onChange={(e) => setFinalRecommendations(e.target.value)}
                    placeholder="Enter final recommendations for the employee..."
                    rows={3}
                  />
                </div>
              )}

              {selectedAppraisal?.status === 'Completed' && selectedAppraisal.finalRecommendations && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Final Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedAppraisal.finalRecommendations}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="ai-insights">
              {selectedAppraisal?.aiInsights ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <CardTitle>AI-ASSISTED PERFORMANCE INSIGHTS</CardTitle>
                    </div>
                    <CardDescription>
                      <Badge variant="secondary" className="text-xs">System-Generated Insights (Demo)</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Overall Summary</h4>
                      <p className="text-muted-foreground">{selectedAppraisal.aiInsights.overallSummary}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2 text-green-700">Strengths</h4>
                        <ul className="space-y-1">
                          {selectedAppraisal.aiInsights.strengths.map((s, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-orange-700">Areas for Improvement</h4>
                        <ul className="space-y-1">
                          {selectedAppraisal.aiInsights.areasForImprovement.map((s, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-blue-700">Training Suggestions</h4>
                      <ul className="space-y-1">
                        {selectedAppraisal.aiInsights.trainingSuggestions.map((s, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 border">
                      <h4 className="font-semibold mb-2">Attendance Impact on Performance</h4>
                      <p className="text-sm text-muted-foreground">{selectedAppraisal.aiInsights.attendanceImpact}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    AI insights will be generated after review submission.
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-4">
                {selectedAppraisal?.reviewerAssessments?.map((assessment) => (
                  <Card key={assessment.criterionId}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{assessment.criterionName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Self Score</p>
                          <p className="font-bold">{assessment.selfScore}/10</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Reviewer Score</p>
                          <p className="font-bold">{assessment.reviewerScore}/10</p>
                        </div>
                      </div>
                      {assessment.reviewerComments && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          <span className="font-medium">Comments:</span> {assessment.reviewerComments}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFinalizeDialogOpen(false)}>Close</Button>
            {selectedAppraisal?.status === 'Reviewed' && (
              <Button onClick={handleFinalizeAppraisal}>
                <CheckCircle className="w-4 h-4 mr-2" />Finalize Appraisal
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
