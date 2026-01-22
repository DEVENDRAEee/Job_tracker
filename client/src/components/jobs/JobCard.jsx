import React, { useState } from 'react';
import { MapPin, Building, Clock, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';
import TrackingModal from '../tracking/TrackingModal';
import api from '../../lib/api';

export default function JobCard({ job }) {
    const [expanded, setExpanded] = useState(false);
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

    const postedDate = job.job_posted_at_datetime_utc
        ? formatDistanceToNow(new Date(job.job_posted_at_datetime_utc), { addSuffix: true })
        : 'Recently';

    const handleApply = () => {
        window.open(job.job_apply_link, '_blank');

        // Show modal after a delay to simulate return
        setTimeout(() => {
            setShowTrackingModal(true);
        }, 1000);
    };

    const handleConfirmTracking = async () => {
        try {
            await api.post('/applications', { job });
            setIsApplied(true);
            setShowTrackingModal(false);
            // Optional: Toast success
        } catch (err) {
            console.error("Failed to track", err);
        }
    };

    // Score logic
    const score = job.matchScore || 0;
    let scoreColor = 'bg-gray-100 text-gray-800'; // Default gray
    if (score >= 70) scoreColor = 'bg-green-100 text-green-800';
    else if (score >= 40) scoreColor = 'bg-yellow-100 text-yellow-800';

    return (
        <>
            <div className="group relative flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div>
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                                {job.job_title}
                            </h3>
                            <p className="mt-1 text-sm font-medium text-gray-500">{job.employer_name}</p>
                        </div>

                        {job.matchScore !== undefined && (
                            <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", scoreColor)}>
                                {score}% Match
                            </span>
                        )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-500">
                        <div className="flex items-center">
                            <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            {job.job_city}, {job.job_state} ({job.job_is_remote ? 'Remote' : 'On-site'})
                        </div>
                        <div className="flex items-center">
                            <Briefcase className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            {job.job_employment_type}
                        </div>
                        <div className="flex items-center">
                            <Clock className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            {postedDate}
                        </div>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm text-gray-600">
                        {job.job_description}
                    </p>

                    {/* Why this matches section */}
                    {job.matchReason && (
                        <div className="mt-4">
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                {expanded ? "Hide analysis" : "Why this matches"}
                                {expanded ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
                            </button>
                            {expanded && (
                                <div className="mt-2 rounded-md bg-indigo-50 p-3 text-sm text-indigo-900">
                                    <p className="font-semibold">AI Assistant Analysis:</p>
                                    <p className="mt-1">{job.matchReason}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                        {job.job_required_skills && job.job_required_skills.slice(0, 3).map((skill, i) => (
                            <span key={i} className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <Button onClick={handleApply} className="w-full" disabled={isApplied}>
                        {isApplied ? 'Applied' : 'Apply Now'}
                    </Button>
                </div>
            </div>

            <TrackingModal
                isOpen={showTrackingModal}
                onClose={() => setShowTrackingModal(false)}
                onConfirm={handleConfirmTracking}
                jobTitle={job.job_title}
                companyName={job.employer_name}
            />
        </>
    );
}
