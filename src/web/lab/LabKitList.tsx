import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, ChevronLeft, ChevronRight, Upload, X, CheckCircle2 } from 'lucide-react';
import { mockKits, mockPatients, mockCeMsData, mockUsers } from '../../data/mock';
import WebRoleHeader from '../WebRoleHeader';
import { getLabSafePatient, getKitStatusLabel, getKitStatusColor, getQcStatusColor } from './labUtils';

const ITEMS_PER_PAGE = 8;

export default function LabKitList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [qcFilter, setQcFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showCeMsImport, setShowCeMsImport] = useState(false);
  const [importKitId, setImportKitId] = useState('');
  const [importQualityScore, setImportQualityScore] = useState('');
  const [importTotalPeptides, setImportTotalPeptides] = useState('');
  const [importInstrumentId, setImportInstrumentId] = useState('CE-MS-INST-01');
  const [importFile, setImportFile] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const enrichedKits = useMemo(() => {
    return mockKits.map((kit) => {
      const patient = mockPatients.find((p) => p.id === kit.patientId);
      const cemsData = mockCeMsData.find((c) => c.kitId === kit.id);
      const orderedByUser = mockUsers.find((u) => u.id === kit.orderedBy);
      const labSafe = patient ? getLabSafePatient(patient) : null;

      return {
        ...kit,
        birthYear: labSafe?.birthYear ?? '\u2014',
        anonymousId: labSafe?.anonymousId ?? '\u2014',
        orderedByName: orderedByUser
          ? `${orderedByUser.firstName} ${orderedByUser.lastName}`
          : '\u2014',
        qcStatus: cemsData?.qcStatus ?? null,
        registeredDate: kit.registeredAt
          ? new Date(kit.registeredAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '\u2014',
      };
    });
  }, []);

  const filteredKits = useMemo(() => {
    return enrichedKits.filter((kit) => {
      const matchesSearch =
        !search || kit.kitId.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || kit.status === statusFilter;
      const matchesQc = !qcFilter || kit.qcStatus === qcFilter;
      return matchesSearch && matchesStatus && matchesQc;
    });
  }, [search, statusFilter, qcFilter, enrichedKits]);

  const totalPages = Math.max(1, Math.ceil(filteredKits.length / ITEMS_PER_PAGE));
  const paginatedKits = filteredKits.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  // Reset page when filters change
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };
  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };
  const handleQcChange = (val: string) => {
    setQcFilter(val);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Kits</h1>
            <button
              onClick={() => { setShowCeMsImport(true); setImportSuccess(false); }}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import CE-MS
            </button>
          </div>
          <WebRoleHeader />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Kit ID..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none min-w-[180px]"
              >
                <option value="">All Statuses</option>
                <option value="ordered">Ordered</option>
                <option value="shipped">Shipped</option>
                <option value="registered">Registered</option>
                <option value="sample_received">Sample Received</option>
                <option value="processing">Processing</option>
                <option value="analysis_complete">Analysis Complete</option>
                <option value="results_available">Results Available</option>
              </select>
            </div>
            <select
              value={qcFilter}
              onChange={(e) => handleQcChange(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none min-w-[150px]"
            >
              <option value="">All QC</option>
              <option value="passed">QC Passed</option>
              <option value="pending">QC Pending</option>
              <option value="failed">QC Failed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Kit ID</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Birth Year</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Ordered By</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Registered</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">QC Status</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedKits.map((kit) => (
                  <tr key={kit.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{kit.kitId}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getKitStatusColor(kit.status)}`}
                      >
                        {getKitStatusLabel(kit.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{kit.birthYear}</td>
                    <td className="px-6 py-4 text-gray-600">{kit.orderedByName}</td>
                    <td className="px-6 py-4 text-gray-500">{kit.registeredDate}</td>
                    <td className="px-6 py-4">
                      {kit.qcStatus ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getQcStatusColor(kit.qcStatus)}`}
                        >
                          {kit.qcStatus}
                        </span>
                      ) : (
                        <span className="text-gray-400">{'\u2014'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/web/kits/${kit.kitId}`)}
                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedKits.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      No kits match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{' '}
              <span className="font-medium">
                {filteredKits.length === 0
                  ? 0
                  : (page - 1) * ITEMS_PER_PAGE + 1}
                -{Math.min(page * ITEMS_PER_PAGE, filteredKits.length)}
              </span>{' '}
              of <span className="font-medium">{filteredKits.length}</span> kits
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`p-2 rounded-lg border border-gray-300 ${
                  page === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    p === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`p-2 rounded-lg border border-gray-300 ${
                  page === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {showCeMsImport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Import CE-MS Results</h2>
              <button onClick={() => setShowCeMsImport(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {importSuccess ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Import Successful</h3>
                  <p className="text-sm text-gray-500">CE-MS results imported for kit {importKitId}.</p>
                  <button
                    onClick={() => setShowCeMsImport(false)}
                    className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kit ID</label>
                    <select
                      value={importKitId}
                      onChange={(e) => setImportKitId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                      <option value="">Select Kit...</option>
                      {enrichedKits
                        .filter((k) => ['processing', 'sample_received'].includes(k.status))
                        .map((k) => (
                          <option key={k.id} value={k.kitId}>{k.kitId} — {getKitStatusLabel(k.status)}</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CE-MS Data File</label>
                    {importFile ? (
                      <div className="border-2 border-green-300 bg-green-50 rounded-lg p-4 text-center">
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-1" />
                        <p className="text-sm font-medium text-green-700">cems_run_data.mzML</p>
                        <p className="text-xs text-green-600">4.2 MB uploaded</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setImportFile(true)}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 hover:bg-teal-50 transition-colors cursor-pointer"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload CE-MS data file</p>
                        <p className="text-xs text-gray-400 mt-1">.mzML, .raw, .csv</p>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quality Score</label>
                      <input
                        type="number"
                        min="0" max="100"
                        placeholder="0-100"
                        value={importQualityScore}
                        onChange={(e) => setImportQualityScore(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Peptides</label>
                      <input
                        type="number"
                        placeholder="e.g. 14832"
                        value={importTotalPeptides}
                        onChange={(e) => setImportTotalPeptides(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instrument ID</label>
                    <select
                      value={importInstrumentId}
                      onChange={(e) => setImportInstrumentId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                      <option value="CE-MS-INST-01">CE-MS-INST-01</option>
                      <option value="CE-MS-INST-02">CE-MS-INST-02</option>
                      <option value="CE-MS-INST-03">CE-MS-INST-03</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowCeMsImport(false)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (importKitId && importFile) setImportSuccess(true);
                      }}
                      disabled={!importKitId || !importFile}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      Import Results
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
