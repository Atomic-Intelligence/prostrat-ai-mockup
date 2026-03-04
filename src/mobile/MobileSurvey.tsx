import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function MobileSurvey() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Section 1 — Symptoms
  const [urinarySymptoms, setUrinarySymptoms] = useState(false);
  const [painOrDiscomfort, setPainOrDiscomfort] = useState(false);
  const [bloodInUrine, setBloodInUrine] = useState(false);
  const [frequentUrination, setFrequentUrination] = useState(false);
  const [difficultyUrinating, setDifficultyUrinating] = useState(false);

  // Section 2 — Family History
  const [familyHistoryProstate, setFamilyHistoryProstate] = useState(false);
  const [familyHistoryOther, setFamilyHistoryOther] = useState(false);
  const [familyRelationship, setFamilyRelationship] = useState('');

  // Section 3 — Medications
  const [medications, setMedications] = useState('');

  // Section 4 — Previous Procedures
  const [previousBiopsy, setPreviousBiopsy] = useState(false);
  const [previousSurgery, setPreviousSurgery] = useState(false);
  const [previousRadiation, setPreviousRadiation] = useState(false);
  const [procedureDetails, setProcedureDetails] = useState('');

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const Toggle = ({
    value,
    onChange,
    label,
  }: {
    value: boolean;
    onChange: (val: boolean) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-300'} relative`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : ''}`}
        />
      </button>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="flex flex-col min-h-full bg-gray-50">
        {/* Success State */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5 animate-[scale-in_0.3s_ease-out]">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Survey Completed
          </h2>
          <p className="text-sm text-gray-500 text-center max-w-[260px] mb-8">
            Thank you for completing the health survey. This information will
            help your healthcare team.
          </p>

          <button
            onClick={() => navigate('/mobile/home')}
            className="w-full max-w-[280px] py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 bg-white border-b border-gray-100">
        <button
          onClick={() => navigate('/mobile/home')}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">Health Survey</h1>
        </div>
        <span className="text-xs font-medium text-gray-500">
          Step {currentSection} of 4
        </span>
      </div>

      {/* Progress Bar */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-1 flex-1 rounded-full transition-colors ${
                step <= currentSection ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-4 flex flex-col gap-5">
        {/* Section 1 — Symptoms */}
        {currentSection === 1 && (
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">
              Current Symptoms
            </h2>
            <p className="text-xs text-gray-500 mb-3">
              Please indicate any symptoms you are currently experiencing.
            </p>
            <div className="divide-y divide-gray-100">
              <Toggle
                label="Urinary symptoms"
                value={urinarySymptoms}
                onChange={setUrinarySymptoms}
              />
              <Toggle
                label="Pain or discomfort"
                value={painOrDiscomfort}
                onChange={setPainOrDiscomfort}
              />
              <Toggle
                label="Blood in urine (hematuria)"
                value={bloodInUrine}
                onChange={setBloodInUrine}
              />
              <Toggle
                label="Frequent urination"
                value={frequentUrination}
                onChange={setFrequentUrination}
              />
              <Toggle
                label="Difficulty urinating"
                value={difficultyUrinating}
                onChange={setDifficultyUrinating}
              />
            </div>
          </div>
        )}

        {/* Section 2 — Family History */}
        {currentSection === 2 && (
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">
              Family History
            </h2>
            <p className="text-xs text-gray-500 mb-3">
              Please provide information about relevant family medical history.
            </p>
            <div className="divide-y divide-gray-100">
              <Toggle
                label="Family history of prostate cancer"
                value={familyHistoryProstate}
                onChange={setFamilyHistoryProstate}
              />
              <Toggle
                label="Family history of other cancer"
                value={familyHistoryOther}
                onChange={setFamilyHistoryOther}
              />
            </div>
            {(familyHistoryProstate || familyHistoryOther) && (
              <div className="mt-3">
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Relationship (e.g., Father, Brother)
                </label>
                <input
                  type="text"
                  value={familyRelationship}
                  onChange={(e) => setFamilyRelationship(e.target.value)}
                  placeholder="e.g., Father, Brother"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            )}
          </div>
        )}

        {/* Section 3 — Medications */}
        {currentSection === 3 && (
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">
              Current Medications
            </h2>
            <p className="text-xs text-gray-500 mb-3">
              Please list any medications you are currently taking.
            </p>
            <textarea
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="List your current medications..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
            />
          </div>
        )}

        {/* Section 4 — Previous Procedures */}
        {currentSection === 4 && (
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">
              Previous Procedures
            </h2>
            <p className="text-xs text-gray-500 mb-3">
              Please indicate any relevant previous procedures.
            </p>
            <div className="divide-y divide-gray-100">
              <Toggle
                label="Previous biopsy"
                value={previousBiopsy}
                onChange={setPreviousBiopsy}
              />
              <Toggle
                label="Previous surgery"
                value={previousSurgery}
                onChange={setPreviousSurgery}
              />
              <Toggle
                label="Previous radiation therapy"
                value={previousRadiation}
                onChange={setPreviousRadiation}
              />
            </div>
            {(previousBiopsy || previousSurgery || previousRadiation) && (
              <div className="mt-3">
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Procedure details
                </label>
                <textarea
                  value={procedureDetails}
                  onChange={(e) => setProcedureDetails(e.target.value)}
                  placeholder="Describe the procedures..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                />
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-auto pt-2">
          {currentSection > 1 && (
            <button
              onClick={() => setCurrentSection(currentSection - 1)}
              className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors active:scale-[0.98] transform"
            >
              Back
            </button>
          )}
          {currentSection < 4 ? (
            <button
              onClick={() => setCurrentSection(currentSection + 1)}
              className="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-colors active:scale-[0.98] transform"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-colors active:scale-[0.98] transform"
            >
              Submit Survey
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
