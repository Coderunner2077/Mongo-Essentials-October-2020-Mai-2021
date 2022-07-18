const db = require('../models');
const User = db.user;
const Role = db.role;

const isAdmin = async (userId, res) => {
    try { 
        const user = await User.findById(userId);
        if(!user) return false;
        const role = await Role.findOne({ name: "admin" })
        if(user.roles.includes(role.id))
            return true;
    } catch(err) { return res.status(500).json({ message: err })}

    return false;        
}
const adminAccess = async (req, res, next) => {
    const allowed = await isAdmin(req.userId, res);
    if(!allowed)
        return res.status(403).json({ message: "Requires Admin privilege" });
    next();
    /*
    User.findById(req.userId)
        .then(user => {
            Role.findOne({ name: 'admin'})
                .then(role => {
                    if(!user.roles.includes(role.id))
                        return res.status(403).json({ message: "Requires Admin privilege!"});

                    next();
                })
                .catch(err => res.status(500).json({ message: err }));
        })
        .catch(err => res.status(500).json({ message: err }));
    */
};

const moderatorAccess = (req, res, next) => {
    User.findById(req.userId) 
        .then(user => {
            Role.findOne({ name: 'moderator'})
                .then(role => {
                    if(!user.roles.includes(role.id))
                        return res.status(403).json({ message: "Requires moderator privilege!"});

                    next();
                })
                .catch(err => res.status(500).json({ message: err }));
        })
        .catch(err => res.status(500).json({ message: err }));
};

const verifyUpdateDeleteAccessAdmin = async (req, res, next) => {
    if(req.userId !== req.params.id) {
        const allowed = await isAdmin(req.userId, res);
        if(!allowed) return res.status(403).json({ message: "Requires admin privilege!" });
    }
    next();
};

module.exports = {
    adminAccess, moderatorAccess, verifyUpdateDeleteAccessAdmin
};