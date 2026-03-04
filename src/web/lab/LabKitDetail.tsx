import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronRight,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Upload,
  ThumbsUp,
  ThumbsDown,
  Brain,
} from 'lucide-react';
import {
  mockKits,
  mockPatients,
  mockCeMsData,
  mockClinicalData,
  mockAiResults,
  mockUsers,
  type KitStatus,
} from '../../data/mock';
import { useRole } from '../../context/RoleContext';
import WebRoleHeader from '../WebRoleHeader';
import { getLabSafePatient, getKitStatusLabel, getKitStatusColor, getQcStatusColor } from './labUtils';

const kitLifecycleSteps: KitStatus[] = [
  'ordered',
  'shipped',
  'registered',
  'sample_received',
  'processing',
  'analysis_complete',
  'results_available',
];

function getStepDate(kit: (typeof mockKits)[0], step: KitStatus): string | null {
  switch (step) {
    case 'ordered': return kit.orderedAt;
    case 'shipped': return kit.shippedAt;
    case 'registered': return kit.registeredAt;
    case 'sample_received': return kit.sampleReceivedAt;
    case 'processing': return kit.processingStartedAt;
    case 'analysis_complete': return kit.analysisCompletedAt;
    case 'results_available': return kit.resultsAvailableAt;
    default: return null;
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function LabKitDetail() {
  const { kitId } = useParams<{ kitId: string }>();
  const navigate = useNavigate();
  const { role } = useRole();
  const [qcActionDone, setQcActionDone] = useState<'approved' | 'rejected' | null>(null);

  // Find kit by kitId (the display ID like PST-2026-A1B2)
  const kit = mockKits.find((k) => k.kitId === kitId) ?? mockKits[0];
  const patient = mockPatients.find((p) => p.id === kit.patientId);
  const labSafe = patient ? getLabSafePatient(patient) : null;
  const cemsData = mockCeMsData.find((c) => c.kitId === kit.id);
  const clinicalData = mockClinicalData.find((c) => c.kitId === kit.id);
  const aiResult = mockAiResults.find((r) => r.kitId === kit.id);
  const orderedByUser = mockUsers.find((u) => u.id === kit.orderedBy);

  // Determine which steps are completed
  const currentStepIndex = kitLifecycleSteps.indexOf(kit.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link to="/web/kits" className="hover:text-blue-600">
              Kits
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium">Kit {kit.kitId}</span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{kit.kitId}</h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getKitStatusColor(kit.status)}`}
                >
                  {getKitStatusLabel(kit.status)}
                </span>
                {labSafe && (
                  <>
                    <span>Birth Year: {labSafe.birthYear}</span>
                    <span className="font-mono text-xs">{labSafe.anonymousId}</span>
                  </>
                )}
                {orderedByUser && (
                  <span>Ordered by: {orderedByUser.firstName} {orderedByUser.lastName}</span>
                )}
              </div>
            </div>
            <WebRoleHeader />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Status Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Kit Lifecycle</h2>
          <div className="relative pl-8">
            {/* Vertical line */}
            <div className="absolute left-[15px] top-1 bottom-1 w-0.5 bg-gray-200" />
            <div className="space-y-6">
              {kitLifecycleSteps.map((step, i) => {
                const isCompleted = i < currentStepIndex;
                const isCurrent = i === currentStepIndex;
                const isFuture = i > currentStepIndex;
                const date = getStepDate(kit, step);

                return (
                  <div key={step} className="relative flex items-start gap-4">
                    {/* Step indicator */}
                    <div className="absolute -left-8">
                      {isCompleted && (
                        <CheckCircle2 className="w-7 h-7 text-green-500" />
                      )}
                      {isCurrent && (
                        <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                          <Circle className="w-3 h-3 text-white fill-white" />
                        </div>
                      )}
                      {isFuture && (
                        <Circle className="w-7 h-7 text-gray-300" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          isFuture ? 'text-gray-400' : 'text-gray-900'
                        }`}
                      >
                        {getKitStatusLabel(step)}
                      </p>
                      {date && (
                        <p className="text-xs text-gray-500 mt-0.5">{formatDate(date)}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CE-MS Data Panel */}
        {cemsData && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">CE-MS Data</h2>

            {cemsData.qcStatus === 'failed' && (
              <div className="flex items-center gap-3 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700 font-medium">
                  QC Failed - Quality score below threshold. A repeat analysis is recommended.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Quality Score</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-gray-900">{cemsData.qualityScore}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        cemsData.qualityScore >= 80
                          ? 'bg-green-500'
                          : cemsData.qualityScore >= 60
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${cemsData.qualityScore}%` }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">QC Status</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getQcStatusColor(cemsData.qcStatus)}`}
                >
                  {cemsData.qcStatus}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Peptides</p>
                <p className="text-lg font-semibold text-gray-900">{cemsData.totalPeptides.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Run Date</p>
                <p className="text-sm text-gray-900">{formatDate(cemsData.runDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Instrument ID</p>
                <p className="text-sm font-mono text-gray-700">{cemsData.instrumentId}</p>
              </div>
            </div>
          </div>
        )}

        {/* Clinical Data Summary (read-only) */}
        {clinicalData && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Clinical Data Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">PSA Level</p>
                <p className="text-lg font-semibold text-gray-900">{clinicalData.psaLevel} ng/mL</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Gleason Score</p>
                <p className="text-lg font-semibold text-gray-900">{clinicalData.gleasonScore}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Tumor Stage</p>
                <p className="text-lg font-semibold text-gray-900">{clinicalData.tumorStage}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Prostate Volume</p>
                <p className="text-lg font-semibold text-gray-900">{clinicalData.prostateVolume} mL</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">PSA Density</p>
                <p className="text-lg font-semibold text-gray-900">{clinicalData.psaDensity.toFixed(3)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Lab Supervisor Only Section */}
        {role === 'lab_supervisor' && (
          <div className="space-y-6">
            {/* QC Review */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Supervisor Actions</h2>

              {qcActionDone ? (
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg ${
                    qcActionDone === 'approved'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {qcActionDone === 'approved' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                  <p
                    className={`text-sm font-medium ${
                      qcActionDone === 'approved' ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    QC {qcActionDone === 'approved' ? 'Approved' : 'Rejected'} successfully.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQcActionDone('approved')}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Approve QC
                  </button>
                  <button
                    onClick={() => setQcActionDone('rejected')}
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-red-200"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    Reject QC
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={() => navigate(`/web/mri-upload/${kit.patientId}`)}
                    className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-purple-200"
                  >
                    <Upload className="w-4 h-4" />
                    Upload MRI
                  </button>
                </div>
              )}
            </div>

            {/* AI Result Summary (if results available) */}
            {aiResult && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900">AI Result Summary</h2>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Risk Score</p>
                    <p className="text-3xl font-bold text-gray-900">{aiResult.riskScore}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Risk Category</p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                        aiResult.riskCategory === 'LOW'
                          ? 'bg-green-100 text-green-700'
                          : aiResult.riskCategory === 'INTERMEDIATE'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {aiResult.riskCategory}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Confidence</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {Math.round(aiResult.confidence * 100)}%
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-4 text-sm text-gray-500">
                  <span>Model: {aiResult.modelVersion}</span>
                  <span>Status: <span className="capitalize font-medium">{aiResult.status}</span></span>
                  <span>Generated: {formatDate(aiResult.generatedAt)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
