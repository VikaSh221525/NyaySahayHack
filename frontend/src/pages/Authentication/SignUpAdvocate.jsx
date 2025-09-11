import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Eye, EyeOff, Phone, Briefcase, MapPin, FileText, ArrowLeft } from 'lucide-react';

const SignUpAdvocate = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            barCouncilNumber: '',
            specialization: '',
            yearsOfPractice: '',
            location: '',
            password: '',
            confirmPassword: ''
        }
    });

    const password = watch('password', '');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const onSubmit = (data) => {
        console.log('Advocate signup data:', { ...data, barCertificate: selectedFile });
        navigate('/login/advocate');
    };

    const specializations = [
        'Civil Law',
        'Criminal Law',
        'Corporate Law',
        'Family Law',
        'Intellectual Property',
        'Tax Law',
        'Constitutional Law',
        'Labor Law',
        'Environmental Law',
        'Cyber Law'
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-4xl">
                <div className="bg-white rounded-2xl shadow-xl p-8 relative">
                    <button 
                        onClick={() => navigate(-1)}
                        className="absolute top-6 left-6 text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Join as a Legal Professional</h1>
                        <p className="text-gray-600">Create your advocate account to get started</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        autoComplete="name"
                                        placeholder="John Doe"
                                        className={`block w-full pl-10 pr-3 py-3 border ${
                                            errors.fullName ? 'border-red-300' : 'border-gray-300'
                                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                        {...register('fullName', {
                                            required: 'Full name is required'
                                        })}
                                    />
                                </div>
                                {errors.fullName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="you@lawfirm.com"
                                        className={`block w-full pl-10 pr-3 py-3 border ${
                                            errors.email ? 'border-red-300' : 'border-gray-300'
                                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address'
                                            }
                                        })}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        placeholder="+91 98765 43210"
                                        className={`block w-full pl-10 pr-3 py-3 border ${
                                            errors.phone ? 'border-red-300' : 'border-gray-300'
                                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                        {...register('phone', {
                                            required: 'Phone number is required',
                                            pattern: {
                                                value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                                                message: 'Invalid phone number'
                                            }
                                        })}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="barCouncilNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    Bar Council Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FileText className="h-5 w-5 text-gray-400" />
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
                                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white`}
                                        {...register('specialization', {
                                            required: 'Please select your area of practice'
                                        })}
                                    >
                                        <option value="">Select your specialization</option>
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

                            <div>
                                <label htmlFor="yearsOfPractice" className="block text-sm font-medium text-gray-700 mb-1">
                                    Years of Practice
                                </label>
                                <input
                                    id="yearsOfPractice"
                                    type="number"
                                    min="0"
                                    max="60"
                                    className={`block w-full px-3 py-3 border ${
                                        errors.yearsOfPractice ? 'border-red-300' : 'border-gray-300'
                                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                    {...register('yearsOfPractice', {
                                        required: 'Please enter years of practice',
                                        min: {
                                            value: 0,
                                            message: 'Years cannot be negative'
                                        },
                                        max: {
                                            value: 60,
                                            message: 'Please enter a valid number of years'
                                        }
                                    })}
                                />
                                {errors.yearsOfPractice && (
                                    <p className="mt-1 text-sm text-red-600">{errors.yearsOfPractice.message}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
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

                            <div>
                                <label htmlFor="barCertificate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Bar Certificate (PDF)
                                </label>
                                <div className="mt-1 flex items-center">
                                    <label
                                        htmlFor="bar-certificate-upload"
                                        className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-lg shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Choose File
                                    </label>
                                    <input
                                        id="bar-certificate-upload"
                                        name="bar-certificate-upload"
                                        type="file"
                                        accept=".pdf"
                                        className="sr-only"
                                        onChange={handleFileChange}
                                    />
                                    <span className="ml-3 text-sm text-gray-500 truncate">
                                        {selectedFile ? selectedFile.name : 'No file chosen'}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Upload your bar council certificate (PDF, max 5MB)</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-5">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Credentials</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            placeholder="••••••••"
                                            className={`block w-full pl-10 pr-10 py-3 border ${
                                                errors.password ? 'border-red-300' : 'border-gray-300'
                                            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                            {...register('password', {
                                                required: 'Password is required',
                                                minLength: {
                                                    value: 8,
                                                    message: 'Password must be at least 8 characters'
                                                },
                                                pattern: {
                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
                                                }
                                            })}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            placeholder="••••••••"
                                            className={`block w-full pl-10 pr-10 py-3 border ${
                                                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                            {...register('confirmPassword', {
                                                required: 'Please confirm your password',
                                                validate: value => value === password || 'Passwords do not match'
                                            })}
                                        />
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    {...register('terms', {
                                        required: 'You must accept the terms and conditions'
                                    })}
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="text-gray-700">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>
                        </div>
                        {errors.terms && (
                            <p className="text-sm text-red-600">{errors.terms.message}</p>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Create Advocate Account
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login/advocate" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpAdvocate;