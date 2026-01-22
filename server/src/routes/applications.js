const applicationService = require('../services/applicationService');

module.exports = async function (fastify, opts) {
    fastify.get('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
        return applicationService.getApplicationsByUser(request.user.email);
    });

    fastify.post('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
        const { job } = request.body;
        if (!job) {
            return reply.code(400).send({ message: 'Job data required' });
        }

        const newApp = applicationService.createApplication({
            userEmail: request.user.email,
            jobId: job.job_id,
            jobTitle: job.job_title,
            companyName: job.employer_name,
            jobCity: job.job_city,
            jobState: job.job_state,
            matchScore: job.matchScore
        });

        return newApp;
    });
};
