const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock-key',
});

function calculateMockScore(resumeText, jobDescription) {
    // Simple keyword matching heuristic
    const resumeWords = new Set(resumeText.toLowerCase().split(/\W+/));
    const jobWords = jobDescription.toLowerCase().split(/\W+/);

    let matchCount = 0;
    const keywords = ['react', 'node', 'javascript', 'typescript', 'python', 'sql', 'aws', 'design', 'manager'];

    // Count important keywords match
    let importantMatches = 0;
    keywords.forEach(k => {
        if (resumeWords.has(k) && jobDescription.toLowerCase().includes(k)) {
            importantMatches++;
        }
    });

    const baseScore = 60 + (importantMatches * 10);
    return Math.min(Math.floor(baseScore + (Math.random() * 10)), 98);
}

async function scoreJob(resumeText, job) {
    if (!resumeText) return { score: 0, reason: 'Upload resume to see match' };

    // If no API key, use mock
    if (!process.env.OPENAI_API_KEY) {
        return {
            score: calculateMockScore(resumeText, job.job_description),
            reason: 'Matched based on skills overlap (Mock AI)'
        };
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a recruiter. Compare the resume to the job description. Return JSON: { score: number (0-100), reason: string (1 sentence summary) }." },
            { role: "user", content: `RESUME: ${resumeText.substring(0, 1000)}...\n\nJOB: ${job.job_description.substring(0, 500)}...` }],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" },
        });

        return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
        console.error("AI Scoring failed", error);
        return { score: calculateMockScore(resumeText, job.job_description), reason: 'AI Error, fallback score' };
    }
}

async function chat(message, userContext) {
    // Simple mock chat logic
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('remote')) {
        return "I can help you find remote jobs. Check out the 'Filters' section or type 'Remote' in the search bar!";
        // In a real app, this would return a structural action to update state
    }
    if (lowerMsg.includes('match') || lowerMsg.includes('score')) {
        return "Our AI matches jobs based on your resume skills and experience. Upload your resume to get started.";
    }
    if (lowerMsg.includes('application') || lowerMsg.includes('track')) {
        return "You can see all your tracked applications in the Dashboard.";
    }

    if (!process.env.OPENAI_API_KEY) {
        return "I am your AI assistant. How can I help you find a job today?";
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful job assistant. Be concise." },
                { role: "user", content: message }
            ],
            model: "gpt-3.5-turbo",
        });
        return completion.choices[0].message.content;
    } catch (e) {
        return "I'm having trouble connecting to my brain right now.";
    }
}

module.exports = { scoreJob, chat };

