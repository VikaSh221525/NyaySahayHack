import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Briefcase, Building2, Award, Upload, ArrowLeft, Save, FileText } from 'lucide-react';
import { useAuthStatus } from '../../hooks/useAuthQuery.js';
import { useUpdateAdvocateProfile } from '../../hooks/useAuthQuery.js';
import NavAdvocate from '../../components/NavAdvocate';

const specializations = [
    'Civil Law', 'Criminal Law', 'Corporate Law', 'Family Law', 
    'Intellectual Property', 'Tax Law', 'Labor Law', 'Constitutional Law',
    'Cyber Law', 'Environmental Law', 'International Law', 'Other'
];

const AdvocateProfile = () => {
    const navigate = useNavigate();
    const { data: authData, isLoading: authLoading } = useAuthStatus();
    const updateProfileMutation = useUpdateAdvocateProfile();
    
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    
    const userData = authData?.user || {};
    
    const { register, handleSubmit, formState: { errors }, setError, setValue } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            lawFirm: '',
            barCouncilNumber: '',
            yearsOfPractice: '',
            specialization: '',
            location: '',
            bio: '',
        }
    });

    // Update form values when userData is available
    useEffect(() => {
        if (userData && Object.keys(userData).length > 0) {
            setValue('fullName', userData.fullName || '');
            setValue('email', userData.email || '');
            setValue('phone', userData.phone || '');
            setValue('lawFirm', userData.lawFirm || '');
            setValue('barCouncilNumber', userData.barCouncilNumber || '');
            setValue('yearsOfPractice', userData.yearsOfPractice || '');
            setValue('specialization', userData.specialization || '');
            setValue('location', userData.location || '');
            setValue('bio', userData.bio || '');
            
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

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            
            // Add editable fields
            formData.append('lawFirm', data.lawFirm);
            formData.append('barCouncilNumber', data.barCouncilNumber);
            formData.append('yearsOfPractice', data.yearsOfPractice);
            formData.append('specialization', data.specialization);
            formData.append('location', data.location);
            formData.append('bio', data.bio || '');
            
            // Add profile picture if selected
            if (profilePic) {
                formData.append('profilePicture', profilePic);
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
            <NavAdvocate />
            
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
                        <p className="text-gray-600">Manage your professional information</p>
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

                            {/* Bar Council Number - Editable */}
                            <div>
                                <label htmlFor="barCouncilNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    Bar Council Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Award className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="barCouncilNumber"
                                        type="text"
                                        className={`block w-full pl-10 pr-3 py-3 border ${
                                            errors.barCouncilNumber ? 'border-red-300' : 'border-gray-300'
                                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                        {...register('barCouncilNumber', {
                                            required: 'Bar Council Number is required'
                                        })}
                                    />
                                </div>
                                {errors.barCouncilNumber && (
                                    <p className="mt-1 text-sm text-red-600">{errors.barCouncilNumber.message}</p>
                                )}
                            </div>

                            {/* Law Firm - Editable */}
                            <div>
                                <label htmlFor="lawFirm" className="block text-sm font-medium text-gray-700 mb-1">
                                    Law Firm <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building2 className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="lawFirm"
                                        type="text"
                                        className={`block w-full pl-10 pr-3 py-3 border ${
                                            errors.lawFirm ? 'border-red-300' : 'border-gray-300'
                                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                        {...register('lawFirm', {
                                            required: 'Law firm name is required'
                                        })}
                                    />
                                </div>
                                {errors.lawFirm && (
                                    <p className="mt-1 text-sm text-red-600">{errors.lawFirm.message}</p>
                                )}
                            </div>

                            {/* Years of Practice - Editable */}
                            <div>
                                <label htmlFor="yearsOfPractice" className="block text-sm font-medium text-gray-700 mb-1">
                                    Years of Practice <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Briefcase className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        id="yearsOfPractice"
                                        className={`block w-full pl-10 pr-3 py-3 border ${
                                            errors.yearsOfPractice ? 'border-red-300' : 'border-gray-300'
                                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white`}
                                        {...register('yearsOfPractice', {
                                            required: 'Please select years of practice'
                                        })}
                                    >
                                        <option value="">Select years</option>
                                        {Array.from({ length: 30 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1} {i === 0 ? 'year' : 'years'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.yearsOfPractice && (
                                    <p className="mt-1 text-sm text-red-600">{errors.yearsOfPractice.message}</p>
                                )}
                            </div>

                            {/* Specialization - Editable */}
                            <div>
                                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                                    Specialization <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Briefcase className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        id="specialization"
                                        className={`block w-full pl-10 pr-3 py-3 border ${
                                            errors.specialization ? 'border-red-300' : 'border-gray-300'
                                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white`}
                                        {...register('specialization', {
                                            required: 'Please select your specialization'
                                        })}
                                    >
                                        <option value="">Select specialization</option>
                                        {specializations.map((spec) => (
                                            <option key={spec} value={spec}>
                                                {spec}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.specialization && (
                                    <p className="mt-1 text-sm text-red-600">{errors.specialization.message}</p>
                                )}
                            </div>

                            {/* Location - Editable */}
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="location"
                                        type="text"
                                        placeholder="e.g., Mumbai, Maharashtra"
                                        className={`block w-full pl-10 pr-3 py-3 border ${
                                            errors.location ? 'border-red-300' : 'border-gray-300'
                                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                        {...register('location', {
                                            required: 'Location is required'
                                        })}
                                    />
                                </div>
                                {errors.location && (
                                    <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                                )}
                            </div>

                            {/* Bio - Editable */}
                            <div className="md:col-span-2">
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                    Professional Bio
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                                        <FileText className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        id="bio"
                                        rows={4}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Tell us about your legal expertise and experience..."
                                        {...register('bio')}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Describe your professional background and areas of expertise
                                </p>
                            </div>

                            {/* Bar Certificate Info */}
                            {userData.barCertificate && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bar Certificate
                                    </label>
                                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            Bar certificate uploaded and verified
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Contact support to update your bar certificate
                                        </p>
                                    </div>
                                </div>
                            )}
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

export default AdvocateProfile;
