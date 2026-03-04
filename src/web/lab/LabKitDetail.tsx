import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Upload,
  ThumbsUp,
  ThumbsDown,
  Brain,
  Download,
  ArrowLeft,
} from 'lucide-react';
import {
  mockKits,
  mockPatients,
  mockCeMsData,
  mockClinicalData,
  mockAiResults,
  mockUsers,
  mockSurveyData,
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
  const [aiAction, setAiAction] = useState<'idle' | 'running' | 'run_success' | 'export_success'>('idle');
  const [showImportAi, setShowImportAi] = useState(false);
  const [importRiskScore, setImportRiskScore] = useState('');
  const [importRiskCategory, setImportRiskCategory] = useState('LOW');
  const [importConfidence, setImportConfidence] = useState('');
  const [importModelVersion, setImportModelVersion] = useState('ProSTRAT-v3.2.1');
  const [importAiSuccess, setImportAiSuccess] = useState(false);

  // Find kit by kitId (the display ID like PST-2026-A1B2)
  const kit = mockKits.find((k) => k.kitId === kitId) ?? mockKits[0];
  const patient = mockPatients.find((p) => p.id === kit.patientId);
  const labSafe = patient ? getLabSafePatient(patient) : null;
  const cemsData = mockCeMsData.find((c) => c.kitId === kit.id);
  const clinicalData = mockClinicalData.find((c) => c.kitId === kit.id);
  const aiResult = mockAiResults.find((r) => r.kitId === kit.id);
  const orderedByUser = mockUsers.find((u) => u.id === kit.orderedBy);
  const surveyData = mockSurveyData.find((s) => s.kitId === kit.id);

  // Determine which steps are completed
  const currentStepIndex = kitLifecycleSteps.indexOf(kit.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <button onClick={() => navigate('/web/kits')} className="hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Kits
            </button>
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

        {/* Survey Data */}
        {surveyData && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Survey Data</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase">Symptoms</p>
                {[
                  { label: 'Urinary Symptoms', value: surveyData.urinarySymptoms },
                  { label: 'Pain/Discomfort', value: surveyData.painOrDiscomfort },
                  { label: 'Blood in Urine', value: surveyData.bloodInUrine },
                  { label: 'Frequent Urination', value: surveyData.frequentUrination },
                  { label: 'Difficulty Urinating', value: surveyData.difficultyUrinating },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.value ? 'bg-red-400' : 'bg-gray-300'}`} />
                    <span className={`text-xs ${item.value ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase">Family History</p>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${surveyData.familyHistoryProstateCancer ? 'bg-red-400' : 'bg-gray-300'}`} />
                  <span className={`text-xs ${surveyData.familyHistoryProstateCancer ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>Prostate Cancer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${surveyData.familyHistoryOtherCancer ? 'bg-red-400' : 'bg-gray-300'}`} />
                  <span className={`text-xs ${surveyData.familyHistoryOtherCancer ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>Other Cancer</span>
                </div>
                {surveyData.familyRelationship && (
                  <p className="text-xs text-gray-600 mt-1">Relation: {surveyData.familyRelationship}</p>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase">Medications</p>
                <p className="text-xs text-gray-700">{surveyData.currentMedications || 'None reported'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase">Previous Procedures</p>
                {[
                  { label: 'Previous Biopsy', value: surveyData.previousBiopsy },
                  { label: 'Previous Surgery', value: surveyData.previousSurgery },
                  { label: 'Previous Radiation', value: surveyData.previousRadiation },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.value ? 'bg-amber-400' : 'bg-gray-300'}`} />
                    <span className={`text-xs ${item.value ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{item.label}</span>
                  </div>
                ))}
                {surveyData.procedureDetails && (
                  <p className="text-xs text-gray-600 mt-1">Details: {surveyData.procedureDetails}</p>
                )}
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

            {/* AI Model Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">AI Model Actions</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                The AI service processes CE-MS, clinical, survey, and MRI data. It may run on a separate secure system requiring manual data exchange.
              </p>

              {aiAction === 'running' ? (
                <div className="flex items-center justify-center gap-3 py-8">
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-600">Running AI model...</p>
                </div>
              ) : aiAction === 'run_success' ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-700 font-medium">AI model execution initiated. Results will appear when processing is complete.</p>
                </div>
              ) : aiAction === 'export_success' ? (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Data package exported successfully.</p>
                    <p className="text-xs text-blue-600 mt-0.5 font-mono">prostrat_kit_{kit.kitId}_export.json</p>
                    <p className="text-xs text-blue-500 mt-0.5">Contains: CE-MS, clinical, survey, MRI metadata</p>
                  </div>
                </div>
              ) : showImportAi ? (
                <div className="space-y-4">
                  {importAiSuccess ? (
                    <div className="text-center py-4">
                      <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-gray-900">AI result imported for kit {kit.kitId}.</p>
                      <button
                        onClick={() => { setShowImportAi(false); setImportAiSuccess(false); }}
                        className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Risk Score (0-100)</label>
                          <input
                            type="number" min="0" max="100"
                            value={importRiskScore}
                            onChange={(e) => setImportRiskScore(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Risk Category</label>
                          <select
                            value={importRiskCategory}
                            onChange={(e) => setImportRiskCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                          >
                            <option value="LOW">LOW</option>
                            <option value="INTERMEDIATE">INTERMEDIATE</option>
                            <option value="HIGH">HIGH</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confidence (0-1)</label>
                          <input
                            type="number" min="0" max="1" step="0.01"
                            value={importConfidence}
                            onChange={(e) => setImportConfidence(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Model Version</label>
                          <input
                            type="text"
                            value={importModelVersion}
                            onChange={(e) => setImportModelVersion(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowImportAi(false)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => { if (importRiskScore) setImportAiSuccess(true); }}
                          className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Import Result
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      setAiAction('running');
                      setTimeout(() => setAiAction('run_success'), 1500);
                    }}
                    className="p-4 border-2 border-green-200 rounded-xl hover:bg-green-50 transition-colors text-left"
                  >
                    <Brain className="w-6 h-6 text-green-600 mb-2" />
                    <h3 className="text-sm font-semibold text-gray-900">Run AI Model</h3>
                    <p className="text-xs text-gray-500 mt-1">Automatically submit data to the AI service</p>
                  </button>
                  <button
                    onClick={() => setAiAction('export_success')}
                    className="p-4 border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-colors text-left"
                  >
                    <Download className="w-6 h-6 text-blue-600 mb-2" />
                    <h3 className="text-sm font-semibold text-gray-900">Export Data for AI</h3>
                    <p className="text-xs text-gray-500 mt-1">Download data package for offline processing</p>
                  </button>
                  <button
                    onClick={() => setShowImportAi(true)}
                    className="p-4 border-2 border-purple-200 rounded-xl hover:bg-purple-50 transition-colors text-left"
                  >
                    <Upload className="w-6 h-6 text-purple-600 mb-2" />
                    <h3 className="text-sm font-semibold text-gray-900">Import AI Result</h3>
                    <p className="text-xs text-gray-500 mt-1">Manually enter AI model results</p>
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
