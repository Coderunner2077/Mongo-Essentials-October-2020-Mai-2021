const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({ username: req.body.username })
        .then((user) => {
            if(user)
                return res.status(400).json({ message: "Failed! Username already in use"});

            // Email
            User.findOne({ email: req.body.email })
                .then((user) => {
                    if(user) 
                        return res.status(400).json({ message: "Failed! Email already in use"});
                    
                    next();
                })
                .catch(err => {
                    res.status(500).json({ message: err });
                })
        })
        .catch(err => {
            res.status(500).json({ message: err });
        });
};

const checkRolesExisted = (req, res, next) => {
    let roles = req.body.roles;
    if(roles) {
        if(typeof roles === 'string')
            roles = roles.split(' ');
        for(let i = 0; i < roles.length; i++) {
            if(!ROLES.includes(roles[i])) {
                res.status(400).json({ message: `Failed! Role ${roles[i]} does not exist`});
                return;
            }
        }
    }

    next();
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};

module.exports = verifySignUp;