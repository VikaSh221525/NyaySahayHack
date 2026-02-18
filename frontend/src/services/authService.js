import api from './api.js';

export const authService = {
    // Register client
    registerClient: async (userData) => {
        try {
            const response = await api.post('/auth/signup/client', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    // Login client
    loginClient: async (credentials) => {
        try {
            const response = await api.post('/auth/login/client', credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    // Logout client
    logoutClient: async () => {
        try {
            const response = await api.post('/auth/logout/client');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Logout failed' };
        }
    },

    // Client onboarding
    onboardingClient: async (formData) => {
        try {
            const response = await api.put('/auth/onboarding/client', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Onboarding failed' };
        }
    },

    // Register advocate
    registerAdvocate: async (userData) => {
        try {
            const response = await api.post('/auth/signup/advocate', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    // Login advocate
    loginAdvocate: async (credentials) => {
        try {
            const response = await api.post('/auth/login/advocate', credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    // Logout advocate
    logoutAdvocate: async () => {
        try {
            const response = await api.post('/auth/logout/advocate');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Logout failed' };
        }
    },

    // Advocate onboarding
    onboardingAdvocate: async (formData) => {
        try {
            const response = await api.put('/auth/onboarding/advocate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Onboarding failed' };
        }
    },

    // Check authentication status
    checkAuth: async () => {
        try {
            const response = await api.get('/auth/check');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Authentication check failed' };
        }
    },

    // Check profile completion status
    checkProfileStatus: async () => {
        try {
            const response = await api.get('/auth/profile-status');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Profile status check failed' };
        }
    },

    // Get current user (client specific)
    getCurrentClient: async () => {
        try {
            const response = await api.get('/auth/me/client');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get client data' };
        }
    },

    // Get current user (advocate specific)
    getCurrentAdvocate: async () => {
        try {
            const response = await api.get('/auth/me/advocate');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get advocate data' };
        }
    },

    // Update client profile
    updateClientProfile: async (formData) => {
        try {
            const response = await api.put('/auth/profile/client', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update profile' };
        }
    },

    // Update advocate profile
    updateAdvocateProfile: async (formData) => {
        try {
            const response = await api.put('/auth/profile/advocate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update profile' };
        }
    },
};