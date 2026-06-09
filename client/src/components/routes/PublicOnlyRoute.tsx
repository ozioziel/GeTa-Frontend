import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';

function PublicOnlyRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default PublicOnlyRoute;
