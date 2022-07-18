const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if(!token)
        return res.status(403).json({ message: "Authentication required"});

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err)
            return res.status(401).json({ message: "Unauthorized! " + err });

        req.userId = decoded.userId;
        next();
    });
}

module.exports = verifyToken;