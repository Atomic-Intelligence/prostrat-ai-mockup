import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  QrCode,
  Camera,
  CheckCircle2,
  Info,
} from 'lucide-react';

export default function MobileKitRegister() {
  const navigate = useNavigate();
  const [kitId, setKitId] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = () => {
    setIsRegistered(true);
  };

  if (isRegistered) {
    return (
      <div className="flex flex-col min-h-full bg-gray-50">
        {/* Success State */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5 animate-[scale-in_0.3s_ease-out]">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Kit Registered!
          </h2>
          <p className="text-sm text-gray-500 text-center max-w-[260px] mb-2">
            Your kit{' '}
            <span className="font-semibold text-gray-700">
              {kitId || 'PST-2024-0847'}
            </span>{' '}
            has been successfully registered.
          </p>
          <p className="text-xs text-gray-400 text-center max-w-[240px] mb-8">
            You will receive a notification once your sample is received at our
            laboratory.
          </p>

          <button
            onClick={() => navigate('/mobile/status')}
            className="w-full max-w-[280px] py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            View Test Status
          </button>
          <button
            onClick={() => navigate('/mobile/home')}
            className="mt-3 text-sm text-primary-600 font-medium hover:text-primary-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

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
        <h1 className="text-lg font-semibold text-gray-900">Register Kit</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-5 flex flex-col gap-5">
        {/* QR Scanner Area */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">
              Scan QR Code on Kit
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Point your camera at the QR code on your test kit packaging.
            </p>
          </div>
          <div className="mx-4 mb-4 h-48 bg-gray-900 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
            {/* Scan corners overlay */}
            <div className="absolute inset-4">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/60 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/60 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/60 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/60 rounded-br-lg" />
            </div>
            <QrCode className="w-12 h-12 text-white/30 mb-2" />
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <Camera className="w-3.5 h-3.5 text-white/70" />
              <span className="text-xs text-white/70 font-medium">
                Tap to scan
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            or
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Manual Entry */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">
            Enter Kit ID Manually
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            Find the 12-digit code on your kit label.
          </p>
          <div className="flex flex-col gap-1.5">
            <input
              type="text"
              value={kitId}
              onChange={(e) => setKitId(e.target.value)}
              placeholder="PST-XXXX-XXXX"
              maxLength={13}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-mono tracking-wider text-center text-base"
            />
            <p className="text-[11px] text-gray-400 text-center">
              Format: PST-XXXX-XXXX
            </p>
          </div>
        </div>

        {/* Register Button */}
        <button
          onClick={handleRegister}
          className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-colors active:scale-[0.98] transform"
        >
          Register Kit
        </button>

        {/* Info Box */}
        <div className="bg-primary-50 rounded-2xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-primary-900 font-medium mb-1">
              What happens next?
            </p>
            <p className="text-xs text-primary-700 leading-relaxed">
              After registration, collect your sample following the instructions
              in your kit and mail it using the prepaid shipping label. You'll
              receive updates as your sample is processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
