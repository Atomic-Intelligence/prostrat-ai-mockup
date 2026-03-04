import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  TestTubes,
  Clock,
  CheckCircle2,
  UserPlus,
  PackagePlus,
  Link2,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { mockDashboardStats, mockWebPatients, type PatientStatus } from '../data/mock';
import { useRole } from '../context/RoleContext';
import WebRoleHeader from './WebRoleHeader';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ITEMS_PER_PAGE = 8;

const statusConfig: Record<PatientStatus, { label: string; className: string }> = {
  ordered: { label: 'Ordered', className: 'bg-gray-100 text-gray-700' },
  sample_received: { label: 'Sample Received', className: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Processing', className: 'bg-blue-100 text-blue-700' },
  analysis_complete: { label: 'Analysis Complete', className: 'bg-purple-100 text-purple-700' },
  results_available: { label: 'Results Available', className: 'bg-green-100 text-green-700' },
  report_generated: { label: 'Report Generated', className: 'bg-teal-100 text-teal-700' },
};

const recentActivity = [
  { time: '10 min ago', action: 'Kit Ordered', patient: 'ANON-2B8E4C', kitId: 'PST-2026-O5P6', user: 'Dr. Weber' },
  { time: '2 hours ago', action: 'Sample Received', patient: 'ANON-4E8D1A', kitId: 'PST-2026-I9J0', user: 'L. Fischer' },
  { time: 'Yesterday', action: 'Analysis Complete', patient: 'ANON-5D1F7B', kitId: 'PST-2026-E5F6', user: 'L. Fischer' },
  { time: '2 days ago', action: 'Results Released', patient: 'ANON-2B8E4C', kitId: 'PST-2026-C3D4', user: 'J. Hartmann' },
  { time: '3 days ago', action: 'Result Approved', patient: 'ANON-7F3A9D', kitId: 'PST-2026-A1B2', user: 'J. Hartmann' },
  { time: '5 days ago', action: 'Kit Registered', patient: 'ANON-4E8D1A', kitId: 'PST-2026-I9J0', user: 'Dr. Bauer' },
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

// ---------------------------------------------------------------------------
// Modal type discriminator
// ---------------------------------------------------------------------------

type ModalType = 'create' | 'orderKit' | 'linkPerson' | 'addKit' | null;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WebDashboard() {
  const navigate = useNavigate();
  const { role, currentUser } = useRole();

  // Role-based redirect
  useEffect(() => {
    if (role === 'lab_operator') navigate('/web/kits', { replace: true });
    if (role === 'lab_supervisor') navigate('/web/lab-dashboard', { replace: true });
  }, [role, navigate]);

  // ----- Patient table state -----
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // ----- Modal state -----
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [toastMessage, setToastMessage] = useState('');

  // Patient form fields (shared across create / linkPerson / addKit modals)
  const emptyPatient = { firstName: '', lastName: '', dateOfBirth: '', email: '', phone: '' };
  const [newPatient, setNewPatient] = useState(emptyPatient);
  const [linkPid, setLinkPid] = useState('');
  const [kitIdInput, setKitIdInput] = useState('');
  const [orderKitPatientId, setOrderKitPatientId] = useState('');

  // ----- Derived data -----
  const filteredPatients = useMemo(() => {
    return mockWebPatients.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.patientId.toLowerCase().includes(q);
      const matchesStatus = !statusFilter || p.latestStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / ITEMS_PER_PAGE));
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPatients.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPatients, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // ----- Helpers -----
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const closeModal = () => {
    setActiveModal(null);
    setNewPatient(emptyPatient);
    setLinkPid('');
    setKitIdInput('');
    setOrderKitPatientId('');
  };

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Patient ${newPatient.firstName} ${newPatient.lastName} created successfully.`);
    closeModal();
  };

  const handleOrderKit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = mockWebPatients.find((p) => p.id === orderKitPatientId);
    const name = patient ? patient.name : 'selected patient';
    showToast(`Kit ordered for ${name}. Kit ID will be assigned when shipped.`);
    closeModal();
  };

  const handleLinkPerson = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      `Patient ${newPatient.firstName} ${newPatient.lastName} created and linked to ${linkPid}.`,
    );
    closeModal();
  };

  const handleAddKit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      `Patient ${newPatient.firstName} ${newPatient.lastName} created with kit ${kitIdInput}.`,
    );
    closeModal();
  };

  // ----- Pagination helpers -----
  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---- Header ---- */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Welcome back, {currentUser.firstName} {currentUser.lastName}
            </p>
          </div>
          <WebRoleHeader />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* ---- Quick Actions ---- */}
        <div className="flex flex-wrap gap-3 mb-5">
          <button
            onClick={() => setActiveModal('create')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            New Patient
          </button>
          <button
            onClick={() => setActiveModal('orderKit')}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <PackagePlus className="w-4 h-4" />
            Order Kit
          </button>
          <button
            onClick={() => setActiveModal('linkPerson')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Link2 className="w-4 h-4" />
            Patient + Person
          </button>
          <button
            onClick={() => setActiveModal('addKit')}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <PackagePlus className="w-4 h-4" />
            Patient + Kit
          </button>
        </div>

        {/* ---- Compact Stat Cards ---- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 ${card.border} px-4 py-3`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500">{card.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-0.5">{card.value}</p>
                  </div>
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.accent}`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ---- Two Column: Patient Table + Recent Activity ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Patient Table (2/3) */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Search & Filters */}
            <div className="px-5 py-3 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or kit..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none min-w-[180px]"
                >
                  <option value="">All Statuses</option>
                  <option value="ordered">Ordered</option>
                  <option value="sample_received">Sample Received</option>
                  <option value="processing">Processing</option>
                  <option value="analysis_complete">Analysis Complete</option>
                  <option value="results_available">Results Available</option>
                  <option value="report_generated">Report Generated</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-5 py-2.5 font-medium text-gray-500 text-xs">
                      Name
                    </th>
                    <th className="text-left px-5 py-2.5 font-medium text-gray-500 text-xs">
                      Personal ID
                    </th>
                    <th className="text-left px-5 py-2.5 font-medium text-gray-500 text-xs">
                      Kits
                    </th>
                    <th className="text-left px-5 py-2.5 font-medium text-gray-500 text-xs">
                      Latest Status
                    </th>
                    <th className="text-left px-5 py-2.5 font-medium text-gray-500 text-xs">
                      Last Updated
                    </th>
                    <th className="text-left px-5 py-2.5 font-medium text-gray-500 text-xs">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedPatients.map((patient) => {
                    const status = patient.latestStatus
                      ? statusConfig[patient.latestStatus]
                      : null;
                    return (
                      <tr
                        key={patient.id}
                        onClick={() => navigate(`/web/patients/${patient.id}`)}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-3 font-medium text-gray-900">{patient.name}</td>
                        <td className="px-5 py-3 font-mono text-xs text-blue-600">
                          {patient.patientId || '\u2014'}
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                            {patient.kits.length}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {status ? (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}
                            >
                              {status.label}
                            </span>
                          ) : (
                            <span className="text-gray-400">{'\u2014'}</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-gray-500">{patient.lastUpdated}</td>
                        <td className="px-5 py-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/web/patients/${patient.id}`);
                            }}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {paginatedPatients.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-gray-400 text-sm">
                        No patients match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Showing{' '}
                <span className="font-medium">
                  {filteredPatients.length === 0
                    ? 0
                    : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                  -{Math.min(currentPage * ITEMS_PER_PAGE, filteredPatients.length)}
                </span>{' '}
                of <span className="font-medium">{filteredPatients.length}</span> patients
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className={`p-1.5 rounded-lg border border-gray-300 ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {pageNumbers.map((pg, idx) =>
                  pg === 'ellipsis' ? (
                    <span key={`e-${idx}`} className="text-gray-400 text-xs px-1">
                      ...
                    </span>
                  ) : (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        pg === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {pg}
                    </button>
                  ),
                )}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className={`p-1.5 rounded-lg border border-gray-300 ${
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity Sidebar (1/3) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-4 space-y-3">
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-lg px-3.5 py-2.5 border border-gray-100"
                >
                  <p className="text-xs text-gray-400">{item.time}</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{item.action}</p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{item.kitId}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ---- Inline toast ---- */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium z-50 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODALS                                                                */}
      {/* ==================================================================== */}

      {activeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            {/* ---- Create Patient Modal ---- */}
            {activeModal === 'create' && (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Create Patient</h2>
                  <button
                    onClick={closeModal}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <form onSubmit={handleCreatePatient} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newPatient.firstName}
                        onChange={(e) =>
                          setNewPatient({ ...newPatient, firstName: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newPatient.lastName}
                        onChange={(e) =>
                          setNewPatient({ ...newPatient, lastName: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      value={newPatient.dateOfBirth}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, dateOfBirth: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={newPatient.email}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newPatient.phone}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ---- Order Kit Modal ---- */}
            {activeModal === 'orderKit' && (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Kit</h2>
                  <button
                    onClick={closeModal}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <form onSubmit={handleOrderKit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Patient
                    </label>
                    <select
                      required
                      value={orderKitPatientId}
                      onChange={(e) => setOrderKitPatientId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                    >
                      <option value="">-- Select a patient --</option>
                      {mockWebPatients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.patientId})
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-xs text-gray-500">
                    A kit will be ordered for the selected patient. The Kit ID will be assigned
                    once the kit is shipped.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      Confirm Order
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ---- Create + Link Person Modal ---- */}
            {activeModal === 'linkPerson' && (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Create + Link Person</h2>
                  <button
                    onClick={closeModal}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <form onSubmit={handleLinkPerson} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newPatient.firstName}
                        onChange={(e) =>
                          setNewPatient({ ...newPatient, firstName: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newPatient.lastName}
                        onChange={(e) =>
                          setNewPatient({ ...newPatient, lastName: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      value={newPatient.dateOfBirth}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, dateOfBirth: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={newPatient.email}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newPatient.phone}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Link2 className="w-3.5 h-3.5 inline mr-1" />
                      Personal ID (PID)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="PID-XXXX"
                      value={linkPid}
                      onChange={(e) => setLinkPid(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      Create &amp; Link
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ---- Create + Add Kit Modal ---- */}
            {activeModal === 'addKit' && (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Create + Add Kit</h2>
                  <button
                    onClick={closeModal}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <form onSubmit={handleAddKit} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newPatient.firstName}
                        onChange={(e) =>
                          setNewPatient({ ...newPatient, firstName: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newPatient.lastName}
                        onChange={(e) =>
                          setNewPatient({ ...newPatient, lastName: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      value={newPatient.dateOfBirth}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, dateOfBirth: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={newPatient.email}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newPatient.phone}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <TestTubes className="w-3.5 h-3.5 inline mr-1" />
                      Kit ID
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="PST-XXXX-XXXX"
                      value={kitIdInput}
                      onChange={(e) => setKitIdInput(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      Create &amp; Add Kit
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
