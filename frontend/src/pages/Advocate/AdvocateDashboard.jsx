import { useLocation } from 'react-router-dom';
import NavAdvocate from '../../components/NavAdvocate';
import NyaySahayAi from '../../common/NyaySahayAi';
import YourClients from './YourClients';

const AdvocateDashboard = () => {
    const location = useLocation();

    // Determine which component to show based on the current path
    const renderContent = () => {
        switch (location.pathname) {
            case '/advocate/clients':
                return <YourClients />;
            case '/advocate/dashboard':
            default:
                return <NyaySahayAi />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavAdvocate />
            <main>
                {renderContent()}
            </main>
        </div>
    );
};

export default AdvocateDashboard;