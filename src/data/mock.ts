// =============================================================================
// ProSTRAT-AI Demo Application - Mock Data
// =============================================================================

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

export type DeletionStatus = 'active' | 'pending_deletion' | 'deleted';

export interface Patient {
  id: string;
  anonymousId: string;
  patientId: string; // Self-registration ID shown to patient (e.g. "PID-7F3A")
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  language: 'en' | 'de' | 'fr' | 'it';
  deletionStatus: DeletionStatus;
}

export type KitStatus =
  | 'ordered'
  | 'shipped'
  | 'registered'
  | 'sample_received'
  | 'processing'
  | 'analysis_complete'
  | 'results_available';

export interface Kit {
  id: string;
  kitId: string;
  patientId: string;
  status: KitStatus;
  orderedBy: string;
  registeredByPatient: boolean;
  registeredAt: string | null;
  sampleReceivedAt: string | null;
  orderedAt: string;
  shippedAt: string | null;
  processingStartedAt: string | null;
  analysisCompletedAt: string | null;
  resultsAvailableAt: string | null;
}

export interface ClinicalData {
  id: string;
  kitId: string;
  patientId: string;
  psaLevel: number;
  gleasonScore: string;
  tumorStage: string;
  prostateVolume: number;
  psaDensity: number;
  dreFindings: string;
  comorbidities: string[];
  collectedAt: string;
}

export type QcStatus = 'passed' | 'pending' | 'failed';

export interface CeMsData {
  id: string;
  kitId: string;
  qualityScore: number;
  qcStatus: QcStatus;
  totalPeptides: number;
  runDate: string;
  instrumentId: string;
}

export type RiskCategory = 'HIGH' | 'INTERMEDIATE' | 'LOW';
export type AiResultStatus = 'pending' | 'approved' | 'rejected';

export interface FeatureContribution {
  feature_name: string;
  contribution_weight: number;
  value: number | string;
}

export interface AiResult {
  id: string;
  kitId: string;
  patientId: string;
  riskScore: number;
  riskCategory: RiskCategory;
  confidence: number;
  modelVersion: string;
  status: AiResultStatus;
  featureContributions: FeatureContribution[];
  generatedAt: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

export type UserRole = 'physician' | 'lab_operator' | 'lab_supervisor' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organization: string;
}

export type ActivityType =
  | 'kit_registered'
  | 'sample_received'
  | 'analysis_complete'
  | 'results_available'
  | 'result_approved'
  | 'result_rejected'
  | 'patient_created'
  | 'kit_ordered';

export interface RecentActivity {
  id: string;
  type: ActivityType;
  message: string;
  userId: string;
  kitId: string | null;
  patientId: string | null;
  timestamp: string;
}

export type NotificationSeverity = 'info' | 'warning' | 'error' | 'success';

export interface Notification {
  id: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  read: boolean;
  userId: string;
  createdAt: string;
}

// Physician-Patient linking entity
export interface PhysicianPatient {
  id: string;
  physicianUserId: string;
  patientId: string;
  linkedPatientId: string | null; // patient's self-reg PID, null if not linked
  notes: string;
  createdAt: string;
}

// MRI Data — per patient, paired with a kit
export type MriType = 'mpMRI' | 'T2W' | 'DWI' | 'DCE';

export interface MriData {
  id: string;
  patientId: string;
  kitId: string;
  uploadedBy: string;
  uploadedByRole: UserRole;
  fileName: string;
  fileSize: string;
  mriType: MriType;
  piradsScore: number | null;
  notes: string;
  uploadedAt: string;
}

// Survey Data — per kit, filled by patient
export interface SurveyData {
  id: string;
  kitId: string;
  patientId: string;
  urinarySymptoms: boolean;
  painOrDiscomfort: boolean;
  bloodInUrine: boolean;
  frequentUrination: boolean;
  difficultyUrinating: boolean;
  familyHistoryProstateCancer: boolean;
  familyHistoryOtherCancer: boolean;
  familyRelationship: string;
  currentMedications: string;
  previousBiopsy: boolean;
  previousSurgery: boolean;
  previousRadiation: boolean;
  procedureDetails: string;
  completedAt: string;
}

// -----------------------------------------------------------------------------
// Mock Users
// -----------------------------------------------------------------------------

export const mockUsers: User[] = [
  {
    id: 'usr-001',
    email: 'dr.weber@uniklinik-heidelberg.de',
    firstName: 'Markus',
    lastName: 'Weber',
    role: 'physician',
    organization: 'Universit\u00e4tsklinikum Heidelberg',
  },
  {
    id: 'usr-002',
    email: 'l.fischer@prostrat-lab.eu',
    firstName: 'Lena',
    lastName: 'Fischer',
    role: 'lab_operator',
    organization: 'ProSTRAT Diagnostics GmbH',
  },
  {
    id: 'usr-003',
    email: 'j.hartmann@prostrat-lab.eu',
    firstName: 'Jonas',
    lastName: 'Hartmann',
    role: 'lab_supervisor',
    organization: 'ProSTRAT Diagnostics GmbH',
  },
  {
    id: 'usr-004',
    email: 'admin@prostrat-ai.eu',
    firstName: 'Clara',
    lastName: 'Neumann',
    role: 'admin',
    organization: 'ProSTRAT Diagnostics GmbH',
  },
  {
    id: 'usr-005',
    email: 'dr.bauer@charite.de',
    firstName: 'Stefan',
    lastName: 'Bauer',
    role: 'physician',
    organization: 'Charit\u00e9 \u2013 Universit\u00e4tsmedizin Berlin',
  },
];

// -----------------------------------------------------------------------------
// Mock Patients
// -----------------------------------------------------------------------------

