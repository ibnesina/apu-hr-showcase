import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Play, CheckCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  AppraisalCycle, 
  AppraisalCriterion,
  defaultCriteria,
  getAppraisalCycles, 
  addAppraisalCycle, 
  updateAppraisalCycle, 
  deleteAppraisalCycle 
} from '@/lib/appraisalData';
import { addAuditLog } from '@/lib/storage';
import { toast } from 'sonner';

export default function AppraisalCycles() {
  const [cycles, setCycles] = useState<AppraisalCycle[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState<AppraisalCycle | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    status: 'Draft' as AppraisalCycle['status'],
  });
  const [criteria, setCriteria] = useState<AppraisalCriterion[]>(defaultCriteria);

  useEffect(() => {
    setCycles(getAppraisalCycles());
  }, []);

  const resetForm = () => {
    setFormData({ name: '', startDate: '', endDate: '', status: 'Draft' });
    setCriteria(defaultCriteria);
    setEditingCycle(null);
  };

  const getTotalWeightage = () => criteria.reduce((sum, c) => sum + c.weightage, 0);

  const handleCriterionChange = (id: string, field: keyof AppraisalCriterion, value: string | number) => {
    setCriteria(prev => prev.map(c => 
      c.id === id ? { ...c, [field]: field === 'weightage' ? Number(value) : value } : c
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (getTotalWeightage() !== 100) {
      toast.error('Total weightage must equal 100%');
      return;
    }

    if (editingCycle) {
      updateAppraisalCycle(editingCycle.id, { ...formData, criteria });
      addAuditLog('Updated', 'Appraisal Cycle', `Updated cycle: ${formData.name}`);
      toast.success('Appraisal cycle updated');
    } else {
      addAppraisalCycle({ ...formData, criteria, createdBy: 'Admin' });
      addAuditLog('Created', 'Appraisal Cycle', `Created new cycle: ${formData.name}`);
      toast.success('Appraisal cycle created');
    }

    setCycles(getAppraisalCycles());
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (cycle: AppraisalCycle) => {
    setEditingCycle(cycle);
    setFormData({
      name: cycle.name,
      startDate: cycle.startDate,
      endDate: cycle.endDate,
      status: cycle.status,
    });
    setCriteria(cycle.criteria);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteAppraisalCycle(id);
    addAuditLog('Deleted', 'Appraisal Cycle', 'Removed appraisal cycle');
    setCycles(getAppraisalCycles());
    toast.success('Appraisal cycle deleted');
  };

  const handleActivate = (cycle: AppraisalCycle) => {
    updateAppraisalCycle(cycle.id, { status: 'Active' });
    addAuditLog('Activated', 'Appraisal Cycle', `Activated cycle: ${cycle.name}`);
    setCycles(getAppraisalCycles());
    toast.success('Appraisal cycle activated');
  };

  const handleComplete = (cycle: AppraisalCycle) => {
    updateAppraisalCycle(cycle.id, { status: 'Completed' });
    addAuditLog('Completed', 'Appraisal Cycle', `Completed cycle: ${cycle.name}`);
    setCycles(getAppraisalCycles());
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

  return (
    <AppLayout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Appraisal Cycles</h1>
          <p className="page-description">Create and manage performance appraisal cycles</p>
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
                <div className="space-y-2">
                  <Label>Cycle Name</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. Annual Appraisal 2025"
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input 
                      type="date" 
                      value={formData.startDate} 
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input 
                      type="date" 
                      value={formData.endDate} 
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})} 
                      required 
                    />
                  </div>
                </div>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cycles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{cycles.length}</p>
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

      {/* Cycles Table */}
      <div className="table-container">
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
            {cycles.map((cycle) => (
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
            {cycles.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No appraisal cycles found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
