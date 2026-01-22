import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Sprawdzamy, czy jest token

  if (!token) {
    // Jeśli nie ma tokena, przekieruj na stronę logowania/główną
    return <Navigate to="/" replace />;
  }

  return children; 
};

export default ProtectedRoute;