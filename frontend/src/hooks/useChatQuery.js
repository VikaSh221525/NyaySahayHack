import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chatService.js';
import toast from 'react-hot-toast';

// Hook to get all chats
export const useChats = () => {
    return useQuery({
        queryKey: ['chats'],
        queryFn: chatService.getChats,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to get messages for a specific chat
export const useMessages = (chatId) => {
    return useQuery({
        queryKey: ['messages', chatId],
        queryFn: () => chatService.getMessages(chatId),
        enabled: !!chatId, // Only run if chatId exists
        staleTime: 1 * 60 * 1000, // 1 minute
    });
};

// Hook to create a new chat
export const useCreateChat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: chatService.createChat,
        onSuccess: (data) => {
            // Invalidate and refetch chats
            queryClient.invalidateQueries({ queryKey: ['chats'] });
            toast.success('New chat created!');
            return data.chat;
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create chat');
        }
    });
};

// Hook to delete a chat
export const useDeleteChat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: chatService.deleteChat,
        onSuccess: () => {
            // Invalidate and refetch chats
            queryClient.invalidateQueries({ queryKey: ['chats'] });
            toast.success('Chat deleted successfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete chat');
        }
    });
};