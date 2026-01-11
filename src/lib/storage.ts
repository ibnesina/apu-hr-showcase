// Session storage helper for demo data persistence
import { 
  Employee, 
  LeaveRequest, 
  LeavePolicy, 
  Document, 
  PayrollRecord, 
  AuditLog,
  EmployeeAttendance,
  AttendanceRecord,
  Shift,
  Holiday,
  PayrollSetup,
  LeaveBalance,
  initialEmployees,
  initialLeaveRequests,
  initialLeavePolicies,
  initialDocuments,
  initialPayrollRecords,
  initialAuditLogs,
  initialAttendanceRecords,
  initialShifts,
  initialHolidays,
  initialPayrollSetup,
  generateAttendanceCalendar
} from './mockData';

const STORAGE_KEYS = {
  EMPLOYEES: 'apu_hr_employees',
  LEAVE_REQUESTS: 'apu_hr_leave_requests',
  LEAVE_POLICIES: 'apu_hr_leave_policies',
  LEAVE_BALANCES: 'apu_hr_leave_balances',
  DOCUMENTS: 'apu_hr_documents',
  PAYROLL: 'apu_hr_payroll',
  PAYROLL_SETUP: 'apu_hr_payroll_setup',
  AUDIT_LOGS: 'apu_hr_audit_logs',
  ATTENDANCE: 'apu_hr_attendance',
  SHIFTS: 'apu_hr_shifts',
  HOLIDAYS: 'apu_hr_holidays',
};

// Generic storage functions
function getFromStorage<T>(key: string, initialData: T[]): T[] {
  const stored = sessionStorage.getItem(key);
  if (stored) {
    return JSON.parse(stored);
  }
  sessionStorage.setItem(key, JSON.stringify(initialData));
  return initialData;
}

function saveToStorage<T>(key: string, data: T[]): void {
  sessionStorage.setItem(key, JSON.stringify(data));
}

// Employee functions
export const getEmployees = (): Employee[] => getFromStorage(STORAGE_KEYS.EMPLOYEES, initialEmployees);
export const saveEmployees = (employees: Employee[]) => saveToStorage(STORAGE_KEYS.EMPLOYEES, employees);

export const addEmployee = (employee: Omit<Employee, 'id'>): Employee => {
  const employees = getEmployees();
  const newEmployee = { ...employee, id: Date.now().toString() };
  employees.push(newEmployee);
  saveEmployees(employees);
  addAuditLog('Created', 'Employee', `Added new employee: ${employee.name}`);
  return newEmployee;
};

export const updateEmployee = (id: string, updates: Partial<Employee>): Employee | null => {
  const employees = getEmployees();
  const index = employees.findIndex(e => e.id === id);
  if (index !== -1) {
    employees[index] = { ...employees[index], ...updates };
    saveEmployees(employees);
    addAuditLog('Updated', 'Employee', `Updated employee: ${employees[index].name}`);
    return employees[index];
  }
  return null;
};

export const deleteEmployee = (id: string): boolean => {
  const employees = getEmployees();
  const employee = employees.find(e => e.id === id);
  const filtered = employees.filter(e => e.id !== id);
  if (filtered.length !== employees.length) {
    saveEmployees(filtered);
    addAuditLog('Deleted', 'Employee', `Removed employee: ${employee?.name}`);
    return true;
  }
  return false;
};

// Leave Request functions
export const getLeaveRequests = (): LeaveRequest[] => getFromStorage(STORAGE_KEYS.LEAVE_REQUESTS, initialLeaveRequests);
export const saveLeaveRequests = (requests: LeaveRequest[]) => saveToStorage(STORAGE_KEYS.LEAVE_REQUESTS, requests);

export const updateLeaveRequestStatus = (id: string, status: LeaveRequest['status']): LeaveRequest | null => {
  const requests = getLeaveRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index !== -1) {
    const request = requests[index];
    requests[index].status = status;
    saveLeaveRequests(requests);
    addAuditLog('Updated', 'Leave Request', `${status} leave request for ${request.employeeName}`);
    
    // If approved, update leave balance and mark attendance as Leave
    if (status === 'Approved') {
      // Update leave balance
      updateLeaveBalance(request.employeeId, request.leaveType, request.days);
      
      // Update attendance for the leave dates
      markAttendanceAsLeave(request.employeeId, request.startDate, request.endDate);
    }
    
    return requests[index];
  }
  return null;
};

