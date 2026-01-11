import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CalendarDays } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Holiday } from '@/lib/mockData';
import { getHolidays, addHoliday, updateHoliday, deleteHoliday } from '@/lib/storage';
import { toast } from 'sonner';

export default function HolidayManagement() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [formData, setFormData] = useState({ name: '', date: '', description: '' });

  useEffect(() => { setHolidays(getHolidays()); }, []);

  const resetForm = () => { setFormData({ name: '', date: '', description: '' }); setEditingHoliday(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHoliday) { updateHoliday(editingHoliday.id, formData); toast.success('Holiday updated'); }
    else { addHoliday(formData); toast.success('Holiday added'); }
    setHolidays(getHolidays());
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setFormData({ name: holiday.name, date: holiday.date, description: holiday.description || '' });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => { deleteHoliday(id); setHolidays(getHolidays()); toast.success('Holiday deleted'); };

  const sortedHolidays = [...holidays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <AppLayout>
      <div className="page-header flex items-center justify-between">
        <div><h1 className="page-title">Holiday Management</h1><p className="page-description">Manage public holidays and off-days</p></div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Add Holiday</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingHoliday ? 'Edit Holiday' : 'Add Holiday'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Holiday Name</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
              <div className="space-y-2"><Label>Date</Label><Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required /></div>
              <div className="space-y-2"><Label>Description</Label><Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancel</Button>
                <Button type="submit">{editingHoliday ? 'Update' : 'Add'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="table-container">
        <Table>
          <TableHeader><TableRow><TableHead>Holiday</TableHead><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {sortedHolidays.map((holiday) => (
              <TableRow key={holiday.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-muted-foreground" />{holiday.name}</div></TableCell>
                <TableCell>{new Date(holiday.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</TableCell>
                <TableCell>{holiday.description}</TableCell>
                <TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon" onClick={() => handleEdit(holiday)}><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(holiday.id)}><Trash2 className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
