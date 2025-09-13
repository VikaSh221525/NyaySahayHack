import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
    AlertTriangle, 
    Upload, 
    X, 
    FileText, 
    MapPin, 
    Mail,
    Camera,
    Video,
    File
} from 'lucide-react';
import { useReportIncident } from '../../hooks/useIncidentQuery.js';

const ReportIncident = () => {
    const navigate = useNavigate();
    const reportIncidentMutation = useReportIncident();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch
    } = useForm();

    const incidentTypes = [
        { value: 'corruption', label: 'Corruption' },
        { value: 'police_misconduct', label: 'Police Misconduct' },
        { value: 'government_negligence', label: 'Government Negligence' },
        { value: 'fraud', label: 'Fraud' },
        { value: 'other', label: 'Other' }
    ];

    const urgencyLevels = [
        { value: 'low', label: 'Low', color: 'text-green-600' },
        { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
        { value: 'high', label: 'High', color: 'text-orange-600' },
        { value: 'critical', label: 'Critical', color: 'text-red-600' }
    ];

    const handleFileSelect = (files) => {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => {
            const isValidType = file.type.startsWith('image/') || 
                               file.type.startsWith('video/') || 
                               file.type === 'application/pdf';
            const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
            return isValidType && isValidSize;
        });

        if (validFiles.length !== fileArray.length) {
            setError('evidenceFiles', {
                message: 'Some files were rejected. Only images, videos, and PDFs under 10MB are allowed.'
            });
        }

        setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const getFileIcon = (file) => {
        if (file.type.startsWith('image/')) return <Camera className="h-4 w-4" />;
        if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />;
        return <File className="h-4 w-4" />;
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            
            // Add text fields
            Object.keys(data).forEach(key => {
                if (data[key]) {
                    formData.append(key, data[key]);
                }
            });
            
            // Add files
            selectedFiles.forEach(file => {
                formData.append('evidenceFiles', file);
            });

            await reportIncidentMutation.mutateAsync(formData);
        } catch (error) {
            console.error('Report incident error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <AlertTriangle className="h-12 w-12 text-red-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Incident</h1>
                        <p className="text-gray-600">
                            Report corruption, misconduct, or any legal violations. Your report will be forwarded to appropriate authorities.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Incident Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Incident Title <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    id="title"
                                    type="text"
                                    placeholder="Brief title describing the incident"
                                    className={`block w-full pl-10 pr-3 py-3 border ${
                                        errors.title ? 'border-red-300' : 'border-gray-300'
                                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                    {...register('title', {
                                        required: 'Incident title is required',
                                        minLength: {
                                            value: 10,
                                            message: 'Title must be at least 10 characters'
                                        }
                                    })}
                                />
                            </div>
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Incident Type and Urgency */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="incidentType" className="block text-sm font-medium text-gray-700 mb-2">
                                    Incident Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="incidentType"
                                    className={`block w-full px-3 py-3 border ${
                                        errors.incidentType ? 'border-red-300' : 'border-gray-300'
                                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white`}
                                    {...register('incidentType', {
                                        required: 'Please select an incident type'
                                    })}
                                >
                                    <option value="">Select incident type</option>
                                    {incidentTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.incidentType && (
                                    <p className="mt-1 text-sm text-red-600">{errors.incidentType.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                                    Urgency Level
                                </label>
                                <select
                                    id="urgency"
                                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                                    {...register('urgency')}
                                >
                                    {urgencyLevels.map(level => (
                                        <option key={level.value} value={level.value}>
                                            {level.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    id="location"
                                    type="text"
                                    placeholder="Where did this incident occur?"
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

                        {/* Incident Details */}
                        <div>
                            <label htmlFor="incidentDetails" className="block text-sm font-medium text-gray-700 mb-2">
                                Detailed Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="incidentDetails"
                                rows={6}
                                placeholder="Provide a detailed description of what happened, when it occurred, who was involved, and any other relevant information..."
                                className={`block w-full px-3 py-3 border ${
                                    errors.incidentDetails ? 'border-red-300' : 'border-gray-300'
                                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                {...register('incidentDetails', {
                                    required: 'Detailed description is required',
                                    minLength: {
                                        value: 50,
                                        message: 'Description must be at least 50 characters'
                                    }
                                })}
                            />
                            {errors.incidentDetails && (
                                <p className="mt-1 text-sm text-red-600">{errors.incidentDetails.message}</p>
                            )}
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Evidence Files (Optional)
                            </label>
                            <div
                                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                                    dragActive 
                                        ? 'border-indigo-400 bg-indigo-50' 
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <div className="text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="mt-4">
                                        <label className="cursor-pointer">
                                            <span className="mt-2 block text-sm font-medium text-gray-900">
                                                Drop files here or click to upload
                                            </span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                multiple
                                                accept="image/*,video/*,.pdf"
                                                onChange={(e) => handleFileSelect(e.target.files)}
                                            />
                                        </label>
                                        <p className="mt-2 text-xs text-gray-500">
                                            Images, videos, or PDFs up to 10MB each (max 5 files)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Files */}
                            {selectedFiles.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                {getFileIcon(file)}
                                                <span className="text-sm text-gray-700 truncate">
                                                    {file.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {errors.evidenceFiles && (
                                <p className="mt-1 text-sm text-red-600">{errors.evidenceFiles.message}</p>
                            )}
                        </div>

                        {/* Important Notice */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex">
                                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        Important Notice
                                    </h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Your report will be forwarded to appropriate authorities</li>
                                            <li>You will receive a confirmation email with an incident number</li>
                                            <li>Providing false information is a punishable offense</li>
                                            <li>Keep your incident number for future reference</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={reportIncidentMutation.isPending}
                                className="px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {reportIncidentMutation.isPending ? 'Submitting Report...' : 'Submit Report'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportIncident;