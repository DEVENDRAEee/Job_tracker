const axios = require('axios');

const MOCK_JOBS = [
    {
        job_id: '1',
        job_title: 'Senior React Developer',
        employer_name: 'TechCorp',
        job_city: 'San Francisco',
        job_state: 'CA',
        job_country: 'USA',
        job_is_remote: true,
        job_employment_type: 'FULLTIME',
        job_description: 'We are looking for a Senior React Developer to lead our frontend team. Must have 5+ years of experience with React, Node.js, and TypeScript.',
        job_apply_link: 'https://example.com/apply/1',
        job_posted_at_datetime_utc: new Date(Date.now() - 86400000).toISOString(),
        job_required_skills: ['React', 'Node.js', 'TypeScript', 'Redux']
    },
    {
        job_id: '2',
        job_title: 'Full Stack Engineer',
        employer_name: 'StartupX',
        job_city: 'New York',
        job_state: 'NY',
        job_country: 'USA',
        job_is_remote: false,
        job_employment_type: 'FULLTIME',
        job_description: 'Join our fast-paced startup. Stack: Next.js, Postgres, Redis. AI experience is a plus.',
        job_apply_link: 'https://example.com/apply/2',
        job_posted_at_datetime_utc: new Date(Date.now() - 172800000).toISOString(),
        job_required_skills: ['Next.js', 'PostgreSQL', 'Redis', 'AI']
    },
    {
        job_id: '3',
        job_title: 'Frontend Developer',
        employer_name: 'Creative Agency',
        job_city: 'Austin',
        job_state: 'TX',
        job_country: 'USA',
        job_is_remote: true,
        job_employment_type: 'CONTRACTOR',
        job_description: 'Contract role for a creative agency. Implement pixel-perfect designs from Figma.',
        job_apply_link: 'https://example.com/apply/3',
        job_posted_at_datetime_utc: new Date(Date.now() - 259200000).toISOString(),
        job_required_skills: ['React', 'Tailwind CSS', 'Figma']
    },
    {
        job_id: '4',
        job_title: 'Backend Engineer',
        employer_name: 'FinanceFlow',
        job_city: 'Chicago',
        job_state: 'IL',
        job_country: 'USA',
        job_is_remote: false,
        job_employment_type: 'FULLTIME',
        job_description: 'Building secure financial systems. Node.js, Fastify, MySQL.',
        job_apply_link: 'https://example.com/apply/4',
        job_posted_at_datetime_utc: new Date(Date.now() - 259200000).toISOString(),
        job_required_skills: ['Node.js', 'Fastify', 'MySQL', 'Security']
    }
];

async function searchJobs(query, filters = {}) {
    // If JSEARCH_API_KEY is present, use it. Otherwise return mock.
    if (process.env.JSEARCH_API_KEY) {
        // Logic for real API would go here, omitting complexity for now to ensure reliability
        // In a real app, map filters to JSearch parameters
    }

    // Filter mock jobs
    let filtered = MOCK_JOBS;

    // Text Search
    if (query) {
        const lowerQuery = query.toLowerCase();
        filtered = filtered.filter(job =>
            job.job_title.toLowerCase().includes(lowerQuery) ||
            job.employer_name.toLowerCase().includes(lowerQuery) ||
            (job.job_required_skills && job.job_required_skills.some(s => s.toLowerCase().includes(lowerQuery)))
        );
    }

    // Filters
    if (filters.type && filters.type !== 'All') {
        filtered = filtered.filter(job => job.job_employment_type === filters.type);
    }
    if (filters.remote && filters.remote !== 'All') {
        const isRemote = filters.remote === 'true';
        filtered = filtered.filter(job => job.job_is_remote === isRemote);
    }
    if (filters.date && filters.date !== 'Any') {
        const now = Date.now();
        const jobTime = (dateStr) => new Date(dateStr).getTime();
        const hours24 = 24 * 60 * 60 * 1000;

        if (filters.date === '24h') {
            filtered = filtered.filter(job => (now - jobTime(job.job_posted_at_datetime_utc)) < hours24);
        } else if (filters.date === '7d') {
            filtered = filtered.filter(job => (now - jobTime(job.job_posted_at_datetime_utc)) < 7 * hours24);
        } else if (filters.date === '30d') {
            filtered = filtered.filter(job => (now - jobTime(job.job_posted_at_datetime_utc)) < 30 * hours24);
        }
    }

    return filtered;
}

module.exports = { searchJobs };