export const mockPatients: Patient[] = [
  {
    id: 'pat-001',
    anonymousId: 'ANON-7F3A9D',
    patientId: 'PID-7F3A',
    firstName: 'Hans',
    lastName: 'M\u00fcller',
    dateOfBirth: '1958-03-14',
    email: 'h.mueller@email.de',
    phone: '+49 170 1234567',
    language: 'de',
    deletionStatus: 'active',
  },
  {
    id: 'pat-002',
    anonymousId: 'ANON-2B8E4C',
    patientId: 'PID-2B8E',
    firstName: 'Karl',
    lastName: 'Schneider',
    dateOfBirth: '1962-07-22',
    email: 'k.schneider@email.de',
    phone: '+49 171 2345678',
    language: 'de',
    deletionStatus: 'active',
  },
  {
    id: 'pat-003',
    anonymousId: 'ANON-5D1F7B',
    patientId: 'PID-5D1F',
    firstName: 'Peter',
    lastName: 'Braun',
    dateOfBirth: '1955-11-08',
    email: 'p.braun@email.de',
    phone: '+49 172 3456789',
    language: 'de',
    deletionStatus: 'active',
  },
  {
    id: 'pat-004',
    anonymousId: 'ANON-9C6A2E',
    patientId: 'PID-9C6A',
    firstName: 'Jean-Pierre',
    lastName: 'Dubois',
    dateOfBirth: '1960-01-30',
    email: 'jp.dubois@email.fr',
    phone: '+33 6 12 34 56 78',
    language: 'fr',
    deletionStatus: 'active',
  },
  {
    id: 'pat-005',
    anonymousId: 'ANON-4E8D1A',
    patientId: 'PID-4E8D',
    firstName: 'Marco',
    lastName: 'Rossi',
    dateOfBirth: '1967-09-05',
    email: 'm.rossi@email.it',
    phone: '+39 320 1234567',
    language: 'it',
    deletionStatus: 'active',
  },
  {
    id: 'pat-006',
    anonymousId: 'ANON-8B3F6C',
    patientId: 'PID-8B3F',
    firstName: 'Wolfgang',
    lastName: 'Schmidt',
    dateOfBirth: '1953-05-19',
    email: 'w.schmidt@email.de',
    phone: '+49 173 4567890',
    language: 'de',
    deletionStatus: 'pending_deletion',
  },
];

// -----------------------------------------------------------------------------
// Mock Kits
// -----------------------------------------------------------------------------

export const mockKits: Kit[] = [
  {
    id: 'kit-001',
    kitId: 'PST-2026-A1B2',
    patientId: 'pat-001',
    status: 'results_available',
    orderedBy: 'usr-001',
    registeredByPatient: true,
    registeredAt: '2026-01-10T09:15:00Z',
    sampleReceivedAt: '2026-01-14T11:30:00Z',
    orderedAt: '2026-01-06T08:00:00Z',
    shippedAt: '2026-01-07T14:20:00Z',
    processingStartedAt: '2026-01-15T07:00:00Z',
    analysisCompletedAt: '2026-01-18T16:45:00Z',
    resultsAvailableAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'kit-002',
    kitId: 'PST-2026-C3D4',
    patientId: 'pat-002',
    status: 'results_available',
    orderedBy: 'usr-001',
    registeredByPatient: false,
    registeredAt: '2026-01-18T10:00:00Z',
    sampleReceivedAt: '2026-01-22T09:45:00Z',
    orderedAt: '2026-01-15T11:30:00Z',
    shippedAt: '2026-01-16T13:10:00Z',
    processingStartedAt: '2026-01-23T07:30:00Z',
    analysisCompletedAt: '2026-01-26T14:20:00Z',
    resultsAvailableAt: '2026-01-28T09:00:00Z',
  },
  {
    id: 'kit-003',
    kitId: 'PST-2026-E5F6',
    patientId: 'pat-003',
    status: 'analysis_complete',
    orderedBy: 'usr-005',
    registeredByPatient: false,
    registeredAt: '2026-02-03T14:20:00Z',
    sampleReceivedAt: '2026-02-07T10:15:00Z',
    orderedAt: '2026-01-29T09:00:00Z',
    shippedAt: '2026-01-30T15:30:00Z',
    processingStartedAt: '2026-02-08T08:00:00Z',
    analysisCompletedAt: '2026-02-11T17:30:00Z',
    resultsAvailableAt: null,
  },
  {
    id: 'kit-004',
    kitId: 'PST-2026-G7H8',
    patientId: 'pat-004',
    status: 'processing',
    orderedBy: 'usr-001',
    registeredByPatient: false,
    registeredAt: '2026-02-14T08:45:00Z',
    sampleReceivedAt: '2026-02-18T12:00:00Z',
    orderedAt: '2026-02-10T10:00:00Z',
    shippedAt: '2026-02-11T16:00:00Z',
    processingStartedAt: '2026-02-19T07:15:00Z',
    analysisCompletedAt: null,
    resultsAvailableAt: null,
  },
  {
    id: 'kit-005',
    kitId: 'PST-2026-I9J0',
    patientId: 'pat-005',
    status: 'sample_received',
    orderedBy: 'usr-005',
    registeredByPatient: false,
    registeredAt: '2026-02-20T11:30:00Z',
    sampleReceivedAt: '2026-02-25T09:00:00Z',
    orderedAt: '2026-02-17T14:00:00Z',
    shippedAt: '2026-02-18T10:45:00Z',
    processingStartedAt: null,
    analysisCompletedAt: null,
    resultsAvailableAt: null,
  },
  {
    id: 'kit-006',
    kitId: 'PST-2026-K1L2',
    patientId: 'pat-006',
    status: 'results_available',
    orderedBy: 'usr-005',
    registeredByPatient: false,
    registeredAt: '2025-12-02T09:00:00Z',
    sampleReceivedAt: '2025-12-06T10:30:00Z',
    orderedAt: '2025-11-28T13:00:00Z',
    shippedAt: '2025-11-29T09:15:00Z',
    processingStartedAt: '2025-12-07T07:00:00Z',
    analysisCompletedAt: '2025-12-10T15:00:00Z',
    resultsAvailableAt: '2025-12-12T11:30:00Z',
  },
  {
    id: 'kit-007',
    kitId: 'PST-2026-M3N4',
    patientId: 'pat-001',
    status: 'shipped',
    orderedBy: 'usr-001',
    registeredByPatient: true,
    registeredAt: null,
    sampleReceivedAt: null,
    orderedAt: '2026-02-26T09:30:00Z',
    shippedAt: '2026-02-27T14:00:00Z',
    processingStartedAt: null,
    analysisCompletedAt: null,
    resultsAvailableAt: null,
  },
  {
    id: 'kit-008',
    kitId: 'PST-2026-O5P6',
    patientId: 'pat-002',
    status: 'ordered',
    orderedBy: 'usr-001',
    registeredByPatient: false,
    registeredAt: null,
    sampleReceivedAt: null,
    orderedAt: '2026-03-01T08:00:00Z',
    shippedAt: null,
    processingStartedAt: null,
    analysisCompletedAt: null,
    resultsAvailableAt: null,
  },
];

