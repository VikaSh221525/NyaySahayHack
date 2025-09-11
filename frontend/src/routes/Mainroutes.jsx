import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserTypeSelection from '../pages/Authentication/UserTypeSelection';
import LoginClient from '../pages/Authentication/LoginClient';
import SignUpClient from '../pages/Authentication/SignUpClient';
import LoginAdvocate from '../pages/Authentication/LoginAdvocate';
import SignUpAdvocate from '../pages/Authentication/SignUpAdvocate';

const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<UserTypeSelection/>} />
            <Route path="/select-user-type" element={<UserTypeSelection />} />

            {/* Client Routes */}
            <Route path="/login/client" element={<LoginClient />} />
            <Route path="/signup/client" element={<SignUpClient />} />

            {/* Advocate Routes */}
            <Route path="/login/advocate" element={<LoginAdvocate />} />
            <Route path="/signup/advocate" element={<SignUpAdvocate />} />

            {/* Fallback route */}
            {/* <Route path="*" element={<Navigate to="/select-user-type" replace />} /> */}
        </Routes>
    );
};

export default MainRoutes;