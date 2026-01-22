// Simple in-memory user store
const users = [];

module.exports = {
    findUserByEmail: (email) => users.find(u => u.email === email),
    createUser: (user) => {
        users.push(user);
        return user;
    },
    // Mock user for dev convenience
    seed: () => {
        if (users.length === 0) {
            users.push({
                id: '1',
                email: 'demo@jobtracker.com',
                name: 'Demo User',
                resumeText: '', // Will be filled later
                skills: []
            });
        }
    }
};
