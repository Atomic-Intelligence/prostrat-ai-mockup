import { createContext, useContext, useState, type ReactNode } from 'react';
import { mockMobilePatient, mockMobileKits, type Patient, type Kit } from '../data/mock';

interface MobilePatientContextType {
  patient: Patient;
  kits: Kit[];
  selectedKit: Kit | null;
  setSelectedKit: (kit: Kit) => void;
}

const MobilePatientContext = createContext<MobilePatientContextType | null>(null);

export function MobilePatientProvider({ children }: { children: ReactNode }) {
  const [selectedKit, setSelectedKit] = useState<Kit | null>(
    mockMobileKits.length > 0 ? mockMobileKits[0] : null
  );

  return (
    <MobilePatientContext.Provider
      value={{
        patient: mockMobilePatient,
        kits: mockMobileKits,
        selectedKit,
        setSelectedKit,
      }}
    >
      {children}
    </MobilePatientContext.Provider>
  );
}

export function useMobilePatient() {
  const ctx = useContext(MobilePatientContext);
  if (!ctx) throw new Error('useMobilePatient must be used within MobilePatientProvider');
  return ctx;
}
