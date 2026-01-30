const mysql = require('mysql2');

// Create connection pool to MySQL database
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Shini$1970',
    database: process.env.DB_NAME || 'task_management_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Check connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('✅ Connected to MySQL database');
    connection.release();
});

// Export promise-based pool
module.exports = pool.promise();