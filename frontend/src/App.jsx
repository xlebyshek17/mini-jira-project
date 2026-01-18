import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import stylów Bootstrapa

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<h1>Dashboard bedzie pozniej</h1>} />
      </Routes>
    </Router>
  )
}

export default App;