// Cancel leave request
export const cancelLeaveRequest = (id: string): LeaveRequest | null => {
  const requests = getLeaveRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index !== -1 && requests[index].status === 'Pending') {
    requests[index].status = 'Cancelled';
    saveLeaveRequests(requests);
    addAuditLog('Cancelled', 'Leave Request', `Cancelled leave request for ${requests[index].employeeName}`);
    return requests[index];
  }
  return null;
};

// Leave Policy functions
export const getLeavePolicies = (): LeavePolicy[] => getFromStorage(STORAGE_KEYS.LEAVE_POLICIES, initialLeavePolicies);
export const saveLeavePolicies = (policies: LeavePolicy[]) => saveToStorage(STORAGE_KEYS.LEAVE_POLICIES, policies);

export const addLeavePolicy = (policy: Omit<LeavePolicy, 'id'>): LeavePolicy => {
  const policies = getLeavePolicies();
  const newPolicy = { ...policy, id: Date.now().toString() };
  policies.push(newPolicy);
  saveLeavePolicies(policies);
  addAuditLog('Created', 'Leave Policy', `Added leave policy: ${policy.type}`);
  return newPolicy;
};

export const updateLeavePolicy = (id: string, updates: Partial<LeavePolicy>): LeavePolicy | null => {
  const policies = getLeavePolicies();
  const index = policies.findIndex(p => p.id === id);
  if (index !== -1) {
    policies[index] = { ...policies[index], ...updates };
    saveLeavePolicies(policies);
    addAuditLog('Updated', 'Leave Policy', `Updated leave policy: ${policies[index].type}`);
    return policies[index];
  }
  return null;
};

export const deleteLeavePolicy = (id: string): boolean => {
  const policies = getLeavePolicies();
  const policy = policies.find(p => p.id === id);
  const filtered = policies.filter(p => p.id !== id);
  if (filtered.length !== policies.length) {
    saveLeavePolicies(filtered);
    addAuditLog('Deleted', 'Leave Policy', `Removed leave policy: ${policy?.type}`);
    return true;
  }
  return false;
};

// Leave Balance functions
export const getLeaveBalances = (): LeaveBalance[] => {
  const stored = sessionStorage.getItem(STORAGE_KEYS.LEAVE_BALANCES);
  if (stored) return JSON.parse(stored);
  
  // Initialize with all employees and all leave types
  const employees = getEmployees();
  const policies = getLeavePolicies();
  const balances: LeaveBalance[] = [];
  
  employees.forEach(emp => {
    policies.forEach(policy => {
      balances.push({
        employeeId: emp.id,
        leaveType: policy.type,
        used: 0,
        remaining: policy.annualLimit,
      });
    });
  });
  
  sessionStorage.setItem(STORAGE_KEYS.LEAVE_BALANCES, JSON.stringify(balances));
  return balances;
};

export const saveLeaveBalances = (balances: LeaveBalance[]) => saveToStorage(STORAGE_KEYS.LEAVE_BALANCES, balances);

export const getEmployeeLeaveBalance = (employeeId: string, leaveType: string): LeaveBalance | null => {
  const balances = getLeaveBalances();
  return balances.find(b => b.employeeId === employeeId && b.leaveType === leaveType) || null;
};

export const updateLeaveBalance = (employeeId: string, leaveType: string, daysUsed: number): void => {
  const balances = getLeaveBalances();
  const index = balances.findIndex(b => b.employeeId === employeeId && b.leaveType === leaveType);
  if (index !== -1) {
    balances[index].used += daysUsed;
    balances[index].remaining = Math.max(0, balances[index].remaining - daysUsed);
    saveLeaveBalances(balances);
  }
};

// Shift functions
export const getShifts = (): Shift[] => getFromStorage(STORAGE_KEYS.SHIFTS, initialShifts);
export const saveShifts = (shifts: Shift[]) => saveToStorage(STORAGE_KEYS.SHIFTS, shifts);

export const addShift = (shift: Omit<Shift, 'id'>): Shift => {
  const shifts = getShifts();
  const newShift = { ...shift, id: Date.now().toString() };
  shifts.push(newShift);
  saveShifts(shifts);
  addAuditLog('Created', 'Shift', `Added shift: ${shift.name}`);
  return newShift;
};

