import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentService } from '../services/incidentService.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Hook to get all incidents for the user
export const useMyIncidents = () => {
    return useQuery({
        queryKey: ['incidents'],
        queryFn: incidentService.getMyIncidents,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Hook to get specific incident details
export const useIncidentDetails = (incidentId) => {
    return useQuery({
        queryKey: ['incident', incidentId],
        queryFn: () => incidentService.getIncidentDetails(incidentId),
        enabled: !!incidentId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to report a new incident
export const useReportIncident = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: incidentService.reportIncident,
        onSuccess: (data) => {
            // Invalidate and refetch incidents
            queryClient.invalidateQueries({ queryKey: ['incidents'] });
            
            toast.success(
                `Incident reported successfully! Incident Number: ${data.incident.incidentNumber}`,
                { duration: 6000 }
            );
            
            // Navigate to incidents list or dashboard
            navigate('/client/incidents');
            
            return data.incident;
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to report incident');
        }
    });
};