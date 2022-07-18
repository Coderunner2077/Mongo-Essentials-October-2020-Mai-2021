const { exercise } = require('../models');
const db = require('../models');
const Exercise = db.exercise;
const User = db.user;

const isOwner = (req, res, next) => {
    Exercise.findById(req.params.id)
        .then(exercise => {
            if(!exercise)
                return res.status(404).send("Exercise not found!");

            if(req.userId !== exercise.user)
                return res.status(403).json({ message: "This exercise is not yours to tamper with"});

            next();
        })
        .catch(err => res.status(500).json({ message: err}));
}

const isOwnerOrMod = (req, res, next) => {
    Exercise.findById(req.params.id)
        .then(exericse => {
            if(!exercise)
                return res.status(404).send("Exercise not found!");

            if(req.userId !== exercise.user) {
                User.findById(req.userId)
                    .populate('roles', '-__v')
                    .then(user => {
                        for(let role of user.roles)
                            if(role.name === "moderator"){
                                next();
                                return;
                            }
                        res.status(403).json({ message: "Unauthorized!" });
                    })
                    .catch(err => res.status(500).json({ message: err }));
            } else
                next();
        })
}

module.exports = {
    isOwner, isOwnerOrMod
};