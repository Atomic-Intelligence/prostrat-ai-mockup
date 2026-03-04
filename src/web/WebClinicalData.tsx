import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Save, SendHorizonal, CheckCircle2 } from 'lucide-react';
import { mockClinicalData as clinicalDataArr, mockWebPatients } from '../data/mock';

const clinData = clinicalDataArr[0];

export default function WebClinicalData() {
  const { kitId } = useParams<{ kitId: string }>();
  const navigate = useNavigate();

  const displayKitId = kitId || 'PST-2026-A1B2';
  const patient = mockWebPatients.find((p) => p.activeKit === displayKitId) || mockWebPatients[0];

  const [psaLevel, setPsaLevel] = useState(clinData.psaLevel.toString());
  const [gleasonScore, setGleasonScore] = useState(clinData.gleasonScore);
  const [tumorStage, setTumorStage] = useState(clinData.tumorStage);
  const [prostateVolume, setProstateVolume] = useState(clinData.prostateVolume.toString());
  const [dreFindings, setDreFindings] = useState<'Normal' | 'Abnormal'>('Abnormal');
  const [dreNotes, setDreNotes] = useState(clinData.dreFindings);
  const [comorbidities, setComorbidities] = useState({
    diabetes: clinData.comorbidities.includes('Type 2 Diabetes'),
    hypertension: clinData.comorbidities.includes('Hypertension'),
    bph: clinData.comorbidities.includes('Benign Prostatic Hyperplasia'),
    previousTurp: false,
    familyHistoryPca: false,
  });
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'idle'>('saved');

  const psaDensity = useMemo(() => {
    const psa = parseFloat(psaLevel);
    const vol = parseFloat(prostateVolume);
    if (!isNaN(psa) && !isNaN(vol) && vol > 0) {
      return (psa / vol).toFixed(2);
    }
    return '\u2014';
  }, [psaLevel, prostateVolume]);

  const handleFieldChange = () => {
    setAutoSaveStatus('saving');
    setTimeout(() => setAutoSaveStatus('saved'), 1200);
  };

  const toggleComorbidity = (key: keyof typeof comorbidities) => {
    setComorbidities((prev) => ({ ...prev, [key]: !prev[key] }));
    handleFieldChange();
  };

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
            <span className="text-gray-900 font-medium">Clinical Data</span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clinical Data Entry</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Kit ID: <span className="font-mono">{displayKitId}</span>
              </p>
            </div>

            {/* Auto-save indicator */}
            <div className="flex items-center gap-2 text-sm">
              {autoSaveStatus === 'saved' && (
                <span className="flex items-center gap-1.5 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  Auto-saved
                </span>
              )}
              {autoSaveStatus === 'saving' && (
                <span className="flex items-center gap-1.5 text-gray-500">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  Saving...
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Two-column form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-gray-900 pb-2 border-b border-gray-200">
                Clinical Measurements
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  PSA Level (ng/mL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={psaLevel}
                  onChange={(e) => {
                    setPsaLevel(e.target.value);
                    handleFieldChange();
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Gleason Score
                </label>
                <select
                  value={gleasonScore}
                  onChange={(e) => {
                    setGleasonScore(e.target.value);
                    handleFieldChange();
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="6">6 (Grade Group 1)</option>
                  <option value="7">7 (Grade Group 2/3)</option>
                  <option value="8">8 (Grade Group 4)</option>
                  <option value="9">9 (Grade Group 5)</option>
                  <option value="10">10 (Grade Group 5)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tumor Stage
                </label>
                <select
                  value={tumorStage}
                  onChange={(e) => {
                    setTumorStage(e.target.value);
                    handleFieldChange();
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="T1a">T1a - Incidental, &le;5% of tissue</option>
                  <option value="T1b">T1b - Incidental, &gt;5% of tissue</option>
                  <option value="T1c">T1c - Identified by needle biopsy</option>
                  <option value="T2a">T2a - Involves &le;50% of one lobe</option>
                  <option value="T2b">T2b - Involves &gt;50% of one lobe</option>
                  <option value="T2c">T2c - Involves both lobes</option>
                  <option value="T3a">T3a - Extracapsular extension</option>
                  <option value="T3b">T3b - Seminal vesicle invasion</option>
                  <option value="T4">T4 - Fixed or invades adjacent structures</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Prostate Volume (mL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={prostateVolume}
                  onChange={(e) => {
                    setProstateVolume(e.target.value);
                    handleFieldChange();
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  PSA Density (ng/mL/mL)
                </label>
                <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-mono">
                  {psaDensity}
                  <span className="text-gray-400 font-sans ml-2 text-xs">(auto-calculated)</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-gray-900 pb-2 border-b border-gray-200">
                Examination & History
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digital Rectal Examination (DRE) Findings
                </label>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="dre"
                      checked={dreFindings === 'Normal'}
                      onChange={() => {
                        setDreFindings('Normal');
                        handleFieldChange();
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    Normal
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="dre"
                      checked={dreFindings === 'Abnormal'}
                      onChange={() => {
                        setDreFindings('Abnormal');
                        handleFieldChange();
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    Abnormal
                  </label>
                </div>
                <textarea
                  value={dreNotes}
                  onChange={(e) => {
                    setDreNotes(e.target.value);
                    handleFieldChange();
                  }}
                  placeholder="DRE findings notes..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Comorbidities
                </label>
                <div className="space-y-2.5">
                  {[
                    { key: 'diabetes' as const, label: 'Diabetes Mellitus' },
                    { key: 'hypertension' as const, label: 'Hypertension' },
                    { key: 'bph' as const, label: 'Benign Prostatic Hyperplasia (BPH)' },
                    { key: 'previousTurp' as const, label: 'Previous TURP' },
                    { key: 'familyHistoryPca' as const, label: 'Family History of Prostate Cancer' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={comorbidities[key]}
                        onChange={() => toggleComorbidity(key)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Previous Test Results */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Previous Test Results
            </h3>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-500">
                No previous test results on file. Historical PSA values, biopsy results, and imaging reports will appear here when available.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              onClick={() => navigate(`/web/patients/${patient.id}`)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setAutoSaveStatus('saving');
                setTimeout(() => setAutoSaveStatus('saved'), 1000);
              }}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
              <SendHorizonal className="w-4 h-4" />
              Submit
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
