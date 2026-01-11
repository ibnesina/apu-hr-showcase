import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Shift } from '@/lib/mockData';
import { getShifts, addShift, updateShift, deleteShift } from '@/lib/storage';
import { toast } from 'sonner';

export default function ShiftManagement() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [formData, setFormData] = useState({ name: '', startTime: '08:00', endTime: '17:00', description: '' });

  useEffect(() => { setShifts(getShifts()); }, []);

  const resetForm = () => { setFormData({ name: '', startTime: '08:00', endTime: '17:00', description: '' }); setEditingShift(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingShift) { updateShift(editingShift.id, formData); toast.success('Shift updated'); }
    else { addShift(formData); toast.success('Shift added'); }
    setShifts(getShifts());
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (shift: Shift) => {
    setEditingShift(shift);
    setFormData({ name: shift.name, startTime: shift.startTime, endTime: shift.endTime, description: shift.description || '' });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => { deleteShift(id); setShifts(getShifts()); toast.success('Shift deleted'); };

  return (
    <AppLayout>
      <div className="page-header flex items-center justify-between">
        <div><h1 className="page-title">Shift Management</h1><p className="page-description">Configure work shifts and schedules</p></div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Add Shift</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingShift ? 'Edit Shift' : 'Add Shift'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Shift Name</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Start Time</Label><Input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} required /></div>
                <div className="space-y-2"><Label>End Time</Label><Input type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} required /></div>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancel</Button>
                <Button type="submit">{editingShift ? 'Update' : 'Add'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="table-container">
        <Table>
          <TableHeader><TableRow><TableHead>Shift Name</TableHead><TableHead>Start Time</TableHead><TableHead>End Time</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" />{shift.name}</div></TableCell>
                <TableCell>{shift.startTime}</TableCell><TableCell>{shift.endTime}</TableCell><TableCell>{shift.description}</TableCell>
                <TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon" onClick={() => handleEdit(shift)}><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(shift.id)}><Trash2 className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
