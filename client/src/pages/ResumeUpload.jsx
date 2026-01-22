import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { UploadCloud } from 'lucide-react';

export default function ResumeUpload() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [fileName, setFileName] = useState('');

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('resume', data.resume[0]);

            await api.post('/resume/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Update local storage user if needed, or just redirect
            const user = JSON.parse(localStorage.getItem('user'));
            user.resumeText = 'uploaded'; // Optimistic update or fetch fresh user
            localStorage.setItem('user', JSON.stringify(user));

            navigate('/dashboard');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                        <UploadCloud className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Upload Resume</h2>
                    <p className="mt-2 text-sm text-gray-600">We need your resume to match you with jobs.</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Resume (PDF or TXT)
                        </label>
                        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                            <div className="space-y-1 text-center">
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="resume-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                                        <span>Upload a file</span>
                                        <Input
                                            id="resume-upload"
                                            type="file"
                                            accept=".pdf,.txt"
                                            className="sr-only"
                                            {...register('resume', {
                                                required: 'Resume is required',
                                                onChange: (e) => {
                                                    if (e.target.files?.[0]) {
                                                        setFileName(e.target.files[0].name);
                                                    }
                                                }
                                            })}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF or TXT up to 5MB</p>
                                {fileName && (
                                    <p className="mt-2 text-sm text-indigo-600 font-medium">Selected: {fileName}</p>
                                )}
                            </div>
                        </div>
                        {errors.resume && (
                            <p className="mt-1 text-xs text-red-500">{errors.resume.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Analyze & Continue
                    </Button>
                </form>
            </div>
        </div>
    );
}
