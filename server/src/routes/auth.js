const userStore = require('../services/userStore');

module.exports = async function (fastify, opts) {
    fastify.post('/login', async (request, reply) => {
        const { email } = request.body;
        if (!email) {
            return reply.code(400).send({ message: 'Email is required' });
        }

        // Find or create user
        let user = userStore.findUserByEmail(email);
        if (!user) {
            user = userStore.createUser({
                id: Math.random().toString(36).substr(2, 9),
                email,
                name: email.split('@')[0],
                resumeText: null,
                skills: []
            });
        }

        // Generate token
        const token = fastify.jwt.sign({ id: user.id, email: user.email });

        return { token, user };
    });

    fastify.get('/me', { onRequest: [fastify.authenticate] }, async (request, reply) => {
        const user = userStore.findUserByEmail(request.user.email);
        return user;
    });
};
