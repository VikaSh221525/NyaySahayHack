import { Video, Phone } from 'lucide-react';

const CallButton = ({ handleVideoCall, disabled = false }) => {
    return (
        <div className="absolute top-4 right-4 z-10">
            <button
                onClick={handleVideoCall}
                disabled={disabled}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Video className="h-4 w-4" />
                <span className="hidden sm:inline">Start Video Call</span>
            </button>
        </div>
    );
};

export default CallButton;