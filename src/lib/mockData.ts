// Mock data for the HR Management System Demo

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  grade: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  status: 'Active' | 'Inactive';
  joinDate: string;
  phone: string;
  shiftId?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  appliedDate: string;
}

export interface LeavePolicy {
  id: string;
  type: string;
  annualLimit: number;
  carryForward: boolean;
  isPaid: boolean;
  description: string;
}

export interface LeaveBalance {
  employeeId: string;
  leaveType: string;
  used: number;
  remaining: number;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  description?: string;
}

export interface PayrollSetup {
  employeeId: string;
  baseSalary: number;
  perDayRate: number;
  allowance: number;
}

export interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent' | 'Leave' | 'Holiday';
  checkIn?: string;
  checkOut?: string;
  isLate?: boolean;
}

export interface EmployeeAttendance {
  employeeId: string;
  employeeName: string;
  department: string;
  records: AttendanceRecord[];
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  absentDays: number;
  unpaidLeaveDays: number;
  netSalary: number;
  month: string;
  status: 'Pending' | 'Processed';
}

export interface Document {
  id: string;
  name: string;
  type: 'PDF' | 'DOC' | 'DOCX' | 'XLS';
  category: string;
  version: string;
  uploadedBy: string;
  uploadedDate: string;
  size: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  user: string;
  timestamp: string;
  details: string;
}

// Initial mock data
export const initialEmployees: Employee[] = [
  { id: '1', name: 'Dr. Ahmad Razali', email: 'ahmad.razali@apu.edu.my', department: 'Computer Science', role: 'Senior Lecturer', grade: 'DG52', employmentType: 'Full-time', status: 'Active', joinDate: '2019-03-15', phone: '+60 12-345-6789', shiftId: '1' },
  { id: '2', name: 'Prof. Siti Aminah', email: 'siti.aminah@apu.edu.my', department: 'Business', role: 'Professor', grade: 'DG54', employmentType: 'Full-time', status: 'Active', joinDate: '2015-08-01', phone: '+60 12-987-6543', shiftId: '1' },
  { id: '3', name: 'Mr. Lee Wei Ming', email: 'lee.weiming@apu.edu.my', department: 'Engineering', role: 'Lecturer', grade: 'DG48', employmentType: 'Full-time', status: 'Active', joinDate: '2021-01-10', phone: '+60 13-456-7890', shiftId: '1' },
  { id: '4', name: 'Ms. Priya Sharma', email: 'priya.sharma@apu.edu.my', department: 'Design', role: 'Senior Lecturer', grade: 'DG52', employmentType: 'Full-time', status: 'Active', joinDate: '2020-06-20', phone: '+60 14-567-8901', shiftId: '2' },
  { id: '5', name: 'Dr. Muhammad Hafiz', email: 'muhammad.hafiz@apu.edu.my', department: 'Computer Science', role: 'Associate Professor', grade: 'DG54', employmentType: 'Full-time', status: 'Active', joinDate: '2017-02-28', phone: '+60 15-678-9012', shiftId: '1' },
  { id: '6', name: 'Mrs. Chen Li Hua', email: 'chen.lihua@apu.edu.my', department: 'Administration', role: 'HR Manager', grade: 'N44', employmentType: 'Full-time', status: 'Active', joinDate: '2018-09-12', phone: '+60 16-789-0123', shiftId: '1' },
  { id: '7', name: 'Mr. Raj Kumar', email: 'raj.kumar@apu.edu.my', department: 'IT Support', role: 'System Administrator', grade: 'N41', employmentType: 'Full-time', status: 'Active', joinDate: '2022-04-05', phone: '+60 17-890-1234', shiftId: '2' },
  { id: '8', name: 'Dr. Fatimah Zahra', email: 'fatimah.zahra@apu.edu.my', department: 'Business', role: 'Lecturer', grade: 'DG48', employmentType: 'Part-time', status: 'Inactive', joinDate: '2020-11-18', phone: '+60 18-901-2345', shiftId: '1' },
];