export const updateShift = (id: string, updates: Partial<Shift>): Shift | null => {
  const shifts = getShifts();
  const index = shifts.findIndex(s => s.id === id);
  if (index !== -1) {
    shifts[index] = { ...shifts[index], ...updates };
    saveShifts(shifts);
    addAuditLog('Updated', 'Shift', `Updated shift: ${shifts[index].name}`);
    return shifts[index];
  }
  return null;
};

export const deleteShift = (id: string): boolean => {
  const shifts = getShifts();
  const shift = shifts.find(s => s.id === id);
  const filtered = shifts.filter(s => s.id !== id);
  if (filtered.length !== shifts.length) {
    saveShifts(filtered);
    addAuditLog('Deleted', 'Shift', `Removed shift: ${shift?.name}`);
    return true;
  }
  return false;
};

// Holiday functions
export const getHolidays = (): Holiday[] => getFromStorage(STORAGE_KEYS.HOLIDAYS, initialHolidays);
export const saveHolidays = (holidays: Holiday[]) => saveToStorage(STORAGE_KEYS.HOLIDAYS, holidays);

export const addHoliday = (holiday: Omit<Holiday, 'id'>): Holiday => {
  const holidays = getHolidays();
  const newHoliday = { ...holiday, id: Date.now().toString() };
  holidays.push(newHoliday);
  saveHolidays(holidays);
  addAuditLog('Created', 'Holiday', `Added holiday: ${holiday.name} on ${holiday.date}`);
  
  // Update attendance for all employees on this date
  markDateAsHoliday(holiday.date);
  
  return newHoliday;
};

export const updateHoliday = (id: string, updates: Partial<Holiday>): Holiday | null => {
  const holidays = getHolidays();
  const index = holidays.findIndex(h => h.id === id);
  if (index !== -1) {
    holidays[index] = { ...holidays[index], ...updates };
    saveHolidays(holidays);
    addAuditLog('Updated', 'Holiday', `Updated holiday: ${holidays[index].name}`);
    return holidays[index];
  }
  return null;
};

export const deleteHoliday = (id: string): boolean => {
  const holidays = getHolidays();
  const holiday = holidays.find(h => h.id === id);
  const filtered = holidays.filter(h => h.id !== id);
  if (filtered.length !== holidays.length) {
    saveHolidays(filtered);
    addAuditLog('Deleted', 'Holiday', `Removed holiday: ${holiday?.name}`);
    return true;
  }
  return false;
};

// Mark a date as holiday in all employee attendance
const markDateAsHoliday = (date: string): void => {
  const records = getAttendanceRecords();
  records.forEach(emp => {
    const recordIndex = emp.records.findIndex(r => r.date === date);
    if (recordIndex !== -1) {
      emp.records[recordIndex].status = 'Holiday';
      emp.records[recordIndex].checkIn = undefined;
      emp.records[recordIndex].checkOut = undefined;
    }
  });
  saveAttendanceRecords(records);
};

// Mark attendance as Leave for date range
const markAttendanceAsLeave = (employeeId: string, startDate: string, endDate: string): void => {
  const records = getAttendanceRecords();
  const empIndex = records.findIndex(r => r.employeeId === employeeId);
  if (empIndex !== -1) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const recordIndex = records[empIndex].records.findIndex(r => r.date === dateStr);
      if (recordIndex !== -1 && records[empIndex].records[recordIndex].status !== 'Holiday') {
        records[empIndex].records[recordIndex].status = 'Leave';
        records[empIndex].records[recordIndex].checkIn = undefined;
        records[empIndex].records[recordIndex].checkOut = undefined;
      }
    }
    saveAttendanceRecords(records);
  }
};

// Payroll Setup functions
export const getPayrollSetup = (): PayrollSetup[] => getFromStorage(STORAGE_KEYS.PAYROLL_SETUP, initialPayrollSetup);
export const savePayrollSetup = (setup: PayrollSetup[]) => saveToStorage(STORAGE_KEYS.PAYROLL_SETUP, setup);

export const getEmployeePayrollSetup = (employeeId: string): PayrollSetup | null => {
  const setup = getPayrollSetup();
  return setup.find(s => s.employeeId === employeeId) || null;
};

