import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CourseDiscovery from './pages/CourseDiscovery';
import CheckoutPage from './pages/CheckoutPage';
import Dashboard from './pages/Dashboard';
import LearningPlayer from './pages/LearningPlayer';
import AdminDashboard from './pages/AdminDashboard';
import CourseDetailPage from './pages/CourseDetailPage';
import Navbar from './components/Navbar';
import MarketingNavbar from './components/MarketingNavbar';
import LandingPage from './pages/LandingPage';
import Footer from './components/Footer';
import AdminLayout from './pages/Admin/AdminLayout';
import UsersPage from './pages/Admin/UsersPage';
import CoursesPage from './pages/Admin/CoursesPage';
import CourseEditPage from './pages/Admin/CourseEditPage';
import BranchManagementPage from './pages/Admin/BranchManagementPage';
import VerificationPendingPage from './pages/VerificationPendingPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import FAQPage from './pages/FAQPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import BlogGalleryPage from './pages/BlogGalleryPage';
import BlogPostDisplay from './pages/BlogPostDisplay';
import BlogListPage from './pages/Admin/BlogListPage';
import BlogEditPage from './pages/Admin/BlogEditPage';

const PrivateRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) return <div className="container" style={{ padding: '4rem 0' }}>Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    // Hardening: Redirect to /discovery instead of /dashboard on role failure
    if (roles && !roles.includes(user.role)) return <Navigate to="/discovery" />;

    return <>{children}</>;
};

function AppContent() {
    const location = useLocation();
    const isLandingPage = location.pathname === '/';

    return (
        <>
            {isLandingPage ? <MarketingNavbar /> : <Navbar />}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/discovery" element={<CourseDiscovery />} />
                <Route path="/course/:slug" element={<CourseDetailPage />} />
                <Route path="/checkout/:courseId" element={<CheckoutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verification-pending" element={<VerificationPendingPage />} />
                <Route path="/verify-email" element={<EmailVerificationPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/blog" element={<BlogGalleryPage />} />
                <Route path="/blog/:slug" element={<BlogPostDisplay />} />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                <Route path="/learn/:slug" element={
                    <PrivateRoute>
                        <LearningPlayer />
                    </PrivateRoute>
                } />
                <Route path="/admin" element={
                    <PrivateRoute roles={['admin', 'super_admin']}>
                        <AdminLayout />
                    </PrivateRoute>
                }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="courses" element={<CoursesPage />} />
                    <Route path="courses/:id" element={<CourseEditPage />} />
                    <Route path="branches" element={<BranchManagementPage />} />
                    <Route path="blogs" element={<BlogListPage />} />
                    <Route path="blogs/:id" element={<BlogEditPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/discovery" />} />
            </Routes>
            {!location.pathname.startsWith('/admin') && <Footer />}
        </>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;
