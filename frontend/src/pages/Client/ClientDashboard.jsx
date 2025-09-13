import { useLocation } from 'react-router-dom';
import NavClient from '../../components/NavClient';
import NyaySahayAi from '../../common/NyaySahayAi';
import ReportIncident from './ReportIncident';
import RecommendedAdvocates from './RecommendedAdvocates';

const ClientDashboard = () => {
    const location = useLocation();

    // Determine which component to show based on the current path
    const renderContent = () => {
        switch (location.pathname) {
            case '/client/report-incident':
                return <ReportIncident />;
            case '/client/advocates':
                return <RecommendedAdvocates />;
            case '/client/dashboard':
            default:
                return <NyaySahayAi />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavClient />
            <main>
                {renderContent()}
            </main>
        </div>
    );
};

export default ClientDashboard;