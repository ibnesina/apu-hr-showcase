import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, login as authLogin, logout as authLogout, getCurrentUser } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => User | null;
  logout: () => void;
  isAdmin: boolean;
  isFaculty: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getCurrentUser();
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): User | null => {
    const loggedInUser = authLogin(username, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      return loggedInUser;
    }
    return null;
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAdmin: user?.role === 'Admin',
        isFaculty: user?.role === 'Faculty',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return safe defaults when outside provider (during initial render)
    return {
      user: null,
      isLoading: true,
      login: () => null,
      logout: () => {},
      isAdmin: false,
      isFaculty: false,
    };
  }
  return context;
}
