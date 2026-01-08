import { useState, useEffect } from 'react';
import { Check, X, Clock } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaveRequest, LeavePolicy } from '@/lib/mockData';
import { getLeaveRequests, getLeavePolicies, updateLeaveRequestStatus } from '@/lib/storage';
import { toast } from 'sonner';

export default function LeaveManagement() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leavePolicies, setLeavePolicies] = useState<LeavePolicy[]>([]);

  useEffect(() => {
    setLeaveRequests(getLeaveRequests());
    setLeavePolicies(getLeavePolicies());
  }, []);

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

  const pendingCount = leaveRequests.filter(r => r.status === 'Pending').length;

  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">Leave Management</h1>
        <p className="page-description">Manage leave policies and employee leave requests</p>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests">
            Leave Requests
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
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.employeeName}</TableCell>
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
                    <TableCell className="text-right">
                      {request.status === 'Pending' && (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={() => handleApprove(request.id)}>
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleReject(request.id)}>
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
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
