import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateAttendanceCalendar, AttendanceRecord } from '@/lib/mockData';

const statusColors: Record<string, string> = {
  Present: 'bg-green-100 text-green-800 hover:bg-green-200',
  Absent: 'bg-red-100 text-red-800 hover:bg-red-200',
  Leave: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  Holiday: 'bg-gray-100 text-gray-500',
};

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Attendance() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1));
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(() =>
    generateAttendanceCalendar(2024, 0)
  );
  const [selectedEmployee, setSelectedEmployee] = useState('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (AttendanceRecord | null)[] = [];

    // Add empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add attendance records for each day
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const record = attendanceData.find(r => r.date === dateStr);
      days.push(record || { date: dateStr, status: 'Present' });
    }

    return days;
  }, [year, month, attendanceData]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(year, month + (direction === 'next' ? 1 : -1), 1);
    setCurrentDate(newDate);
    setAttendanceData(generateAttendanceCalendar(newDate.getFullYear(), newDate.getMonth()));
  };

  const handleStatusChange = (date: string, newStatus: AttendanceRecord['status']) => {
    setAttendanceData(prev =>
      prev.map(record =>
        record.date === date ? { ...record, status: newStatus } : record
      )
    );
  };

  const stats = useMemo(() => {
    const present = attendanceData.filter(r => r.status === 'Present').length;
    const absent = attendanceData.filter(r => r.status === 'Absent').length;
    const leave = attendanceData.filter(r => r.status === 'Leave').length;
    const holiday = attendanceData.filter(r => r.status === 'Holiday').length;
    return { present, absent, leave, holiday };
  }, [attendanceData]);

  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">Attendance Management</h1>
        <p className="page-description">Track and manage employee attendance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              <p className="text-sm text-muted-foreground">Present</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              <p className="text-sm text-muted-foreground">Absent</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.leave}</p>
              <p className="text-sm text-muted-foreground">On Leave</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{stats.holiday}</p>
              <p className="text-sm text-muted-foreground">Holidays</p>
            </div>
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
              {months[month]} {year}
            </CardTitle>
            <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Employees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              <SelectItem value="1">Dr. Ahmad Razali</SelectItem>
              <SelectItem value="2">Prof. Siti Aminah</SelectItem>
              <SelectItem value="3">Mr. Lee Wei Ming</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((record, index) => (
              <div key={index} className="aspect-square p-1">
                {record && (
                  <button
                    onClick={() => {
                      const statuses: AttendanceRecord['status'][] = ['Present', 'Absent', 'Leave', 'Holiday'];
                      const currentIndex = statuses.indexOf(record.status);
                      const nextIndex = (currentIndex + 1) % statuses.length;
                      handleStatusChange(record.date, statuses[nextIndex]);
                    }}
                    className={`w-full h-full rounded-lg flex flex-col items-center justify-center transition-colors ${statusColors[record.status]}`}
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

          {/* Legend */}
          <div className="flex gap-6 mt-6 justify-center">
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${color.split(' ')[0]}`} />
                <span className="text-sm text-muted-foreground">{status}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Click on any day to toggle its status
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