// -----------------------------------------------------------------------------
// Mock Clinical Data
// -----------------------------------------------------------------------------

export const mockClinicalData: ClinicalData[] = [
  {
    id: 'clin-001',
    kitId: 'kit-001',
    patientId: 'pat-001',
    psaLevel: 7.8,
    gleasonScore: '3+4',
    tumorStage: 'T2a',
    prostateVolume: 42,
    psaDensity: 0.186,
    dreFindings: 'Palpable nodule on right lobe, firm consistency',
    comorbidities: ['Hypertension', 'Type 2 Diabetes'],
    collectedAt: '2026-01-10T09:15:00Z',
  },
  {
    id: 'clin-002',
    kitId: 'kit-002',
    patientId: 'pat-002',
    psaLevel: 4.2,
    gleasonScore: '3+3',
    tumorStage: 'T1c',
    prostateVolume: 35,
    psaDensity: 0.12,
    dreFindings: 'No palpable abnormalities, symmetric gland',
    comorbidities: ['Hyperlipidemia'],
    collectedAt: '2026-01-18T10:00:00Z',
  },
  {
    id: 'clin-003',
    kitId: 'kit-003',
    patientId: 'pat-003',
    psaLevel: 12.4,
    gleasonScore: '4+3',
    tumorStage: 'T2b',
    prostateVolume: 55,
    psaDensity: 0.225,
    dreFindings: 'Bilateral induration, extension beyond midline',
    comorbidities: ['Coronary Artery Disease', 'Atrial Fibrillation', 'COPD'],
    collectedAt: '2026-02-03T14:20:00Z',
  },
  {
    id: 'clin-004',
    kitId: 'kit-004',
    patientId: 'pat-004',
    psaLevel: 5.9,
    gleasonScore: '3+4',
    tumorStage: 'T1c',
    prostateVolume: 38,
    psaDensity: 0.155,
    dreFindings: 'Subtle firmness on left apex, otherwise unremarkable',
    comorbidities: [],
    collectedAt: '2026-02-14T08:45:00Z',
  },
  {
    id: 'clin-005',
    kitId: 'kit-005',
    patientId: 'pat-005',
    psaLevel: 3.1,
    gleasonScore: '3+3',
    tumorStage: 'T1c',
    prostateVolume: 28,
    psaDensity: 0.111,
    dreFindings: 'Normal prostate, no suspicious findings',
    comorbidities: ['Benign Prostatic Hyperplasia'],
    collectedAt: '2026-02-20T11:30:00Z',
  },
  {
    id: 'clin-006',
    kitId: 'kit-006',
    patientId: 'pat-006',
    psaLevel: 14.6,
    gleasonScore: '4+3',
    tumorStage: 'T2b',
    prostateVolume: 60,
    psaDensity: 0.243,
    dreFindings: 'Large firm nodule on right lobe, possible extracapsular extension',
    comorbidities: ['Hypertension', 'Chronic Kidney Disease Stage 3', 'Obesity'],
    collectedAt: '2025-12-02T09:00:00Z',
  },
];

// -----------------------------------------------------------------------------
// Mock CE-MS Data
// -----------------------------------------------------------------------------

export const mockCeMsData: CeMsData[] = [
  {
    id: 'cems-001',
    kitId: 'kit-001',
    qualityScore: 94.2,
    qcStatus: 'passed',
    totalPeptides: 1847,
    runDate: '2026-01-15T08:30:00Z',
    instrumentId: 'CE-MS-INST-03',
  },
  {
    id: 'cems-002',
    kitId: 'kit-002',
    qualityScore: 91.7,
    qcStatus: 'passed',
    totalPeptides: 1762,
    runDate: '2026-01-23T09:00:00Z',
    instrumentId: 'CE-MS-INST-01',
  },
  {
    id: 'cems-003',
    kitId: 'kit-003',
    qualityScore: 88.3,
    qcStatus: 'passed',
    totalPeptides: 1695,
    runDate: '2026-02-08T10:15:00Z',
    instrumentId: 'CE-MS-INST-02',
  },
  {
    id: 'cems-004',
    kitId: 'kit-004',
    qualityScore: 72.1,
    qcStatus: 'pending',
    totalPeptides: 1523,
    runDate: '2026-02-19T08:00:00Z',
    instrumentId: 'CE-MS-INST-03',
  },
  {
    id: 'cems-005',
    kitId: 'kit-006',
    qualityScore: 96.5,
    qcStatus: 'passed',
    totalPeptides: 1912,
    runDate: '2025-12-07T09:30:00Z',
    instrumentId: 'CE-MS-INST-01',
  },
  {
    id: 'cems-006',
    kitId: 'kit-005',
    qualityScore: 45.8,
    qcStatus: 'failed',
    totalPeptides: 892,
    runDate: '2026-02-26T07:45:00Z',
    instrumentId: 'CE-MS-INST-02',
  },
];

