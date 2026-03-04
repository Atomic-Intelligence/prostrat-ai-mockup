import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Upload,
  CheckCircle2,
  FileImage,
  ArrowLeft,
} from 'lucide-react';
import {
  mockPatients,
  mockKits,
  mockMriData,
  mockUsers,
  type MriType,
} from '../../data/mock';
import { useRole } from '../../context/RoleContext';
import WebRoleHeader from '../WebRoleHeader';
import { getLabSafePatient } from './labUtils';

export default function LabMriUpload() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { role } = useRole();

  const patient = mockPatients.find((p) => p.id === patientId) ?? mockPatients[0];
  const labSafe = getLabSafePatient(patient);
  const patientKits = mockKits.filter((k) => k.patientId === patient.id);
  const patientMris = mockMriData.filter((m) => m.patientId === patient.id);

  const [selectedKitId, setSelectedKitId] = useState(
    patientKits.length > 0 ? patientKits[0].kitId : '',
  );
  const [uploadState, setUploadState] = useState<'idle' | 'uploaded'>('idle');
  const [mriType, setMriType] = useState<MriType>('mpMRI');
  const [piradsScore, setPiradsScore] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleUploadClick = () => {
    // Simulate upload
    setUploadState('uploaded');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const isLabRole = role === 'lab_operator' || role === 'lab_supervisor';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <button onClick={() => navigate('/web/kits')} className="hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Kits
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium">Upload MRI</span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Upload MRI</h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                {isLabRole ? (
                  <>
                    <span className="font-mono text-xs">{labSafe.anonymousId}</span>
                    <span>Birth Year: {labSafe.birthYear}</span>
                  </>
                ) : (
                  <span>
                    {patient.firstName} {patient.lastName}
                  </span>
                )}
              </div>
            </div>
            <WebRoleHeader />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Patient Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Patient Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isLabRole ? (
              <>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Anonymous ID</p>
                  <p className="text-sm font-mono text-gray-900">{labSafe.anonymousId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Birth Year</p>
                  <p className="text-sm text-gray-900">{labSafe.birthYear}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Name</p>
                  <p className="text-sm text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                  <p className="text-sm text-gray-900">{patient.dateOfBirth}</p>
                </div>
              </>
            )}
            <div>
              <p className="text-xs text-gray-500 mb-1">Patient ID</p>
              <p className="text-sm font-mono text-gray-900">{patient.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Kits</p>
              <p className="text-sm text-gray-900">{patientKits.length} kit(s)</p>
            </div>
          </div>
        </div>

        {/* Kit Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Select Kit</h2>
          <select
            value={selectedKitId}
            onChange={(e) => setSelectedKitId(e.target.value)}
            className="w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {patientKits.map((kit) => (
              <option key={kit.id} value={kit.kitId}>
                {kit.kitId} ({kit.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')})
              </option>
            ))}
          </select>
        </div>

        {/* Upload Zone */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">MRI File</h2>

          {uploadState === 'idle' ? (
            <button
              onClick={handleUploadClick}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
            >
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-700">
                Click to select or drag & drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                DICOM, NIfTI, or PNG files up to 100 MB
              </p>
            </button>
          ) : (
            <div className="border border-green-200 bg-green-50 rounded-xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <FileImage className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  mri_upload_{selectedKitId.toLowerCase()}.dcm
                </p>
                <p className="text-xs text-gray-500 mt-0.5">27.4 MB - Upload complete</p>
              </div>
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
          )}
        </div>

        {/* Upload Form (shown after file uploaded) */}
        {uploadState === 'uploaded' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">MRI Details</h2>

            {submitted && (
              <div className="flex items-center gap-3 mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-700 font-medium">MRI submitted successfully.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  MRI Type
                </label>
                <select
                  value={mriType}
                  onChange={(e) => setMriType(e.target.value as MriType)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="mpMRI">mpMRI</option>
                  <option value="T2W">T2W</option>
                  <option value="DWI">DWI</option>
                  <option value="DCE">DCE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  PIRADS Score (optional)
                </label>
                <select
                  value={piradsScore}
                  onChange={(e) => setPiradsScore(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Not specified</option>
                  <option value="1">1 - Very Low</option>
                  <option value="2">2 - Low</option>
                  <option value="3">3 - Equivocal</option>
                  <option value="4">4 - High</option>
                  <option value="5">5 - Very High</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes about this MRI upload..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                <Upload className="w-4 h-4" />
                Submit
              </button>
            </div>
          </form>
        )}

        {/* Existing MRI Files */}
        {patientMris.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">Existing MRI Files</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-3 font-medium text-gray-500">File Name</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Type</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">PIRADS</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Size</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Uploaded By</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {patientMris.map((mri) => {
                    const uploader = mockUsers.find((u) => u.id === mri.uploadedBy);
                    return (
                      <tr key={mri.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-gray-700">{mri.fileName}</td>
                        <td className="px-6 py-4 text-gray-600">{mri.mriType}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {mri.piradsScore !== null ? mri.piradsScore : '\u2014'}
                        </td>
                        <td className="px-6 py-4 text-gray-500">{mri.fileSize}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {uploader
                            ? `${uploader.firstName} ${uploader.lastName}`
                            : '\u2014'}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(mri.uploadedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
