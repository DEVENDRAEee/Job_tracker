import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { email: data.email });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            if (!response.data.user.resumeText) {
                // Redirect to resume upload if no resume
                navigate('/upload-resume');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">JobTracker.ai</h2>
                    <p className="mt-2 text-sm text-gray-600">Sign in to track your applications intelligently</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="mt-1">
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                {...register('email', { required: 'Email is required' })}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Sign in
                    </Button>
                </form>
            </div>
        </div>
    );
}
