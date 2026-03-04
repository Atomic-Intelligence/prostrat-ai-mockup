import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TestTubes, CheckCircle2, Clock, AlertTriangle, ClipboardList, ListOrdered, Upload } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { mockKits, mockCeMsData } from '../../data/mock';
import { useRole } from '../../context/RoleContext';
import WebRoleHeader from '../WebRoleHeader';

const recentKitActivity = [
  { time: '10 min ago', action: 'QC Passed', kitId: 'PST-2026-G7H8', instrument: 'CE-MS-INST-03' },
  { time: '2 hours ago', action: 'Sample Processing', kitId: 'PST-2026-I9J0', instrument: 'CE-MS-INST-02' },
  { time: 'Yesterday', action: 'QC Failed', kitId: 'PST-2026-I9J0', instrument: 'CE-MS-INST-02' },
  { time: '2 days ago', action: 'Analysis Complete', kitId: 'PST-2026-E5F6', instrument: 'CE-MS-INST-02' },
  { time: '3 days ago', action: 'QC Approved', kitId: 'PST-2026-A1B2', instrument: 'CE-MS-INST-03' },
  { time: '5 days ago', action: 'Sample Received', kitId: 'PST-2026-I9J0', instrument: '\u2014' },
  { time: '1 week ago', action: 'QC Passed', kitId: 'PST-2026-C3D4', instrument: 'CE-MS-INST-01' },
  { time: '1 week ago', action: 'Analysis Complete', kitId: 'PST-2026-K1L2', instrument: 'CE-MS-INST-01' },
];

export default function LabDashboard() {
  const navigate = useNavigate();
  const { role, currentUser } = useRole();

  useEffect(() => {
    if (role !== 'lab_supervisor') {
      navigate('/web/kits', { replace: true });
    }
  }, [role, navigate]);

  const stats = useMemo(() => {
    const kitsInPipeline = mockKits.filter(
      (k) => k.status !== 'results_available',
    ).length;

    const totalQcEntries = mockCeMsData.length;
    const passedQc = mockCeMsData.filter((d) => d.qcStatus === 'passed').length;
    const pendingQc = mockCeMsData.filter((d) => d.qcStatus === 'pending').length;
    const failedQc = mockCeMsData.filter((d) => d.qcStatus === 'failed').length;
    const qcPassRate =
      totalQcEntries > 0 ? Math.round((passedQc / totalQcEntries) * 100) : 0;

    return { kitsInPipeline, qcPassRate, pendingQc, failedQc, passedQc };
  }, []);

  const qcDistribution = useMemo(
    () => [
      { name: 'Passed', value: stats.passedQc, fill: '#22c55e' },
      { name: 'Pending', value: stats.pendingQc, fill: '#f59e0b' },
      { name: 'Failed', value: stats.failedQc, fill: '#ef4444' },
    ],
    [stats],
  );

  const statCards = [
    {
      label: 'Kits in Pipeline',
      value: stats.kitsInPipeline,
      icon: TestTubes,
      accent: 'bg-blue-50 text-blue-600',
      border: 'border-l-blue-500',
    },
    {
      label: 'QC Pass Rate',
      value: `${stats.qcPassRate}%`,
      icon: CheckCircle2,
      accent: 'bg-green-50 text-green-600',
      border: 'border-l-green-500',
    },
    {
      label: 'Pending QC',
      value: stats.pendingQc,
      icon: Clock,
      accent: 'bg-amber-50 text-amber-600',
      border: 'border-l-amber-500',
    },
    {
      label: 'Failed QC',
      value: stats.failedQc,
      icon: AlertTriangle,
      accent: 'bg-red-50 text-red-600',
      border: 'border-l-red-500',
    },
  ];

  if (role !== 'lab_supervisor') return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lab Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Welcome back, {currentUser.firstName} {currentUser.lastName}
            </p>
          </div>
          <WebRoleHeader />
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
          {/* Recent Kit Activity - 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Kit Activity</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Time</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Action</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Kit ID</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Instrument</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentKitActivity.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{row.time}</td>
                      <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">{row.action}</td>
                      <td className="px-6 py-3 text-gray-500 font-mono text-xs whitespace-nowrap">{row.kitId}</td>
                      <td className="px-6 py-3 text-gray-500 font-mono text-xs whitespace-nowrap">{row.instrument}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column - Chart + Quick Actions */}
          <div className="space-y-6">
            {/* QC Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">QC Distribution</h2>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={qcDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {qcDistribution.map((entry, index) => (
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
                  onClick={() => navigate('/web/kits')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <ClipboardList className="w-4 h-4" />
                  Review QC Results
                </button>
                <button
                  onClick={() => navigate('/web/kits')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <ListOrdered className="w-4 h-4" />
                  View Kit Queue
                </button>
                <button
                  onClick={() => navigate('/web/mri-upload/pat-001')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <Upload className="w-4 h-4" />
                  Upload MRI
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
