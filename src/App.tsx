import { Routes, Route, Navigate } from 'react-router-dom';
import DemoSwitcher from './components/layout/DemoSwitcher';
import PhoneFrame from './components/layout/PhoneFrame';

// Mobile screens
import MobileLogin from './mobile/MobileLogin';
import MobileHome from './mobile/MobileHome';
import MobileKitRegister from './mobile/MobileKitRegister';
import MobileStatus from './mobile/MobileStatus';
import MobileResults from './mobile/MobileResults';

// Web screens
import WebLogin from './web/WebLogin';
import WebDashboard from './web/WebDashboard';
import WebPatientList from './web/WebPatientList';
import WebPatientDetail from './web/WebPatientDetail';
import WebClinicalData from './web/WebClinicalData';
import WebAiResults from './web/WebAiResults';
import WebReportGen from './web/WebReportGen';

function MobileLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center py-8">
      <PhoneFrame />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Landing - redirect to mobile */}
        <Route path="/" element={<Navigate to="/mobile/home" replace />} />

        {/* Mobile routes (inside phone frame) */}
        <Route
          path="/mobile/*"
          element={
            <>
              <DemoSwitcher />
              <MobileLayout />
            </>
          }
        >
          <Route path="login" element={<MobileLogin />} />
          <Route path="home" element={<MobileHome />} />
          <Route path="register-kit" element={<MobileKitRegister />} />
          <Route path="status" element={<MobileStatus />} />
          <Route path="results" element={<MobileResults />} />
        </Route>

        {/* Web routes (full width) */}
        <Route
          path="/web/*"
          element={
            <>
              <DemoSwitcher />
              <Routes>
                <Route path="login" element={<WebLogin />} />
                <Route path="dashboard" element={<WebDashboard />} />
                <Route path="patients" element={<WebPatientList />} />
                <Route path="patients/:id" element={<WebPatientDetail />} />
                <Route path="clinical/:kitId" element={<WebClinicalData />} />
                <Route path="results/:kitId" element={<WebAiResults />} />
                <Route path="reports/:kitId" element={<WebReportGen />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </div>
  );
}
