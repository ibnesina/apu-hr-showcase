// Session storage helper for demo data persistence
import { 
  Employee, 
  LeaveRequest, 
  LeavePolicy, 
  Document, 
  PayrollRecord, 
  AuditLog,
  initialEmployees,
  initialLeaveRequests,
  initialLeavePolicies,
  initialDocuments,
  initialPayrollRecords,
  initialAuditLogs
} from './mockData';

const STORAGE_KEYS = {
  EMPLOYEES: 'apu_hr_employees',
  LEAVE_REQUESTS: 'apu_hr_leave_requests',
  LEAVE_POLICIES: 'apu_hr_leave_policies',
  DOCUMENTS: 'apu_hr_documents',
  PAYROLL: 'apu_hr_payroll',
  AUDIT_LOGS: 'apu_hr_audit_logs',
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
    requests[index].status = status;
    saveLeaveRequests(requests);
    addAuditLog('Updated', 'Leave Request', `${status} leave request for ${requests[index].employeeName}`);
    return requests[index];
  }
  return null;
};

// Leave Policy functions
export const getLeavePolicies = (): LeavePolicy[] => getFromStorage(STORAGE_KEYS.LEAVE_POLICIES, initialLeavePolicies);
export const saveLeavePolicies = (policies: LeavePolicy[]) => saveToStorage(STORAGE_KEYS.LEAVE_POLICIES, policies);

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

export const processPayroll = (id: string): PayrollRecord | null => {
  const records = getPayrollRecords();
  const index = records.findIndex(r => r.id === id);
  if (index !== -1) {
    records[index].status = 'Processed';
    savePayrollRecords(records);
    addAuditLog('Updated', 'Payroll', `Processed payroll for ${records[index].employeeName}`);
    return records[index];
  }
  return null;
};

// Audit Log functions
export const getAuditLogs = (): AuditLog[] => getFromStorage(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
export const saveAuditLogs = (logs: AuditLog[]) => saveToStorage(STORAGE_KEYS.AUDIT_LOGS, logs);

export const addAuditLog = (action: string, module: string, details: string): AuditLog => {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    id: Date.now().toString(),
    action,
    module,
    user: 'Admin',
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

// Reset all data
export const resetAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => sessionStorage.removeItem(key));
};
