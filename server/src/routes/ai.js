const { chat } = require('../services/aiService');

module.exports = async function (fastify, opts) {
    fastify.post('/chat', async (request, reply) => {
        const { message } = request.body;
        const replyText = await chat(message, {});
        return { reply: replyText };
    });
};