export const initialLeaveRequests: LeaveRequest[] = [
  { id: '1', employeeId: '1', employeeName: 'Dr. Ahmad Razali', leaveType: 'Annual Leave', startDate: '2024-01-15', endDate: '2024-01-17', days: 3, reason: 'Family vacation', status: 'Pending', appliedDate: '2024-01-10' },
  { id: '2', employeeId: '3', employeeName: 'Mr. Lee Wei Ming', leaveType: 'Medical Leave', startDate: '2024-01-12', endDate: '2024-01-12', days: 1, reason: 'Doctor appointment', status: 'Approved', appliedDate: '2024-01-11' },
  { id: '3', employeeId: '4', employeeName: 'Ms. Priya Sharma', leaveType: 'Annual Leave', startDate: '2024-01-20', endDate: '2024-01-25', days: 6, reason: 'Personal matters', status: 'Pending', appliedDate: '2024-01-08' },
  { id: '4', employeeId: '2', employeeName: 'Prof. Siti Aminah', leaveType: 'Conference Leave', startDate: '2024-02-01', endDate: '2024-02-03', days: 3, reason: 'International conference', status: 'Approved', appliedDate: '2024-01-05' },
];

export const initialLeavePolicies: LeavePolicy[] = [
  { id: '1', type: 'Annual Leave', annualLimit: 14, carryForward: true, isPaid: true, description: 'Standard annual leave entitlement' },
  { id: '2', type: 'Medical Leave', annualLimit: 14, carryForward: false, isPaid: true, description: 'Sick leave with medical certificate' },
  { id: '3', type: 'Conference Leave', annualLimit: 7, carryForward: false, isPaid: true, description: 'For attending academic conferences' },
  { id: '4', type: 'Maternity Leave', annualLimit: 90, carryForward: false, isPaid: true, description: 'Maternity leave for female employees' },
  { id: '5', type: 'Paternity Leave', annualLimit: 7, carryForward: false, isPaid: true, description: 'Paternity leave for male employees' },
  { id: '6', type: 'Compassionate Leave', annualLimit: 3, carryForward: false, isPaid: true, description: 'For bereavement or family emergencies' },
  { id: '7', type: 'Unpaid Leave', annualLimit: 30, carryForward: false, isPaid: false, description: 'Leave without pay for personal reasons' },
];

export const initialShifts: Shift[] = [
  { id: '1', name: 'Morning Shift', startTime: '08:00', endTime: '17:00', description: 'Standard office hours' },
  { id: '2', name: 'Evening Shift', startTime: '13:00', endTime: '22:00', description: 'Afternoon to evening shift' },
  { id: '3', name: 'Flexible', startTime: '09:00', endTime: '18:00', description: 'Flexible working hours' },
];

export const initialHolidays: Holiday[] = [
  { id: '1', name: 'New Year', date: '2025-01-01', description: 'New Year Day' },
  { id: '2', name: 'Thaipusam', date: '2025-01-29', description: 'Thaipusam Festival' },
  { id: '3', name: 'Federal Territory Day', date: '2025-02-01', description: 'Federal Territory Day' },
  { id: '4', name: 'Chinese New Year', date: '2025-01-29', description: 'Chinese New Year' },
  { id: '5', name: 'Chinese New Year (2nd Day)', date: '2025-01-30', description: 'Chinese New Year Holiday' },
  { id: '6', name: 'Labour Day', date: '2025-05-01', description: 'Labour Day' },
  { id: '7', name: 'Wesak Day', date: '2025-05-12', description: 'Wesak Day' },
  { id: '8', name: 'Hari Raya Aidilfitri', date: '2025-03-30', description: 'Hari Raya Aidilfitri' },
  { id: '9', name: 'Hari Raya Aidilfitri (2nd Day)', date: '2025-03-31', description: 'Hari Raya Aidilfitri Holiday' },
  { id: '10', name: 'National Day', date: '2025-08-31', description: 'National Day' },
  { id: '11', name: 'Malaysia Day', date: '2025-09-16', description: 'Malaysia Day' },
  { id: '12', name: 'Deepavali', date: '2025-10-20', description: 'Deepavali Festival' },
  { id: '13', name: 'Christmas', date: '2025-12-25', description: 'Christmas Day' },
];

