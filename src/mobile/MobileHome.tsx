import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Bell,
  QrCode,
  Activity,
  FileText,
  ClipboardCheck,
  Home,
  BarChart3,
  ClipboardList,
  User,
  ChevronRight,
  FlaskConical,
  Copy,
} from 'lucide-react';
import { mockUser, mockKit, mockNotifications, mockMobileKits, mockMobilePatient } from '../data/mock';

export default function MobileHome() {
  const navigate = useNavigate();
  const location = useLocation();

  const quickActions = [
    {
      label: 'Register Kit',
      icon: QrCode,
      route: '/mobile/register-kit',
      color: 'bg-primary-50 text-primary-600',
    },
    {
      label: 'My Status',
      icon: Activity,
      route: '/mobile/status',
      color: 'bg-teal-50 text-teal-600',
    },
    {
      label: 'My Results',
      icon: FileText,
      route: '/mobile/results',
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Health Survey',
      icon: ClipboardCheck,
      route: '/mobile/survey',
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  const tabs = [
    { label: 'Home', icon: Home, route: '/mobile/home' },
    { label: 'Status', icon: ClipboardList, route: '/mobile/status' },
    { label: 'Results', icon: BarChart3, route: '/mobile/results' },
    { label: 'Profile', icon: User, route: '/mobile/home' },
  ];

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  // Get the latest kit (last in the array, most recently ordered)
  const latestKit = mockMobileKits[mockMobileKits.length - 1];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ordered': return 'Ordered';
      case 'shipped': return 'Shipped';
      case 'registered': return 'Registered';
      case 'sample_received': return 'Sample Received';
      case 'processing': return 'Processing';
      case 'analysis_complete': return 'Analysis Complete';
      case 'results_available': return 'Results Available';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ordered':
      case 'shipped':
        return { dot: 'bg-gray-400', text: 'text-gray-200' };
      case 'registered':
      case 'sample_received':
        return { dot: 'bg-blue-400', text: 'text-blue-200' };
      case 'processing':
        return { dot: 'bg-amber-400 animate-pulse', text: 'text-amber-200' };
      case 'analysis_complete':
        return { dot: 'bg-purple-400', text: 'text-purple-200' };
      case 'results_available':
        return { dot: 'bg-green-400', text: 'text-green-200' };
      default:
        return { dot: 'bg-gray-400', text: 'text-gray-200' };
    }
  };

  const statusColor = latestKit ? getStatusColor(latestKit.status) : null;

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-primary-600 px-5 pt-5 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-200 text-sm">Good morning</p>
            <h1 className="text-xl font-bold text-white">
              Hello, {mockUser.firstName}
            </h1>
          </div>
          <button className="relative w-10 h-10 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Multi-Kit Summary Card */}
        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
          {mockMobileKits.length > 1 ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <FlaskConical className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-semibold text-sm">
                    {mockMobileKits.length} Active Kits
                  </span>
                </div>
                <Link
                  to="/mobile/kits"
                  className="text-xs font-medium text-white/80 hover:text-white flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              {latestKit && (
                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                  <div className="flex-1">
                    <p className="text-white/70 text-[10px] font-medium uppercase tracking-wide">
                      Latest Kit
                    </p>
                    <p className="text-white font-semibold text-sm">
                      {latestKit.kitId}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 ${statusColor?.dot} rounded-full`} />
                    <span className={`${statusColor?.text} text-xs font-medium`}>
                      {getStatusLabel(latestKit.status)}
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white/70 text-xs font-medium uppercase tracking-wide">
                  Active Test
                </p>
                <p className="text-white font-semibold text-sm">
                  {latestKit?.kitId || mockKit.kitId}
                </p>
              </div>
              {latestKit && (
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 ${statusColor?.dot} rounded-full`} />
                  <span className={`${statusColor?.text} text-xs font-medium`}>
                    {getStatusLabel(latestKit.status)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-5 -mt-2 pb-24">
        {/* Personal ID Card */}
        <div className="mt-5 mb-5 bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                Your Personal ID
              </p>
              <p className="text-2xl font-bold text-blue-900 font-mono mt-1">
                {mockMobilePatient.patientId}
              </p>
            </div>
            <button className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors">
              <Copy className="w-4 h-4 text-blue-600" />
            </button>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Share this Personal ID with your physician to link your records
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2.5 shadow-sm hover:shadow-md transition-shadow active:scale-[0.97] transform"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}
                >
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Notification */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Recent Activity
          </h2>
          {mockNotifications.slice(0, 1).map((notif) => (
            <div
              key={notif.id}
              className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3"
            >
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <Activity className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                  {notif.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 mt-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 pb-1 pt-1.5 z-10">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.route && tab.label === 'Home';
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
