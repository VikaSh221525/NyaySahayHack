import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

export const useSocket = () => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    const connect = () => {
        if (socketRef.current?.connected) return;

        setIsConnecting(true);
        
        socketRef.current = io('http://localhost:3000', {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        socketRef.current.on('connect', () => {
            console.log('Connected to JusticeAI');
            setIsConnected(true);
            setIsConnecting(false);
        });

        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from JusticeAI');
            setIsConnected(false);
            setIsConnecting(false);
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnecting(false);
            toast.error('Failed to connect to JusticeAI');
        });
    };

    const disconnect = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
            setIsConnecting(false);
        }
    };

    const sendMessage = (chatId, content) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('ai-message', {
                chat: chatId,
                content: content
            });
        } else {
            toast.error('Not connected to JusticeAI');
        }
    };

    const onAIResponse = (callback) => {
        if (socketRef.current) {
            socketRef.current.on('ai-response', callback);
        }
    };

    const onAIError = (callback) => {
        if (socketRef.current) {
            socketRef.current.on('ai-error', callback);
        }
    };

    const offAIResponse = () => {
        if (socketRef.current) {
            socketRef.current.off('ai-response');
        }
    };

    const offAIError = () => {
        if (socketRef.current) {
            socketRef.current.off('ai-error');
        }
    };

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, []);

    return {
        isConnected,
        isConnecting,
        connect,
        disconnect,
        sendMessage,
        onAIResponse,
        onAIError,
        offAIResponse,
        offAIError
    };
};