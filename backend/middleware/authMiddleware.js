const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // We'll attach the user generic info to the request. 
        // If you need full user from DB, you'd query here. 
        // For now, minimizing DB hits if token has enough info.
        req.user = decoded;
        next();
    } catch (err) {
        return next(new AppError('Invalid token or token has expired', 401));
    }
});

module.exports = { protect };
