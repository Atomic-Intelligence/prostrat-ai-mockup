import { useNavigate } from 'react-router-dom';
import { Users, TestTubes, Clock, CheckCircle2, UserPlus, PackagePlus, ListOrdered } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import {
  mockWebUser,
  mockDashboardStats,
  mockKitStatusDistribution,
} from '../data/mock';

const recentActivity = [
  { time: '10 min ago', action: 'Kit Ordered', patient: 'ANON-2B8E4C', kitId: 'PST-2026-O5P6', user: 'Dr. Weber' },
  { time: '2 hours ago', action: 'Sample Received', patient: 'ANON-4E8D1A', kitId: 'PST-2026-I9J0', user: 'L. Fischer' },
  { time: 'Yesterday', action: 'Analysis Complete', patient: 'ANON-5D1F7B', kitId: 'PST-2026-E5F6', user: 'L. Fischer' },
  { time: '2 days ago', action: 'Results Released', patient: 'ANON-2B8E4C', kitId: 'PST-2026-C3D4', user: 'J. Hartmann' },
  { time: '3 days ago', action: 'Result Approved', patient: 'ANON-7F3A9D', kitId: 'PST-2026-A1B2', user: 'J. Hartmann' },
  { time: '5 days ago', action: 'Kit Registered', patient: 'ANON-4E8D1A', kitId: 'PST-2026-I9J0', user: 'Dr. Bauer' },
  { time: '1 week ago', action: 'Patient Created', patient: 'ANON-4E8D1A', kitId: '—', user: 'Dr. Bauer' },
  { time: '1 week ago', action: 'Kit Ordered', patient: 'ANON-7F3A9D', kitId: 'PST-2026-M3N4', user: 'Dr. Weber' },
];

const statCards = [
  {
    label: 'Total Patients',
    value: mockDashboardStats.totalPatients,
    icon: Users,
    accent: 'bg-blue-50 text-blue-600',
    border: 'border-l-blue-500',
  },
  {
    label: 'Active Kits',
    value: mockDashboardStats.activeKits,
    icon: TestTubes,
    accent: 'bg-amber-50 text-amber-600',
    border: 'border-l-amber-500',
  },
  {
    label: 'Pending Results',
    value: mockDashboardStats.pendingResults,
    icon: Clock,
    accent: 'bg-purple-50 text-purple-600',
    border: 'border-l-purple-500',
  },
  {
    label: 'Completed Analyses',
    value: mockDashboardStats.completedAnalyses,
    icon: CheckCircle2,
    accent: 'bg-green-50 text-green-600',
    border: 'border-l-green-500',
  },
];

export default function WebDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Welcome back, {mockWebUser.firstName} {mockWebUser.lastName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{mockWebUser.role}</span>
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
              EV
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 ${card.border} p-6`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{card.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.accent}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity - 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Time</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Action</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Patient</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Kit ID</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentActivity.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{row.time}</td>
                      <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">{row.action}</td>
                      <td className="px-6 py-3 text-gray-700 whitespace-nowrap">{row.patient}</td>
                      <td className="px-6 py-3 text-gray-500 font-mono text-xs whitespace-nowrap">{row.kitId}</td>
                      <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{row.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column - Chart + Quick Actions */}
          <div className="space-y-6">
            {/* Kit Status Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kit Status Distribution</h2>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={mockKitStatusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {mockKitStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value: string) => (
                      <span className="text-xs text-gray-600">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/web/patients')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <UserPlus className="w-4 h-4" />
                  New Patient
                </button>
                <button
                  onClick={() => navigate('/web/patients')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <PackagePlus className="w-4 h-4" />
                  Order Kit
                </button>
                <button
                  onClick={() => navigate('/web/patients')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <ListOrdered className="w-4 h-4" />
                  View Queue
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
