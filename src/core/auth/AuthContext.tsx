import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'viewer';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean }>;
}

const MOCK_USERS: (AuthUser & { password: string })[] = [
  { id: 'usr-0001', name: 'François Bellanger', email: 'admin@fb.com', password: 'admin123', role: 'super_admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Francois', department: 'Executive' },
  { id: 'usr-0002', name: 'Claire Dupont', email: 'claire@fb.com', password: 'admin123', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Claire', department: 'Operations' },
  { id: 'usr-0003', name: 'Marc Laurent', email: 'marc@fb.com', password: 'admin123', role: 'manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marc', department: 'Sales' },
  { id: 'usr-0004', name: 'Sophie Martin', email: 'viewer@fb.com', password: 'admin123', role: 'viewer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie', department: 'Analytics' },
];

const SESSION_KEY = 'fb_admin_session';
const TOKEN_KEY = 'fb_admin_token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  });

  const login = useCallback(async (email: string, password: string, remember = false) => {
    await new Promise(r => setTimeout(r, 800));
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'Invalid email or password' };
    const { password: _, ...authUser } = found;
    const token = btoa(JSON.stringify({ userId: found.id, exp: Date.now() + 86400000 }));
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(authUser));
    storage.setItem(TOKEN_KEY, token);
    setUser(authUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    await new Promise(r => setTimeout(r, 1000));
    return { success: true };
  }, []);

  const resetPassword = useCallback(async (_token: string, _password: string) => {
    await new Promise(r => setTimeout(r, 1000));
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 4,
  admin: 3,
  manager: 2,
  viewer: 1,
};

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
