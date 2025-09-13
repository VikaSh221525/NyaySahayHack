import api from './api.js';

export const connectionService = {
    // Get recommended advocates (for clients)
    getRecommendedAdvocates: async () => {
        try {
            const response = await api.get('/connections/recommended-advocates');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get recommended advocates' };
        }
    },

    // Send consultation request to advocate (for clients)
    sendConsultationRequest: async (advocateId, requestData) => {
        try {
            const response = await api.post(`/connections/consultation-request/${advocateId}`, requestData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to send consultation request' };
        }
    },

    // Accept consultation request (for advocates)
    acceptConsultationRequest: async (requestId) => {
        try {
            const response = await api.put(`/connections/consultation-request/${requestId}/accept`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to accept consultation request' };
        }
    },

    // Reject consultation request (for advocates)
    rejectConsultationRequest: async (requestId, rejectionReason) => {
        try {
            const response = await api.put(`/connections/consultation-request/${requestId}/reject`, {
                rejectionReason
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to reject consultation request' };
        }
    },

    // Get connected clients (for advocates)
    getMyClients: async () => {
        try {
            const response = await api.get('/connections/my-clients');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get clients' };
        }
    },

    // Get connected advocates (for clients)
    getMyAdvocates: async () => {
        try {
            const response = await api.get('/connections/my-advocates');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get advocates' };
        }
    },

    // Get incoming consultation requests (for advocates)
    getConsultationRequests: async () => {
        try {
            const response = await api.get('/connections/consultation-requests');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get consultation requests' };
        }
    },

    // Get outgoing consultation requests (for clients)
    getOutgoingRequests: async () => {
        try {
            const response = await api.get('/connections/outgoing-consultation-requests');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get outgoing requests' };
        }
    }
};

// Stream Chat service
export const streamChatService = {
    // Get Stream Chat token
    getStreamToken: async () => {
        try {
            const response = await api.get('/stream/token');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get stream token' };
        }
    }
};