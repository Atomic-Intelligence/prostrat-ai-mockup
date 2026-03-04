import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Activity,
  Brain,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';
import { mockWebPatients, mockPatientTimeline, type PatientStatus } from '../data/mock';

const tabs = ['Overview', 'Clinical Data', 'CE-MS Data', 'AI Results', 'Reports'] as const;
type Tab = (typeof tabs)[number];

const statusConfig: Record<PatientStatus, { label: string; className: string }> = {
  ordered: { label: 'Ordered', className: 'bg-gray-100 text-gray-700' },
  sample_received: { label: 'Sample Received', className: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Processing', className: 'bg-blue-100 text-blue-700' },
  analysis_complete: { label: 'Analysis Complete', className: 'bg-purple-100 text-purple-700' },
  results_available: { label: 'Results Available', className: 'bg-green-100 text-green-700' },
  report_generated: { label: 'Report Generated', className: 'bg-teal-100 text-teal-700' },
};

export default function WebPatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  const patient = mockWebPatients.find((p) => p.id === id) || mockWebPatients[0];
  const status = patient.status ? statusConfig[patient.status] : null;
  const kitId = patient.activeKit || 'PST-2026-A1B2';

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
            <span className="text-gray-900 font-medium">Patient Detail</span>
          </nav>

          {/* Patient Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {patient.name}
                </h1>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="font-mono">{patient.id}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    DOB: {patient.dateOfBirth}
                  </span>
                </div>
              </div>
            </div>
            {status && (
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.className}`}
              >
                {status.label}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-0 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Patient Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{patient.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{patient.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="text-sm text-gray-900">{patient.dateOfBirth}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kit Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Active Kit</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Kit ID</p>
                  <p className="text-sm font-mono text-gray-900">{kitId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  {status && (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${status.className}`}
                    >
                      {status.label}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm text-gray-900">{patient.lastUpdated}</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/web/clinical/${kitId}`)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <ClipboardList className="w-4 h-4" />
                    Clinical Data
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate(`/web/results/${kitId}`)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Brain className="w-4 h-4" />
                    AI Results
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate(`/web/reports/${kitId}`)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="w-4 h-4" />
                    Reports
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Timeline - Full width */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-6">Kit Event Timeline</h3>
              <div className="relative">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200" />
                <div className="space-y-6">
                  {mockPatientTimeline.map((event, i) => (
                    <div key={i} className="relative flex items-start gap-4 pl-10">
                      <div
                        className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                          i === mockPatientTimeline.length - 1
                            ? 'bg-blue-600 border-blue-600'
                            : 'bg-white border-gray-300'
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{event.event}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{event.type}</p>
                        <p className="text-xs text-gray-400 mt-1">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Clinical Data' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Clinical Data</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Clinical parameters for kit {kitId}
                </p>
              </div>
              <button
                onClick={() => navigate(`/web/clinical/${kitId}`)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <ClipboardList className="w-4 h-4" />
                Open Clinical Data Entry
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-500 text-sm">
              View and edit clinical data, PSA levels, Gleason scores, and comorbidity information in the dedicated clinical data entry form.
            </p>
          </div>
        )}

        {activeTab === 'CE-MS Data' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">CE-MS Proteomic Data</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Capillary electrophoresis mass spectrometry results for kit {kitId}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                CE-MS data visualization is available after sample processing is complete. Peptide profiles, electropherograms, and mass spectra will appear here.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'AI Results' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI Analysis Results</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Machine learning risk stratification for kit {kitId}
                </p>
              </div>
              <button
                onClick={() => navigate(`/web/results/${kitId}`)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Brain className="w-4 h-4" />
                View Full Analysis
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-500 text-sm">
              Access the complete AI analysis including risk score, feature importance, SHAP explainability, and physician approval workflow.
            </p>
          </div>
        )}

        {activeTab === 'Reports' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Generate and manage clinical reports for kit {kitId}
                </p>
              </div>
              <button
                onClick={() => navigate(`/web/reports/${kitId}`)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <FileText className="w-4 h-4" />
                Generate Report
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-500 text-sm">
              Configure report templates, select sections, add physician interpretations, and generate PDF reports for patients and referring clinicians.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
