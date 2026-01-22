import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainLayout from './components/MainLayout';
import ProfilePage from './pages/ProfilePage';
import ProjectDetails from './pages/ProjectDetails';
import LandingPage from './pages/LandingPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
        <Route path="/projects/:projectId" element={<MainLayout><ProjectDetails /></MainLayout>} />
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
    </Router>
  )
}

export default App;