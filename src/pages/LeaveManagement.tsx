import { useState, useEffect } from 'react';
import { Check, X, Clock, Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeaveRequest, LeavePolicy } from '@/lib/mockData';
import { getLeaveRequests, getLeavePolicies, updateLeaveRequestStatus, saveLeaveRequests, addAuditLog } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function LeaveManagement() {
  const { user, isAdmin, isFaculty } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leavePolicies, setLeavePolicies] = useState<LeavePolicy[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  useEffect(() => {
    setLeaveRequests(getLeaveRequests());
    setLeavePolicies(getLeavePolicies());
  }, []);

  // Filter requests for faculty
  const displayRequests = isFaculty ? leaveRequests.filter(r => r.employeeId === user?.id) : leaveRequests;

  const handleApprove = (id: string) => {
    updateLeaveRequestStatus(id, 'Approved');
    setLeaveRequests(getLeaveRequests());
    toast.success('Leave request approved');
  };

  const handleReject = (id: string) => {
    updateLeaveRequestStatus(id, 'Rejected');
    setLeaveRequests(getLeaveRequests());
    toast.success('Leave request rejected');
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      employeeId: user?.id || '',
      employeeName: user?.name || '',
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days,
      reason: formData.reason,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    
    const requests = getLeaveRequests();
    requests.push(newRequest);
    saveLeaveRequests(requests);
    addAuditLog('Created', 'Leave Request', `${user?.name} applied for ${formData.leaveType}`);
    setLeaveRequests(getLeaveRequests());
    setIsDialogOpen(false);
    setFormData({ leaveType: '', startDate: '', endDate: '', reason: '' });
    toast.success('Leave request submitted');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="status-badge status-pending"><Clock className="w-3 h-3 mr-1" />{status}</span>;
      case 'Approved':
        return <span className="status-badge status-approved"><Check className="w-3 h-3 mr-1" />{status}</span>;
      case 'Rejected':
        return <span className="status-badge status-rejected"><X className="w-3 h-3 mr-1" />{status}</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const pendingCount = displayRequests.filter(r => r.status === 'Pending').length;

  return (
    <AppLayout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">{isFaculty ? 'My Leaves' : 'Leave Management'}</h1>
          <p className="page-description">{isFaculty ? 'Apply and track your leave requests' : 'Manage leave policies and employee leave requests'}</p>
        </div>
        {isFaculty && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Apply Leave</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Apply for Leave</DialogTitle></DialogHeader>
              <form onSubmit={handleApplyLeave} className="space-y-4">
                <div className="space-y-2">
                  <Label>Leave Type</Label>
                  <Select value={formData.leaveType} onValueChange={(v) => setFormData({...formData, leaveType: v})}>
                    <SelectTrigger><SelectValue placeholder="Select leave type" /></SelectTrigger>
                    <SelectContent>
                      {leavePolicies.map(p => <SelectItem key={p.id} value={p.type}>{p.type}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} required />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Submit Request</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests">
            {isFaculty ? 'My Requests' : 'Leave Requests'}
            {pendingCount > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="policies">Leave Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  {isAdmin && <TableHead>Employee</TableHead>}
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                  {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayRequests.map((request) => (
                  <TableRow key={request.id}>
                    {isAdmin && <TableCell className="font-medium">{request.employeeName}</TableCell>}
                    <TableCell>{request.leaveType}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{request.startDate}</p>
                        <p className="text-muted-foreground">to {request.endDate}</p>
                      </div>
                    </TableCell>
                    <TableCell>{request.days}</TableCell>
                    <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                    <TableCell>{request.appliedDate}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        {request.status === 'Pending' && (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" onClick={() => handleApprove(request.id)}>
                              <Check className="w-4 h-4 mr-1" />Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleReject(request.id)}>
                              <X className="w-4 h-4 mr-1" />Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="policies">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leavePolicies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{policy.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Annual Limit</span>
                      <span className="font-semibold">{policy.annualLimit} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carry Forward</span>
                      <span className={`font-semibold ${policy.carryForward ? 'text-green-600' : 'text-red-600'}`}>
                        {policy.carryForward ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground pt-2 border-t">
                      {policy.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
