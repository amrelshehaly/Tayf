import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Navigation } from '../components/Navigation';
import LoginPage from '../pages/login';
import BranchesPage from './branches';
import BranchAdminsPage from './Admins';
import MaterialsPage from './Materials';
import ProductsPage from './Products';

function App() {
  return (
    <div className="container" style={{ padding: '20px' }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  );
}

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div aria-busy="true">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/branches"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <BranchesPage />
                </ProtectedRoute>
              }
            />

            <Route path="/admins" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <BranchAdminsPage />
              </ProtectedRoute>
            } />

            <Route path="/materials" element={
              <ProtectedRoute allowedRoles={['branchadmin']}>
                <MaterialsPage />
              </ProtectedRoute>
            } />

            <Route path="/products" element={
              <ProtectedRoute allowedRoles={['branchadmin']}>
                <ProductsPage />
              </ProtectedRoute>
            } />

            <Route path="/" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
  );
}

function RootRedirect() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'superadmin') {
    return <Navigate to="/branches" replace />;
  } else {
    return <Navigate to="/materials" replace />;
  }
}

export default App;