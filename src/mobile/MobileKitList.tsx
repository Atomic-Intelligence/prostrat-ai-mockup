import { useNavigate, Link } from 'react-router-dom';
import {
  TestTube2,
  ChevronRight,
  Plus,
  ArrowLeft,
  Clock,
  Home,
  ClipboardList,
  BarChart3,
  User,
} from 'lucide-react';
import { mockMobileKits, mockKits } from '../data/mock';
import type { KitStatus } from '../data/mock';

export default function MobileKitList() {
  const navigate = useNavigate();

  const tabs = [
    { label: 'Home', icon: Home, route: '/mobile/home' },
    { label: 'Status', icon: ClipboardList, route: '/mobile/status' },
    { label: 'Results', icon: BarChart3, route: '/mobile/results' },
    { label: 'Profile', icon: User, route: '/mobile/home' },
  ];

  const getStatusBadge = (status: KitStatus) => {
    switch (status) {
      case 'ordered':
      case 'shipped':
        return { bg: 'bg-gray-100', text: 'text-gray-600', dot: false, label: status === 'ordered' ? 'Ordered' : 'Shipped' };
      case 'registered':
      case 'sample_received':
        return { bg: 'bg-blue-100', text: 'text-blue-700', dot: false, label: status === 'registered' ? 'Registered' : 'Sample Received' };
      case 'processing':
        return { bg: 'bg-amber-100', text: 'text-amber-700', dot: true, label: 'Processing' };
      case 'analysis_complete':
        return { bg: 'bg-purple-100', text: 'text-purple-700', dot: false, label: 'Analysis Complete' };
      case 'results_available':
        return { bg: 'bg-green-100', text: 'text-green-700', dot: false, label: 'Results Available' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', dot: false, label: status };
    }
  };

  const getStatusDescription = (status: KitStatus) => {
    switch (status) {
      case 'ordered':
        return 'Kit has been ordered and is being prepared';
      case 'shipped':
        return 'Awaiting registration';
      case 'registered':
        return 'Kit registered, awaiting sample';
      case 'sample_received':
        return 'Sample received at the laboratory';
      case 'processing':
        return 'In lab processing';
      case 'analysis_complete':
        return 'Analysis complete, awaiting review';
      case 'results_available':
        return 'Results ready';
      default:
        return '';
    }
  };

  // Get full kit data from mockKits for each mobile kit
  const enrichedKits = mockMobileKits.map((mobileKit) => {
    const fullKit = mockKits.find((k) => k.id === mobileKit.id);
    return fullKit || mobileKit;
  });

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
        <h1 className="text-lg font-semibold text-gray-900 flex-1">My Kits</h1>
        <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
          {enrichedKits.length} kits
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-5 pb-24 flex flex-col gap-3">
        {enrichedKits.map((kit) => {
          const badge = getStatusBadge(kit.status);
          const description = getStatusDescription(kit.status);
          const orderedDate = new Date(kit.orderedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <div
              key={kit.id}
              className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                    <TestTube2 className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 font-mono">
                      {kit.kitId}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-400">
                        Ordered {orderedDate}
                      </p>
                    </div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${badge.bg} ${badge.text}`}
                >
                  {badge.dot && (
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                  )}
                  {badge.label}
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-3">{description}</p>

              {kit.status === 'results_available' ? (
                <Link
                  to="/mobile/results"
                  className="flex items-center justify-between py-2.5 px-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <span className="text-sm font-medium text-green-700">
                    View Results
                  </span>
                  <ChevronRight className="w-4 h-4 text-green-500" />
                </Link>
              ) : (
                <Link
                  to="/mobile/status"
                  className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">
                    Track Status
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              )}
            </div>
          );
        })}

        {/* Register New Kit Button */}
        <button
          onClick={() => navigate('/mobile/register-kit')}
          className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 active:scale-[0.98] transform mt-2"
        >
          <Plus className="w-4 h-4" />
          Register New Kit
        </button>
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 pb-1 pt-1.5 z-10">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = false;
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
