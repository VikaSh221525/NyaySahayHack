import { MessageCircle, Loader2 } from 'lucide-react';

const ChatLoader = () => {
    return (
        <div className="h-[93vh] flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="relative mb-4">
                    <MessageCircle className="h-16 w-16 text-indigo-600 mx-auto" />
                    <Loader2 className="h-6 w-6 text-indigo-600 animate-spin absolute -bottom-1 -right-1" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Connecting to Chat</h3>
                <p className="text-gray-500">Please wait while we establish your connection...</p>
            </div>
        </div>
    );
};

export default ChatLoader;