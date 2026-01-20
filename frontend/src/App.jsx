import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import stylów Bootstrapa

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainLayout from './components/MainLayout';
import ProfilePage from './pages/ProfilePage';
import ProjectDetails from './pages/ProjectDetails';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
        <Route path="/projects/:projectId" element={<MainLayout><ProjectDetails /></MainLayout>} />
      </Routes>
    </Router>
  )
}

export default App;