export const updatePayrollSetup = (employeeId: string, updates: Partial<PayrollSetup>): PayrollSetup => {
  const setup = getPayrollSetup();
  const index = setup.findIndex(s => s.employeeId === employeeId);
  if (index !== -1) {
    setup[index] = { ...setup[index], ...updates };
    savePayrollSetup(setup);
    addAuditLog('Updated', 'Payroll Setup', `Updated payroll setup for employee ID: ${employeeId}`);
    return setup[index];
  } else {
    const newSetup: PayrollSetup = {
      employeeId,
      baseSalary: updates.baseSalary || 0,
      perDayRate: updates.perDayRate || 0,
      allowance: updates.allowance || 0,
    };
    setup.push(newSetup);
    savePayrollSetup(setup);
    addAuditLog('Created', 'Payroll Setup', `Created payroll setup for employee ID: ${employeeId}`);
    return newSetup;
  }
};

// Document functions
export const getDocuments = (): Document[] => getFromStorage(STORAGE_KEYS.DOCUMENTS, initialDocuments);
export const saveDocuments = (documents: Document[]) => saveToStorage(STORAGE_KEYS.DOCUMENTS, documents);

export const addDocument = (doc: Omit<Document, 'id'>): Document => {
  const documents = getDocuments();
  const newDoc = { ...doc, id: Date.now().toString() };
  documents.push(newDoc);
  saveDocuments(documents);
  addAuditLog('Created', 'Document', `Uploaded document: ${doc.name}`);
  return newDoc;
};

// Payroll functions
export const getPayrollRecords = (): PayrollRecord[] => getFromStorage(STORAGE_KEYS.PAYROLL, initialPayrollRecords);
export const savePayrollRecords = (records: PayrollRecord[]) => saveToStorage(STORAGE_KEYS.PAYROLL, records);

// Calculate payroll based on attendance and leave
export const calculatePayroll = (employeeId: string, month: string): { 
  basicSalary: number; 
  allowances: number; 
  deductions: number; 
  absentDays: number;
  unpaidLeaveDays: number;
  netSalary: number;
} => {
  const setup = getEmployeePayrollSetup(employeeId);
  const attendance = getAttendanceRecords().find(a => a.employeeId === employeeId);
  const leaveRequests = getLeaveRequests().filter(l => 
    l.employeeId === employeeId && 
    l.status === 'Approved'
  );
  const policies = getLeavePolicies();
  
  if (!setup) {
    return { basicSalary: 0, allowances: 0, deductions: 0, absentDays: 0, unpaidLeaveDays: 0, netSalary: 0 };
  }
  
  // Count absent days for the month
  const [monthName, yearStr] = month.split(' ');
  const monthIndex = new Date(`${monthName} 1, ${yearStr}`).getMonth();
  const year = parseInt(yearStr);
  
  let absentDays = 0;
  let unpaidLeaveDays = 0;
  
  if (attendance) {
    attendance.records.forEach(record => {
      const recordDate = new Date(record.date);
      if (recordDate.getMonth() === monthIndex && recordDate.getFullYear() === year) {
        if (record.status === 'Absent') {
          absentDays++;
        }
      }
    });
  }
  
  // Count unpaid leave days
  leaveRequests.forEach(request => {
    const policy = policies.find(p => p.type === request.leaveType);
    if (policy && !policy.isPaid) {
      // Check if leave falls in this month
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        if (d.getMonth() === monthIndex && d.getFullYear() === year) {
          unpaidLeaveDays++;
        }
      }
    }
  });
  
  const deductions = (absentDays + unpaidLeaveDays) * setup.perDayRate;
  const netSalary = setup.baseSalary + setup.allowance - deductions;
  
  return {
    basicSalary: setup.baseSalary,
    allowances: setup.allowance,
    deductions,
    absentDays,
    unpaidLeaveDays,
    netSalary: Math.max(0, netSalary),
  };
};

export const processPayroll = (id: string): PayrollRecord | null => {
  const records = getPayrollRecords();
  const index = records.findIndex(r => r.id === id);
  if (index !== -1) {
    const record = records[index];
    
    // Calculate actual payroll based on attendance
    const calculated = calculatePayroll(record.employeeId, record.month);
    
    records[index] = {
      ...record,
      ...calculated,
      status: 'Processed',
    };
    
    savePayrollRecords(records);
    addAuditLog('Updated', 'Payroll', `Processed payroll for ${record.employeeName} - ${record.month}`);
    return records[index];
  }
  return null;
};

