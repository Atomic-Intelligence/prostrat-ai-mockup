import { useNavigate } from 'react-router-dom';
import { useRole, type WebRole } from '../context/RoleContext';

const roleBadgeColors: Record<WebRole, string> = {
  physician: 'bg-blue-600',
  lab_operator: 'bg-green-600',
  lab_supervisor: 'bg-purple-600',
};

const roleHomeRoutes: Record<WebRole, string> = {
  physician: '/web/dashboard',
  lab_operator: '/web/kits',
  lab_supervisor: '/web/lab-dashboard',
};

export default function WebRoleHeader() {
  const { role, setRole, currentUser } = useRole();
  const navigate = useNavigate();

  const initials = `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`;

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as WebRole;
    setRole(newRole);
    navigate(roleHomeRoutes[newRole]);
  };

  return (
    <div className="flex items-center gap-3">
      <select
        value={role}
        onChange={handleRoleChange}
        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
      >
        <option value="physician">Physician</option>
        <option value="lab_operator">Lab Operator</option>
        <option value="lab_supervisor">Lab Supervisor</option>
      </select>
      <span className="text-sm text-gray-500">
        {currentUser.firstName} {currentUser.lastName}
      </span>
      <div
        className={`w-9 h-9 rounded-full ${roleBadgeColors[role]} text-white flex items-center justify-center text-sm font-semibold`}
      >
        {initials}
      </div>
    </div>
  );
}
