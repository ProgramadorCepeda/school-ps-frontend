import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './shared/ui/templates/AppLayout';
import { EnrollmentSearch } from './pages/EnrollmentSearchPage';
import { EnrollmentDetail } from './pages/EnrollmentDetailPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import './index.css';

// Route guard component to verify active session token
const ProtectedLayout: React.FC = () => {
  const [token] = useState(() => localStorage.getItem('auth_token'));
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <AppLayout />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Core Routes */}
        <Route path="/" element={<ProtectedLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="enrollment" element={<EnrollmentSearch />} />
          <Route path="student/:id/enrollment" element={<EnrollmentDetail />} />
        </Route>

        {/* Fallback redirection */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
