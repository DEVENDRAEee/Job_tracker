const applications = [];

module.exports = {
    getApplicationsByUser: (email) => {
        return applications.filter(app => app.userEmail === email).sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    },
    createApplication: (appData) => {
        const newApp = {
            ...appData,
            id: Math.random().toString(36).substr(2, 9),
            appliedAt: new Date().toISOString(),
            status: 'Applied' // Applied, Interview, Offer, Rejected
        };
        applications.push(newApp);
        return newApp;
    }
};
