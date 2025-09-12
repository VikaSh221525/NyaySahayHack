import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, MapPin, Upload, FileText, ArrowLeft, Mail, Phone } from 'lucide-react';
import { useClientOnboarding, useAuthStatus } from '../../hooks/useAuthQuery.js';

const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
    'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
    'Ladakh', 'Lakshadweep', 'Puducherry'
];

const ClientOnboarding = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { data: authData } = useAuthStatus();
    const clientOnboardingMutation = useClientOnboarding();
    
    const [profilePic, setProfilePic] = useState(null);
    const [idProof, setIdProof] = useState(null);
    const [selectedState, setSelectedState] = useState('');
    const [userData, setUserData] = useState({});
    
    // Get user data from auth query
    useEffect(() => {
        if (authData?.user) {
            setUserData(authData.user);
            setSelectedState(authData.user.state || '');
        }
    }, [authData]);
    
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        defaultValues: {
            fullName: userData.fullName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.address || '',
            state: userData.state || '',
            description: userData.description || '',
        }
    });

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setProfilePic(file);
        }
    };

    const handleIdProofChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
            setIdProof(file);
        }
    };

    const handleStateChange = (e) => {
        const state = e.target.value;
        setSelectedState(state);
    };

    const onSubmit = async (data) => {
        try {
            // Create FormData for file uploads
            const formData = new FormData();
            
            // Add text fields
            formData.append('state', selectedState);
            formData.append('description', data.description || '');
            formData.append('address', data.address || '');
            
            // Add files if selected
            if (profilePic) {
                formData.append('profilePicture', profilePic);
            }
            if (idProof) {
                formData.append('idProof', idProof);
            }

            await clientOnboardingMutation.mutateAsync(formData);
            
        } catch (error) {
            console.error('Onboarding error:', error);
            setError('root', { 
                message: error.message || 'Failed to update profile. Please try again.' 
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl">
                <div className="bg-white rounded-2xl shadow-xl p-8 relative">
                    <button 
                        onClick={() => navigate(-1)}
                        className="absolute top-6 left-6 text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
                        <p className="text-gray-600">Help us know you better to serve you better</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {profilePic ? (
                                        <img 
                                            src={URL.createObjectURL(profilePic)} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-16 h-16 text-gray-400" />
                                    )}
                                </div>
                                <label 
                                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                                    title="Upload profile picture"
                                >
                                    <Upload className="w-5 h-5" />
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleProfilePicChange}
                                    />
                                </label>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">Click to upload profile picture (optional)</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="fullName"
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-100"
                                        disabled
                                        {...register('fullName')}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-100"
                                        disabled
                                        {...register('email')}
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="phone"
                                        type="tel"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-100"
                                        disabled
                                        {...register('phone')}
                                    />
                                </div>
                            </div>

                            {/* State */}
                            <div>
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                    State <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        id="state"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                                        value={selectedState}
                                        onChange={handleStateChange}
                                        required
                                    >
                                        <option value="">Select your state</option>
                                        {indianStates.map((state) => (
                                            <option key={state} value={state}>
                                                {state}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* ID Proof Upload */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ID Proof (Aadhar, Voter ID, etc.) - Optional
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                    <div className="space-y-1 text-center">
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                                <span>Upload a file</span>
                                                <input 
                                                    id="idProof" 
                                                    name="idProof" 
                                                    type="file" 
                                                    className="sr-only" 
                                                    accept=".pdf,image/*"
                                                    onChange={handleIdProofChange}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PDF, JPG, PNG up to 5MB
                                        </p>
                                        {idProof && (
                                            <p className="text-sm text-green-600">
                                                {idProof.name} selected
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Short Description (Optional)
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="description"
                                        rows={3}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-lg p-3"
                                        placeholder="e.g., Business owner, Student, Professional, etc."
                                        {...register('description')}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    This helps us understand your background better
                                </p>
                            </div>
                        </div>

                        {errors.root && (
                            <div className="text-sm text-red-600 text-center">
                                {errors.root.message}
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={clientOnboardingMutation.isPending || !selectedState}
                                className="px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {clientOnboardingMutation.isPending ? 'Updating Profile...' : 'Complete Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClientOnboarding;
