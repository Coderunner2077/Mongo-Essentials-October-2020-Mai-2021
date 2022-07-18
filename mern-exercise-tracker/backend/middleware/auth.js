const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        if (req.userId && req.userId !== userId)
            throw 'Invalid user ID';
        else
            next();
    } catch (error) {
        res.status(401).json({ error: error || new Error('Invalid request!')});
    }
};