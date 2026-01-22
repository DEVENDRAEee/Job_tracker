import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ResumeUpload from './pages/ResumeUpload';
import Dashboard from './pages/Dashboard';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
  return children;
}

import Layout from './components/layout/Layout';
import JobFeed from './components/jobs/JobFeed';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/upload-resume" element={
          <ProtectedRoute>
            <ResumeUpload />
          </ProtectedRoute>
        } />

        {/* Main App Layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/jobs" element={<JobFeed />} />
          <Route path="/applications" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/jobs" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
