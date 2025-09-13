import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { connectionService, streamChatService } from '../services/connectionService.js';
import toast from 'react-hot-toast';

// Hook to get recommended advocates (for clients)
export const useRecommendedAdvocates = () => {
    return useQuery({
        queryKey: ['recommendedAdvocates'],
        queryFn: connectionService.getRecommendedAdvocates,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

// Hook to get connected advocates (for clients)
export const useMyAdvocates = () => {
    return useQuery({
        queryKey: ['myAdvocates'],
        queryFn: connectionService.getMyAdvocates,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to get connected clients (for advocates)
export const useMyClients = () => {
    return useQuery({
        queryKey: ['myClients'],
        queryFn: connectionService.getMyClients,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to get consultation requests (for advocates)
export const useConsultationRequests = () => {
    return useQuery({
        queryKey: ['consultationRequests'],
        queryFn: connectionService.getConsultationRequests,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Hook to get outgoing requests (for clients)
export const useOutgoingRequests = () => {
    return useQuery({
        queryKey: ['outgoingRequests'],
        queryFn: connectionService.getOutgoingRequests,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Hook to send consultation request (for clients)
export const useSendConsultationRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ advocateId, requestData }) => 
            connectionService.sendConsultationRequest(advocateId, requestData),
        onSuccess: (data) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['recommendedAdvocates'] });
            queryClient.invalidateQueries({ queryKey: ['outgoingRequests'] });
            
            toast.success('Consultation request sent successfully!');
            return data.request;
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to send consultation request');
        }
    });
};

// Hook to accept consultation request (for advocates)
export const useAcceptConsultationRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: connectionService.acceptConsultationRequest,
        onSuccess: (data) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['consultationRequests'] });
            queryClient.invalidateQueries({ queryKey: ['myClients'] });
            
            toast.success('Consultation request accepted!');
            return data.request;
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to accept consultation request');
        }
    });
};

// Hook to reject consultation request (for advocates)
export const useRejectConsultationRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ requestId, rejectionReason }) => 
            connectionService.rejectConsultationRequest(requestId, rejectionReason),
        onSuccess: () => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['consultationRequests'] });
            
            toast.success('Consultation request rejected');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to reject consultation request');
        }
    });
};

// Hook to get Stream Chat token
export const useStreamToken = () => {
    return useQuery({
        queryKey: ['streamToken'],
        queryFn: streamChatService.getStreamToken,
        staleTime: 30 * 60 * 1000, // 30 minutes
        cacheTime: 60 * 60 * 1000, // 1 hour
    });
};