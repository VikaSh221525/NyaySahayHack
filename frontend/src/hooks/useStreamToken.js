import { useQuery } from '@tanstack/react-query';
import { streamChatService } from '../services/connectionService';

const useStreamToken = (authUser) => {
    return useQuery({
        queryKey: ['streamToken', authUser?._id],
        queryFn: async () => {
            if (!authUser) return null;
            return await streamChatService.getStreamToken();
        },
        enabled: !!authUser,
        staleTime: 30 * 60 * 1000, // 30 minutes
        cacheTime: 60 * 60 * 1000, // 1 hour
        retry: 3,
    });
};

export default useStreamToken;