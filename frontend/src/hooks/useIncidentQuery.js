import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentService } from '../services/incidentService.js';
import toast from 'react-hot-toast';

// Hook to get user's incidents
export const useMyIncidents = () => {
    return useQuery({
        queryKey: ['myIncidents'],
        queryFn: incidentService.getMyIncidents,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Hook to get incident details
export const useIncidentDetails = (incidentId) => {
    return useQuery({
        queryKey: ['incident', incidentId],
        queryFn: () => incidentService.getIncidentDetails(incidentId),
        enabled: !!incidentId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to report incident
export const useReportIncident = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: incidentService.reportIncident,
        onSuccess: (data) => {
            // Invalidate incidents list
            queryClient.invalidateQueries({ queryKey: ['myIncidents'] });
            
            toast.success(`Incident reported successfully! Incident Number: ${data.incident.incidentNumber}`);
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to report incident. Please try again.');
        }
    });
};