// Process all payroll for a month
export const processAllPayroll = (month: string): number => {
  const records = getPayrollRecords();
  let processed = 0;
  
  records.forEach((record, index) => {
    if (record.month === month && record.status === 'Pending') {
      const calculated = calculatePayroll(record.employeeId, record.month);
      records[index] = {
        ...record,
        ...calculated,
        status: 'Processed',
      };
      processed++;
    }
  });
  
  savePayrollRecords(records);
  if (processed > 0) {
    addAuditLog('Updated', 'Payroll', `Processed ${processed} payroll records for ${month}`);
  }
  return processed;
};

// Audit Log functions
export const getAuditLogs = (): AuditLog[] => getFromStorage(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
export const saveAuditLogs = (logs: AuditLog[]) => saveToStorage(STORAGE_KEYS.AUDIT_LOGS, logs);

export const addAuditLog = (action: string, module: string, details: string): AuditLog => {
  const logs = getAuditLogs();
  const user = sessionStorage.getItem('apu_hr_auth_user');
  const userName = user ? JSON.parse(user).name : 'System';
  
  const newLog: AuditLog = {
    id: Date.now().toString(),
    action,
    module,
    user: userName,
    timestamp: new Date().toLocaleString('en-GB', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(',', ''),
    details,
  };
  logs.unshift(newLog);
  saveAuditLogs(logs);
  return newLog;
};

// Attendance functions
export const getAttendanceRecords = (): EmployeeAttendance[] => 
  getFromStorage(STORAGE_KEYS.ATTENDANCE, initialAttendanceRecords);
export const saveAttendanceRecords = (records: EmployeeAttendance[]) => 
  saveToStorage(STORAGE_KEYS.ATTENDANCE, records);

export const updateEmployeeAttendance = (
  employeeId: string, 
  date: string, 
  status: AttendanceRecord['status'],
  checkIn?: string,
  checkOut?: string
): EmployeeAttendance | null => {
  const records = getAttendanceRecords();
  const empIndex = records.findIndex(r => r.employeeId === employeeId);
  if (empIndex !== -1) {
    const recordIndex = records[empIndex].records.findIndex(r => r.date === date);
    if (recordIndex !== -1) {
      // Check shift to determine if late
      const employees = getEmployees();
      const employee = employees.find(e => e.id === employeeId);
      const shifts = getShifts();
      const shift = shifts.find(s => s.id === employee?.shiftId);
      
      let isLate = false;
      if (status === 'Present' && checkIn && shift) {
        const shiftStartMinutes = parseInt(shift.startTime.split(':')[0]) * 60 + parseInt(shift.startTime.split(':')[1]);
        const checkInMinutes = parseInt(checkIn.split(':')[0]) * 60 + parseInt(checkIn.split(':')[1]);
        isLate = checkInMinutes > shiftStartMinutes + 15; // 15 min grace
      }
      
      records[empIndex].records[recordIndex] = {
        date,
        status,
        checkIn: status === 'Present' ? (checkIn || records[empIndex].records[recordIndex].checkIn) : undefined,
        checkOut: status === 'Present' ? (checkOut || records[empIndex].records[recordIndex].checkOut) : undefined,
        isLate,
      };
      saveAttendanceRecords(records);
      addAuditLog('Updated', 'Attendance', `Updated attendance for ${records[empIndex].employeeName} on ${date}`);
      return records[empIndex];
    }
  }
  return null;
};

export const getAttendanceForDate = (date: string): { employeeId: string; employeeName: string; department: string; record: AttendanceRecord }[] => {
  const records = getAttendanceRecords();
  const employees = getEmployees();
  const shifts = getShifts();
  
  return records.map(emp => {
    const employee = employees.find(e => e.id === emp.employeeId);
    const shift = shifts.find(s => s.id === employee?.shiftId);
    
    const record = emp.records.find(r => r.date === date) || {
      date,
      status: 'Absent' as const,
    };
    return {
      employeeId: emp.employeeId,
      employeeName: emp.employeeName,
      department: emp.department,
      record,
      shift,
    };
  });
};

export const regenerateAttendanceForMonth = (year: number, month: number): void => {
  const records = getAttendanceRecords();
  const holidays = getHolidays();
  const shifts = getShifts();
  const employees = getEmployees();
  
  records.forEach(emp => {
    const employee = employees.find(e => e.id === emp.employeeId);
    const shift = shifts.find(s => s.id === employee?.shiftId);
    emp.records = generateAttendanceCalendar(year, month, holidays, shift);
  });
  
  saveAttendanceRecords(records);
};

// Reset all data
export const resetAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => sessionStorage.removeItem(key));
};
