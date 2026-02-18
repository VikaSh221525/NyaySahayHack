import { useState } from 'react';
import { 
    AlertTriangle, 
    Search, 
    Filter, 
    Calendar,
    MapPin,
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    Eye,
    Mail,
    ChevronRight
} from 'lucide-react';
import { useMyIncidents } from '../../hooks/useIncidentQuery';
import NavClient from '../../components/NavClient';

const MyIncidents = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    
    const { data: incidents, isLoading } = useMyIncidents();

    const getStatusColor = (status) => {
        switch (status) {
            case 'submitted':
                return 'bg-blue-100 text-blue-800';
            case 'under_review':
                return 'bg-yellow-100 text-yellow-800';
            case 'forwarded':
                return 'bg-purple-100 text-purple-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'submitted':
                return <Clock className="h-4 w-4" />;
            case 'under_review':
                return <AlertCircle className="h-4 w-4" />;
            case 'forwarded':
                return <ChevronRight className="h-4 w-4" />;
            case 'resolved':
                return <CheckCircle className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'critical':
                return 'text-red-600';
            case 'high':
                return 'text-orange-600';
            case 'medium':
                return 'text-blue-600';
            case 'low':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatIncidentType = (type) => {
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const filteredIncidents = incidents?.incidents?.filter(incident => {
        const matchesSearch = 
            incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            incident.incidentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            incident.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    }) || [];

    const IncidentCard = ({ incident }) => (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-mono text-gray-500">{incident.incidentNumber}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                            {getStatusIcon(incident.status)}
                            <span className="ml-1">{formatIncidentType(incident.status)}</span>
                        </span>
                        {incident.emailSent && (
                            <span className="inline-flex items-center text-xs text-green-600">
                                <Mail className="h-3 w-3 mr-1" />
                                Email Sent
                            </span>
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{incident.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            {formatIncidentType(incident.incidentType)}
                        </div>
                        <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {incident.location}
                        </div>
                        <div className={`flex items-center font-medium ${getUrgencyColor(incident.urgency)}`}>
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            {incident.urgency.toUpperCase()}
                        </div>
                    </div>
                </div>
                <button 
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="View Details"
                >
                    <Eye className="h-5 w-5" />
                </button>
            </div>
            
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Reported on {formatDate(incident.createdAt)}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <NavClient />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Incidents</h1>
                    <p className="text-gray-600">Track and manage your reported incidents</p>
                </div>

                {/* Stats */}
                {incidents?.incidents && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Reports</p>
                                    <p className="text-2xl font-bold text-gray-900">{incidents.incidents.length}</p>
                                </div>
                                <FileText className="h-8 w-8 text-gray-400" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Submitted</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {incidents.incidents.filter(i => i.status === 'submitted').length}
                                    </p>
                                </div>
                                <Clock className="h-8 w-8 text-blue-400" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Under Review</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {incidents.incidents.filter(i => i.status === 'under_review').length}
                                    </p>
                                </div>
                                <AlertCircle className="h-8 w-8 text-yellow-400" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Resolved</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {incidents.incidents.filter(i => i.status === 'resolved').length}
                                    </p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-400" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Search and Filter */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title, incident number, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="submitted">Submitted</option>
                            <option value="under_review">Under Review</option>
                            <option value="forwarded">Forwarded</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                {/* Incidents List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : filteredIncidents.length > 0 ? (
                        filteredIncidents.map((incident) => (
                            <IncidentCard key={incident._id} incident={incident} />
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm || statusFilter !== 'all' ? 'No incidents found' : 'No incidents reported yet'}
                            </h3>
                            <p className="text-gray-500">
                                {searchTerm || statusFilter !== 'all' 
                                    ? 'Try adjusting your search or filter criteria.' 
                                    : 'You haven\'t reported any incidents yet. Click "Report Incident" to get started.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyIncidents;
