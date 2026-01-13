import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Play, CheckCircle, Calendar } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AppraisalCycle, 
  AppraisalCriterion,
  defaultCriteria,
  getAppraisalCycles, 
  addAppraisalCycle, 
  updateAppraisalCycle, 
  deleteAppraisalCycle,
  getAppraisals,
} from '@/lib/appraisalData';
import { addAuditLog } from '@/lib/storage';
import { toast } from 'sonner';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'];

export default function AppraisalCycles() {
  const [cycles, setCycles] = useState<AppraisalCycle[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState<AppraisalCycle | null>(null);
  const [formData, setFormData] = useState({
    cycleType: 'monthly' as 'monthly' | 'annual',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    status: 'Draft' as AppraisalCycle['status'],
  });
  const [criteria, setCriteria] = useState<AppraisalCriterion[]>(defaultCriteria);

  useEffect(() => {
    loadCycles();
  }, []);

  const loadCycles = () => {
    setCycles(getAppraisalCycles().sort((a, b) => {
      // Sort by year desc, then month desc
      if (a.year !== b.year) return b.year - a.year;
      if (a.cycleType === 'annual' && b.cycleType !== 'annual') return -1;
      if (b.cycleType === 'annual' && a.cycleType !== 'annual') return 1;
      return (b.month || 0) - (a.month || 0);
    }));
  };

  const resetForm = () => {
    setFormData({ 
      cycleType: 'monthly', 
      month: new Date().getMonth() + 1, 
      year: new Date().getFullYear(),
      status: 'Draft' 
    });
    setCriteria(defaultCriteria);
    setEditingCycle(null);
  };

  const getTotalWeightage = () => criteria.reduce((sum, c) => sum + c.weightage, 0);

  const handleCriterionChange = (id: string, field: keyof AppraisalCriterion, value: string | number) => {
    setCriteria(prev => prev.map(c => 
      c.id === id ? { ...c, [field]: field === 'weightage' ? Number(value) : value } : c
    ));
  };

  const getCycleName = () => {
    if (formData.cycleType === 'monthly') {
      return `${MONTHS[formData.month - 1]} ${formData.year}`;
    }
    return `Annual Review ${formData.year}`;
  };

  const getDateRange = () => {
    const year = formData.year || new Date().getFullYear();
    const month = formData.month || 1;
    
    if (formData.cycleType === 'monthly') {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      // Validate dates before calling toISOString
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return { startDate: '', endDate: '' };
      }
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };
    }
    return {
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (getTotalWeightage() !== 100) {
      toast.error('Total weightage must equal 100%');
      return;
    }

    const dates = getDateRange();

    try {
      if (editingCycle) {
        updateAppraisalCycle(editingCycle.id, { 
          name: getCycleName(),
          ...dates,
          criteria,
          cycleType: formData.cycleType,
          month: formData.cycleType === 'monthly' ? formData.month : undefined,
          year: formData.year,
          status: formData.status,
        });
        addAuditLog('Updated', 'Appraisal Cycle', `Updated cycle: ${getCycleName()}`);
        toast.success('Appraisal cycle updated');
      } else {
        addAppraisalCycle({ 
          name: getCycleName(),
          ...dates,
          criteria, 
          createdBy: 'Admin',
          cycleType: formData.cycleType,
          month: formData.cycleType === 'monthly' ? formData.month : undefined,
          year: formData.year,
          status: formData.status,
        });
        addAuditLog('Created', 'Appraisal Cycle', `Created new cycle: ${getCycleName()}`);
        toast.success('Appraisal cycle created');
      }

      // Close dialog first, then update state
      setIsDialogOpen(false);
      resetForm();
      // Use setTimeout to allow dialog animation to complete
      setTimeout(() => {
        loadCycles();
      }, 100);
    } catch (error) {
      console.error('Error saving cycle:', error);
      toast.error('Failed to save appraisal cycle');
    }
  };

  const handleEdit = (cycle: AppraisalCycle) => {
    setEditingCycle(cycle);
    setFormData({
      cycleType: cycle.cycleType,
      month: cycle.month || 1,
      year: cycle.year,
      status: cycle.status,
    });
    setCriteria(cycle.criteria);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteAppraisalCycle(id);
    addAuditLog('Deleted', 'Appraisal Cycle', 'Removed appraisal cycle');
    loadCycles();
    toast.success('Appraisal cycle deleted');
  };

  const handleActivate = (cycle: AppraisalCycle) => {
    updateAppraisalCycle(cycle.id, { status: 'Active' });
    addAuditLog('Activated', 'Appraisal Cycle', `Activated cycle: ${cycle.name}`);
    loadCycles();
    toast.success('Appraisal cycle activated');
  };

  const handleComplete = (cycle: AppraisalCycle) => {
    updateAppraisalCycle(cycle.id, { status: 'Completed' });
    addAuditLog('Completed', 'Appraisal Cycle', `Completed cycle: ${cycle.name}`);
    loadCycles();
    toast.success('Appraisal cycle marked as completed');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'Completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCycleTypeBadge = (cycle: AppraisalCycle) => {
    if (cycle.cycleType === 'annual') {
      return <Badge className="bg-purple-100 text-purple-800">Annual</Badge>;
    }
    return <Badge variant="outline">Monthly</Badge>;
  };

  const monthlyCycles = cycles.filter(c => c.cycleType === 'monthly');
  const annualCycles = cycles.filter(c => c.cycleType === 'annual');

  // Calculate annual summary stats
  const getAnnualStats = (year: number) => {
    const appraisals = getAppraisals().filter(a => a.year === year && a.cycleType === 'monthly' && a.status === 'Completed');
    const monthCount = new Set(appraisals.map(a => a.month)).size;
    const avgScore = appraisals.length > 0 
      ? appraisals.reduce((sum, a) => sum + (a.finalScore || 0), 0) / appraisals.length 
      : 0;
    return { monthCount, avgScore: avgScore.toFixed(1), total: appraisals.length };
  };

  return (
    <AppLayout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Appraisal Cycles</h1>
          <p className="page-description">Create and manage monthly & annual appraisal cycles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Create Cycle</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCycle ? 'Edit Appraisal Cycle' : 'Create Appraisal Cycle'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {/* Cycle Type */}
                <div className="space-y-2">
                  <Label>Cycle Type</Label>
                  <Select 
                    value={formData.cycleType} 
                    onValueChange={(v: 'monthly' | 'annual') => setFormData({...formData, cycleType: v})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annual">Annual (Auto-generated Summary)</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.cycleType === 'annual' && (
                    <p className="text-xs text-muted-foreground">
                      Annual cycles are auto-generated summaries based on monthly appraisals
                    </p>
                  )}
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select 
                    value={formData.year.toString()} 
                    onValueChange={(v) => setFormData({...formData, year: parseInt(v)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Month (only for monthly) */}
                {formData.cycleType === 'monthly' && (
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select 
                      value={formData.month.toString()} 
                      onValueChange={(v) => setFormData({...formData, month: parseInt(v)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((month, index) => (
                          <SelectItem key={index} value={(index + 1).toString()}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Preview */}
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{getCycleName()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Period: {getDateRange().startDate} to {getDateRange().endDate}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Evaluation Criteria</Label>
                  <Badge variant={getTotalWeightage() === 100 ? "default" : "destructive"}>
                    Total: {getTotalWeightage()}%
                  </Badge>
                </div>
                <div className="space-y-3">
                  {criteria.map((criterion) => (
                    <Card key={criterion.id} className="p-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-5">
                          <Input
                            value={criterion.name}
                            onChange={(e) => handleCriterionChange(criterion.id, 'name', e.target.value)}
                            placeholder="Criterion name"
                          />
                        </div>
                        <div className="col-span-3">
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={criterion.weightage}
                              onChange={(e) => handleCriterionChange(criterion.id, 'weightage', e.target.value)}
                              className="w-20"
                            />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </div>
                        <div className="col-span-4">
                          <Input
                            value={criterion.description}
                            onChange={(e) => handleCriterionChange(criterion.id, 'description', e.target.value)}
                            placeholder="Description"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  * Attendance criterion is mandatory for integration with attendance module
                </p>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={getTotalWeightage() !== 100}>
                  {editingCycle ? 'Update Cycle' : 'Create Cycle'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Cycles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{monthlyCycles.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Annual Summaries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{annualCycles.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Cycles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {cycles.filter(c => c.status === 'Active').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {cycles.filter(c => c.status === 'Completed').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cycles Tabs */}
      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Cycles</TabsTrigger>
          <TabsTrigger value="annual">Annual Summaries</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Appraisal Cycles</CardTitle>
              <CardDescription>Individual monthly evaluation periods</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cycle Name</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Criteria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyCycles.map((cycle) => (
                    <TableRow key={cycle.id}>
                      <TableCell className="font-medium">{cycle.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{cycle.startDate}</p>
                          <p className="text-muted-foreground">to {cycle.endDate}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {cycle.criteria.length} criteria
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(cycle.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {cycle.status === 'Draft' && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleActivate(cycle)}>
                                <Play className="w-4 h-4 mr-1" />Activate
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleEdit(cycle)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDelete(cycle.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </>
                          )}
                          {cycle.status === 'Active' && (
                            <Button size="sm" variant="outline" onClick={() => handleComplete(cycle)}>
                              <CheckCircle className="w-4 h-4 mr-1" />Complete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {monthlyCycles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No monthly cycles found. Create one to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="annual">
          <Card>
            <CardHeader>
              <CardTitle>Annual Summary Cycles</CardTitle>
              <CardDescription>Auto-generated annual summaries based on monthly appraisals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Monthly Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {annualCycles.map((cycle) => {
                    const stats = getAnnualStats(cycle.year);
                    return (
                      <TableRow key={cycle.id}>
                        <TableCell className="font-medium">{cycle.name}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{cycle.startDate}</p>
                            <p className="text-muted-foreground">to {cycle.endDate}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{stats.monthCount} months completed</p>
                            <p className="text-muted-foreground">{stats.total} appraisals (Avg: {stats.avgScore})</p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(cycle.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {cycle.status === 'Draft' && (
                              <Button size="sm" variant="outline" onClick={() => handleActivate(cycle)}>
                                <Play className="w-4 h-4 mr-1" />Activate
                              </Button>
                            )}
                            {cycle.status === 'Active' && (
                              <Button size="sm" variant="outline" onClick={() => handleComplete(cycle)}>
                                <CheckCircle className="w-4 h-4 mr-1" />Complete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {annualCycles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No annual summaries found. Annual summaries are auto-generated from monthly data.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