// -----------------------------------------------------------------------------
// Mock AI Results
// -----------------------------------------------------------------------------

export const mockAiResults: AiResult[] = [
  {
    id: 'ai-001',
    kitId: 'kit-001',
    patientId: 'pat-001',
    riskScore: 58,
    riskCategory: 'INTERMEDIATE',
    confidence: 0.87,
    modelVersion: 'ProSTRAT-v3.2.1',
    status: 'approved',
    featureContributions: [
      { feature_name: 'PSA Level', contribution_weight: 0.18, value: 7.8 },
      { feature_name: 'Gleason Score', contribution_weight: 0.22, value: '3+4' },
      { feature_name: 'Peptide Pattern CKB-142', contribution_weight: 0.15, value: 0.73 },
      { feature_name: 'MRI Radiomics', contribution_weight: 0.12, value: 0.61 },
      { feature_name: 'Age', contribution_weight: 0.08, value: 67 },
      { feature_name: 'Prostate Volume', contribution_weight: 0.07, value: 42 },
      { feature_name: 'PSA Density', contribution_weight: 0.09, value: 0.186 },
      { feature_name: 'DRE Findings', contribution_weight: 0.05, value: 'positive' },
      { feature_name: 'Peptide Pattern COL1A1-87', contribution_weight: 0.04, value: 0.45 },
    ],
    generatedAt: '2026-01-18T17:00:00Z',
    reviewedBy: 'usr-003',
    reviewedAt: '2026-01-20T09:30:00Z',
  },
  {
    id: 'ai-002',
    kitId: 'kit-002',
    patientId: 'pat-002',
    riskScore: 22,
    riskCategory: 'LOW',
    confidence: 0.93,
    modelVersion: 'ProSTRAT-v3.2.1',
    status: 'approved',
    featureContributions: [
      { feature_name: 'PSA Level', contribution_weight: 0.10, value: 4.2 },
      { feature_name: 'Gleason Score', contribution_weight: 0.12, value: '3+3' },
      { feature_name: 'Peptide Pattern CKB-142', contribution_weight: 0.08, value: 0.31 },
      { feature_name: 'MRI Radiomics', contribution_weight: 0.06, value: 0.28 },
      { feature_name: 'Age', contribution_weight: 0.09, value: 63 },
      { feature_name: 'Prostate Volume', contribution_weight: 0.05, value: 35 },
      { feature_name: 'PSA Density', contribution_weight: 0.07, value: 0.12 },
      { feature_name: 'DRE Findings', contribution_weight: 0.02, value: 'negative' },
      { feature_name: 'Peptide Pattern TIMP1-204', contribution_weight: 0.06, value: 0.19 },
    ],
    generatedAt: '2026-01-26T14:45:00Z',
    reviewedBy: 'usr-003',
    reviewedAt: '2026-01-28T08:30:00Z',
  },
  {
    id: 'ai-003',
    kitId: 'kit-003',
    patientId: 'pat-003',
    riskScore: 81,
    riskCategory: 'HIGH',
    confidence: 0.91,
    modelVersion: 'ProSTRAT-v3.2.1',
    status: 'pending',
    featureContributions: [
      { feature_name: 'PSA Level', contribution_weight: 0.24, value: 12.4 },
      { feature_name: 'Gleason Score', contribution_weight: 0.26, value: '4+3' },
      { feature_name: 'Peptide Pattern CKB-142', contribution_weight: 0.19, value: 0.88 },
      { feature_name: 'MRI Radiomics', contribution_weight: 0.14, value: 0.79 },
      { feature_name: 'Age', contribution_weight: 0.06, value: 70 },
      { feature_name: 'Prostate Volume', contribution_weight: 0.04, value: 55 },
      { feature_name: 'PSA Density', contribution_weight: 0.11, value: 0.225 },
      { feature_name: 'DRE Findings', contribution_weight: 0.08, value: 'positive' },
      { feature_name: 'Peptide Pattern MMP9-56', contribution_weight: 0.07, value: 0.82 },
      { feature_name: 'Family History Score', contribution_weight: 0.03, value: 1 },
    ],
    generatedAt: '2026-02-11T18:00:00Z',
    reviewedBy: null,
    reviewedAt: null,
  },
  {
    id: 'ai-004',
    kitId: 'kit-006',
    patientId: 'pat-006',
    riskScore: 89,
    riskCategory: 'HIGH',
    confidence: 0.95,
    modelVersion: 'ProSTRAT-v3.2.1',
    status: 'approved',
    featureContributions: [
      { feature_name: 'PSA Level', contribution_weight: 0.27, value: 14.6 },
      { feature_name: 'Gleason Score', contribution_weight: 0.25, value: '4+3' },
      { feature_name: 'Peptide Pattern CKB-142', contribution_weight: 0.21, value: 0.92 },
      { feature_name: 'MRI Radiomics', contribution_weight: 0.16, value: 0.85 },
      { feature_name: 'Age', contribution_weight: 0.07, value: 72 },
      { feature_name: 'Prostate Volume', contribution_weight: 0.06, value: 60 },
      { feature_name: 'PSA Density', contribution_weight: 0.13, value: 0.243 },
      { feature_name: 'DRE Findings', contribution_weight: 0.09, value: 'positive' },
      { feature_name: 'Peptide Pattern COL3A1-112', contribution_weight: 0.05, value: 0.91 },
      { feature_name: 'Comorbidity Index', contribution_weight: 0.04, value: 3 },
    ],
    generatedAt: '2025-12-10T15:30:00Z',
    reviewedBy: 'usr-003',
    reviewedAt: '2025-12-12T11:00:00Z',
  },
];

