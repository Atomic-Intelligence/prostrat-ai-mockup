import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  FileDown,
  Share2,
  Link2,
  Mail,
  Dna,
  AlertTriangle,
} from 'lucide-react';
import { mockWebPatients, mockAiResult, mockClinicalData as clinicalDataArr } from '../data/mock';

const clinData = clinicalDataArr[0];

const templates = ['Standard Report', 'Detailed Clinical Report', 'Summary Report'] as const;
const languages = ['English', 'German', 'Croatian'] as const;
const recommendationTemplates = [
  'Select a template...',
  'Active Surveillance Protocol',
  'Referral for MRI-Guided Biopsy',
  'Multidisciplinary Tumor Board Review',
  'Radical Prostatectomy Evaluation',
  'Radiation Therapy Consultation',
] as const;

const defaultSections = {
  patientInfo: true,
  clinicalData: true,
  cemsData: true,
  aiAnalysis: true,
  riskAssessment: true,
  physicianRecommendations: true,
};

export default function WebReportGen() {
  const { kitId } = useParams<{ kitId: string }>();
  const navigate = useNavigate();

  const displayKitId = kitId || mockAiResult.kitId;
  const patient = mockWebPatients.find((p) => p.kits.includes(displayKitId)) || mockWebPatients[0];

  const [template, setTemplate] = useState<string>(templates[0]);
  const [language, setLanguage] = useState<string>(languages[0]);
  const [sections, setSections] = useState(defaultSections);
  const [interpretation, setInterpretation] = useState(
    'The integrated proteomic and clinical risk model indicates intermediate risk for clinically significant prostate cancer. Given the PSA level of 7.2 ng/mL, Gleason 7, and abnormal DRE findings, further evaluation with multiparametric MRI is recommended before proceeding to biopsy.'
  );
  const [recTemplate, setRecTemplate] = useState<string>(recommendationTemplates[0]);
  const [customRec, setCustomRec] = useState(
    'Recommend mpMRI of the prostate within 4 weeks. If PI-RADS >= 3, proceed with MRI-targeted biopsy. Follow-up PSA in 3 months. Patient counseled regarding findings and next steps.'
  );
  const [showShareOptions, setShowShareOptions] = useState(false);

  const toggleSection = (key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // SVG gauge for preview
  const score = mockAiResult.riskScore;
  const gaugeRadius = 40;
  const gaugeCx = 50;
  const gaugeCy = 50;
  const startAngle = Math.PI;
  const scoreAngle = startAngle - (score / 100) * Math.PI;
  const arcEndX = gaugeCx + gaugeRadius * Math.cos(scoreAngle);
  const arcEndY = gaugeCy - gaugeRadius * Math.sin(scoreAngle);
  const largeArc = score > 50 ? 1 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <button onClick={() => navigate('/web/patients')} className="hover:text-blue-600">
              Patients
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button
              onClick={() => navigate(`/web/patients/${patient.id}`)}
              className="hover:text-blue-600"
            >
              {patient.name}
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium">Generate Report</span>
          </nav>

          <h1 className="text-2xl font-bold text-gray-900">Generate Report</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Kit: <span className="font-mono">{displayKitId}</span> &bull;{' '}
            {patient.name}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Configuration */}
          <div className="space-y-6">
            {/* Template & Language */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Report Configuration</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Report Template
                  </label>
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {templates.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {languages.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Report Sections</h3>
              <div className="space-y-3">
                {[
                  { key: 'patientInfo' as const, label: 'Patient Information' },
                  { key: 'clinicalData' as const, label: 'Clinical Data' },
                  { key: 'cemsData' as const, label: 'CE-MS Proteomic Summary' },
                  { key: 'aiAnalysis' as const, label: 'AI Analysis' },
                  { key: 'riskAssessment' as const, label: 'Risk Assessment' },
                  { key: 'physicianRecommendations' as const, label: 'Physician Recommendations' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sections[key]}
                      onChange={() => toggleSection(key)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Physician Interpretation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Physician Interpretation
              </h3>
              <textarea
                value={interpretation}
                onChange={(e) => setInterpretation(e.target.value)}
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Recommendations</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Recommendation Template
                  </label>
                  <select
                    value={recTemplate}
                    onChange={(e) => setRecTemplate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {recommendationTemplates.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Custom Recommendation Text
                  </label>
                  <textarea
                    value={customRec}
                    onChange={(e) => setCustomRec(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Report Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-base font-semibold text-gray-900">Report Preview</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {template} &bull; {language}
                </p>
              </div>

              {/* Mock PDF Preview */}
              <div className="p-6 space-y-6 max-h-[calc(100vh-220px)] overflow-y-auto">
                {/* Report Header */}
                <div className="border-b-2 border-blue-600 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Dna className="w-6 h-6 text-blue-600" />
                      <span className="text-lg font-bold text-blue-800">ProSTRAT-AI</span>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p>Clinical Analysis Report</p>
                      <p>Generated: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Patient Info Section */}
                {sections.patientInfo && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                      Patient Information
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Name:</span>{' '}
                        <span className="font-medium">
                          {patient.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Patient ID:</span>{' '}
                        <span className="font-mono font-medium">{patient.id}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">DOB:</span>{' '}
                        <span className="font-medium">{patient.dateOfBirth}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Kit ID:</span>{' '}
                        <span className="font-mono font-medium">{displayKitId}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Clinical Data Section */}
                {sections.clinicalData && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                      Clinical Data
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">PSA:</span>{' '}
                        <span className="font-medium">{clinData.psaLevel} ng/mL</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Gleason:</span>{' '}
                        <span className="font-medium">{clinData.gleasonScore}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Stage:</span>{' '}
                        <span className="font-medium">{clinData.tumorStage}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Volume:</span>{' '}
                        <span className="font-medium">{clinData.prostateVolume} mL</span>
                      </div>
                      <div>
                        <span className="text-gray-500">DRE:</span>{' '}
                        <span className="font-medium">{clinData.dreFindings}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">PSA Density:</span>{' '}
                        <span className="font-medium">{clinData.psaDensity}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Risk Assessment with Gauge */}
                {sections.riskAssessment && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                      Risk Assessment
                    </h4>
                    <div className="flex items-center gap-6">
                      <svg width={100} height={65} viewBox="0 0 100 65">
                        {/* Background arc */}
                        <path
                          d={`M ${gaugeCx - gaugeRadius} ${gaugeCy} A ${gaugeRadius} ${gaugeRadius} 0 0 1 ${gaugeCx + gaugeRadius} ${gaugeCy}`}
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth={8}
                          strokeLinecap="round"
                        />
                        {/* Score arc */}
                        <path
                          d={`M ${gaugeCx - gaugeRadius} ${gaugeCy} A ${gaugeRadius} ${gaugeRadius} 0 ${largeArc} 1 ${arcEndX} ${arcEndY}`}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth={8}
                          strokeLinecap="round"
                        />
                        <text
                          x={gaugeCx}
                          y={gaugeCy - 5}
                          textAnchor="middle"
                          fill="#111827"
                          fontSize={18}
                          fontWeight="bold"
                        >
                          {score}
                        </text>
                        <text
                          x={gaugeCx}
                          y={gaugeCy + 8}
                          textAnchor="middle"
                          fill="#6b7280"
                          fontSize={7}
                        >
                          /100
                        </text>
                      </svg>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Risk Category:</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold text-xs">
                            <AlertTriangle className="w-3 h-3" />
                            {mockAiResult.riskCategory}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Confidence:</span>{' '}
                          <span className="font-medium">{Math.round(mockAiResult.confidence * 100)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Model:</span>{' '}
                          <span className="font-medium">{mockAiResult.modelVersion}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Analysis Key Findings */}
                {sections.aiAnalysis && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                      AI Analysis - Key Findings
                    </h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Top contributing features to risk prediction:</p>
                      <ul className="list-disc list-inside space-y-0.5 ml-2">
                        {mockAiResult.featureContributions.slice(0, 4).map((f) => (
                          <li key={f.feature_name}>
                            <span className="font-medium text-gray-900">{f.feature_name}</span>
                            <span className="text-gray-500">
                              {' '}
                              (importance: {f.contribution_weight.toFixed(2)})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Physician Recommendations */}
                {sections.physicianRecommendations && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                      Physician Interpretation & Recommendations
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{interpretation}</p>
                    {customRec && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                        <strong>Recommendation:</strong> {customRec}
                      </div>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="border-t border-gray-200 pt-3 text-xs text-gray-400 text-center">
                  <p>ProSTRAT-AI Clinical Report &bull; Confidential Medical Document</p>
                  <p>EU MDR Class C IVD &bull; For licensed healthcare professional use only</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/web/patients/${patient.id}`)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to Patient
            </button>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
                <FileDown className="w-4 h-4" />
                Generate PDF
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Generate & Share
                </button>

                {showShareOptions && (
                  <div className="absolute right-0 bottom-full mb-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-4 space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900">Share Options</h4>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-left">
                      <Link2 className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Generate Link</p>
                        <p className="text-xs text-gray-500">Expires in 7 days</p>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-left">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Send to Patient Email</p>
                        <p className="text-xs text-gray-500">{patient.email}</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
