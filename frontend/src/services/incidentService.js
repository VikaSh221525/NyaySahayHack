import api from './api.js';

export const incidentService = {
    // Report a new incident
    reportIncident: async (formData) => {
        try {
            const response = await api.post('/incidents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to report incident' };
        }
    },

    // Get all incidents for the user
    getMyIncidents: async () => {
        try {
            const response = await api.get('/incidents');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get incidents' };
        }
    },

    // Get specific incident details
    getIncidentDetails: async (incidentId) => {
        try {
            const response = await api.get(`/incidents/${incidentId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get incident details' };
        }
    }
};