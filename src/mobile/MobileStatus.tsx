import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  Clock,
  Home,
  ClipboardList,
  BarChart3,
  User,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import { mockKit, mockCompletedKit, mockMobileKits } from '../data/mock';

const kitStagesMap: Record<string, typeof mockKit> = {
  'PST-2026-M3N4': mockKit,
  'PST-2026-A1B2': mockCompletedKit,
};

export default function MobileStatus() {
  const navigate = useNavigate();
  const location = useLocation();

  // Build selectable kits from mockMobileKits
  const selectableKits = mockMobileKits.map((k) => ({
    id: k.id,
    kitId: k.kitId,
    status: k.status,
  }));

  const [selectedKitId, setSelectedKitId] = useState(selectableKits[0]?.kitId || mockKit.kitId);

  const selectedKitData = kitStagesMap[selectedKitId] || mockKit;

  const tabs = [
    { label: 'Home', icon: Home, route: '/mobile/home' },
    { label: 'Status', icon: ClipboardList, route: '/mobile/status' },
    { label: 'Results', icon: BarChart3, route: '/mobile/results' },
    { label: 'Profile', icon: User, route: '/mobile/home' },
  ];

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
        );
      case 'in-progress':
        return (
          <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center relative">
            <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
            <span className="absolute inset-0 rounded-full animate-ping bg-primary-200 opacity-30" />
          </div>
        );
      case 'pending':
      default:
        return (
          <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
            <Circle className="w-5 h-5 text-gray-300" />
          </div>
        );
    }
  };

  const getLineColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-300';
      case 'in-progress':
        return 'bg-primary-200';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 pt-5 pb-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">Test Status</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-gray-500">Kit ID:</span>
          <span className="text-sm font-mono font-semibold text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-md">
            {selectedKitId}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-5 pb-24">
        {/* Kit Selector */}
        {selectableKits.length > 1 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {selectableKits.map((kit) => (
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

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">
            Progress Timeline
          </h2>

          <div className="flex flex-col">
            {selectedKitData.stages.map((stage, index) => (
              <div key={stage.id} className="flex gap-4">
                {/* Timeline Column */}
                <div className="flex flex-col items-center">
                  {getStageIcon(stage.status)}
                  {index < selectedKitData.stages.length - 1 && (
                    <div
                      className={`w-0.5 flex-1 my-1 ${getLineColor(stage.status)}`}
                    />
                  )}
                </div>

                {/* Content Column */}
                <div
                  className={`flex-1 pb-6 ${index === selectedKitData.stages.length - 1 ? 'pb-0' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          stage.status === 'pending'
                            ? 'text-gray-400'
                            : 'text-gray-900'
                        }`}
                      >
                        {stage.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {stage.date || 'Pending'}
                      </p>
                    </div>
                    {stage.status === 'in-progress' && (
                      <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                        In Progress
                      </span>
                    )}
                  </div>
                  {stage.status === 'in-progress' && (
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      {stage.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estimated Time */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mt-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Estimated time remaining</p>
            <p className="text-sm font-semibold text-gray-900">
              {selectedKitData.estimatedCompletion}
            </p>
          </div>
        </div>

        {/* Contact Support */}
        <button className="w-full bg-white rounded-2xl shadow-sm p-4 mt-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary-600" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-semibold text-gray-900">
              Contact Support
            </p>
            <p className="text-xs text-gray-500">
              Have questions about your test?
            </p>
          </div>
        </button>
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