// -----------------------------------------------------------------------------
// Mock Recent Activity
// -----------------------------------------------------------------------------

export const mockRecentActivity: RecentActivity[] = [
  {
    id: 'act-001',
    type: 'kit_ordered',
    message: 'Kit PST-2026-O5P6 ordered for patient ANON-2B8E4C',
    userId: 'usr-001',
    kitId: 'kit-008',
    patientId: 'pat-002',
    timestamp: '2026-03-01T08:00:00Z',
  },
  {
    id: 'act-002',
    type: 'sample_received',
    message: 'Sample received for kit PST-2026-I9J0',
    userId: 'usr-002',
    kitId: 'kit-005',
    patientId: 'pat-005',
    timestamp: '2026-02-25T09:00:00Z',
  },
  {
    id: 'act-003',
    type: 'analysis_complete',
    message: 'CE-MS analysis completed for kit PST-2026-E5F6 - awaiting AI review',
    userId: 'usr-002',
    kitId: 'kit-003',
    patientId: 'pat-003',
    timestamp: '2026-02-11T17:30:00Z',
  },
  {
    id: 'act-004',
    type: 'results_available',
    message: 'Results released for kit PST-2026-C3D4 - LOW risk classification',
    userId: 'usr-003',
    kitId: 'kit-002',
    patientId: 'pat-002',
    timestamp: '2026-01-28T09:00:00Z',
  },
  {
    id: 'act-005',
    type: 'result_approved',
    message: 'AI result for kit PST-2026-A1B2 approved by lab supervisor',
    userId: 'usr-003',
    kitId: 'kit-001',
    patientId: 'pat-001',
    timestamp: '2026-01-20T09:30:00Z',
  },
  {
    id: 'act-006',
    type: 'kit_registered',
    message: 'Kit PST-2026-I9J0 registered by Dr. Bauer for patient ANON-4E8D1A',
    userId: 'usr-005',
    kitId: 'kit-005',
    patientId: 'pat-005',
    timestamp: '2026-02-20T11:30:00Z',
  },
  {
    id: 'act-007',
    type: 'patient_created',
    message: 'New patient ANON-4E8D1A added to the system',
    userId: 'usr-005',
    kitId: null,
    patientId: 'pat-005',
    timestamp: '2026-02-17T13:45:00Z',
  },
  {
    id: 'act-008',
    type: 'result_approved',
    message: 'AI result for kit PST-2026-K1L2 approved - HIGH risk, patient notified',
    userId: 'usr-003',
    kitId: 'kit-006',
    patientId: 'pat-006',
    timestamp: '2025-12-12T11:00:00Z',
  },
  {
    id: 'act-009',
    type: 'kit_ordered',
    message: 'Follow-up kit PST-2026-M3N4 ordered for patient ANON-7F3A9D',
    userId: 'usr-001',
    kitId: 'kit-007',
    patientId: 'pat-001',
    timestamp: '2026-02-26T09:30:00Z',
  },
  {
    id: 'act-010',
    type: 'sample_received',
    message: 'Sample received for kit PST-2026-G7H8 - processing initiated',
    userId: 'usr-002',
    kitId: 'kit-004',
    patientId: 'pat-004',
    timestamp: '2026-02-18T12:00:00Z',
  },
];

// -----------------------------------------------------------------------------
// Mock Notifications
// -----------------------------------------------------------------------------

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    title: 'AI Result Pending Review',
    message:
      'The AI analysis for kit PST-2026-E5F6 (patient ANON-5D1F7B) is complete and requires supervisor review. Risk classification: HIGH (score 81).',
    severity: 'warning',
    read: false,
    userId: 'usr-003',
    createdAt: '2026-02-11T18:05:00Z',
  },
  {
    id: 'notif-002',
    title: 'QC Failed - Kit PST-2026-I9J0',
    message:
      'The CE-MS quality control for kit PST-2026-I9J0 has failed (quality score: 45.8). Total peptides detected: 892. A repeat analysis is recommended.',
    severity: 'error',
    read: false,
    userId: 'usr-002',
    createdAt: '2026-02-26T08:00:00Z',
  },
  {
    id: 'notif-003',
    title: 'Results Available',
    message:
      'Results for kit PST-2026-C3D4 are now available. Risk classification: LOW (score 22, confidence 93%). You may view the full report in the patient dashboard.',
    severity: 'success',
    read: true,
    userId: 'usr-001',
    createdAt: '2026-01-28T09:05:00Z',
  },
  {
    id: 'notif-004',
    title: 'New Kit Shipped',
    message:
      'Kit PST-2026-M3N4 has been shipped to Universit\u00e4tsklinikum Heidelberg. Expected delivery: 2-3 business days. Tracking available in the kit details.',
    severity: 'info',
    read: true,
    userId: 'usr-001',
    createdAt: '2026-02-27T14:05:00Z',
  },
  {
    id: 'notif-005',
    title: 'Patient Deletion Request',
    message:
      'Patient ANON-8B3F6C (Wolfgang Schmidt) has requested data deletion under GDPR Article 17. Review and process within 30 days. Current status: pending_deletion.',
    severity: 'warning',
    read: false,
    userId: 'usr-004',
    createdAt: '2026-02-28T10:00:00Z',
  },
  {
    id: 'notif-006',
    title: 'High Risk Result Approved',
    message:
      'The HIGH risk result for kit PST-2026-K1L2 (patient ANON-8B3F6C, score 89) has been approved by the lab supervisor. The referring physician has been notified.',
    severity: 'info',
    read: true,
    userId: 'usr-005',
    createdAt: '2025-12-12T11:35:00Z',
  },
  {
    id: 'notif-007',
    title: 'Processing Started',
    message:
      'CE-MS analysis has begun for kit PST-2026-G7H8. Estimated completion: 2-3 business days. You will be notified when results are ready for review.',
    severity: 'info',
    read: false,
    userId: 'usr-001',
    createdAt: '2026-02-19T07:20:00Z',
  },
  {
    id: 'notif-008',
    title: 'Model Version Update',
    message:
      'ProSTRAT AI model has been updated to version 3.2.1. Key improvements: enhanced peptide pattern recognition and updated risk calibration. All new analyses will use the updated model.',
    severity: 'info',
    read: true,
    userId: 'usr-004',
    createdAt: '2026-01-05T12:00:00Z',
  },
];

