const db = require('../models');
const User = db.user;
const ROLES = db.ROLES;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            if(user)
                return res.status(400).json({ message: "Failed! Username already in use!"});

            User.findOne({ email: req.body.email })
                .then(user => {
                    if(user)
                        return res.status(400).json({ message: "Failed! Email already in use!"});

                    
                    next();
                })
                .catch(err => res.status(500).json({ message: err }));
        })
        .catch(err => res.status(500).json({ message: err }));
};

const checkRolesExist = (req, res, next) => {
    const roles = req.body.roles;
    for(let role of roles)
        if(!ROLES.includes(`ROLE_${role.toUpperCase()}`)){
            res.status(400).json({ message: `Failed! Role ${role} doesn't exist!`});
            return;
        }

    next();
};

module.exports = {
    checkDuplicateUsernameOrEmail,
    checkRolesExist
};