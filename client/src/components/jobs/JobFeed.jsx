import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import JobCard from './JobCard';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Search, Filter } from 'lucide-react';

export default function JobFeed() {
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        type: 'All',
        remote: 'All',
        date: 'Any'
    });

    const { data: jobs, isLoading, error, refetch } = useQuery({
        queryKey: ['jobs', search, filters],
        queryFn: async () => {
            const params = { query: search, ...filters };
            const res = await api.get(`/jobs/search`, { params });
            return res.data.data;
        },
        keepPreviousData: true,
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Recommended Jobs</h1>
                    <p className="text-sm text-gray-500">Jobs matched to your profile and preferences.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <Input
                        placeholder="Search jobs, skills, companies..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center text-sm text-gray-500 font-medium">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters:
                </div>

                <select
                    className="rounded-md border border-gray-300 py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                    <option value="All">All Job Types</option>
                    <option value="FULLTIME">Full-time</option>
                    <option value="CONTRACTOR">Contract</option>
                    <option value="INTERN">Internship</option>
                </select>

                <select
                    className="rounded-md border border-gray-300 py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.remote}
                    onChange={(e) => handleFilterChange('remote', e.target.value)}
                >
                    <option value="All">Any Location</option>
                    <option value="true">Remote</option>
                    <option value="false">On-site</option>
                </select>

                <select
                    className="rounded-md border border-gray-300 py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                >
                    <option value="Any">Date Posted: Any</option>
                    <option value="24h">Last 24 hours</option>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                </select>

                <Button variant="ghost" size="sm" onClick={() => {
                    setFilters({ type: 'All', remote: 'All', date: 'Any' });
                    setSearch('');
                }}>
                    Reset
                </Button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-64 rounded-lg bg-gray-100 animate-pulse"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-center text-red-500">Error loading jobs</div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {jobs?.map((job) => (
                        <JobCard key={job.job_id} job={job} />
                    ))}
                    {jobs?.length === 0 && (
                        <div className="col-span-full py-12 text-center bg-white rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500">No jobs found matching your criteria.</p>
                            <Button variant="link" onClick={() => {
                                setFilters({ type: 'All', remote: 'All', date: 'Any' });
                                setSearch('');
                            }}>Clear Filters</Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