// -----------------------------------------------------------------------------
// Mock Physician-Patient Links
// -----------------------------------------------------------------------------

export const mockPhysicianPatients: PhysicianPatient[] = [
  { id: 'pp-001', physicianUserId: 'usr-001', patientId: 'pat-001', linkedPatientId: 'PID-7F3A', notes: 'Follow-up patient, active surveillance', createdAt: '2025-11-15T09:00:00Z' },
  { id: 'pp-002', physicianUserId: 'usr-001', patientId: 'pat-002', linkedPatientId: 'PID-2B8E', notes: '', createdAt: '2025-12-01T10:30:00Z' },
  { id: 'pp-003', physicianUserId: 'usr-001', patientId: 'pat-004', linkedPatientId: null, notes: 'Referred from Dr. Schmidt', createdAt: '2026-02-08T14:00:00Z' },
  { id: 'pp-004', physicianUserId: 'usr-005', patientId: 'pat-003', linkedPatientId: 'PID-5D1F', notes: 'High PSA, urgent workup', createdAt: '2026-01-25T08:00:00Z' },
  { id: 'pp-005', physicianUserId: 'usr-005', patientId: 'pat-005', linkedPatientId: null, notes: 'Screening patient', createdAt: '2026-02-15T11:00:00Z' },
  { id: 'pp-006', physicianUserId: 'usr-005', patientId: 'pat-006', linkedPatientId: 'PID-8B3F', notes: 'GDPR deletion requested', createdAt: '2025-11-20T09:00:00Z' },
];

// -----------------------------------------------------------------------------
// Mock MRI Data
// -----------------------------------------------------------------------------

export const mockMriData: MriData[] = [
  {
    id: 'mri-001',
    patientId: 'pat-001',
    kitId: 'kit-001',
    uploadedBy: 'usr-001',
    uploadedByRole: 'physician',
    fileName: 'pat001_mpMRI_20260112.dcm',
    fileSize: '24.5 MB',
    mriType: 'mpMRI',
    piradsScore: 3,
    notes: 'Multiparametric MRI showing 12mm lesion in peripheral zone, right mid-gland',
    uploadedAt: '2026-01-12T14:30:00Z',
  },
  {
    id: 'mri-002',
    patientId: 'pat-003',
    kitId: 'kit-003',
    uploadedBy: 'usr-003',
    uploadedByRole: 'lab_supervisor',
    fileName: 'pat003_mpMRI_20260205.dcm',
    fileSize: '31.2 MB',
    mriType: 'mpMRI',
    piradsScore: 4,
    notes: 'Suspicious lesion in left peripheral zone, 18mm, restricted diffusion',
    uploadedAt: '2026-02-05T10:00:00Z',
  },
  {
    id: 'mri-003',
    patientId: 'pat-006',
    kitId: 'kit-006',
    uploadedBy: 'usr-005',
    uploadedByRole: 'physician',
    fileName: 'pat006_mpMRI_20251204.dcm',
    fileSize: '28.7 MB',
    mriType: 'mpMRI',
    piradsScore: 5,
    notes: 'Large lesion right peripheral zone with extracapsular extension suspected',
    uploadedAt: '2025-12-04T16:00:00Z',
  },
  {
    id: 'mri-004',
    patientId: 'pat-001',
    kitId: 'kit-001',
    uploadedBy: 'usr-003',
    uploadedByRole: 'lab_supervisor',
    fileName: 'pat001_T2W_20260113.dcm',
    fileSize: '18.3 MB',
    mriType: 'T2W',
    piradsScore: null,
    notes: 'T2-weighted supplementary images',
    uploadedAt: '2026-01-13T09:00:00Z',
  },
];

// -----------------------------------------------------------------------------
// Mock Survey Data
// -----------------------------------------------------------------------------

export const mockSurveyData: SurveyData[] = [
  {
    id: 'survey-001',
    kitId: 'kit-001',
    patientId: 'pat-001',
    urinarySymptoms: true,
    painOrDiscomfort: false,
    bloodInUrine: false,
    frequentUrination: true,
    difficultyUrinating: true,
    familyHistoryProstateCancer: true,
    familyHistoryOtherCancer: false,
    familyRelationship: 'Father',
    currentMedications: 'Tamsulosin 0.4mg daily, Metformin 500mg twice daily, Lisinopril 10mg daily',
    previousBiopsy: true,
    previousSurgery: false,
    previousRadiation: false,
    procedureDetails: 'TRUS-guided biopsy in 2024, 12 cores, Gleason 3+3 in 2 cores',
    completedAt: '2026-01-10T09:30:00Z',
  },
  {
    id: 'survey-002',
    kitId: 'kit-002',
    patientId: 'pat-002',
    urinarySymptoms: false,
    painOrDiscomfort: false,
    bloodInUrine: false,
    frequentUrination: false,
    difficultyUrinating: false,
    familyHistoryProstateCancer: false,
    familyHistoryOtherCancer: true,
    familyRelationship: 'Mother (breast cancer)',
    currentMedications: 'Atorvastatin 20mg daily',
    previousBiopsy: false,
    previousSurgery: false,
    previousRadiation: false,
    procedureDetails: '',
    completedAt: '2026-01-18T10:15:00Z',
  },
  {
    id: 'survey-003',
    kitId: 'kit-006',
    patientId: 'pat-006',
    urinarySymptoms: true,
    painOrDiscomfort: true,
    bloodInUrine: true,
    frequentUrination: true,
    difficultyUrinating: true,
    familyHistoryProstateCancer: true,
    familyHistoryOtherCancer: false,
    familyRelationship: 'Brother',
    currentMedications: 'Amlodipine 5mg daily, Furosemide 40mg daily, Allopurinol 300mg daily',
    previousBiopsy: true,
    previousSurgery: true,
    previousRadiation: false,
    procedureDetails: 'TURP in 2020 for BPH, TRUS biopsy 2023 showing Gleason 4+3',
    completedAt: '2025-12-02T09:15:00Z',
  },
];

