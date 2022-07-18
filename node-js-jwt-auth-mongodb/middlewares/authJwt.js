const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const Role = db.role;
const User = db.user;

const verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if(!token) 
        return res.status(403).send({ message: "No token provided!"});

    jwt.verify(token, config.secret, (err, decoded) => {
        if(err)
            return res.status(401).send({ message: "Unauthorized!" });

        req.userId = decoded.id;
        next();
    });
};

const isAdmin = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            Role.findOne({ name: 'admin' })
            .then(role => {
                if(!user.roles.includes(role._id))
                    return res.status(403).send({ message: "Requires Admin privilege" });
                next();
            })
            .catch(err => res.status(500).send({ message: err}));
        })
        .catch(err => res.status(500).send({ message: err }));
};

const isModerator = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            Role.find(
                { _id: { $in: user.roles } },
                (err, roles) => {
                    if(err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    for(let i = 0; i < roles.length; i++) {
                        if(roles[i].name === 'moderator') {
                            next();
                            return;
                        }
                    }

                    res.status(403).send({ message: 'Requires Moderator Role!' });
                    return;
                }
            )
        })
        .catch(err => res.status(500).send({ message: err }));
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
};

module.exports = authJwt;
