import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthQuery';
import useStreamToken from '../hooks/useStreamToken';
import { 
    CallingState, 
    StreamCall, 
    StreamVideo, 
    StreamVideoClient, 
    useCallStateHooks, 
    SpeakerLayout, 
    StreamTheme, 
    CallControls 
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import toast from 'react-hot-toast';
import PageLoader from '../components/PageLoader';

const API_KEY = import.meta.env.VITE_STREAM_API_KEY || 'your-stream-api-key';

const CallPage = () => {
    const { id: callId } = useParams();
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);
    
    const { data: authData, isLoading } = useAuthStatus();
    const authUser = authData?.user;
    const { data: tokenData } = useStreamToken(authUser);

    useEffect(() => {
        const initCall = async () => {
            if (!tokenData?.token || !authUser || !callId) {
                setIsConnecting(false);
                return;
            }

            try {
                console.log("Initializing stream video client...");
                const user = {
                    id: authUser._id,
                    name: authUser.fullName,
                    image: authUser.profilePicture || undefined
                };

                const videoClient = new StreamVideoClient({
                    apiKey: API_KEY,
                    user,
                    token: tokenData.token
                });

                const callInstance = videoClient.call("default", callId);
                await callInstance.join({ create: true });
                
                console.log("Joined call successfully!");
                setClient(videoClient);
                setCall(callInstance);
            } catch (error) {
                console.error("Error joining call: ", error);
                toast.error("Could not join the call. Please try again.");
            } finally {
                setIsConnecting(false);
            }
        };

        initCall();

        // Cleanup function
        return () => {
            if (call) {
                call.leave();
            }
            if (client) {
                client.disconnectUser();
            }
        };
    }, [tokenData, authUser, callId]);

    if (isLoading || isConnecting) return <PageLoader />;

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-900">
            <div className="relative w-full h-full">
                {client && call ? (
                    <StreamVideo client={client}>
                        <StreamCall call={call}>
                            <CallContent />
                        </StreamCall>
                    </StreamVideo>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-white">
                            <h2 className="text-xl font-semibold mb-2">Unable to Initialize Call</h2>
                            <p className="text-gray-300">Please refresh the page or try again later</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const CallContent = () => {
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();
    const navigate = useNavigate();

    useEffect(() => {
        if (callingState === CallingState.LEFT) {
            navigate(-1); // Go back to previous page
        }
    }, [callingState, navigate]);

    return (
        <StreamTheme className="h-full">
            <div className="h-full flex flex-col">
                <div className="flex-1">
                    <SpeakerLayout />
                </div>
                <div className="p-4">
                    <CallControls />
                </div>
            </div>
        </StreamTheme>
    );
};

export default CallPage;