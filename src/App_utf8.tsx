import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import CourseDiscovery from './pages/CourseDiscovery.js';
import CheckoutPage from './pages/CheckoutPage.js';
import Dashboard from './pages/Dashboard.js';
import LearningPlayer from './pages/LearningPlayer.js';
import AdminDashboard from './pages/AdminDashboard.js';
import Navbar from './components/Navbar.js';

const PrivateRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) return <div className="container" style={{ padding: '4rem 0' }}>Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    // Hardening: Redirect to /discovery instead of /dashboard on role failure
    if (roles && !roles.includes(user.role)) return <Navigate to="/discovery" />;

    return <>{children}</>;
};

function AppContent() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/discovery" element={<CourseDiscovery />} />
                <Route path="/checkout/:courseId" element={<CheckoutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                <Route path="/learn/:courseId" element={
                    <PrivateRoute>
                        <LearningPlayer />
                    </PrivateRoute>
                } />
                <Route path="/admin" element={
                    <PrivateRoute roles={['admin', 'super_admin']}>
                        <AdminDashboard />
                    </PrivateRoute>
                } />
                {/* Fallback Catch-all: Always land on Discovery */}
                <Route path="*" element={<Navigate to="/discovery" />} />
                <Route path="/" element={<Navigate to="/discovery" />} />
            </Routes>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
