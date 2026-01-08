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
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
}

export interface LeavePolicy {
  id: string;
  type: string;
  annualLimit: number;
  carryForward: boolean;
  description: string;
}

export interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent' | 'Leave' | 'Holiday';
  checkIn?: string;
  checkOut?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
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
  { id: '1', name: 'Dr. Ahmad Razali', email: 'ahmad.razali@apu.edu.my', department: 'Computer Science', role: 'Senior Lecturer', grade: 'DG52', employmentType: 'Full-time', status: 'Active', joinDate: '2019-03-15', phone: '+60 12-345-6789' },
  { id: '2', name: 'Prof. Siti Aminah', email: 'siti.aminah@apu.edu.my', department: 'Business', role: 'Professor', grade: 'DG54', employmentType: 'Full-time', status: 'Active', joinDate: '2015-08-01', phone: '+60 12-987-6543' },
  { id: '3', name: 'Mr. Lee Wei Ming', email: 'lee.weiming@apu.edu.my', department: 'Engineering', role: 'Lecturer', grade: 'DG48', employmentType: 'Full-time', status: 'Active', joinDate: '2021-01-10', phone: '+60 13-456-7890' },
  { id: '4', name: 'Ms. Priya Sharma', email: 'priya.sharma@apu.edu.my', department: 'Design', role: 'Senior Lecturer', grade: 'DG52', employmentType: 'Full-time', status: 'Active', joinDate: '2020-06-20', phone: '+60 14-567-8901' },
  { id: '5', name: 'Dr. Muhammad Hafiz', email: 'muhammad.hafiz@apu.edu.my', department: 'Computer Science', role: 'Associate Professor', grade: 'DG54', employmentType: 'Full-time', status: 'Active', joinDate: '2017-02-28', phone: '+60 15-678-9012' },
  { id: '6', name: 'Mrs. Chen Li Hua', email: 'chen.lihua@apu.edu.my', department: 'Administration', role: 'HR Manager', grade: 'N44', employmentType: 'Full-time', status: 'Active', joinDate: '2018-09-12', phone: '+60 16-789-0123' },
  { id: '7', name: 'Mr. Raj Kumar', email: 'raj.kumar@apu.edu.my', department: 'IT Support', role: 'System Administrator', grade: 'N41', employmentType: 'Full-time', status: 'Active', joinDate: '2022-04-05', phone: '+60 17-890-1234' },
  { id: '8', name: 'Dr. Fatimah Zahra', email: 'fatimah.zahra@apu.edu.my', department: 'Business', role: 'Lecturer', grade: 'DG48', employmentType: 'Part-time', status: 'Inactive', joinDate: '2020-11-18', phone: '+60 18-901-2345' },
];

export const initialLeaveRequests: LeaveRequest[] = [
  { id: '1', employeeId: '1', employeeName: 'Dr. Ahmad Razali', leaveType: 'Annual Leave', startDate: '2024-01-15', endDate: '2024-01-17', days: 3, reason: 'Family vacation', status: 'Pending', appliedDate: '2024-01-10' },
  { id: '2', employeeId: '3', employeeName: 'Mr. Lee Wei Ming', leaveType: 'Medical Leave', startDate: '2024-01-12', endDate: '2024-01-12', days: 1, reason: 'Doctor appointment', status: 'Approved', appliedDate: '2024-01-11' },
  { id: '3', employeeId: '4', employeeName: 'Ms. Priya Sharma', leaveType: 'Annual Leave', startDate: '2024-01-20', endDate: '2024-01-25', days: 6, reason: 'Personal matters', status: 'Pending', appliedDate: '2024-01-08' },
  { id: '4', employeeId: '2', employeeName: 'Prof. Siti Aminah', leaveType: 'Conference Leave', startDate: '2024-02-01', endDate: '2024-02-03', days: 3, reason: 'International conference', status: 'Approved', appliedDate: '2024-01-05' },
];

