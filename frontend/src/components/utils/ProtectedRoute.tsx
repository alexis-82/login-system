import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Reindirizza al login se non c'è token
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;