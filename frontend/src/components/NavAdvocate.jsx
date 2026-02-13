import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Scale, 
    Bot, 
    Users, 
    ChevronDown, 
    User,
    LogOut,
    Shield,
    Briefcase
} from 'lucide-react';
import { useAuthStatus } from '../hooks/useAuthQuery.js';
import { useLogout } from '../hooks/useAuthQuery.js';

const NavAdvocate = () => {
    const location = useLocation();
    const { data: authData } = useAuthStatus();
    const logoutMutation = useLogout();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const user = authData?.user;

    const navItems = [
        {
            name: 'JusticeAI',
            path: '/advocate/dashboard',
            icon: Bot,
            description: 'AI Legal Assistant'
        },
        {
            name: 'Your Clients',
            path: '/advocate/clients',
            icon: Users,
            description: 'Manage Your Clients'
        }
    ];

    const isActive = (path) => {
        if (path === '/advocate/dashboard') {
            return location.pathname === '/advocate/dashboard' || location.pathname === '/advocate/justice-ai';
        }
        return location.pathname === path;
    };

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            {/* Top Bar */}
            <div className="bg-indigo-600 text-white text-xs py-1">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <Shield className="h-3 w-3" />
                            <span>Secure Legal Platform</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-1">
                            <span>Professional Legal Services</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 text-xs">
                        <span className="hidden md:inline">📞 +91-1800-NYAYA-HELP</span>
                        <span className="hidden md:inline">✉️ support@nyayasahay.gov.in</span>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/advocate/dashboard" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Scale className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            <span className="text-indigo-600">न्याय</span>Sahay
                        </span>
                        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-medium">
                            Advocate
                        </span>
                    </Link>

                    {/* Navigation Items */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                        active
                                            ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    <Icon className={`h-4 w-4 ${active ? 'text-indigo-600' : 'text-gray-500'}`} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-4">
                        {/* Profile Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                    {user?.profilePicture ? (
                                        <img 
                                            src={user.profilePicture} 
                                            alt={user.fullName}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-4 w-4 text-indigo-600" />
                                    )}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                                    <p className="text-xs text-gray-500">Advocate</p>
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </button>

                            {/* Profile Dropdown */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="font-semibold text-gray-900">{user?.fullName}</p>
                                        <p className="text-sm text-gray-500">{user?.email}</p>
                                    </div>
                                    
                                    <Link
                                        to="/advocate/profile"
                                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                    >
                                        <User className="h-4 w-4" />
                                        <span>Profile Settings</span>
                                    </Link>
                                    
                                    <Link
                                        to="/advocate/consultation-requests"
                                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                    >
                                        <Briefcase className="h-4 w-4" />
                                        <span>Consultation Requests</span>
                                    </Link>
                                    
                                    <button
                                        onClick={handleLogout}
                                        disabled={logoutMutation.isPending}
                                        className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>{logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden border-t border-gray-200 py-2">
                    <div className="flex justify-around">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex flex-col items-center space-y-1 p-2 rounded-lg ${
                                        active
                                            ? 'text-indigo-600'
                                            : 'text-gray-600'
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="text-xs font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Click outside to close dropdowns */}
            {showProfileMenu && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => {
                        setShowProfileMenu(false);
                    }}
                />
            )}
        </nav>
    );
};

export default NavAdvocate;