export const initialLeavePolicies: LeavePolicy[] = [
  { id: '1', type: 'Annual Leave', annualLimit: 14, carryForward: true, description: 'Standard annual leave entitlement' },
  { id: '2', type: 'Medical Leave', annualLimit: 14, carryForward: false, description: 'Sick leave with medical certificate' },
  { id: '3', type: 'Conference Leave', annualLimit: 7, carryForward: false, description: 'For attending academic conferences' },
  { id: '4', type: 'Maternity Leave', annualLimit: 90, carryForward: false, description: 'Maternity leave for female employees' },
  { id: '5', type: 'Paternity Leave', annualLimit: 7, carryForward: false, description: 'Paternity leave for male employees' },
  { id: '6', type: 'Compassionate Leave', annualLimit: 3, carryForward: false, description: 'For bereavement or family emergencies' },
];

export const initialDocuments: Document[] = [
  { id: '1', name: 'Employee Handbook 2024', type: 'PDF', category: 'Policy', version: 'v2.1', uploadedBy: 'HR Admin', uploadedDate: '2024-01-01', size: '2.4 MB' },
  { id: '2', name: 'Leave Policy Guidelines', type: 'PDF', category: 'Policy', version: 'v1.3', uploadedBy: 'HR Admin', uploadedDate: '2023-12-15', size: '1.1 MB' },
  { id: '3', name: 'Performance Review Template', type: 'DOCX', category: 'Template', version: 'v1.0', uploadedBy: 'HR Admin', uploadedDate: '2024-01-05', size: '456 KB' },
  { id: '4', name: 'Salary Structure 2024', type: 'XLS', category: 'Finance', version: 'v1.0', uploadedBy: 'Finance Dept', uploadedDate: '2024-01-02', size: '890 KB' },
  { id: '5', name: 'Code of Conduct', type: 'PDF', category: 'Policy', version: 'v3.0', uploadedBy: 'HR Admin', uploadedDate: '2023-11-20', size: '1.8 MB' },
];

export const initialPayrollRecords: PayrollRecord[] = [
  { id: '1', employeeId: '1', employeeName: 'Dr. Ahmad Razali', department: 'Computer Science', basicSalary: 8500, allowances: 1500, deductions: 850, netSalary: 9150, month: 'January 2024', status: 'Processed' },
  { id: '2', employeeId: '2', employeeName: 'Prof. Siti Aminah', department: 'Business', basicSalary: 12000, allowances: 2000, deductions: 1200, netSalary: 12800, month: 'January 2024', status: 'Processed' },
  { id: '3', employeeId: '3', employeeName: 'Mr. Lee Wei Ming', department: 'Engineering', basicSalary: 6500, allowances: 1000, deductions: 650, netSalary: 6850, month: 'January 2024', status: 'Pending' },
  { id: '4', employeeId: '4', employeeName: 'Ms. Priya Sharma', department: 'Design', basicSalary: 7500, allowances: 1200, deductions: 750, netSalary: 7950, month: 'January 2024', status: 'Pending' },
  { id: '5', employeeId: '5', employeeName: 'Dr. Muhammad Hafiz', department: 'Computer Science', basicSalary: 10500, allowances: 1800, deductions: 1050, netSalary: 11250, month: 'January 2024', status: 'Processed' },
  { id: '6', employeeId: '6', employeeName: 'Mrs. Chen Li Hua', department: 'Administration', basicSalary: 7000, allowances: 1100, deductions: 700, netSalary: 7400, month: 'January 2024', status: 'Pending' },
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

// Helper function to generate attendance calendar data
export const generateAttendanceCalendar = (year: number, month: number): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const holidays = [1, 25]; // Example public holidays
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split('T')[0];
    
    let status: AttendanceRecord['status'];
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      status = 'Holiday';
    } else if (holidays.includes(day)) {
      status = 'Holiday';
    } else if (Math.random() > 0.9) {
      status = Math.random() > 0.5 ? 'Leave' : 'Absent';
    } else {
      status = 'Present';
    }
    
    records.push({
      date: dateStr,
      status,
      checkIn: status === 'Present' ? '08:' + String(Math.floor(Math.random() * 30)).padStart(2, '0') : undefined,
      checkOut: status === 'Present' ? '17:' + String(Math.floor(Math.random() * 30) + 30).padStart(2, '0') : undefined,
    });
  }
  
  return records;
};
