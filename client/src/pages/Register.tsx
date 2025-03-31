import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, Link } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { insertUserSchema } from '@shared/schema';

// Create extended schema with additional validations
const registerSchema = insertUserSchema.extend({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Omit confirm password and terms when sending to server
type RegisterFormData = z.infer<typeof registerSchema>;
type RegisterSubmitData = Omit<RegisterFormData, 'confirmPassword' | 'agreeToTerms'>;

export default function Register() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      agreeToTerms: false,
    },
  });
  
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterSubmitData) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Registration successful!',
        description: 'Your account has been created. Please log in.',
      });
      
      // Redirect to login page
      setLocation('/login');
    },
    onError: (error: any) => {
      toast({
        title: 'Registration failed',
        description: error.message || 'An error occurred during registration. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    },
  });
  
  const onSubmit = (data: RegisterFormData) => {
    setIsLoading(true);
    // Omit confirmPassword and agreeToTerms before sending to server
    const { confirmPassword, agreeToTerms, ...submitData } = data;
    registerMutation.mutate(submitData);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-500 mt-2">
            Join the Athlete Network
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-gray-700 block">
              Full Name
            </label>
            <input
              id="fullName"
              placeholder="John Doe"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700 block">
              Username
            </label>
            <input
              id="username"
              placeholder="johndoe"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('username')}
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
              Email
            </label>
            <input
              id="email"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              id="agreeToTerms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              {...register('agreeToTerms')}
            />
            <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-sm text-red-500 mt-1">{errors.agreeToTerms.message}</p>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2 px-4 rounded-md hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <p className="text-center mt-8 text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}