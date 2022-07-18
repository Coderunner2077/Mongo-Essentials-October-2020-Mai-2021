const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const db = require("../models");
const User = db.user;
const Role = db.role;
const Exercise = db.exercise;

exports.signup = (req, res) => {
    const user = new User({ username: req.body.username, email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8) });
    
    if(req.body.roles && req.body.roles.length > 0) {
        Role.find({ name: { $in: req.body.roles }})
            .then(roles => {
                user.roles = roles.map(role => role.id);
                user.save()
                    .then(() => res.status(201).json({ message: "New User registered!"}))
                    .catch(err => res.status(400).json({ message: err }));           
            })
            .catch(err => res.status(500).json({ message: err }));
    } else {
        Role.findOne({ name: "user" })
            .then(role => {
                user.roles = [role.id];
                user.save()
                .then(() => res.status(201).json({ message: "New User registered!"}))
                .catch(err => res.status(400).json({ message: err }));
            })
            .catch(err => res.status(500).json({ message: err }));
    }
};

exports.signin = (req, res) => {
    User.findOne({ username: req.body.username })
        .select("+password")
        .populate("roles", "-__v")
        .then(user => {
            if(!user)
                return res.status(401).json({ message: "Incorrect username!" });

            const passwordValid = bcrypt.compareSync(req.body.password, user.password);
            if(!passwordValid) 
                return res.status(401).json({ 
                    accessToken: null,
                    message: "Incorrect password!"
                });
            const expiresIn = 86400;
            const roles = user.roles.map(role => `ROLE_${role.name.toUpperCase()}`);
            const accessToken = jwt.sign({ userId: user.id}, authConfig.secret,
                { expiresIn });

            res.status(200).json({
                id: user.id, username: user.username, email: user.email,
                roles, accessToken, signedAt: Date.now(), expiresIn
            });
        })
        .catch(err => res.status(500).json({ message: err }));
}

const sameArrays = (array1, array2) => {
    let isSame = true;
    array1.forEach(value => {
        if(!array2.includes(value)) {
            isSame = false;
        }
           
    });
    for(let value of array2)
        if(!array1.includes(value)) {
            isSame = false;
            break;
        }
           
    return isSame;
}

exports.update = async (req, res) => {
    User.findById(req.params.id)
        .select("+password")
        .then(async user => {
            if(!user)
                return res.status(404).json({ message: 'User ID not found!'});

            let passwordValid = false;
            let isOwner = req.userId === req.params.id;
            
            if(isOwner)
                passwordValid = bcrypt.compareSync(req.body.password, user.password);
            else {
                try {
                    const admin = await User.findById(req.userId).select("+password");
                    passwordValid = bcrypt.compareSync(req.body.password, admin.password);
                } catch (err) {
                    return res.status(500).json({ message: err });
                }
            }
           
            if(!passwordValid)
                return res.status(401).json({ message: "Password incorrect!"});

            const updates = {};
            if(isOwner) {
                if(req.body.username && user.username !== req.body.username)
                    updates.username = req.body.username;
                if(req.body.email && user.email !== req.body.email)
                    updates.email = req.body.email;
                if(req.body.newPassword) {
                    const samePassword = bcrypt.compareSync(req.body.newPassword, user.password);
                    if(!samePassword)
                        updates.password = bcrypt.hashSync(req.body.newPassword);
                }
            }
           
            try {
                if(!isOwner && req.body.roles) {
                    const roles = await Role.find({ name: { $in: req.body.roles }}); 
                    if(!sameArrays(roles.map(role => role._id.toString()), user.roles.map(id => id.toString())))
                        updates.roles = roles;      
                }
            } catch(err) {
                return res.status(500).json({ message: err });
            }

            if(Object.keys(updates).length === 0)
                return res.status(400).json({ message: "No changes to update!"})
           
            User.updateOne({ _id: user.id }, updates)
                .then(() => {
                    delete updates.password;
                    
                    if(updates.roles)
                        updates.roles = updates.roles.map(role => `ROLE_${role.name.toUpperCase()}`);
                    if(updates.username) {
                        Exercise.updateMany({ user: user.id}, { username: user.username })
                            .then(() => res.status(200).json({ 
                                updates, message: 'User updated!'
                            }))
                            .catch(err => res.status(500).json({ message: error}))
                    } else {
                        return res.status(200).json({ updates, message: 'User updated!'});
                    }
                        
                })
                .catch(error => res.status(400).json({ message: error }));

        })
        .catch(error => res.status(500).json({ message: error}));
};

exports.delete = (req, res) => {
    User.deleteOne({ _id: req.params.id })
        .then(() => res.status(204).send())
        .catch(error => res.status(400).json({ message: error }));
}