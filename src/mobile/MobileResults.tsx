import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Home,
  ClipboardList,
  BarChart3,
  User,
  Download,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  MessageSquare,
  Info,
} from 'lucide-react';
import { mockResult, mockMobileKits } from '../data/mock';

export default function MobileResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedWhat, setExpandedWhat] = useState(false);

  // Filter kits with results
  const resultsKits = mockMobileKits.filter(
    (k) => k.status === 'results_available'
  );

  const [selectedKitId, setSelectedKitId] = useState(
    resultsKits[0]?.kitId || ''
  );

  const tabs = [
    { label: 'Home', icon: Home, route: '/mobile/home' },
    { label: 'Status', icon: ClipboardList, route: '/mobile/status' },
    { label: 'Results', icon: BarChart3, route: '/mobile/results' },
    { label: 'Profile', icon: User, route: '/mobile/home' },
  ];

  // SVG gauge configuration
  const gaugeRadius = 80;
  const gaugeStroke = 12;
  const gaugeCenterX = 120;
  const gaugeCenterY = 100;
  // Semi-circle from 180 to 0 degrees (left to right, top half)
  const startAngle = 180;
  const endAngle = 0;
  const totalAngle = startAngle - endAngle; // 180 degrees
  const scoreAngle = (mockResult.riskScore / mockResult.maxScore) * totalAngle;
  const _circumference = Math.PI * gaugeRadius;
  void _circumference;

  // Helper to get point on arc
  const polarToCartesian = (
    cx: number,
    cy: number,
    r: number,
    angleDeg: number
  ) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy - r * Math.sin(angleRad),
    };
  };

  // Background arc path (full semicircle)
  const bgStart = polarToCartesian(
    gaugeCenterX,
    gaugeCenterY,
    gaugeRadius,
    startAngle
  );
  const bgEnd = polarToCartesian(
    gaugeCenterX,
    gaugeCenterY,
    gaugeRadius,
    endAngle
  );
  const bgArcPath = `M ${bgStart.x} ${bgStart.y} A ${gaugeRadius} ${gaugeRadius} 0 0 1 ${bgEnd.x} ${bgEnd.y}`;

  // Score arc path
  const scoreEndAngle = startAngle - scoreAngle;
  const scoreEnd = polarToCartesian(
    gaugeCenterX,
    gaugeCenterY,
    gaugeRadius,
    scoreEndAngle
  );
  const largeArcFlag = scoreAngle > 180 ? 1 : 0;
  const scoreArcPath = `M ${bgStart.x} ${bgStart.y} A ${gaugeRadius} ${gaugeRadius} 0 ${largeArcFlag} 1 ${scoreEnd.x} ${scoreEnd.y}`;

  const riskColorMap = {
    LOW: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      accent: '#22c55e',
      label: 'Low Risk',
    },
    INTERMEDIATE: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      accent: '#f59e0b',
      label: 'Intermediate Risk',
    },
    HIGH: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      accent: '#ef4444',
      label: 'High Risk',
    },
  };

  const riskStyle = riskColorMap[mockResult.riskCategory];

  // No results available state
  if (resultsKits.length === 0) {
    return (
      <div className="flex flex-col min-h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/mobile/home')}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Your Results</h1>
          </div>
        </div>

        {/* No Results Message */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Info className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            No Results Yet
          </h2>
          <p className="text-sm text-gray-500 text-center max-w-[260px]">
            No results available yet. Your tests are still being processed.
          </p>
        </div>

        {/* Bottom Tab Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 pb-1 pt-1.5 z-10">
          <div className="flex items-center justify-around">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.route;
              return (
                <button
                  key={tab.label}
                  onClick={() => navigate(tab.route)}
                  className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
                    isActive
                      ? 'text-primary-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <tab.icon
                    className="w-5 h-5"
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                  <span
                    className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/mobile/home')}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Your Results</h1>
            <p className="text-sm text-gray-500 mt-0.5">{mockResult.dateOfResult}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-5 pb-24 flex flex-col gap-4">
        {/* Kit Selector */}
        {resultsKits.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {resultsKits.map((kit) => (
              <button
                key={kit.id}
                onClick={() => setSelectedKitId(kit.kitId)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  selectedKitId === kit.kitId
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {kit.kitId}
              </button>
            ))}
          </div>
        )}

        {/* Risk Category */}
        <div
          className={`rounded-2xl p-5 border ${riskStyle.bg} ${riskStyle.border} flex flex-col items-center`}
        >
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className={`w-5 h-5 ${riskStyle.text}`} />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Risk Assessment
            </span>
          </div>
          <p className={`text-3xl font-bold ${riskStyle.text}`}>
            {mockResult.riskCategory}
          </p>
          <p className="text-sm text-gray-600 mt-0.5">{riskStyle.label}</p>
        </div>

        {/* Gauge */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex justify-center">
            <svg
              width="240"
              height="130"
              viewBox="0 0 240 130"
              className="overflow-visible"
            >
              {/* Background arc */}
              <path
                d={bgArcPath}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={gaugeStroke}
                strokeLinecap="round"
              />
              {/* Score arc */}
              <path
                d={scoreArcPath}
                fill="none"
                stroke={riskStyle.accent}
                strokeWidth={gaugeStroke}
                strokeLinecap="round"
              />
              {/* Score indicator dot */}
              <circle
                cx={scoreEnd.x}
                cy={scoreEnd.y}
                r={7}
                fill="white"
                stroke={riskStyle.accent}
                strokeWidth={3}
              />
              {/* Center text */}
              <text
                x={gaugeCenterX}
                y={gaugeCenterY - 14}
                textAnchor="middle"
                className="text-3xl font-bold"
                fill="#111827"
                fontSize="32"
                fontWeight="700"
              >
                {mockResult.riskScore}
              </text>
              <text
                x={gaugeCenterX}
                y={gaugeCenterY + 6}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="12"
              >
                out of {mockResult.maxScore}
              </text>
              {/* Min/Max labels */}
              <text
                x={gaugeCenterX - gaugeRadius - 2}
                y={gaugeCenterY + 20}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="10"
              >
                0
              </text>
              <text
                x={gaugeCenterX + gaugeRadius + 2}
                y={gaugeCenterY + 20}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="10"
              >
                100
              </text>
            </svg>
          </div>
          {/* Confidence */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xs text-gray-500">Confidence:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${mockResult.confidence}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-700">
                {mockResult.confidence}%
              </span>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Your Results Explained
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {mockResult.explanation}
          </p>
        </div>

        {/* What does this mean? - Expandable */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setExpandedWhat(!expandedWhat)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-900">
              What does this mean?
            </span>
            {expandedWhat ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {expandedWhat && (
            <div className="px-4 pb-4 pt-0">
              <p className="text-sm text-gray-600 leading-relaxed">
                {mockResult.whatItMeans}
              </p>
            </div>
          )}
        </div>

        {/* Physician's Note */}
        {mockResult.physicianNote && (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-primary-500" />
              <h3 className="text-sm font-semibold text-gray-900">
                Physician's Note
              </h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-sm text-gray-600 leading-relaxed italic">
                "{mockResult.physicianNote}"
              </p>
            </div>
          </div>
        )}

        {/* Download PDF Button */}
        <button className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 active:scale-[0.98] transform">
          <Download className="w-4 h-4" />
          Download PDF Report
        </button>

        {/* Discuss with Doctor Card */}
        <div className="bg-primary-50 rounded-2xl p-4 flex gap-3 border border-primary-100">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-900">
              Discuss with Your Doctor
            </p>
            <p className="text-xs text-primary-700 leading-relaxed mt-0.5">
              We recommend sharing these results with your healthcare provider
              for a comprehensive discussion about your care plan.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 pb-1 pt-1.5 z-10">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.route;
            return (
              <button
                key={tab.label}
                onClick={() => navigate(tab.route)}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <tab.icon
                  className="w-5 h-5"
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <span
                  className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
