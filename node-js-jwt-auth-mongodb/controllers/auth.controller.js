const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });    

    user.save()
        .then(() => {
            if(req.body.roles) {
                let roles = typeof req.body.roles === 'string' ? req.body.roles.split(' ') :
                    req.body.roles;
                Role.find({
                    name: { $in: roles }
                })
                .then(roles => {
                    user.roles = roles.map(role => role._id);
                    user.save()
                        .then(() => res.status(201).json({ message: "User successfully registered!" }))
                        .catch(err => res.status(500).json({ message: err }));
                })
                .catch(err => res.status(500).json(err));
            } else {
                Role.findOne({ name: 'user' })
                    .then(role => {
                        user.roles = [role._id];
                        user.save()
                            .then(() => res.status(201).json({ message: "User successfully registered!" }))
                            .catch(err => res.status(500).json({ message: err }));
                    })
                    .catch(err => res.status(500).json({ message: err }));
            }
        })
        .catch(err => res.status(500).json({ message: err }));
}

exports.signin = (req, res) => {
    User.findOne({ username: req.body.username })
        .populate("roles", "-__v")
        .then(user => {
            if(!user)
                return res.status(404).send({ message: 'User not found!'});

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if(!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Incorrect password!"
                });
            }

            const token = jwt.sign(
                { id: user._id },
                config.secret,
                { expiresIn: 86400 }
            );

            const authorities = user.roles.map(role => 
                `ROLE_${role.name.toUpperCase()}`    
            );

            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token
            })

        })
        .catch(err => res.status(500).send({ message: err }));
}