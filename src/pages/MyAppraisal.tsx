import { useState, useEffect } from 'react';
import { Send, FileText, Calendar, Clock, CheckCircle, AlertCircle, Plus, Eye, Trash2, Sparkles, BookOpen, Users } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { 
  AppraisalCycle, 
  Appraisal, 
  ResearchEntry,
  AdminContribution,
  getAppraisalCycles, 
  getAppraisalsByEmployee,
  getAppraisalByEmployeeAndCycle,
  createOrUpdateAppraisal,
  calculateAttendanceSummary,
  generateAIScoresForEntry,
  generateSystemScores,
  getAvailableMonthsForAppraisal,
} from '@/lib/appraisalData';
import { addAuditLog } from '@/lib/storage';
import { toast } from 'sonner';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'];

export default function MyAppraisal() {
  const { user } = useAuth();
  const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
  const [cycles, setCycles] = useState<AppraisalCycle[]>([]);
  const [selectedAppraisal, setSelectedAppraisal] = useState<Appraisal | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [availableMonths, setAvailableMonths] = useState<number[]>([]);

  // Research entry form
  const [researchEntries, setResearchEntries] = useState<ResearchEntry[]>([]);
  const [newResearch, setNewResearch] = useState({ title: '', description: '', type: 'journal' as ResearchEntry['type'] });
  
  // Admin contribution form
  const [adminContributions, setAdminContributions] = useState<AdminContribution[]>([]);
  const [newAdmin, setNewAdmin] = useState({ title: '', description: '', category: 'committee' as AdminContribution['category'] });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const available = getAvailableMonthsForAppraisal(user.id, selectedYear);
      setAvailableMonths(available);
      if (available.length > 0 && !available.includes(selectedMonth || 0)) {
        setSelectedMonth(available[available.length - 1]); // Most recent available month
      }
    }
  }, [selectedYear, user]);

  const loadData = () => {
    if (!user) return;
    const allCycles = getAppraisalCycles();
    setCycles(allCycles);
    
    const userAppraisals = getAppraisalsByEmployee(user.id);
    setAppraisals(userAppraisals.sort((a, b) => {
      // Sort by year then month descending
      if (a.year !== b.year) return b.year - a.year;
      return (b.month || 0) - (a.month || 0);
    }));
  };

  const handleCreateAppraisal = () => {
    if (!user || !selectedMonth) {
      toast.error('Please select a month');
      return;
    }

    const cycle = cycles.find(c => c.cycleType === 'monthly' && c.month === selectedMonth && c.year === selectedYear);
    
    const attendanceSummary = calculateAttendanceSummary(user.id);
    const systemScores = generateSystemScores(user.id, attendanceSummary);

    const newAppraisal: Omit<Appraisal, 'id'> = {
      cycleId: cycle?.id || `${MONTHS[selectedMonth - 1].toLowerCase().slice(0, 3)}-${selectedYear}`,
      cycleName: `${MONTHS[selectedMonth - 1]} ${selectedYear}`,
      cycleType: 'monthly',
      month: selectedMonth,
      year: selectedYear,
      employeeId: user.id,
      employeeName: user.name,
      department: 'Faculty',
      status: 'Self Assessment',
      researchEntries: [],
      adminContributions: [],
      systemScores,
      selfAssessments: [],
      reviewerAssessments: [],
      attendanceSummary,
    };

    const saved = createOrUpdateAppraisal(newAppraisal);
    addAuditLog('Created', 'Appraisal', `${user.name} started monthly appraisal for ${MONTHS[selectedMonth - 1]} ${selectedYear}`);
    
    loadData();
    setIsCreateDialogOpen(false);
    setSelectedAppraisal(saved);
    setResearchEntries([]);
    setAdminContributions([]);
    setIsViewDialogOpen(true);
    toast.success(`Appraisal created for ${MONTHS[selectedMonth - 1]} ${selectedYear}`);
  };

  const handleViewAppraisal = (appraisal: Appraisal) => {
    setSelectedAppraisal(appraisal);
    setResearchEntries(appraisal.researchEntries || []);
    setAdminContributions(appraisal.adminContributions || []);
    setIsViewDialogOpen(true);
  };

  const handleAddResearch = () => {
    if (!newResearch.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const entry: ResearchEntry = {
      id: Date.now().toString(),
      title: newResearch.title,
      description: newResearch.description,
      type: newResearch.type,
      documents: ['document.pdf'], // Simulated upload
      submittedAt: new Date().toISOString(),
    };

    setResearchEntries([...researchEntries, entry]);
    setNewResearch({ title: '', description: '', type: 'journal' });
    toast.success('Research entry added');
  };

  const handleRemoveResearch = (id: string) => {
    setResearchEntries(researchEntries.filter(r => r.id !== id));
  };

  const handleAddAdmin = () => {
    if (!newAdmin.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const contribution: AdminContribution = {
      id: Date.now().toString(),
      title: newAdmin.title,
      description: newAdmin.description,
      category: newAdmin.category,
      submittedAt: new Date().toISOString(),
    };

    setAdminContributions([...adminContributions, contribution]);
    setNewAdmin({ title: '', description: '', category: 'committee' });
    toast.success('Contribution added');
  };

  const handleRemoveAdmin = (id: string) => {
    setAdminContributions(adminContributions.filter(a => a.id !== id));
  };

  const handleSaveDraft = () => {
    if (!selectedAppraisal) return;

    const aiScores = generateAIScoresForEntry(researchEntries, adminContributions);

    const updated: Appraisal = {
      ...selectedAppraisal,
      researchEntries,
      adminContributions,
      aiGeneratedScores: aiScores,
      status: 'Self Assessment',
    };

    createOrUpdateAppraisal(updated);
    loadData();
    toast.success('Draft saved successfully');
  };

  const handleSubmitAppraisal = () => {
    if (!selectedAppraisal) return;

    const aiScores = generateAIScoresForEntry(researchEntries, adminContributions);

    // Build self assessments from all scores
    const selfAssessments = [
      { criterionId: 'teaching', criterionName: 'Teaching Performance', score: selectedAppraisal.systemScores?.teaching || 7, comments: 'System-generated from Teaching Performance module' },
      { criterionId: 'research', criterionName: 'Research & Publications', score: aiScores.research, comments: aiScores.reasoning },
      { criterionId: 'admin', criterionName: 'Administrative Contribution', score: aiScores.admin, comments: `Based on ${adminContributions.length} contribution(s)` },
      { criterionId: 'feedback', criterionName: 'Student Feedback', score: selectedAppraisal.systemScores?.studentFeedback || 7, comments: 'System-generated from Student Feedback module' },
      { criterionId: 'attendance', criterionName: 'Attendance', score: selectedAppraisal.systemScores?.attendance || 8, comments: 'System-generated from Attendance module' },
    ];

    const updated: Appraisal = {
      ...selectedAppraisal,
      researchEntries,
      adminContributions,
      aiGeneratedScores: aiScores,
      selfAssessments,
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
    };

    createOrUpdateAppraisal(updated);
    addAuditLog('Submitted', 'Appraisal', `${selectedAppraisal.employeeName} submitted appraisal for ${selectedAppraisal.cycleName}`);
    
    loadData();
    setIsViewDialogOpen(false);
    setSelectedAppraisal(null);
    toast.success('Appraisal submitted successfully');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Self Assessment':
        return <Badge variant="secondary"><FileText className="w-3 h-3 mr-1" />Draft</Badge>;
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

  const getCycleTypeBadge = (appraisal: Appraisal) => {
    if (appraisal.cycleType === 'annual') {
      return <Badge variant="outline" className="ml-2">Annual Summary</Badge>;
    }
    return null;
  };

  const isEditable = (appraisal: Appraisal) => {
    return appraisal.status === 'Self Assessment' || appraisal.status === 'Not Started';
  };

  return (
    <AppLayout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">My Appraisal</h1>
          <p className="page-description">View and manage your monthly performance appraisals</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Create Appraisal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Monthly Appraisal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Month</Label>
                <Select value={selectedMonth ? selectedMonth.toString() : undefined} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMonths.map(m => (
                      <SelectItem key={m} value={m.toString()}>{MONTHS[m - 1]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableMonths.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No active appraisal cycles available for {selectedYear}. 
                    Please contact HR to activate cycles.
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateAppraisal} disabled={!selectedMonth || availableMonths.length === 0}>
                Create Appraisal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Appraisals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{appraisals.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">
              {appraisals.filter(a => a.status === 'Self Assessment').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {appraisals.filter(a => a.status === 'Submitted').length}
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

      {/* Appraisals List */}
      <Card>
        <CardHeader>
          <CardTitle>My Appraisals</CardTitle>
          <CardDescription>Monthly and annual appraisal submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Research</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Final Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appraisals.map((appraisal) => (
                <TableRow key={appraisal.id}>
                  <TableCell className="font-medium">{appraisal.cycleName}</TableCell>
                  <TableCell>
                    <Badge variant={appraisal.cycleType === 'annual' ? 'default' : 'outline'}>
                      {appraisal.cycleType === 'annual' ? 'Annual' : 'Monthly'}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(appraisal.status)}</TableCell>
                  <TableCell>{appraisal.researchEntries?.length || 0} entries</TableCell>
                  <TableCell>{appraisal.adminContributions?.length || 0} items</TableCell>
                  <TableCell>
                    {appraisal.finalScore ? (
                      <span className="font-bold">{appraisal.finalScore.toFixed(1)}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => handleViewAppraisal(appraisal)}>
                      <Eye className="w-4 h-4 mr-1" />
                      {isEditable(appraisal) ? 'Edit' : 'View'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {appraisals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No appraisals found. Create one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View/Edit Appraisal Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle>{selectedAppraisal?.cycleName} Appraisal</DialogTitle>
              {selectedAppraisal && getStatusBadge(selectedAppraisal.status)}
              {selectedAppraisal && getCycleTypeBadge(selectedAppraisal)}
            </div>
          </DialogHeader>

          {selectedAppraisal && (
            <Tabs defaultValue="research" className="space-y-4">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="research">Research</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
                <TabsTrigger value="system">System Scores</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              {/* Research & Publications Tab */}
              <TabsContent value="research" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Research & Publications
                    </CardTitle>
                    <CardDescription>Add your research publications and academic contributions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Existing entries */}
                    {researchEntries.map((entry) => (
                      <div key={entry.id} className="flex items-start justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{entry.title}</p>
                            <Badge variant="outline" className="text-xs capitalize">{entry.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{entry.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <FileText className="w-3 h-3" />
                            {entry.documents.length} document(s) attached
                          </div>
                        </div>
                        {isEditable(selectedAppraisal) && (
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveResearch(entry.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}

                    {/* Add new entry form */}
                    {isEditable(selectedAppraisal) && (
                      <Card className="border-dashed">
                        <CardContent className="pt-4 space-y-3">
                          <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2 space-y-2">
                              <Label>Title</Label>
                              <Input 
                                value={newResearch.title}
                                onChange={(e) => setNewResearch({...newResearch, title: e.target.value})}
                                placeholder="Publication title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Type</Label>
                              <Select value={newResearch.type} onValueChange={(v: ResearchEntry['type']) => setNewResearch({...newResearch, type: v})}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="journal">Journal</SelectItem>
                                  <SelectItem value="conference">Conference</SelectItem>
                                  <SelectItem value="book">Book/Chapter</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea 
                              value={newResearch.description}
                              onChange={(e) => setNewResearch({...newResearch, description: e.target.value})}
                              placeholder="Brief description (journal name, conference, impact factor, etc.)"
                              rows={2}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <FileText className="w-4 h-4" />
                              <span>Upload document (UI demo)</span>
                              <Button variant="ghost" size="sm">Browse</Button>
                            </div>
                            <Button onClick={handleAddResearch}>
                              <Plus className="w-4 h-4 mr-1" />Add Entry
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {researchEntries.length === 0 && !isEditable(selectedAppraisal) && (
                      <p className="text-center text-muted-foreground py-4">No research entries submitted</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Administrative Contributions Tab */}
              <TabsContent value="admin" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Administrative Contributions
                    </CardTitle>
                    <CardDescription>Add your committee work, coordination roles, and mentoring activities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Existing contributions */}
                    {adminContributions.map((contrib) => (
                      <div key={contrib.id} className="flex items-start justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{contrib.title}</p>
                            <Badge variant="outline" className="text-xs capitalize">{contrib.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{contrib.description}</p>
                        </div>
                        {isEditable(selectedAppraisal) && (
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveAdmin(contrib.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}

                    {/* Add new contribution form */}
                    {isEditable(selectedAppraisal) && (
                      <Card className="border-dashed">
                        <CardContent className="pt-4 space-y-3">
                          <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2 space-y-2">
                              <Label>Title</Label>
                              <Input 
                                value={newAdmin.title}
                                onChange={(e) => setNewAdmin({...newAdmin, title: e.target.value})}
                                placeholder="Contribution title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Category</Label>
                              <Select value={newAdmin.category} onValueChange={(v: AdminContribution['category']) => setNewAdmin({...newAdmin, category: v})}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="committee">Committee</SelectItem>
                                  <SelectItem value="coordination">Coordination</SelectItem>
                                  <SelectItem value="mentoring">Mentoring</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea 
                              value={newAdmin.description}
                              onChange={(e) => setNewAdmin({...newAdmin, description: e.target.value})}
                              placeholder="Brief description of your contribution"
                              rows={2}
                            />
                          </div>
                          <div className="flex justify-end">
                            <Button onClick={handleAddAdmin}>
                              <Plus className="w-4 h-4 mr-1" />Add Contribution
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {adminContributions.length === 0 && !isEditable(selectedAppraisal) && (
                      <p className="text-center text-muted-foreground py-4">No administrative contributions submitted</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* System Scores Tab (Read-only) */}
              <TabsContent value="system" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>System-Generated Scores</CardTitle>
                    <CardDescription>These scores are automatically derived from respective modules (read-only)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-4 text-center">
                          <p className="text-3xl font-bold text-blue-600">
                            {selectedAppraisal.systemScores?.teaching || '-'}/10
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">Teaching Performance</p>
                          <p className="text-xs text-muted-foreground mt-2">From Teaching Module</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-purple-50 border-purple-200">
                        <CardContent className="pt-4 text-center">
                          <p className="text-3xl font-bold text-purple-600">
                            {selectedAppraisal.systemScores?.studentFeedback || '-'}/10
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">Student Feedback</p>
                          <p className="text-xs text-muted-foreground mt-2">From Student Surveys</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="pt-4 text-center">
                          <p className="text-3xl font-bold text-green-600">
                            {selectedAppraisal.systemScores?.attendance || '-'}/10
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">Attendance</p>
                          <p className="text-xs text-muted-foreground mt-2">From Attendance Module</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Attendance Summary */}
                    {selectedAppraisal.attendanceSummary && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Attendance Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-5 gap-2 text-center">
                            <div className="p-2 rounded bg-muted">
                              <p className="text-lg font-bold">{selectedAppraisal.attendanceSummary.totalWorkingDays}</p>
                              <p className="text-xs text-muted-foreground">Working Days</p>
                            </div>
                            <div className="p-2 rounded bg-green-50">
                              <p className="text-lg font-bold text-green-600">{selectedAppraisal.attendanceSummary.presentDays}</p>
                              <p className="text-xs text-muted-foreground">Present</p>
                            </div>
                            <div className="p-2 rounded bg-red-50">
                              <p className="text-lg font-bold text-red-600">{selectedAppraisal.attendanceSummary.absentDays}</p>
                              <p className="text-xs text-muted-foreground">Absent</p>
                            </div>
                            <div className="p-2 rounded bg-yellow-50">
                              <p className="text-lg font-bold text-yellow-600">{selectedAppraisal.attendanceSummary.leaveDays}</p>
                              <p className="text-xs text-muted-foreground">Leave</p>
                            </div>
                            <div className="p-2 rounded bg-blue-50">
                              <p className="text-lg font-bold text-blue-600">{selectedAppraisal.attendanceSummary.attendancePercentage}%</p>
                              <p className="text-xs text-muted-foreground">Rate</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-4">
                {/* AI Generated Scores */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <CardTitle>AI-Suggested Scores</CardTitle>
                      <Badge variant="secondary" className="text-xs">AI-ASSISTED (Demo)</Badge>
                    </div>
                    <CardDescription>Scores generated based on your Research & Admin submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedAppraisal.aiGeneratedScores ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-background border">
                            <p className="text-3xl font-bold text-primary">{selectedAppraisal.aiGeneratedScores.research}/10</p>
                            <p className="text-sm text-muted-foreground">Research & Publications</p>
                          </div>
                          <div className="p-4 rounded-lg bg-background border">
                            <p className="text-3xl font-bold text-primary">{selectedAppraisal.aiGeneratedScores.admin}/10</p>
                            <p className="text-sm text-muted-foreground">Administrative Contribution</p>
                          </div>
                        </div>
                        <div className="p-3 rounded bg-background border text-sm">
                          <p className="font-medium mb-1">AI Reasoning:</p>
                          <p className="text-muted-foreground">{selectedAppraisal.aiGeneratedScores.reasoning}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <p>AI scores will be generated when you add Research & Admin entries</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Overall Score Summary */}
                {selectedAppraisal.status === 'Completed' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Final Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 rounded-lg border">
                          <p className="text-4xl font-bold">{selectedAppraisal.finalScore?.toFixed(1)}</p>
                          <p className="text-muted-foreground">Final Score</p>
                        </div>
                        <div className="text-center p-4 rounded-lg border">
                          <Badge className={
                            selectedAppraisal.performanceCategory === 'Excellent' ? 'bg-green-100 text-green-800' :
                            selectedAppraisal.performanceCategory === 'Good' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {selectedAppraisal.performanceCategory}
                          </Badge>
                          <p className="text-muted-foreground mt-2">Performance Category</p>
                        </div>
                      </div>

                      {selectedAppraisal.aiInsights && (
                        <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <Badge variant="secondary" className="text-xs">AI-ASSISTED (Demo)</Badge>
                          </div>
                          <p className="text-sm">{selectedAppraisal.aiInsights.overallSummary}</p>
                          
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="font-medium text-sm mb-2">Strengths:</p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {selectedAppraisal.aiInsights.strengths.map((s, i) => (
                                  <li key={i}>• {s}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-sm mb-2">Areas for Improvement:</p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {selectedAppraisal.aiInsights.areasForImprovement.map((a, i) => (
                                  <li key={i}>• {a}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Submission preview for draft */}
                {isEditable(selectedAppraisal) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Submission Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-5 gap-2 text-center text-sm">
                        <div className="p-3 rounded border">
                          <p className="font-bold">{selectedAppraisal.systemScores?.teaching || '-'}</p>
                          <p className="text-xs text-muted-foreground">Teaching</p>
                        </div>
                        <div className="p-3 rounded border">
                          <p className="font-bold">{researchEntries.length > 0 ? generateAIScoresForEntry(researchEntries, []).research : '-'}</p>
                          <p className="text-xs text-muted-foreground">Research</p>
                        </div>
                        <div className="p-3 rounded border">
                          <p className="font-bold">{adminContributions.length > 0 ? generateAIScoresForEntry([], adminContributions).admin : '-'}</p>
                          <p className="text-xs text-muted-foreground">Admin</p>
                        </div>
                        <div className="p-3 rounded border">
                          <p className="font-bold">{selectedAppraisal.systemScores?.studentFeedback || '-'}</p>
                          <p className="text-xs text-muted-foreground">Feedback</p>
                        </div>
                        <div className="p-3 rounded border">
                          <p className="font-bold">{selectedAppraisal.systemScores?.attendance || '-'}</p>
                          <p className="text-xs text-muted-foreground">Attendance</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            {selectedAppraisal && isEditable(selectedAppraisal) && (
              <>
                <Button variant="secondary" onClick={handleSaveDraft}>Save Draft</Button>
                <Button onClick={handleSubmitAppraisal}>
                  <Send className="w-4 h-4 mr-2" />Submit Appraisal
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
