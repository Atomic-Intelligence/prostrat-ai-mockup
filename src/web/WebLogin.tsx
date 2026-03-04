import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dna, ShieldCheck, BarChart3, Microscope, Lock, Mail } from 'lucide-react';

const roles = ['Physician', 'Lab Operator', 'Lab Supervisor', 'Admin'] as const;

export default function WebLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>(roles[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/web/dashboard');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Half - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white flex-col justify-center px-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Dna className="w-8 h-8 text-blue-200" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">ProSTRAT-AI</h1>
              <p className="text-blue-200 text-sm font-medium">Clinical Platform</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-3 leading-snug">
            AI-Powered Prostate Cancer<br />Risk Stratification
          </h2>
          <p className="text-blue-200 mb-10 text-lg leading-relaxed max-w-md">
            Integrated CE-MS proteomics and machine learning for precision risk assessment in clinical urology.
          </p>

          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Microscope className="w-5 h-5 text-blue-200" />
              </div>
              <div>
                <p className="font-semibold text-white">CE-MS Peptide Analysis</p>
                <p className="text-blue-300 text-sm">High-resolution capillary electrophoresis mass spectrometry on urine samples</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <BarChart3 className="w-5 h-5 text-blue-200" />
              </div>
              <div>
                <p className="font-semibold text-white">Multi-Modal AI Risk Model</p>
                <p className="text-blue-300 text-sm">Ensemble model combining proteomic, clinical, and imaging features</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 text-blue-200" />
              </div>
              <div>
                <p className="font-semibold text-white">EU MDR / IVDR Compliant</p>
                <p className="text-blue-300 text-sm">Full audit trail, explainability, and regulatory documentation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Half - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center">
              <Dna className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ProSTRAT-AI</h1>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
              <p className="text-gray-500 mt-1">Access the ProSTRAT-AI clinical platform</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@clinic.eu"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Remember me
                </label>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                ProSTRAT-AI Clinical Platform v1.4.0<br />
                EU MDR Class C IVD &bull; ISO 13485 Certified
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
