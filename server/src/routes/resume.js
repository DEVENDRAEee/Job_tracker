const { extractText } = require('../services/resumeParser');
const userStore = require('../services/userStore');

module.exports = async function (fastify, opts) {
    fastify.post('/upload', { onRequest: [fastify.authenticate] }, async (request, reply) => {
        const data = await request.file();
        if (!data) {
            return reply.code(400).send({ message: 'No file uploaded' });
        }

        const fileBuffer = await data.toBuffer();
        try {
            console.log('Processing upload:', data.filename, data.mimetype);
            const text = await extractText(fileBuffer, data.mimetype);

            // Update user
            const user = userStore.findUserByEmail(request.user.email);
            if (user) {
                user.resumeText = text;
            }

            return { message: 'Resume uploaded successfully', textPreview: text.substring(0, 100) + '...' };
        } catch (err) {
            console.error('Resume processing error:', err); // Log full error
            return reply.code(500).send({ message: 'Failed to process resume: ' + err.message });
        }
    });
};
