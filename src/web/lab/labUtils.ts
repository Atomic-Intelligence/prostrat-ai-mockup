import type { Patient } from '../../data/mock';

export interface LabSafePatient {
  birthYear: string;
  anonymousId: string;
}

export function getLabSafePatient(patient: Patient): LabSafePatient {
  return {
    birthYear: patient.dateOfBirth.split('-')[0],
    anonymousId: patient.anonymousId,
  };
}

export function getKitStatusLabel(status: string): string {
  return status
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function getKitStatusColor(status: string): string {
  switch (status) {
    case 'ordered': return 'bg-gray-100 text-gray-700';
    case 'shipped': return 'bg-blue-100 text-blue-700';
    case 'registered': return 'bg-indigo-100 text-indigo-700';
    case 'sample_received': return 'bg-cyan-100 text-cyan-700';
    case 'processing': return 'bg-amber-100 text-amber-700';
    case 'analysis_complete': return 'bg-purple-100 text-purple-700';
    case 'results_available': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export function getQcStatusColor(status: string): string {
  switch (status) {
    case 'passed': return 'bg-green-100 text-green-700';
    case 'pending': return 'bg-amber-100 text-amber-700';
    case 'failed': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}