export const initialPayrollSetup: PayrollSetup[] = [
  { employeeId: '1', baseSalary: 8500, perDayRate: 388, allowance: 1500 },
  { employeeId: '2', baseSalary: 12000, perDayRate: 545, allowance: 2000 },
  { employeeId: '3', baseSalary: 6500, perDayRate: 295, allowance: 1000 },
  { employeeId: '4', baseSalary: 7500, perDayRate: 341, allowance: 1200 },
  { employeeId: '5', baseSalary: 10500, perDayRate: 477, allowance: 1800 },
  { employeeId: '6', baseSalary: 7000, perDayRate: 318, allowance: 1100 },
  { employeeId: '7', baseSalary: 5500, perDayRate: 250, allowance: 800 },
  { employeeId: '8', baseSalary: 4000, perDayRate: 182, allowance: 600 },
];

export const initialDocuments: Document[] = [
  { id: '1', name: 'Employee Handbook 2024', type: 'PDF', category: 'Policy', version: 'v2.1', uploadedBy: 'HR Admin', uploadedDate: '2024-01-01', size: '2.4 MB' },
  { id: '2', name: 'Leave Policy Guidelines', type: 'PDF', category: 'Policy', version: 'v1.3', uploadedBy: 'HR Admin', uploadedDate: '2023-12-15', size: '1.1 MB' },
  { id: '3', name: 'Performance Review Template', type: 'DOCX', category: 'Template', version: 'v1.0', uploadedBy: 'HR Admin', uploadedDate: '2024-01-05', size: '456 KB' },
  { id: '4', name: 'Salary Structure 2024', type: 'XLS', category: 'Finance', version: 'v1.0', uploadedBy: 'Finance Dept', uploadedDate: '2024-01-02', size: '890 KB' },
  { id: '5', name: 'Code of Conduct', type: 'PDF', category: 'Policy', version: 'v3.0', uploadedBy: 'HR Admin', uploadedDate: '2023-11-20', size: '1.8 MB' },
];

export const initialPayrollRecords: PayrollRecord[] = [
  { id: '1', employeeId: '1', employeeName: 'Dr. Ahmad Razali', department: 'Computer Science', basicSalary: 8500, allowances: 1500, deductions: 850, absentDays: 0, unpaidLeaveDays: 0, netSalary: 9150, month: 'January 2025', status: 'Processed' },
  { id: '2', employeeId: '2', employeeName: 'Prof. Siti Aminah', department: 'Business', basicSalary: 12000, allowances: 2000, deductions: 1200, absentDays: 0, unpaidLeaveDays: 0, netSalary: 12800, month: 'January 2025', status: 'Processed' },
  { id: '3', employeeId: '3', employeeName: 'Mr. Lee Wei Ming', department: 'Engineering', basicSalary: 6500, allowances: 1000, deductions: 650, absentDays: 0, unpaidLeaveDays: 0, netSalary: 6850, month: 'January 2025', status: 'Pending' },
  { id: '4', employeeId: '4', employeeName: 'Ms. Priya Sharma', department: 'Design', basicSalary: 7500, allowances: 1200, deductions: 750, absentDays: 0, unpaidLeaveDays: 0, netSalary: 7950, month: 'January 2025', status: 'Pending' },
  { id: '5', employeeId: '5', employeeName: 'Dr. Muhammad Hafiz', department: 'Computer Science', basicSalary: 10500, allowances: 1800, deductions: 1050, absentDays: 0, unpaidLeaveDays: 0, netSalary: 11250, month: 'January 2025', status: 'Processed' },
  { id: '6', employeeId: '6', employeeName: 'Mrs. Chen Li Hua', department: 'Administration', basicSalary: 7000, allowances: 1100, deductions: 700, absentDays: 0, unpaidLeaveDays: 0, netSalary: 7400, month: 'January 2025', status: 'Pending' },
];

