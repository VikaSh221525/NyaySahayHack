import React from 'react';
import { Link } from 'react-router-dom';
import { User, Briefcase } from 'lucide-react';

const UserTypeSelection = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-6xl font-bold text-gray-900 mb-2">Welcome to <span className='text-indigo-600 text-[3.5rem]'>न्याय</span>Sahay</h1>
                    <p className="text-gray-600">Choose your account type to get started</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                        to="/signup/client"
                        className="group bg-white p-6 rounded-xl shadow-md border-2 border-transparent hover:border-indigo-500 transition-all duration-200 flex flex-col items-center text-center"
                    >
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
                            <User className="h-8 w-8 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">I'm a Client</h3>
                        <p className="text-sm text-gray-500">Seeking legal assistance and support</p>
                    </Link>

                    <Link
                        to="/signup/advocate"
                        className="group bg-white p-6 rounded-xl shadow-md border-2 border-transparent hover:border-indigo-500 transition-all duration-200 flex flex-col items-center text-center"
                    >
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
                            <Briefcase className="h-8 w-8 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">I'm an Advocate</h3>
                        <p className="text-sm text-gray-500">Provide legal services and expertise</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserTypeSelection;
