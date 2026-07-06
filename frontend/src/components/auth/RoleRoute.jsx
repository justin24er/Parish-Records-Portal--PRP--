// frontend/src/components/auth/RoleRoute.jsx
// Guards a route by minimum role (on top of ProtectedRoute's auth check).
// Used for admin-only screens like Watumiaji (user management) and Ripoti
// za Usalama (audit logs) so a viewer/secretary can never even navigate
// there by typing the URL directly.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';

const ROLE_RANK = { viewer: 1, secretary: 2, admin: 3, super_admin: 4 };

export default function RoleRoute({ minRole, children }) {
  const { user } = useAuth();
  const rank = ROLE_RANK[user?.role] || 0;
  if (rank < ROLE_RANK[minRole]) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  return children;
}
