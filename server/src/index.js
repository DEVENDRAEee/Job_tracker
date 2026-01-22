const fastify = require('fastify')({ logger: true });
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Register plugins
fastify.register(require('@fastify/cors'), {
    origin: '*', // For development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

fastify.register(require('@fastify/formbody'));
fastify.register(require('@fastify/multipart'));

// Custom Plugins
fastify.register(require('./plugins/jwt'));

// Routes
fastify.register(require('./routes/auth'), { prefix: '/api/auth' });
fastify.register(require('./routes/resume'), { prefix: '/api/resume' });
fastify.register(require('./routes/jobs'), { prefix: '/api/jobs' });
fastify.register(require('./routes/applications'), { prefix: '/api/applications' });
fastify.register(require('./routes/ai'), { prefix: '/api/ai' });





fastify.get('/', async (request, reply) => {
    return { status: 'ok', message: 'Job Tracker API is running' };
});

const start = async () => {
    try {
        const port = process.env.PORT || 3000;
        await fastify.listen({ port, host: '0.0.0.0' });
        console.log(`Server running on port ${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
