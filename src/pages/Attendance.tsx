import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, Calendar as CalendarIcon } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getAttendanceRecords, 
  getAttendanceForDate, 
  updateEmployeeAttendance,
  getEmployees 
} from '@/lib/storage';
import { EmployeeAttendance, AttendanceRecord, Employee } from '@/lib/mockData';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  Present: 'bg-green-100 text-green-800',
  Absent: 'bg-red-100 text-red-800',
  Leave: 'bg-yellow-100 text-yellow-800',
  Holiday: 'bg-gray-100 text-gray-500',
};

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Attendance() {
  const { user, isAdmin, isFaculty } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<EmployeeAttendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setAttendanceRecords(getAttendanceRecords());
    setEmployees(getEmployees());
  }, []);

  // Get today's attendance for table view
  const todayAttendance = useMemo(() => {
    return getAttendanceForDate(selectedDate);
  }, [selectedDate, attendanceRecords]);

  // Filter by search and selected employee
  const filteredTodayAttendance = useMemo(() => {
    let filtered = todayAttendance;
    
    if (searchQuery) {
      filtered = filtered.filter(a => 
        a.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedEmployee !== 'all') {
      filtered = filtered.filter(a => a.employeeId === selectedEmployee);
    }
    
    return filtered;
  }, [todayAttendance, searchQuery, selectedEmployee]);

  // For faculty - get their own attendance
  const myAttendance = useMemo(() => {
    if (!isFaculty || !user) return null;
    return attendanceRecords.find(a => a.employeeId === user.id);
  }, [attendanceRecords, isFaculty, user]);

  // Calendar view data
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (AttendanceRecord | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    const records = isFaculty && myAttendance ? myAttendance.records : 
      (selectedEmployee !== 'all' ? attendanceRecords.find(a => a.employeeId === selectedEmployee)?.records : null);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const record = records?.find(r => r.date === dateStr);
      days.push(record || { date: dateStr, status: 'Absent' as const });
    }

    return days;
  }, [currentMonth, myAttendance, selectedEmployee, attendanceRecords, isFaculty]);

  // Stats calculation
  const stats = useMemo(() => {
    const records = isFaculty && myAttendance ? myAttendance.records :
      (selectedEmployee !== 'all' ? 
        attendanceRecords.find(a => a.employeeId === selectedEmployee)?.records : 
        attendanceRecords.flatMap(a => a.records));
    
    if (!records) return { present: 0, absent: 0, leave: 0, holiday: 0 };
    
    return {
      present: records.filter(r => r.status === 'Present').length,
      absent: records.filter(r => r.status === 'Absent').length,
      leave: records.filter(r => r.status === 'Leave').length,
      holiday: records.filter(r => r.status === 'Holiday').length,
    };
  }, [attendanceRecords, myAttendance, selectedEmployee, isFaculty]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const handleStatusChange = (employeeId: string, date: string, newStatus: AttendanceRecord['status']) => {
    if (!isAdmin) return;
    
    updateEmployeeAttendance(employeeId, date, newStatus);
    setAttendanceRecords(getAttendanceRecords());
    toast.success('Attendance updated');
  };

  // Admin view with today's attendance table
  if (isAdmin) {
    return (
      <AppLayout>
        <div className="page-header">
          <h1 className="page-title">Attendance Management</h1>
          <p className="page-description">Track and manage employee attendance</p>
        </div>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList>
            <TabsTrigger value="today">Today's Attendance</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          {/* Today's Attendance Tab */}
          <TabsContent value="today" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-sm font-medium mb-1 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or department..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-48">
                    <label className="text-sm font-medium mb-1 block">Date</label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div className="w-48">
                    <label className="text-sm font-medium mb-1 block">Employee</label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Employees" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        {employees.filter(e => e.status === 'Active').map(emp => (
                          <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {filteredTodayAttendance.filter(a => a.record.status === 'Present').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Present</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {filteredTodayAttendance.filter(a => a.record.status === 'Absent').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Absent</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {filteredTodayAttendance.filter(a => a.record.status === 'Leave').length}
                  </p>
                  <p className="text-sm text-muted-foreground">On Leave</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-gray-600">
                    {filteredTodayAttendance.filter(a => a.record.status === 'Holiday').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Holiday</p>
                </CardContent>
              </Card>
            </div>

            {/* Attendance Table */}
            <div className="table-container">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>In Time</TableHead>
                    <TableHead>Out Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTodayAttendance.map((item) => (
                    <TableRow key={item.employeeId}>
                      <TableCell className="font-medium">{item.employeeName}</TableCell>
                      <TableCell>{item.department}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[item.record.status]}`}>
                          {item.record.status}
                        </span>
                      </TableCell>
                      <TableCell>{item.record.checkIn || '-'}</TableCell>
                      <TableCell>{item.record.checkOut || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={item.record.status}
                          onValueChange={(v) => handleStatusChange(item.employeeId, selectedDate, v as AttendanceRecord['status'])}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Present">Present</SelectItem>
                            <SelectItem value="Absent">Absent</SelectItem>
                            <SelectItem value="Leave">Leave</SelectItem>
                            <SelectItem value="Holiday">Holiday</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Calendar View Tab */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <CardTitle className="text-xl">
                    {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </CardTitle>
                  <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    {employees.filter(e => e.status === 'Active').map(emp => (
                      <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                {selectedEmployee === 'all' ? (
                  <p className="text-center text-muted-foreground py-8">
                    Select an employee to view their calendar
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {weekDays.map(day => (
                        <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((record, index) => (
                        <div key={index} className="aspect-square p-1">
                          {record && (
                            <button
                              onClick={() => {
                                const statuses: AttendanceRecord['status'][] = ['Present', 'Absent', 'Leave', 'Holiday'];
                                const currentIndex = statuses.indexOf(record.status);
                                const nextIndex = (currentIndex + 1) % statuses.length;
                                handleStatusChange(selectedEmployee, record.date, statuses[nextIndex]);
                              }}
                              className={`w-full h-full rounded-lg flex flex-col items-center justify-center transition-colors hover:opacity-80 ${statusColors[record.status]}`}
                            >
                              <span className="text-lg font-semibold">
                                {new Date(record.date).getDate()}
                              </span>
                              <span className="text-xs">
                                {record.status === 'Present' ? 'P' : record.status === 'Absent' ? 'A' : record.status === 'Leave' ? 'L' : 'H'}
                              </span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-6 mt-6 justify-center">
                      {Object.entries(statusColors).map(([status, color]) => (
                        <div key={status} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${color.split(' ')[0]}`} />
                          <span className="text-sm text-muted-foreground">{status}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      Click on any day to toggle status
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </AppLayout>
    );
  }

  // Faculty view - read only calendar
  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">My Attendance</h1>
        <p className="page-description">View your attendance records</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
            <p className="text-sm text-muted-foreground">Present</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            <p className="text-sm text-muted-foreground">Absent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.leave}</p>
            <p className="text-sm text-muted-foreground">On Leave</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-600">{stats.holiday}</p>
            <p className="text-sm text-muted-foreground">Holidays</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-xl">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </CardTitle>
            <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((record, index) => (
              <div key={index} className="aspect-square p-1">
                {record && (
                  <div className={`w-full h-full rounded-lg flex flex-col items-center justify-center ${statusColors[record.status]}`}>
                    <span className="text-lg font-semibold">
                      {new Date(record.date).getDate()}
                    </span>
                    <span className="text-xs">
                      {record.status === 'Present' ? 'P' : record.status === 'Absent' ? 'A' : record.status === 'Leave' ? 'L' : 'H'}
                    </span>
                    {record.checkIn && (
                      <span className="text-[10px]">{record.checkIn}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-6 mt-6 justify-center">
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${color.split(' ')[0]}`} />
                <span className="text-sm text-muted-foreground">{status}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
