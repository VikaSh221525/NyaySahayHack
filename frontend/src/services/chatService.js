import api from './api.js';

export const chatService = {
    // Create a new chat
    createChat: async (title) => {
        try {
            const response = await api.post('/chat', { title });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create chat' };
        }
    },

    // Get all chats for the user
    getChats: async () => {
        try {
            const response = await api.get('/chat');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get chats' };
        }
    },

    // Get messages for a specific chat
    getMessages: async (chatId) => {
        try {
            const response = await api.get(`/chat/messages/${chatId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get messages' };
        }
    },

    // Delete a chat
    deleteChat: async (chatId) => {
        try {
            const response = await api.delete(`/chat/${chatId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete chat' };
        }
    }
};