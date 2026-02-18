import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Users, 
    MessageCircle, 
    Phone, 
    Mail, 
    Calendar,
    Clock,
    User,
    Search,
    Filter,
    ChevronRight,
    Badge,
    AlertCircle
} from 'lucide-react';
import { 
    useMyClients, 
    useMyConsultationRequests, 
    useAcceptConsultationRequest, 
    useRejectConsultationRequest 
} from '../../hooks/useConnectionQuery';

const YourClients = () => {
    const [activeTab, setActiveTab] = useState('clients');
    const [searchTerm, setSearchTerm] = useState('');
    
    const { data: clients, isLoading: clientsLoading } = useMyClients();
    const { data: requests, isLoading: requestsLoading } = useMyConsultationRequests();
    const acceptRequestMutation = useAcceptConsultationRequest();
    const rejectRequestMutation = useRejectConsultationRequest();

    const filteredClients = clients?.clients?.filter(clientData =>
        clientData.client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clientData.client.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const filteredRequests = requests?.requests?.filter(request =>
        request.client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.client.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await acceptRequestMutation.mutateAsync(requestId);
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            await rejectRequestMutation.mutateAsync({ 
                requestId, 
                rejectionReason: 'Unable to take on new clients at this time' 
            });
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };

    const ClientCard = ({ clientData, isRequest = false, requestId = null }) => {
        const client = isRequest ? clientData : clientData.client;
        
        return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        {client.profilePicture ? (
                            <img 
                                src={client.profilePicture} 
                                alt={client.fullName}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <User className="h-6 w-6 text-indigo-600" />
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{client.fullName}</h3>
                        <p className="text-sm text-gray-500">{client.email}</p>
                        {client.phone && (
                            <p className="text-sm text-gray-500">{client.phone}</p>
                        )}
                        {client.state && (
                            <p className="text-sm text-gray-500">{client.state}</p>
                        )}
                        {isRequest ? (
                            <div className="mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending Request
                                </span>
                            </div>
                        ) : (
                            <div className="mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <Badge className="h-3 w-3 mr-1" />
                                    Active Client
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {!isRequest && (
                        <>
                            <Link 
                                to={`/chat/${client._id}`}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Start Chat"
                            >
                                <MessageCircle className="h-4 w-4" />
                            </Link>
                            <button 
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Call Client"
                            >
                                <Phone className="h-4 w-4" />
                            </button>
                            <button 
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Send Email"
                            >
                                <Mail className="h-4 w-4" />
                            </button>
                        </>
                    )}
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
            </div>
            
            {isRequest && clientData.createdAt && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                Requested on {formatDate(clientData.createdAt)}
                            </span>
                        </div>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => handleAcceptRequest(requestId)}
                                disabled={acceptRequestMutation.isPending}
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {acceptRequestMutation.isPending ? 'Accepting...' : 'Accept'}
                            </button>
                            <button 
                                onClick={() => handleRejectRequest(requestId)}
                                disabled={rejectRequestMutation.isPending}
                                className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
                            >
                                {rejectRequestMutation.isPending ? 'Declining...' : 'Decline'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );};

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Clients</h1>
                <p className="text-gray-600">Manage your client relationships and consultation requests</p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('clients')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'clients'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4" />
                                <span>Active Clients</span>
                                {clients?.clients && (
                                    <span className="bg-indigo-100 text-indigo-600 py-0.5 px-2 rounded-full text-xs">
                                        {clients.clients.length}
                                    </span>
                                )}
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'requests'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="h-4 w-4" />
                                <span>Consultation Requests</span>
                                {requests?.requests && (
                                    <span className="bg-yellow-100 text-yellow-600 py-0.5 px-2 rounded-full text-xs">
                                        {requests.requests.length}
                                    </span>
                                )}
                            </div>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {activeTab === 'clients' && (
                    <>
                        {clientsLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : filteredClients.length > 0 ? (
                            filteredClients.map((clientData) => (
                                <ClientCard key={clientData.requestId} clientData={clientData} />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
                                <p className="text-gray-500">
                                    {searchTerm ? 'No clients match your search.' : 'You haven\'t connected with any clients yet.'}
                                </p>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'requests' && (
                    <>
                        {requestsLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : filteredRequests.length > 0 ? (
                            filteredRequests.map((request) => (
                                <ClientCard 
                                    key={request._id} 
                                    clientData={request} 
                                    isRequest={true} 
                                    requestId={request._id}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No consultation requests</h3>
                                <p className="text-gray-500">
                                    {searchTerm ? 'No requests match your search.' : 'You don\'t have any pending consultation requests.'}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default YourClients;