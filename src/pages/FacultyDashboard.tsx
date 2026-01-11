import { useState, useEffect, useMemo } from 'react';
import { User, Calendar, FileText, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getLeaveRequests, getPayrollRecords, getDocuments, getAttendanceRecords } from '@/lib/storage';
import { LeaveRequest, PayrollRecord, Document, EmployeeAttendance } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<EmployeeAttendance[]>([]);

  useEffect(() => {
    setLeaveRequests(getLeaveRequests());
    setPayrollRecords(getPayrollRecords());
    setDocuments(getDocuments());
    setAttendanceRecords(getAttendanceRecords());
  }, []);

  // Get employee's data
  const myLeaveRequests = leaveRequests.filter(r => r.employeeId === user?.id);
  const myPayroll = payrollRecords.filter(r => r.employeeId === user?.id);
  const latestPayslip = myPayroll[myPayroll.length - 1];

  // Get today's attendance
  const today = new Date().toISOString().split('T')[0];
  const myAttendance = attendanceRecords.find(a => a.employeeId === user?.id);
  const todayAttendance = myAttendance?.records.find(r => r.date === today);

  // Calculate attendance stats for current month
  const attendanceStats = useMemo(() => {
    if (!myAttendance) return { present: 0, absent: 0, leave: 0 };
    const currentMonth = new Date().getMonth();
    const monthRecords = myAttendance.records.filter(r => {
      const recordMonth = new Date(r.date).getMonth();
      return recordMonth === currentMonth;
    });
    return {
      present: monthRecords.filter(r => r.status === 'Present').length,
      absent: monthRecords.filter(r => r.status === 'Absent').length,
      leave: monthRecords.filter(r => r.status === 'Leave').length,
    };
  }, [myAttendance]);

  const pendingLeaves = myLeaveRequests.filter(r => r.status === 'Pending').length;
  const approvedLeaves = myLeaveRequests.filter(r => r.status === 'Approved').length;

  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">Welcome, {user?.name}</h1>
        <p className="page-description">Faculty Dashboard - Your personal HR overview</p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6 border-l-4 border-l-primary">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <p className="font-medium">{user?.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{user?.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/attendance')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{attendanceStats.present}</p>
                <p className="text-xs text-muted-foreground">Days Present</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/leave')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingLeaves}</p>
                <p className="text-xs text-muted-foreground">Pending Leaves</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/leave')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{approvedLeaves}</p>
                <p className="text-xs text-muted-foreground">Approved Leaves</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/payroll')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {latestPayslip ? `RM ${(latestPayslip.netSalary / 1000).toFixed(1)}k` : '-'}
                </p>
                <p className="text-xs text-muted-foreground">Latest Pay</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              {todayAttendance ? (
                <>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    todayAttendance.status === 'Present' ? 'bg-green-100 text-green-700' :
                    todayAttendance.status === 'Leave' ? 'bg-yellow-100 text-yellow-700' :
                    todayAttendance.status === 'Absent' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {todayAttendance.status === 'Present' ? <CheckCircle className="w-4 h-4" /> :
                     todayAttendance.status === 'Leave' ? <AlertCircle className="w-4 h-4" /> :
                     <XCircle className="w-4 h-4" />}
                    {todayAttendance.status}
                  </div>
                  {todayAttendance.checkIn && (
                    <div className="mt-3 text-sm text-muted-foreground">
                      <p>Check In: {todayAttendance.checkIn}</p>
                      {todayAttendance.checkOut && <p>Check Out: {todayAttendance.checkOut}</p>}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">No attendance record for today</p>
              )}
            </div>
            <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/attendance')}>
              View Full Attendance
            </Button>
          </CardContent>
        </Card>

        {/* Recent Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              My Leave Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myLeaveRequests.length > 0 ? (
              <div className="space-y-3">
                {myLeaveRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{request.leaveType}</p>
                      <p className="text-xs text-muted-foreground">
                        {request.startDate} - {request.endDate} ({request.days} days)
                      </p>
                    </div>
                    <span className={`status-badge ${
                      request.status === 'Approved' ? 'status-approved' :
                      request.status === 'Rejected' ? 'status-rejected' :
                      'status-pending'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No leave requests</p>
            )}
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/leave')}>
              Manage Leaves
            </Button>
          </CardContent>
        </Card>

        {/* Latest Payslip */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Latest Payslip
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latestPayslip ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Month</span>
                  <span className="font-medium">{latestPayslip.month}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Basic Salary</span>
                  <span>RM {latestPayslip.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Allowances</span>
                  <span>+RM {latestPayslip.allowances.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-red-600">
                  <span>Deductions</span>
                  <span>-RM {latestPayslip.deductions.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Net Salary</span>
                  <span className="text-primary">RM {latestPayslip.netSalary.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`status-badge ${latestPayslip.status === 'Processed' ? 'status-approved' : 'status-pending'}`}>
                    {latestPayslip.status}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No payslip available</p>
            )}
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/payroll')}>
              View All Payslips
            </Button>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              My Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.slice(0, 3).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.category} • {doc.version}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/documents')}>
              View All Documents
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
