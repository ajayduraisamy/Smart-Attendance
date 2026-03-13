import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRedirect from './routes/RoleRedirect';
import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';
import LandingPage from './features/Landing';
import LoginPage from './features/Login';
import SignupPage from './features/Signup';
import AttendancePage from './features/Attendance';
import EmployeesPage from './features/Employees';
import DevicesPage from './features/Devices';
import OfficesPage from './features/Offices';
import LeavesPage from './features/Leaves';
import ReportsPage from './features/Reports';
import BiometricsPage from './features/Biometrics';
import { AdminDashboard, HRDashboard, EmployeeDashboard } from './features/RoleDashboards';
import { ROLES } from './config/roles';
import EmployeesListPage from './features/EmployeesListPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/services" element={<LandingPage section="services" />} />
            <Route path="/about" element={<LandingPage section="about" />} />
            <Route path="/contact" element={<LandingPage section="contact" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* Authenticated app */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<RoleRedirect />} />
            <Route path="admin" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="hr" element={<ProtectedRoute allowedRoles={[ROLES.HR]}><HRDashboard /></ProtectedRoute>} />
            <Route path="employee" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route
              path="employees"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <EmployeesPage />
                </ProtectedRoute>
              }
            />
            <Route
  path="employee-list"
  element={
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
      <EmployeesListPage />
    </ProtectedRoute>
  }
/>
            <Route
              path="devices"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <DevicesPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="offices"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <OfficesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="leaves"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
                  <LeavesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="biometrics"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <BiometricsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
