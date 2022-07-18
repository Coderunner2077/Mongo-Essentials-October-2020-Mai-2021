const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.user = require('./user.model');
db.role = require('./role.model');
db.exercise = require('./exercise.model');
db.ROLES = ['ROLE_USER', 'ROLE_MODERATOR', 'ROLE_ADMIN'];
const Role = db.role;

db.initial = () => {
    Role.estimatedDocumentCount((error, count) => {
        if(!error && count === 0) {
            new Role({ name: "user"}).save()
                .then(() => console.log("added 'user' to roles collection"))
                .catch(err => console.log("error", err));
            new Role({ name: "moderator"}).save()
                .then(() => console.log("added 'moderator' to roles collection"))
                .catch(err => console.log("error", err));
            new Role({ name: "admin"}).save()
                .then(() => console.log("added 'admin' to roles collection"))
                .catch(err => console.log("error", err));
        }
    });
}

module.exports = db;