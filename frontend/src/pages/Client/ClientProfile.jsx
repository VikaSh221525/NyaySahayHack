import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, MapPin, FileText, Upload, ArrowLeft, Save } from 'lucide-react';
import { useAuthStatus } from '../../hooks/useAuthQuery.js';
import { useUpdateClientProfile } from '../../hooks/useAuthQuery.js';
import NavClient from '../../components/NavClient';

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

const ClientProfile = () => {
    const navigate = useNavigate();
    const { data: authData, isLoading: authLoading } = useAuthStatus();
    const updateProfileMutation = useUpdateClientProfile();
    
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const [idProof, setIdProof] = useState(null);
    
    const userData = authData?.user || {};
    
    const { register, handleSubmit, formState: { errors }, setError, setValue } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            state: '',
            address: '',
            description: '',
        }
    });

    // Update form values when userData is available
    useEffect(() => {
        if (userData && Object.keys(userData).length > 0) {
            setValue('fullName', userData.fullName || '');
            setValue('email', userData.email || '');
            setValue('phone', userData.phone || '');
            setValue('state', userData.state || '');
            setValue('address', userData.address || '');
            setValue('description', userData.description || '');
            
            if (userData.profilePicture) {
                setProfilePicPreview(userData.profilePicture);
            }
        }
    }, [userData, setValue]);

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setProfilePic(file);
            setProfilePicPreview(URL.createObjectURL(file));
        }
    };

    const handleIdProofChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
            setIdProof(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            
            // Only add editable fields
            formData.append('address', data.address || '');
            formData.append('description', data.description || '');
            
            // Add files if selected
            if (profilePic) {
                formData.append('profilePicture', profilePic);
            }
            if (idProof) {
                formData.append('idProof', idProof);
            }

            await updateProfileMutation.mutateAsync(formData);
            
        } catch (error) {
            console.error('Profile update error:', error);
            setError('root', { 
                message: error.message || 'Failed to update profile. Please try again.' 
            });
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <NavClient />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 relative">
                    <button 
                        onClick={() => navigate(-1)}
                        className="absolute top-6 left-6 text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
                        <p className="text-gray-600">Manage your account information</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {profilePicPreview ? (
                                        <img 
                                            src={profilePicPreview} 
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
                            <p className="mt-2 text-sm text-gray-500">Click to update profile picture</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name - Read Only */}
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
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
                                        disabled
                                        {...register('fullName')}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Cannot be changed</p>
                            </div>

                            {/* Email - Read Only */}
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
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
                                        disabled
                                        {...register('email')}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Cannot be changed</p>
                            </div>

                            {/* Phone - Read Only */}
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
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
                                        disabled
                                        {...register('phone')}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Cannot be changed</p>
                            </div>

                            {/* State - Read Only */}
                            <div>
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                    State
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="state"
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
                                        disabled
                                        {...register('state')}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Cannot be changed</p>
                            </div>

                            {/* Address - Editable */}
                            <div className="md:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        id="address"
                                        rows={3}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Enter your full address"
                                        {...register('address')}
                                    />
                                </div>
                            </div>

                            {/* Description - Editable */}
                            <div className="md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                                        <FileText className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        id="description"
                                        rows={4}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="e.g., Business owner, Student, Professional, etc."
                                        {...register('description')}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Tell us about yourself
                                </p>
                            </div>

                            {/* ID Proof Upload */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ID Proof (Aadhar, Voter ID, etc.)
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
                                        {userData.idProof && !idProof && (
                                            <p className="text-sm text-gray-600">
                                                Current ID proof uploaded
                                            </p>
                                        )}
                                    </div>
                                </div>
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
                                disabled={updateProfileMutation.isPending}
                                className="flex items-center space-x-2 px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="h-4 w-4" />
                                <span>{updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;