// -----------------------------------------------------------------------------
// Dashboard Summary (derived convenience data)
// -----------------------------------------------------------------------------

export const mockDashboardSummary = {
  totalPatients: mockPatients.filter((p) => p.deletionStatus === 'active').length,
  totalKits: mockKits.length,
  kitsInProgress: mockKits.filter((k) =>
    ['registered', 'sample_received', 'processing', 'analysis_complete'].includes(k.status),
  ).length,
  resultsAvailable: mockKits.filter((k) => k.status === 'results_available').length,
  pendingReview: mockAiResults.filter((r) => r.status === 'pending').length,
  qcFailures: mockCeMsData.filter((d) => d.qcStatus === 'failed').length,
  riskDistribution: {
    low: mockAiResults.filter((r) => r.riskCategory === 'LOW').length,
    intermediate: mockAiResults.filter((r) => r.riskCategory === 'INTERMEDIATE').length,
    high: mockAiResults.filter((r) => r.riskCategory === 'HIGH').length,
  },
  averageConfidence:
    mockAiResults.length > 0
      ? Math.round(
          (mockAiResults.reduce((sum, r) => sum + r.confidence, 0) / mockAiResults.length) * 100,
        ) / 100
      : 0,
  unreadNotifications: mockNotifications.filter((n) => !n.read).length,
};

// =============================================================================
// Convenience exports for Mobile screens
// =============================================================================

/** Mobile patient (uses actual patient data) */
export const mockMobilePatient = {
  ...mockPatients[0],
  // pat-001: Hans Müller, PID-7F3A
};

/** All kits for the mobile patient */
export const mockMobileKits = mockKits.filter(k => k.patientId === 'pat-001');

/** Stage status type for mobile timeline */
export type StageStatus = 'completed' | 'in-progress' | 'pending';

export interface KitStage {
  id: number;
  title: string;
  date: string;
  status: StageStatus;
  description: string;
}

/** Single kit for the mobile status screen (the in-progress one) */
export const mockKit: { kitId: string; stages: KitStage[]; estimatedCompletion: string } = {
  kitId: 'PST-2026-M3N4',
  stages: [
    { id: 1, title: 'Kit Ordered', date: 'Feb 26, 2026', status: 'completed', description: '' },
    { id: 2, title: 'Kit Shipped', date: 'Feb 27, 2026', status: 'completed', description: '' },
    { id: 3, title: 'Kit Registered', date: '', status: 'pending', description: 'Register your kit using the QR code or kit ID.' },
    { id: 4, title: 'Sample Received', date: '', status: 'pending', description: '' },
    { id: 5, title: 'Processing', date: '', status: 'pending', description: '' },
    { id: 6, title: 'Results Available', date: '', status: 'pending', description: '' },
  ],
  estimatedCompletion: '2-3 weeks',
};

/** Completed kit for mobile results */
export const mockCompletedKit: { kitId: string; stages: KitStage[]; estimatedCompletion: string } = {
  kitId: 'PST-2026-A1B2',
  stages: [
    { id: 1, title: 'Kit Registered', date: 'Jan 10, 2026', status: 'completed', description: '' },
    { id: 2, title: 'Sample Received', date: 'Jan 14, 2026', status: 'completed', description: '' },
    { id: 3, title: 'Processing', date: 'Jan 15, 2026', status: 'completed', description: '' },
    { id: 4, title: 'Analysis Complete', date: 'Jan 18, 2026', status: 'completed', description: '' },
    { id: 5, title: 'Results Available', date: 'Jan 20, 2026', status: 'completed', description: '' },
  ],
  estimatedCompletion: 'Complete',
};

/** Single AI result for the mobile results screen */
export const mockResult = {
  riskScore: 24,
  maxScore: 100,
  riskCategory: 'LOW' as RiskCategory,
  confidence: 94,
  dateOfResult: 'February 22, 2025',
  explanation:
    'Your test indicates a LOW risk of prostate cancer progression. This means that based on the analysis of your urine biomarkers, clinical data, and AI model assessment, the likelihood of your cancer progressing in the near future is low.',
  whatItMeans:
    'A LOW risk classification suggests that your prostate cancer is unlikely to progress aggressively. Your current Active Surveillance plan remains appropriate. Continue with regular PSA testing and follow-up appointments as recommended by your physician. This result does not replace professional medical advice.',
  physicianNote:
    'Results are consistent with stable low-grade disease. Recommend continuing Active Surveillance with next PSA check in 6 months and repeat biopsy in 12 months per protocol.',
};

export const mockUser = {
  firstName: 'Hans',
  lastName: 'Müller',
  email: 'h.mueller@email.de',
  patientId: 'PID-7F3A',
};

