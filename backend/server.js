const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('./db');
const AppError = require('./utils/AppError');
const asyncHandler = require('./utils/asyncHandler');
const errorHandler = require('./middleware/errorHandler');
const { protect } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ========== API ENDPOINTS ==========

// 1. POST /register - User Registration
app.post('/register', asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Sanitize
    const cleanName = name ? name.trim() : '';
    const cleanEmail = email ? email.trim() : '';
    const cleanPassword = password ? password.trim() : '';

    // Validate
    if (!cleanName || !cleanEmail || !cleanPassword) {
        throw new AppError('Name, email, and password are required', 400);
    }

    // Check if user exists
    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    const [existing] = await db.query(checkQuery, [cleanEmail]);

    if (existing.length > 0) {
        throw new AppError('Email is already registered', 409);
    }

    // Create user
    const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    console.log(`Registering user: ${cleanEmail}`);
    const [result] = await db.query(insertQuery, [cleanName, cleanEmail, cleanPassword]);
    const userId = result.insertId;

    // Auto-login (generate token)
    const token = jwt.sign({ id: userId, email: cleanEmail }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
            id: userId,
            name: cleanName,
            email: cleanEmail
        }
    });
}));

// 2. POST /login - User Login
app.post('/login', asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Sanitize input
    const cleanEmail = email ? email.trim() : '';
    const cleanPassword = password ? password.trim() : '';

    // Validate input
    if (!cleanEmail || !cleanPassword) {
        throw new AppError('Email and password are required', 400);
    }

    // Check user credentials
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    console.log(`Login attempt for: '${cleanEmail}'`); // DEBUG
    const [results] = await db.query(query, [cleanEmail, cleanPassword]);

    if (results.length === 0) {
        throw new AppError('Invalid email or password', 401);
    }

    const user = results[0];

    // Generate Token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
}));

// Apply protection to all task routes
app.use('/tasks', protect);

// 2. GET /tasks - Get all tasks for a user
app.get('/tasks', asyncHandler(async (req, res, next) => {
    const userId = req.user.id; // From token
    const status = req.query.status;

    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [userId];

    if (status && status !== 'All') {
        query += ' AND status = ?';
        params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const [results] = await db.query(query, params);

    res.json({
        success: true,
        tasks: results
    });
}));

// 3. POST /tasks - Create a new task
app.post('/tasks', asyncHandler(async (req, res, next) => {
    const { title, description, status, due_date } = req.body;
    const user_id = req.user.id; // From token

    // Validate input
    if (!title) {
        throw new AppError('Title is required', 400);
    }

    const query = 'INSERT INTO tasks (user_id, title, description, status, due_date) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [user_id, title, description, status || 'Pending', due_date]);

    res.status(201).json({
        success: true,
        message: 'Task created successfully',
        taskId: result.insertId
    });
}));

// 4. PUT /tasks/:id - Update a task
app.put('/tasks/:id', asyncHandler(async (req, res, next) => {
    const taskId = req.params.id;
    // Ensure user owns the task can be added here, but for now assuming ID matches or we just check existence
    // Ideally: CHECK ownership: SELECT * FROM tasks WHERE id = ? AND user_id = ?

    const { title, description, status, due_date } = req.body;

    const query = 'UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE id = ?';
    const [result] = await db.query(query, [title, description, status, due_date, taskId]);

    if (result.affectedRows === 0) {
        throw new AppError('Task not found', 404);
    }

    res.json({
        success: true,
        message: 'Task updated successfully'
    });
}));

// 5. DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', asyncHandler(async (req, res, next) => {
    const taskId = req.params.id;

    const query = 'DELETE FROM tasks WHERE id = ?';
    const [result] = await db.query(query, [taskId]);

    if (result.affectedRows === 0) {
        throw new AppError('Task not found', 404);
    }

    res.json({
        success: true,
        message: 'Task deleted successfully'
    });
}));

// 404 Handler
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
