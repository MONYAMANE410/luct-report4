import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Welcome from './pages/Auth/Welcome';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import LecturerDashboard from './pages/Lecturer/Dashboard';
import StudentDashboard from './pages/Student/Dashboard';
import PRLDashboard from './pages/PRL/Dashboard';
import PLDashboard from './pages/PL/Dashboard';

import MainLayout from './layouts/MainLayout';

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes wrapped in MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/prl/dashboard" element={<PRLDashboard />} />
        <Route path="/pl/dashboard" element={<PLDashboard />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;
