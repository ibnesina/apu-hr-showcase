// Simple session-based authentication for demo

export type UserRole = 'Admin' | 'Faculty';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  employeeId: string;
  email: string;
  department: string;
}

const AUTH_KEY = 'apu_hr_auth_user';

// Demo users for login - auto-detection based on username
export const demoUsers: Record<string, User> = {
  'admin': {
    id: 'admin-001',
    name: 'Mrs. Chen Li Hua',
    role: 'Admin',
    employeeId: 'ADM001',
    email: 'chen.lihua@apu.edu.my',
    department: 'Administration',
  },
  'faculty1': {
    id: '1',
    name: 'Dr. Ahmad Razali',
    role: 'Faculty',
    employeeId: 'FAC001',
    email: 'ahmad.razali@apu.edu.my',
    department: 'Computer Science',
  },
  'faculty2': {
    id: '2',
    name: 'Prof. Siti Aminah',
    role: 'Faculty',
    employeeId: 'FAC002',
    email: 'siti.aminah@apu.edu.my',
    department: 'Business',
  },
  'faculty3': {
    id: '3',
    name: 'Mr. Lee Wei Ming',
    role: 'Faculty',
    employeeId: 'FAC003',
    email: 'lee.weiming@apu.edu.my',
    department: 'Engineering',
  },
};

// Auto-detect role from username
export const login = (username: string, password: string): User | null => {
  const normalizedUsername = username.toLowerCase().trim();
  
  // Direct match
  if (demoUsers[normalizedUsername]) {
    const user = demoUsers[normalizedUsername];
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
    // Log login action
    const logs = JSON.parse(sessionStorage.getItem('apu_hr_audit_logs') || '[]');
    logs.unshift({
      id: Date.now().toString(),
      action: 'Login',
      module: 'Authentication',
      user: user.name,
      timestamp: new Date().toLocaleString('en-GB', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }).replace(',', ''),
      details: `${user.name} logged in as ${user.role}`,
    });
    sessionStorage.setItem('apu_hr_audit_logs', JSON.stringify(logs));
    return user;
  }
  
  // Partial match - search by name or email
  const matchedKey = Object.keys(demoUsers).find(key => 
    demoUsers[key].name.toLowerCase().includes(normalizedUsername) ||
    demoUsers[key].email.toLowerCase().includes(normalizedUsername)
  );
  
  if (matchedKey) {
    const user = demoUsers[matchedKey];
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
    // Log login action
    const logs = JSON.parse(sessionStorage.getItem('apu_hr_audit_logs') || '[]');
    logs.unshift({
      id: Date.now().toString(),
      action: 'Login',
      module: 'Authentication',
      user: user.name,
      timestamp: new Date().toLocaleString('en-GB', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }).replace(',', ''),
      details: `${user.name} logged in as ${user.role}`,
    });
    sessionStorage.setItem('apu_hr_audit_logs', JSON.stringify(logs));
    return user;
  }
  
  return null;
};

export const logout = (): void => {
  const user = getCurrentUser();
  if (user) {
    // Log logout action
    const logs = JSON.parse(sessionStorage.getItem('apu_hr_audit_logs') || '[]');
    logs.unshift({
      id: Date.now().toString(),
      action: 'Logout',
      module: 'Authentication',
      user: user.name,
      timestamp: new Date().toLocaleString('en-GB', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }).replace(',', ''),
      details: `${user.name} logged out`,
    });
    sessionStorage.setItem('apu_hr_audit_logs', JSON.stringify(logs));
  }
  sessionStorage.removeItem(AUTH_KEY);
};

export const getCurrentUser = (): User | null => {
  const stored = sessionStorage.getItem(AUTH_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'Admin';
};

export const isFaculty = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'Faculty';
};
