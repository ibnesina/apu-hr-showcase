import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Check, X, Clock } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { LeavePolicy } from '@/lib/mockData';
import { getLeavePolicies, addLeavePolicy, updateLeavePolicy, deleteLeavePolicy, addAuditLog } from '@/lib/storage';
import { toast } from 'sonner';

export default function LeavePolicies() {
  const [policies, setPolicies] = useState<LeavePolicy[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<LeavePolicy | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    annualLimit: 14,
    carryForward: false,
    isPaid: true,
    description: '',
  });

  useEffect(() => {
    setPolicies(getLeavePolicies());
  }, []);

  const resetForm = () => {
    setFormData({ type: '', annualLimit: 14, carryForward: false, isPaid: true, description: '' });
    setEditingPolicy(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPolicy) {
      updateLeavePolicy(editingPolicy.id, formData);
      toast.success('Leave policy updated');
    } else {
      addLeavePolicy(formData);
      toast.success('Leave policy added');
    }
    setPolicies(getLeavePolicies());
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (policy: LeavePolicy) => {
    setEditingPolicy(policy);
    setFormData({
      type: policy.type,
      annualLimit: policy.annualLimit,
      carryForward: policy.carryForward,
      isPaid: policy.isPaid,
      description: policy.description,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteLeavePolicy(id);
    setPolicies(getLeavePolicies());
    toast.success('Leave policy deleted');
  };

  return (
    <AppLayout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Leave Policies</h1>
          <p className="page-description">Configure leave types and entitlements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add Policy</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPolicy ? 'Edit Leave Policy' : 'Add Leave Policy'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Leave Type</Label>
                <Input value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Annual Limit (days)</Label>
                <Input type="number" value={formData.annualLimit} onChange={(e) => setFormData({...formData, annualLimit: parseInt(e.target.value)})} required />
              </div>
              <div className="flex items-center justify-between">
                <Label>Carry Forward</Label>
                <Switch checked={formData.carryForward} onCheckedChange={(v) => setFormData({...formData, carryForward: v})} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Paid Leave</Label>
                <Switch checked={formData.isPaid} onCheckedChange={(v) => setFormData({...formData, isPaid: v})} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancel</Button>
                <Button type="submit">{editingPolicy ? 'Update' : 'Add'} Policy</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Leave Type</TableHead>
              <TableHead>Annual Limit</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Carry Forward</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="font-medium">{policy.type}</TableCell>
                <TableCell>{policy.annualLimit} days</TableCell>
                <TableCell>
                  <span className={`status-badge ${policy.isPaid ? 'status-approved' : 'status-rejected'}`}>
                    {policy.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </TableCell>
                <TableCell>{policy.carryForward ? 'Yes' : 'No'}</TableCell>
                <TableCell className="max-w-xs truncate">{policy.description}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(policy)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(policy.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
