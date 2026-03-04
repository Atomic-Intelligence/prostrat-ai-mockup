import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Clock,
  GitCompare,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { mockAiResult, mockWebPatients } from '../data/mock';

function RiskGauge({ score, size = 200 }: { score: number; size?: number }) {
  const radius = (size - 20) / 2;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const startAngle = Math.PI;
  const endAngle = 0;
  const scoreAngle = startAngle - (score / 100) * Math.PI;

  const arcPath = (startA: number, endA: number, r: number) => {
    const x1 = cx + r * Math.cos(startA);
    const y1 = cy - r * Math.sin(startA);
    const x2 = cx + r * Math.cos(endA);
    const y2 = cy - r * Math.sin(endA);
    const largeArc = startA - endA > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // Needle
  const needleAngle = startAngle - (score / 100) * Math.PI;
  const needleLength = radius - 20;
  const nx = cx + needleLength * Math.cos(needleAngle);
  const ny = cy - needleLength * Math.sin(needleAngle);

  // Color based on score
  const getColor = (s: number) => {
    if (s <= 33) return '#22c55e';
    if (s <= 66) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
      {/* Background arc */}
      <path
        d={arcPath(startAngle, endAngle, radius)}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={16}
        strokeLinecap="round"
      />
      {/* Score arc */}
      <path
        d={arcPath(startAngle, scoreAngle, radius)}
        fill="none"
        stroke={getColor(score)}
        strokeWidth={16}
        strokeLinecap="round"
      />
      {/* Needle */}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#374151" strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={5} fill="#374151" />
      {/* Labels */}
      <text x={cx - radius + 5} y={cy + 20} textAnchor="start" className="text-xs" fill="#9ca3af" fontSize={11}>
        0
      </text>
      <text x={cx} y={cy - radius + 25} textAnchor="middle" className="text-xs" fill="#9ca3af" fontSize={11}>
        50
      </text>
      <text x={cx + radius - 5} y={cy + 20} textAnchor="end" className="text-xs" fill="#9ca3af" fontSize={11}>
        100
      </text>
      {/* Score text */}
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#111827" fontSize={32} fontWeight="bold">
        {score}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#6b7280" fontSize={12}>
        Risk Score
      </text>
    </svg>
  );
}

export default function WebAiResults() {
  const { kitId } = useParams<{ kitId: string }>();
  const navigate = useNavigate();
  const [showExplainability, setShowExplainability] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');

  const displayKitId = kitId || mockAiResult.kitId;
  const patient = mockWebPatients.find((p) => p.kits.includes(displayKitId)) || mockWebPatients[0];

  const riskCategoryConfig = {
    LOW: { label: 'LOW', className: 'bg-green-100 text-green-700 border-green-300' },
    INTERMEDIATE: { label: 'INTERMEDIATE', className: 'bg-amber-100 text-amber-700 border-amber-300' },
    HIGH: { label: 'HIGH', className: 'bg-red-100 text-red-700 border-red-300' },
  };

  const category = riskCategoryConfig[mockAiResult.riskCategory];

  const chartData = mockAiResult.featureContributions.map((f) => ({
    feature: f.feature_name,
    importance: f.contribution_weight,
    fill:
      f.contribution_weight >= 0.2
        ? '#3b82f6'
        : f.contribution_weight >= 0.1
          ? '#60a5fa'
          : '#93c5fd',
  }));

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
            <span className="text-gray-900 font-medium">AI Analysis Results</span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Analysis Results</h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span>
                  Kit: <span className="font-mono">{displayKitId}</span>
                </span>
                <span>Model: {mockAiResult.modelVersion}</span>
                <span>Analyzed: {mockAiResult.analysisDate}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Top Row - Score, Category, Confidence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Risk Score Gauge */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Risk Score</h3>
            <RiskGauge score={mockAiResult.riskScore} size={220} />
          </div>

          {/* Risk Category */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Risk Category</h3>
            <span
              className={`inline-flex items-center px-5 py-2 rounded-full text-lg font-bold border ${category.className}`}
            >
              {category.label}
            </span>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Based on integrated proteomic and clinical risk model
            </p>
          </div>

          {/* Confidence */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Model Confidence</h3>
            <p className="text-5xl font-bold text-gray-900">{Math.round(mockAiResult.confidence * 100)}%</p>
            <div className="w-full mt-4 bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all"
                style={{ width: `${mockAiResult.confidence * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Calibrated prediction probability</p>
          </div>
        </div>

        {/* Feature Importance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Feature Importance</h3>
          <p className="text-sm text-gray-500 mb-6">
            Contribution of each feature to the risk prediction (permutation importance)
          </p>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 0.3]} tickFormatter={(v: number) => v.toFixed(2)} />
              <YAxis type="category" dataKey="feature" width={110} tick={{ fontSize: 13 }} />
              <Tooltip
                formatter={(value) => [Number(value).toFixed(3), 'Importance']}
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]} barSize={28}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Explainability Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <button
            onClick={() => setShowExplainability(!showExplainability)}
            className="w-full flex items-center justify-between px-6 py-4 text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900">Explainability Details</h3>
            {showExplainability ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {showExplainability && (
            <div className="px-6 pb-6 border-t border-gray-200 pt-4">
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">SHAP Value Analysis</h4>
                  <p className="text-sm text-gray-600">
                    SHapley Additive exPlanations (SHAP) values quantify each feature&apos;s marginal contribution to the prediction. The model uses TreeSHAP for the gradient-boosted ensemble and DeepSHAP for the neural network components.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Model Architecture</h4>
                  <p className="text-sm text-gray-600">
                    The risk score is computed by an ensemble of XGBoost (proteomic features), a feedforward neural network (clinical + imaging features), and a logistic regression calibrator. Final output is a calibrated probability mapped to a 0-100 score.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Validation Performance</h4>
                  <p className="text-sm text-gray-600">
                    AUC-ROC: 0.91 (95% CI: 0.88-0.94) on the held-out validation cohort (n=1,247). Brier score: 0.12. Calibration slope: 0.97.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Approval Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Physician Review & Approval</h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
              <Clock className="w-3.5 h-3.5" />
              Pending Review
            </span>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Review Notes
            </label>
            <textarea
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              placeholder="Enter your clinical assessment and any additional notes for the record..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
              <CheckCircle2 className="w-4 h-4" />
              Approve Results
            </button>
            <button className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-red-200">
              <XCircle className="w-4 h-4" />
              Reject
            </button>
            <div className="flex-1" />
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed"
              title="No previous analysis available for comparison"
            >
              <GitCompare className="w-4 h-4" />
              Compare with Previous
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
