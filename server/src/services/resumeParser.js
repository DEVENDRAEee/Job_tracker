const pdf = require('pdf-parse');

async function extractText(fileBuffer, mimetype) {
    // Relaxed mimetype check
    if (mimetype.includes('pdf') || mimetype === 'application/octet-stream') {
        try {
            const data = await pdf(fileBuffer);
            return data.text;
        } catch (e) {
            console.error("PDF Parse Error", e);
            throw new Error("Invalid PDF file");
        }
    } else if (mimetype.includes('text') || mimetype === 'application/json') {
        return fileBuffer.toString('utf-8');
    }
    throw new Error(`Unsupported file type: ${mimetype}`);
}

module.exports = { extractText };
