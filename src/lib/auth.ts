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

// Demo users for login
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

export const login = (username: string, password: string, role: UserRole): User | null => {
  // Demo login - any password works
  // Admin login
  if (role === 'Admin' && username.toLowerCase() === 'admin') {
    const user = demoUsers['admin'];
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  }
  
  // Faculty login - match by username or use default
  const facultyKey = Object.keys(demoUsers).find(
    key => key !== 'admin' && (
      demoUsers[key].name.toLowerCase().includes(username.toLowerCase()) ||
      demoUsers[key].email.toLowerCase().includes(username.toLowerCase()) ||
      key === username.toLowerCase()
    )
  );
  
  if (role === 'Faculty') {
    const user = facultyKey ? demoUsers[facultyKey] : demoUsers['faculty1'];
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  }
  
  return null;
};

export const logout = (): void => {
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
