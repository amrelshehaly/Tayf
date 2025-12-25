import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Navigation } from '../components/Navigation';
import LoginPage from '../pages/login';
import BranchesPage from './branches';
import BranchAdminsPage from './Admins';
// import { superAdminDashboard } from '../pages/superAdminDashboard';
// import { branchAdminDashboard } from '../pages/branchAdminDashboard';


function App() {
  return (
    <div className="container" style={{ padding: '20px' }}>
      <AuthProvider>
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

            {/*   <Route 
              path="/branch-admin" 
              element={
                <ProtectedRoute allowedRoles={['branchadmin']}>
                  <BranchAdminDashboard />
                </ProtectedRoute>
              } 
            /> */}

            <Route path="/" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );


  function RootRedirect() {
    const user = localStorage.getItem('user');

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    const userData = JSON.parse(user);

    if (userData.role === 'superadmin') {
      return <Navigate to="/branches" replace />;
    } else {
      return <Navigate to="/branch-admin" replace />;
    }
  }

}

export default App;