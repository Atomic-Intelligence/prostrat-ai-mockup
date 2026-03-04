import { useNavigate, useLocation } from 'react-router-dom';
import { Smartphone, Monitor, Dna } from 'lucide-react';

export default function DemoSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = location.pathname.startsWith('/mobile');
  const isWeb = location.pathname.startsWith('/web');

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Dna className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">
              ProSTRAT-AI
              <span className="text-xs font-normal text-gray-400 ml-2">Interactive Demo</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => navigate('/mobile/home')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              isMobile
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Mobile App
          </button>
          <button
            onClick={() => navigate('/web/dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              isWeb
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Monitor className="w-4 h-4" />
            Web Portal
          </button>
        </div>
      </div>
    </div>
  );
}
