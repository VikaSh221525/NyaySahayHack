import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserTypeSelection from '../pages/Authentication/UserTypeSelection';
import LoginClient from '../pages/Authentication/LoginClient';
import SignUpClient from '../pages/Authentication/SignUpClient';
import LoginAdvocate from '../pages/Authentication/LoginAdvocate';
import SignUpAdvocate from '../pages/Authentication/SignUpAdvocate';
import AdvocateOnboarding from '../pages/Onboarding/AdvocateOnboarding';
import ClientOnboarding from '../pages/Onboarding/ClientOnboarding';

const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<UserTypeSelection/>} />
            <Route path="/select-user-type" element={<UserTypeSelection />} />

            {/* Client Routes */}
            <Route path="/login/client" element={<LoginClient />} />
            <Route path="/signup/client" element={<SignUpClient />} />
            <Route path="/onboarding/client" element={<ClientOnboarding />} />

            {/* Advocate Routes */}
            <Route path="/login/advocate" element={<LoginAdvocate />} />
            <Route path="/signup/advocate" element={<SignUpAdvocate />} />
            <Route path="/onboarding/advocate" element={<AdvocateOnboarding />} />

        </Routes>
    );
};

export default MainRoutes;