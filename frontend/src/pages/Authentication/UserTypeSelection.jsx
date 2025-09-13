import { Link } from 'react-router-dom';
import { ArrowRight, Scale, Shield, Users, Gavel, Star } from 'lucide-react';

const UserTypeSelection = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <Scale className="h-8 w-8 text-indigo-600 mr-2" />
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Welcome to{' '}
                            <span className="text-indigo-600">न्याय</span>Sahay
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose your account type to get started with legal assistance and justice
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Client Card */}
                    <Link
                        to="/signup/client"
                        className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="p-6">
                            {/* Image */}
                            <div className="flex justify-center mb-4">
                                <div className="w-32 h-32 bg-blue-50 rounded-xl flex items-center justify-center p-3">
                                    <img 
                                        className="w-full h-full object-contain" 
                                        src="/Client.svg" 
                                        alt="Client illustration" 
                                    />
                                </div>
                            </div>

                            {/* Title */}
                            <div className="text-center mb-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">I'm a Client</h3>
                                <p className="text-gray-600">Seeking legal assistance and support</p>
                            </div>

                            {/* Features */}
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center text-sm text-gray-700">
                                    <Shield className="h-4 w-4 text-blue-500 mr-2" />
                                    <span>Report incidents</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-700">
                                    <Users className="h-4 w-4 text-blue-500 mr-2" />
                                    <span>Connect with advocates</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-700">
                                    <Scale className="h-4 w-4 text-blue-500 mr-2" />
                                    <span>Get legal guidance</span>
                                </div>
                            </div>

                            {/* Button */}
                            <div className="bg-blue-500 text-white py-3 px-4 rounded-xl text-center font-medium group-hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2">
                                <span>Get Started</span>
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>

                    {/* Advocate Card */}
                    <Link
                        to="/signup/advocate"
                        className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="p-6">
                            {/* Image */}
                            <div className="flex justify-center mb-4">
                                <div className="w-32 h-32 bg-gray-50 rounded-xl flex items-center justify-center p-3">
                                    <img 
                                        className="w-full h-full object-contain" 
                                        src="/Advocate.svg" 
                                        alt="Advocate illustration" 
                                    />
                                </div>
                            </div>

                            {/* Title */}
                            <div className="text-center mb-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">I'm an Advocate</h3>
                                <p className="text-gray-600">Provide legal services and expertise</p>
                            </div>

                            {/* Features */}
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center text-sm text-gray-700">
                                    <Gavel className="h-4 w-4 text-gray-600 mr-2" />
                                    <span>Manage legal practice</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-700">
                                    <Users className="h-4 w-4 text-gray-600 mr-2" />
                                    <span>Connect with clients</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-700">
                                    <Star className="h-4 w-4 text-gray-600 mr-2" />
                                    <span>Build reputation</span>
                                </div>
                            </div>

                            {/* Button */}
                            <div className="bg-gray-800 text-white py-3 px-4 rounded-xl text-center font-medium group-hover:bg-gray-900 transition-colors flex items-center justify-center space-x-2">
                                <span>Get Started</span>
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserTypeSelection;
