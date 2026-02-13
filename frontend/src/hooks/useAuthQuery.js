import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService.js';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Hook for authentication status
export const useAuthStatus = () => {
    return useQuery({
        queryKey: ['authUser'],
        queryFn: async () => {
            const response = await authService.checkProfileStatus();
            return response;
        },
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (replaces deprecated cacheTime)
        refetchOnMount: false, // Don't refetch if data exists in cache
        refetchOnWindowFocus: false, // Don't refetch on window focus
    });
};

// Hook for client registration
export const useRegisterClient = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authService.registerClient,
        onSuccess: (data) => {
            // Update the auth cache
            queryClient.setQueryData(['authUser'], {
                authenticated: true,
                user: data.user,
                role: data.user.role,
                profileComplete: false
            });
            
            toast.success('Account created successfully! Complete your profile to get started.');
            
            // Navigate to onboarding
            navigate('/onboarding/client');
        },
        onError: (error) => {
            console.error('Registration failed:', error);
            toast.error(error.message || 'Registration failed. Please try again.');
        }
    });
};

// Hook for advocate registration
export const useRegisterAdvocate = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authService.registerAdvocate,
        onSuccess: (data) => {
            // Update the auth cache
            queryClient.setQueryData(['authUser'], {
                authenticated: true,
                user: data.user,
                role: data.user.role,
                profileComplete: false
            });
            
            toast.success('Account created successfully! Complete your professional profile.');
            
            // Navigate to onboarding
            navigate('/onboarding/advocate');
        },
        onError: (error) => {
            console.error('Registration failed:', error);
            toast.error(error.message || 'Registration failed. Please try again.');
        }
    });
};

// Hook for client login
export const useLoginClient = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authService.loginClient,
        onSuccess: (data) => {
            // Update the auth cache
            const profileComplete = !!(data.user.state);
            queryClient.setQueryData(['authUser'], {
                authenticated: true,
                user: data.user,
                role: data.user.role,
                profileComplete
            });
            
            toast.success(`Welcome back, ${data.user.fullName}!`);
            
            // Navigate based on profile completion
            if (profileComplete) {
                navigate('/client/dashboard');
            } else {
                navigate('/onboarding/client');
            }
        },
        onError: (error) => {
            console.error('Login failed:', error);
            toast.error(error.message || 'Login failed. Please check your credentials.');
        }
    });
};

// Hook for advocate login
export const useLoginAdvocate = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authService.loginAdvocate,
        onSuccess: (data) => {
            // Update the auth cache
            const profileComplete = !!(data.user.lawFirm && data.user.barCouncilNumber);
            queryClient.setQueryData(['authUser'], {
                authenticated: true,
                user: data.user,
                role: data.user.role,
                profileComplete
            });
            
            toast.success(`Welcome back, ${data.user.fullName}!`);
            
            // Navigate based on profile completion
            if (profileComplete) {
                navigate('/advocate/dashboard');
            } else {
                navigate('/onboarding/advocate');
            }
        },
        onError: (error) => {
            console.error('Login failed:', error);
            toast.error(error.message || 'Login failed. Please check your credentials.');
        }
    });
};

// Hook for client onboarding
export const useClientOnboarding = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authService.onboardingClient,
        onSuccess: (data) => {
            // Update the auth cache
            queryClient.setQueryData(['authUser'], {
                authenticated: true,
                user: data.user,
                role: data.user.role,
                profileComplete: true
            });
            
            toast.success('Profile completed successfully! Welcome to NyaySahay.');
            
            // Navigate to dashboard
            navigate('/client/dashboard');
        },
        onError: (error) => {
            console.error('Onboarding failed:', error);
            toast.error(error.message || 'Failed to update profile. Please try again.');
        }
    });
};

// Hook for advocate onboarding
export const useAdvocateOnboarding = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authService.onboardingAdvocate,
        onSuccess: (data) => {
            // Update the auth cache
            queryClient.setQueryData(['authUser'], {
                authenticated: true,
                user: data.user,
                role: data.user.role,
                profileComplete: true
            });
            
            toast.success('Professional profile completed! Welcome to NyaySahay.');
            
            // Navigate to dashboard
            navigate('/advocate/dashboard');
        },
        onError: (error) => {
            console.error('Onboarding failed:', error);
            toast.error(error.message || 'Failed to update profile. Please try again.');
        }
    });
};

// Hook for logout
export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async () => {
            const user = queryClient.getQueryData(['authUser'])?.user;
            if (user?.role === 'client') {
                return authService.logoutClient();
            } else if (user?.role === 'advocate') {
                return authService.logoutAdvocate();
            }
        },
        onSuccess: () => {
            // Clear all queries and cache
            queryClient.clear();
            
            toast.success('Logged out successfully!');
            
            // Navigate to home
            navigate('/');
        },
        onError: (error) => {
            console.error('Logout failed:', error);
            // Even if logout fails on server, clear cache
            queryClient.clear();
            toast.success('Logged out successfully!');
            navigate('/');
        }
    });
};

// Hook for updating client profile
export const useUpdateClientProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.updateClientProfile,
        onSuccess: (data) => {
            // Update the auth cache
            queryClient.setQueryData(['authUser'], (oldData) => ({
                ...oldData,
                user: data.user
            }));
            
            toast.success('Profile updated successfully!');
        },
        onError: (error) => {
            console.error('Profile update failed:', error);
            toast.error(error.message || 'Failed to update profile. Please try again.');
        }
    });
};