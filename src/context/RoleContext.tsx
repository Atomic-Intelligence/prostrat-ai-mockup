import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import { mockUsers, type User } from '../data/mock';

export type WebRole = 'physician' | 'lab_operator' | 'lab_supervisor';

interface RoleContextType {
  role: WebRole;
  setRole: (role: WebRole) => void;
  currentUser: User;
}

const RoleContext = createContext<RoleContextType | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<WebRole>('physician');

  const currentUser = useMemo(() => {
    switch (role) {
      case 'physician':
        return mockUsers[0]; // Dr. Markus Weber
      case 'lab_operator':
        return mockUsers[1]; // Lena Fischer
      case 'lab_supervisor':
        return mockUsers[2]; // Jonas Hartmann
    }
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, setRole, currentUser }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