// =============================================================================
// Convenience exports for Web screens
// =============================================================================

/** Single web user for the dashboard */
export const mockWebUser = {
  firstName: 'Dr. Markus',
  lastName: 'Weber',
  role: 'Physician',
};

/** Dashboard statistics */
export const mockDashboardStats = {
  totalPatients: 148,
  activeKits: 23,
  pendingResults: 7,
  completedAnalyses: 312,
};

/** Kit status distribution for pie chart */
export const mockKitStatusDistribution = [
  { name: 'Ordered', value: 5, fill: '#94a3b8' },
  { name: 'Processing', value: 8, fill: '#3b82f6' },
  { name: 'Analysis Complete', value: 4, fill: '#a855f7' },
  { name: 'Results Available', value: 6, fill: '#22c55e' },
];

/** Patient status type for web views */
export type PatientStatus =
  | 'ordered'
  | 'sample_received'
  | 'processing'
  | 'analysis_complete'
  | 'results_available'
  | 'report_generated';

/** Web patient list data with flattened fields */
export interface WebPatient {
  id: string;
  name: string;
  anonymousId: string;
  patientId: string; // Self-registration ID
  dateOfBirth: string;
  email: string;
  phone: string;
  kits: string[]; // Array of kit IDs
  latestKitId: string; // Most recent kit
  latestStatus: PatientStatus;
  lastUpdated: string;
}

export const mockWebPatients: WebPatient[] = [
  { id: 'pat-001', name: 'Hans Müller', anonymousId: 'ANON-7F3A9D', patientId: 'PID-7F3A', dateOfBirth: '1958-03-14', email: 'h.mueller@email.de', phone: '+49 170 1234567', kits: ['PST-2026-A1B2', 'PST-2026-M3N4'], latestKitId: 'PST-2026-M3N4', latestStatus: 'results_available', lastUpdated: '2026-02-27' },
  { id: 'pat-002', name: 'Karl Schneider', anonymousId: 'ANON-2B8E4C', patientId: 'PID-2B8E', dateOfBirth: '1962-07-22', email: 'k.schneider@email.de', phone: '+49 171 2345678', kits: ['PST-2026-C3D4', 'PST-2026-O5P6'], latestKitId: 'PST-2026-O5P6', latestStatus: 'results_available', lastUpdated: '2026-03-01' },
  { id: 'pat-003', name: 'Peter Braun', anonymousId: 'ANON-5D1F7B', patientId: 'PID-5D1F', dateOfBirth: '1955-11-08', email: 'p.braun@email.de', phone: '+49 172 3456789', kits: ['PST-2026-E5F6'], latestKitId: 'PST-2026-E5F6', latestStatus: 'analysis_complete', lastUpdated: '2026-02-11' },
  { id: 'pat-004', name: 'Jean-Pierre Dubois', anonymousId: 'ANON-9C6A2E', patientId: 'PID-9C6A', dateOfBirth: '1960-01-30', email: 'jp.dubois@email.fr', phone: '+33 6 12 34 56 78', kits: ['PST-2026-G7H8'], latestKitId: 'PST-2026-G7H8', latestStatus: 'processing', lastUpdated: '2026-02-19' },
  { id: 'pat-005', name: 'Marco Rossi', anonymousId: 'ANON-4E8D1A', patientId: 'PID-4E8D', dateOfBirth: '1967-09-05', email: 'm.rossi@email.it', phone: '+39 320 1234567', kits: ['PST-2026-I9J0'], latestKitId: 'PST-2026-I9J0', latestStatus: 'sample_received', lastUpdated: '2026-02-25' },
  { id: 'pat-006', name: 'Wolfgang Schmidt', anonymousId: 'ANON-8B3F6C', patientId: 'PID-8B3F', dateOfBirth: '1953-05-19', email: 'w.schmidt@email.de', phone: '+49 173 4567890', kits: ['PST-2026-K1L2'], latestKitId: 'PST-2026-K1L2', latestStatus: 'results_available', lastUpdated: '2025-12-12' },
];

/** Single AI result for web detail view */
export const mockAiResult = {
  kitId: 'PST-2026-A1B2',
  riskScore: 62,
  riskCategory: 'INTERMEDIATE' as RiskCategory,
  confidence: 0.87,
  modelVersion: 'v2.1.0',
  analysisDate: 'January 18, 2026',
  status: 'pending' as AiResultStatus,
  featureContributions: [
    { feature_name: 'PSA Level', contribution_weight: 0.28 },
    { feature_name: 'Peptide CKB-142', contribution_weight: 0.22 },
    { feature_name: 'Gleason Score', contribution_weight: 0.18 },
    { feature_name: 'MRI Radiomics', contribution_weight: 0.12 },
    { feature_name: 'PSA Density', contribution_weight: 0.08 },
    { feature_name: 'Prostate Volume', contribution_weight: 0.06 },
    { feature_name: 'Age', contribution_weight: 0.04 },
    { feature_name: 'DRE Findings', contribution_weight: 0.02 },
  ],
};

/** Patient timeline events for detail view */
export const mockPatientTimeline = [
  { date: 'Jan 6, 2026', event: 'Kit PST-2026-A1B2 ordered', type: 'kit' },
  { date: 'Jan 7, 2026', event: 'Kit shipped to clinic', type: 'shipping' },
  { date: 'Jan 10, 2026', event: 'Kit registered by patient', type: 'registration' },
  { date: 'Jan 14, 2026', event: 'Sample received at laboratory', type: 'sample' },
  { date: 'Jan 15, 2026', event: 'CE-MS processing started', type: 'processing' },
  { date: 'Jan 18, 2026', event: 'AI analysis completed - INTERMEDIATE risk', type: 'analysis' },
  { date: 'Jan 20, 2026', event: 'Results approved and released', type: 'results' },
];
