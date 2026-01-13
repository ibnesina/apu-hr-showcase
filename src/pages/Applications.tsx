import { useState, useEffect } from 'react';
import { Eye, Calendar, CheckCircle, XCircle, Users, ChevronRight, Sparkles, FileText, UserCheck, Clock, AlertCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Application,
  JobOpening,
  Interview,
  getApplications,
  getJobOpenings,
  updateApplicationStatus,
  addInterview,
  updateInterview,
} from '@/lib/recruitmentData';
import { addAuditLog } from '@/lib/storage';
import { toast } from 'sonner';

const PIPELINE_STAGES: Application['status'][] = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Offered', 'Rejected'];

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);
  const [isDecisionDialogOpen, setIsDecisionDialogOpen] = useState(false);
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('all');
  const [interviewForm, setInterviewForm] = useState({
    scheduledDate: '',
    interviewType: 'Online' as 'Online' | 'In-person',
    panelMembers: '',
    notes: '',
  });
  const [decisionComments, setDecisionComments] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setApplications(getApplications());
    setJobs(getJobOpenings());
  };

  const handleViewApplication = (app: Application) => {
    setSelectedApp(app);
    setIsViewDialogOpen(true);
  };

  const handleMoveToStage = (app: Application, newStatus: Application['status']) => {
    updateApplicationStatus(app.id, newStatus);
    addAuditLog('Updated', 'Application', `Moved ${app.fullName} to ${newStatus}`);
    loadData();
    toast.success(`Application moved to ${newStatus}`);
  };

  const handleScheduleInterview = () => {
    if (!selectedApp || !interviewForm.scheduledDate) {
      toast.error('Please fill in interview details');
      return;
    }

    addInterview(selectedApp.id, {
      scheduledDate: interviewForm.scheduledDate,
      interviewType: interviewForm.interviewType,
      panelMembers: interviewForm.panelMembers.split(',').map(p => p.trim()),
      notes: interviewForm.notes,
      outcome: 'Pending',
    });

    addAuditLog('Scheduled', 'Interview', `Interview scheduled for ${selectedApp.fullName}`);
    loadData();
    setIsInterviewDialogOpen(false);
    setInterviewForm({ scheduledDate: '', interviewType: 'Online', panelMembers: '', notes: '' });
    toast.success('Interview scheduled successfully');
  };

  const handleMakeDecision = (decision: 'Offered' | 'Rejected') => {
    if (!selectedApp) return;

    updateApplicationStatus(selectedApp.id, decision, decisionComments);
    addAuditLog('Decision', 'Application', `${selectedApp.fullName} ${decision.toLowerCase()}`);
    loadData();
    setIsDecisionDialogOpen(false);
    setIsViewDialogOpen(false);
    setDecisionComments('');
    
    if (decision === 'Offered') {
      toast.success('Offer extended to candidate');
    } else {
      toast.info('Application rejected');
    }
  };

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'Applied':
        return <Badge variant="secondary"><FileText className="w-3 h-3 mr-1" />Applied</Badge>;
      case 'Shortlisted':
        return <Badge className="bg-blue-100 text-blue-800"><UserCheck className="w-3 h-3 mr-1" />Shortlisted</Badge>;
      case 'Interview Scheduled':
        return <Badge className="bg-purple-100 text-purple-800"><Calendar className="w-3 h-3 mr-1" />Interview</Badge>;
      case 'Offered':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Offered</Badge>;
      case 'Rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredApps = selectedJobFilter === 'all' 
    ? applications 
    : applications.filter(a => a.jobId === selectedJobFilter);

  const getStageCount = (status: Application['status']) => 
    filteredApps.filter(a => a.status === status).length;

  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">Applications</h1>
        <p className="page-description">Track and manage candidate applications through the hiring pipeline</p>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {PIPELINE_STAGES.map((stage, index) => (
          <Card key={stage} className={`${stage === 'Rejected' ? 'opacity-60' : ''}`}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase">{stage}</span>
                {index < PIPELINE_STAGES.length - 1 && index !== 3 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-2xl font-bold">{getStageCount(stage)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="flex items-center gap-4">
            <Label>Filter by Job:</Label>
            <Select value={selectedJobFilter} onValueChange={setSelectedJobFilter}>
              <SelectTrigger className="w-80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobs.map(job => (
                  <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>
            {filteredApps.length} application(s) {selectedJobFilter !== 'all' && 'for selected position'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>AI Match</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{app.fullName}</p>
                      <p className="text-xs text-muted-foreground">{app.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{app.jobTitle}</TableCell>
                  <TableCell>
                    {app.aiInsights && (
                      <div className="flex items-center gap-2">
                        <Progress value={app.aiInsights.skillMatchScore} className="w-16 h-2" />
                        <span className="text-sm font-medium">{app.aiInsights.skillMatchScore}%</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell>{app.appliedAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewApplication(app)}>
                        <Eye className="w-4 h-4 mr-1" />View
                      </Button>
                      {app.status === 'Applied' && (
                        <Button size="sm" variant="secondary" onClick={() => handleMoveToStage(app, 'Shortlisted')}>
                          Shortlist
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredApps.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{selectedApp?.fullName}</DialogTitle>
              {selectedApp && getStatusBadge(selectedApp.status)}
            </div>
            <p className="text-sm text-muted-foreground">{selectedApp?.jobTitle}</p>
          </DialogHeader>

          {selectedApp && (
            <Tabs defaultValue="profile" className="space-y-4">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="ai-insights">
                  <Sparkles className="w-3 h-3 mr-1" />AI Insights
                </TabsTrigger>
                <TabsTrigger value="interviews">Interviews ({selectedApp.interviews.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p>{selectedApp.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p>{selectedApp.phone}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedApp.education}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedApp.experience}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Resume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedApp.resumeFileName}</span>
                      <Button size="sm" variant="link">Download</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai-insights" className="space-y-4">
                {selectedApp.aiInsights ? (
                  <>
                    <Card className="border-2 border-dashed border-primary/30">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <CardTitle className="text-sm">AI-ASSISTED CANDIDATE INSIGHTS</CardTitle>
                          <Badge variant="outline" className="text-xs">SYSTEM GENERATED</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          AI-ASSISTED (Demo) - Generated based on application data
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Skill Match Score */}
                        <div>
                          <Label className="text-sm font-medium">Skill Match Score</Label>
                          <div className="flex items-center gap-4 mt-2">
                            <Progress value={selectedApp.aiInsights.skillMatchScore} className="flex-1 h-3" />
                            <span className="text-2xl font-bold text-primary">
                              {selectedApp.aiInsights.skillMatchScore}%
                            </span>
                          </div>
                        </div>

                        <Separator />

                        {/* Resume Summary */}
                        <div>
                          <Label className="text-sm font-medium">Resume Summary</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedApp.aiInsights.resumeSummary}
                          </p>
                        </div>

                        <Separator />

                        {/* Strengths */}
                        <div>
                          <Label className="text-sm font-medium text-green-700">Strengths</Label>
                          <ul className="mt-2 space-y-1">
                            {selectedApp.aiInsights.strengths.map((s, i) => (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Skill Gaps */}
                        <div>
                          <Label className="text-sm font-medium text-amber-700">Areas for Consideration</Label>
                          <ul className="mt-2 space-y-1">
                            {selectedApp.aiInsights.skillGaps.map((g, i) => (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-600" />
                                {g}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Separator />

                        {/* Overall Assessment */}
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <Label className="text-sm font-medium">Overall Assessment</Label>
                          <p className="text-sm mt-1">{selectedApp.aiInsights.overallAssessment}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="text-center py-8">
                    <CardContent>
                      <Sparkles className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">AI insights not available</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="interviews" className="space-y-4">
                {selectedApp.interviews.map((interview) => (
                  <Card key={interview.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">
                              {new Date(interview.scheduledDate).toLocaleDateString()} at{' '}
                              {new Date(interview.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <Badge variant="outline">{interview.interviewType}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Panel: {interview.panelMembers.join(', ')}
                          </p>
                          {interview.notes && (
                            <p className="text-sm bg-muted/50 p-2 rounded">{interview.notes}</p>
                          )}
                        </div>
                        <Badge className={
                          interview.outcome === 'Passed' ? 'bg-green-100 text-green-800' :
                          interview.outcome === 'Failed' ? 'bg-red-100 text-red-800' :
                          interview.outcome === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {interview.outcome}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {selectedApp.status !== 'Offered' && selectedApp.status !== 'Rejected' && (
                  <Button onClick={() => setIsInterviewDialogOpen(true)}>
                    <Calendar className="w-4 h-4 mr-2" />Schedule Interview
                  </Button>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="gap-2">
            {selectedApp && selectedApp.status !== 'Offered' && selectedApp.status !== 'Rejected' && (
              <>
                {selectedApp.status === 'Applied' && (
                  <Button variant="secondary" onClick={() => handleMoveToStage(selectedApp, 'Shortlisted')}>
                    <UserCheck className="w-4 h-4 mr-1" />Shortlist
                  </Button>
                )}
                <Button variant="destructive" onClick={() => { setDecisionComments(''); setIsDecisionDialogOpen(true); }}>
                  <XCircle className="w-4 h-4 mr-1" />Reject
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => { setDecisionComments(''); setIsDecisionDialogOpen(true); }}>
                  <CheckCircle className="w-4 h-4 mr-1" />Make Offer
                </Button>
              </>
            )}
            {selectedApp?.status === 'Offered' && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-lg w-full">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Candidate ready for onboarding via HR system</span>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Interview Dialog */}
      <Dialog open={isInterviewDialogOpen} onOpenChange={setIsInterviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date & Time *</Label>
              <Input
                type="datetime-local"
                value={interviewForm.scheduledDate}
                onChange={(e) => setInterviewForm({ ...interviewForm, scheduledDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Interview Type</Label>
              <Select 
                value={interviewForm.interviewType} 
                onValueChange={(v: 'Online' | 'In-person') => setInterviewForm({ ...interviewForm, interviewType: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="In-person">In-person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Panel Members</Label>
              <Input
                value={interviewForm.panelMembers}
                onChange={(e) => setInterviewForm({ ...interviewForm, panelMembers: e.target.value })}
                placeholder="Prof. John, Dr. Jane, HR Manager"
              />
              <p className="text-xs text-muted-foreground">Comma-separated names</p>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={interviewForm.notes}
                onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                placeholder="Interview focus areas, preparation notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInterviewDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleScheduleInterview}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decision Dialog */}
      <Dialog open={isDecisionDialogOpen} onOpenChange={setIsDecisionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hiring Decision</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Candidate: <strong>{selectedApp?.fullName}</strong>
            </p>
            <div className="space-y-2">
              <Label>Final Comments</Label>
              <Textarea
                value={decisionComments}
                onChange={(e) => setDecisionComments(e.target.value)}
                placeholder="Add any final comments or notes..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDecisionDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleMakeDecision('Rejected')}>
              <XCircle className="w-4 h-4 mr-1" />Reject
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleMakeDecision('Offered')}>
              <CheckCircle className="w-4 h-4 mr-1" />Extend Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
