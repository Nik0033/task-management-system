const db = require('./db');

(async () => {
    try {
        console.log('🔍 Querying users...');
        const [users] = await db.query('SELECT * FROM users');
        console.log('Users found:', users);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
})();
