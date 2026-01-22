const { searchJobs } = require('../services/jobService');
const { scoreJob } = require('../services/aiService');
const userStore = require('../services/userStore');

module.exports = async function (fastify, opts) {
    fastify.get('/search', async (request, reply) => {
        const { query, ...filters } = request.query;

        let user = null;
        try {
            const authHeader = request.headers.authorization;
            if (authHeader) {
                await request.jwtVerify();
                user = userStore.findUserByEmail(request.user.email);
            }
        } catch (e) {
            // Ignore auth error
        }

        try {
            const jobs = await searchJobs(query, filters);

            let enrichedJobs = jobs;
            if (user && user.resumeText) {
                enrichedJobs = await Promise.all(jobs.map(async (job) => {
                    const { score, reason } = await scoreJob(user.resumeText, job);
                    return { ...job, matchScore: score, matchReason: reason };
                }));
            }

            return { data: enrichedJobs };
        } catch (err) {
            request.log.error(err);
            return reply.code(500).send({ message: 'Failed to fetch jobs' });
        }
    });
};
