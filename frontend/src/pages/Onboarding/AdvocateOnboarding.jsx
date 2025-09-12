import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Upload, Briefcase, MapPin, Award, Building2, User } from 'lucide-react';
import { authService } from '../../services/authService.js';

const AdvocateOnboarding = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({});
    
    const specializations = [
        'Civil Law', 'Criminal Law', 'Corporate Law', 'Family Law', 
        'Intellectual Property', 'Tax Law', 'Labor Law', 'Constitutional Law',
        'Cyber Law', 'Environmental Law', 'International Law', 'Other'
    ];

    // Get user data from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserData(user);
        } else {
            // If no user data, redirect to login
            navigate('/login/advocate');
        }
    }, [navigate]);

    const { register, handleSubmit, formState: { errors }, setError } = useForm();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        }
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setProfilePic(file);
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Create FormData for file uploads
            const formData = new FormData();
            
            // Add text fields
            Object.keys(data).forEach(key => {
                if (data[key]) {
                    formData.append(key, data[key]);
                }
            });
            
            // Add files if selected
            if (profilePic) {
                formData.append('profilePicture', profilePic);
            }
            if (selectedFile) {
                formData.append('barCertificate', selectedFile);
            }

            const response = await authService.onboardingAdvocate(formData);
            console.log('Onboarding successful:', response);
            
            // Update user data in localStorage
            localStorage.setItem('user', JSON.stringify(response.user));
            
            // Navigate to dashboard
            navigate('/advocate/dashboard');
            
        } catch (error) {
            console.error('Onboarding error:', error);
            setError('root', { 
                message: error.message || 'Failed to update profile. Please try again.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl">
                <div className="bg-white rounded-2xl shadow-xl p-8 relative">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Advocate Profile</h1>
                        <p className="text-gray-600">Help us know you better to serve you better</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Profile Picture */}
                            <div className="col-span-2 flex flex-col items-center">
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
                                <p className="mt-2 text-sm text-gray-500">Click to upload profile picture</p>
                            </div>

                            {/* Law Firm Name */}
                            <div>
                                <label htmlFor="lawFirm" className="block text-sm font-medium text-gray-700 mb-1">
                                    Name of Law Firm
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building2 className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="lawFirm"
                                        type="text"
                                        placeholder="Enter law firm name"
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

                            {/* Bar Council Number */}
                            <div>
                                <label htmlFor="barCouncilNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    Bar Council Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Award className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="barCouncilNumber"
                                        type="text"
                                        placeholder="e.g., ABC12345"
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

                            {/* Years of Practice */}
                            <div>
                                <label htmlFor="yearsOfPractice" className="block text-sm font-medium text-gray-700 mb-1">
                                    Years of Practice
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
                                        <option value="">Select years of practice</option>
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

                            {/* Area of Practice */}
                            <div>
                                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                                    Area of Practice
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
                                            required: 'Please select your area of practice'
                                        })}
                                    >
                                        <option value="">Select area of practice</option>
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

                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                    Location (City, State)
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

                            {/* Bar Certificate Upload */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Bar Certificate (PDF)
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                    <div className="space-y-1 text-center">
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                                <span>Upload a file</span>
                                                <input 
                                                    id="barCertificate" 
                                                    name="barCertificate" 
                                                    type="file" 
                                                    className="sr-only" 
                                                    accept=".pdf"
                                                    onChange={handleFileChange}
                                                    required
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PDF up to 5MB
                                        </p>
                                        {selectedFile && (
                                            <p className="text-sm text-green-600">
                                                {selectedFile.name} selected
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {errors.barCertificate && (
                                    <p className="mt-1 text-sm text-red-600">{errors.barCertificate.message}</p>
                                )}
                            </div>

                            {/* Bio/About */}
                            <div className="col-span-2">
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                    Brief Bio (Optional)
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="bio"
                                        rows={4}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-lg p-3"
                                        placeholder="Tell us about your legal expertise and experience..."
                                        {...register('bio')}
                                    />
                                </div>
                            </div>
                        </div>

                        {errors.root && (
                            <div className="text-sm text-red-600 text-center">
                                {errors.root.message}
                            </div>
                        )}

                        <div className="flex justify-between pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Updating Profile...' : 'Complete Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdvocateOnboarding;
