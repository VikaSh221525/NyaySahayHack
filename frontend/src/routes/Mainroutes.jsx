import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import UserTypeSelection from '../pages/Authentication/UserTypeSelection';
import LoginClient from '../pages/Authentication/LoginClient';
import SignUpClient from '../pages/Authentication/SignUpClient';
import LoginAdvocate from '../pages/Authentication/LoginAdvocate';
import SignUpAdvocate from '../pages/Authentication/SignUpAdvocate';
import AdvocateOnboarding from '../pages/Onboarding/AdvocateOnboarding';
import ClientOnboarding from '../pages/Onboarding/ClientOnboarding';
import ReportIncident from '../pages/Client/ReportIncident';
import RecommendedAdvocates from '../pages/Client/RecommendedAdvocates';
import api from '../services/api';

// Protected Route Component
const ProtectedRoute = ({ children, requireAuth = true, requiredRole = null, requireCompleteProfile = false }) => {
    const { data: authData, isLoading, error } = useQuery({
        queryKey: ['authUser'],
        queryFn: async () => {
            const response = await api.get('/auth/profile-status');
            return response.data;
        },
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const isAuthenticated = authData?.authenticated;
    const user = authData?.user;
    const profileComplete = authData?.profileComplete;

    // If authentication is required but user is not authenticated
    if (requireAuth && (!isAuthenticated || error)) {
        return <Navigate to="/" replace />;
    }

    // If specific role is required and user doesn't have it
    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    // If complete profile is required but user hasn't completed it
    if (requireCompleteProfile && !profileComplete) {
        const onboardingPath = user?.role === 'client' ? '/onboarding/client' : '/onboarding/advocate';
        return <Navigate to={onboardingPath} replace />;
    }

    return children;
};

// Redirect authenticated users away from auth pages
const AuthRoute = ({ children }) => {
    const { data: authData, isLoading } = useQuery({
        queryKey: ['authUser'],
        queryFn: async () => {
            const response = await api.get('/auth/profile-status');
            return response.data;
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // If user is authenticated, redirect to appropriate dashboard
    if (authData?.authenticated) {
        const user = authData.user;
        const profileComplete = authData.profileComplete;

        if (!profileComplete) {
            const onboardingPath = user?.role === 'client' ? '/onboarding/client' : '/onboarding/advocate';
            return <Navigate to={onboardingPath} replace />;
        } else {
            const dashboardPath = user?.role === 'client' ? '/client/dashboard' : '/advocate/dashboard';
            return <Navigate to={dashboardPath} replace />;
        }
    }

    return children;
};

const MainRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<AuthRoute><UserTypeSelection /></AuthRoute>} />
            <Route path="/select-user-type" element={<AuthRoute><UserTypeSelection /></AuthRoute>} />

            {/* Authentication Routes - Redirect if already authenticated */}
            <Route path="/login/client" element={<AuthRoute><LoginClient /></AuthRoute>} />
            <Route path="/signup/client" element={<AuthRoute><SignUpClient /></AuthRoute>} />
            <Route path="/login/advocate" element={<AuthRoute><LoginAdvocate /></AuthRoute>} />
            <Route path="/signup/advocate" element={<AuthRoute><SignUpAdvocate /></AuthRoute>} />

            {/* Protected Onboarding Routes - Require authentication but not complete profile */}
            <Route
                path="/onboarding/client"
                element={
                    <ProtectedRoute requiredRole="client">
                        <ClientOnboarding />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/onboarding/advocate"
                element={
                    <ProtectedRoute requiredRole="advocate">
                        <AdvocateOnboarding />
                    </ProtectedRoute>
                }
            />

            {/* Protected Dashboard Routes - Require authentication and complete profile */}
            
        </Routes>
    );
};

export default MainRoutes;