export const initialAuditLogs: AuditLog[] = [
  { id: '1', action: 'Created', module: 'Employee', user: 'Admin', timestamp: '2024-01-10 09:15:23', details: 'Added new employee: Dr. Ahmad Razali' },
  { id: '2', action: 'Updated', module: 'Leave Request', user: 'Admin', timestamp: '2024-01-10 10:30:45', details: 'Approved leave request for Mr. Lee Wei Ming' },
  { id: '3', action: 'Created', module: 'Document', user: 'HR Admin', timestamp: '2024-01-09 14:22:10', details: 'Uploaded Employee Handbook 2024' },
  { id: '4', action: 'Updated', module: 'Payroll', user: 'Finance', timestamp: '2024-01-08 16:45:00', details: 'Processed payroll for January 2024' },
  { id: '5', action: 'Deleted', module: 'Employee', user: 'Admin', timestamp: '2024-01-07 11:20:33', details: 'Deactivated employee: Dr. Fatimah Zahra' },
];

// Dashboard statistics
export const dashboardStats = {
  totalEmployees: 8,
  activeEmployees: 7,
  attendanceToday: 85,
  pendingLeaveRequests: 2,
  payrollStatus: 'In Progress',
  departmentDistribution: [
    { name: 'Computer Science', value: 2 },
    { name: 'Business', value: 2 },
    { name: 'Engineering', value: 1 },
    { name: 'Design', value: 1 },
    { name: 'Administration', value: 1 },
    { name: 'IT Support', value: 1 },
  ],
  monthlyAttendance: [
    { month: 'Aug', attendance: 92 },
    { month: 'Sep', attendance: 88 },
    { month: 'Oct', attendance: 95 },
    { month: 'Nov', attendance: 91 },
    { month: 'Dec', attendance: 87 },
    { month: 'Jan', attendance: 85 },
  ],
  leaveUsage: [
    { type: 'Annual', used: 45, total: 112 },
    { type: 'Medical', used: 12, total: 112 },
    { type: 'Conference', used: 8, total: 56 },
    { type: 'Other', used: 5, total: 50 },
  ],
};

// Helper function to generate attendance calendar data with holiday and shift integration
export const generateAttendanceCalendar = (year: number, month: number, holidays: Holiday[] = [], shift?: Shift): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get holiday dates for this month
  const holidayDates = holidays
    .filter(h => {
      const d = new Date(h.date);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .map(h => new Date(h.date).getDate());
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split('T')[0];
    
    let status: AttendanceRecord['status'];
    let isLate = false;
    let checkIn: string | undefined;
    let checkOut: string | undefined;
    
    // Weekend or Holiday
    if (dayOfWeek === 0 || dayOfWeek === 6 || holidayDates.includes(day)) {
      status = 'Holiday';
    } else if (Math.random() > 0.92) {
      // Random leave/absent
      status = Math.random() > 0.5 ? 'Leave' : 'Absent';
    } else {
      status = 'Present';
      
      // Generate check-in time based on shift
      const shiftStart = shift ? parseInt(shift.startTime.split(':')[0]) : 8;
      const randomMinute = Math.floor(Math.random() * 45);
      const lateThreshold = 15; // 15 minutes grace
      
      if (Math.random() > 0.85) {
        // Late arrival
        checkIn = `${String(shiftStart).padStart(2, '0')}:${String(randomMinute + 15).padStart(2, '0')}`;
        isLate = true;
      } else {
        checkIn = `${String(shiftStart).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}`;
        isLate = randomMinute > lateThreshold;
      }
      
      // Generate check-out time
      const shiftEnd = shift ? parseInt(shift.endTime.split(':')[0]) : 17;
      checkOut = `${String(shiftEnd).padStart(2, '0')}:${String(Math.floor(Math.random() * 30) + 30).padStart(2, '0')}`;
    }
    
    records.push({
      date: dateStr,
      status,
      checkIn,
      checkOut,
      isLate,
    });
  }
  
  return records;
};

// Generate initial attendance data for all employees
export const generateInitialAttendance = (): EmployeeAttendance[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  return initialEmployees.map(emp => ({
    employeeId: emp.id,
    employeeName: emp.name,
    department: emp.department,
    records: generateAttendanceCalendar(year, month, initialHolidays, initialShifts.find(s => s.id === emp.shiftId)),
  }));
};

export const initialAttendanceRecords: EmployeeAttendance[] = generateInitialAttendance();
