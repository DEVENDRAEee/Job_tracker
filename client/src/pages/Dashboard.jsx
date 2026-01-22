import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { format } from 'date-fns';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export default function Dashboard() {
    const { data: applications, isLoading, error } = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const res = await api.get('/applications');
            return res.data;
        },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Application Dashboard</h1>
                <p className="text-sm text-gray-500">Track and manage your job applications.</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900">Timeline</h3>
                </div>
                {isLoading ? (
                    <div className="p-6 text-center text-gray-500">Loading tracking data...</div>
                ) : applications?.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-500">No applications yet. Start applying!</p>
                    </div>
                ) : (
                    <ul role="list" className="divide-y divide-gray-200">
                        {applications?.map((app) => (
                            <li key={app.id} className="p-6 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <Clock className="h-5 w-5 text-indigo-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-base font-medium text-gray-900">{app.jobTitle}</h4>
                                            <p className="text-sm text-gray-500">{app.companyName} • {app.jobCity}, {app.jobState}</p>
                                            <p className="text-xs text-gray-400">Applied on {format(new Date(app.appliedAt), 'MMM dd, yyyy')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        {app.matchScore && (
                                            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                                {app.matchScore}% Match
                                            </span>
                                        )}
                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 uppercase tracking-wide">
                                            {app.status}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
