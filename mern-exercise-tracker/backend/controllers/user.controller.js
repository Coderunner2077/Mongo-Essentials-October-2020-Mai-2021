const db = require('../models');
//const { deleteMany } = require('../models/user.model');
const User = db.user;

exports.getUsers = (req, res) => {
    User.find()
        .populate("roles", "-__v")
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json({ message: error}));
};

exports.getUser = (req, res) => {
    User.findById(req.params.id)
        .populate("roles", "-__v")
        .then(user => {
            if(!user)
                return res.status(404).json({ message: "User not found!"});
            user = user.toObject();
            user.id = user._id;
            user.roles = user.roles.map(role => role.name);
            
            return res.status(200).json(user);
        })
        .catch(err => res.status(500).json({ message: err}));
}

exports.allAccess = (req, res) => {
    res.status(200).send("Public content");
}

exports.userBoard = (req, res) => {
    res.status(200).send("User content");
}

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator content");
}

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin content");
}