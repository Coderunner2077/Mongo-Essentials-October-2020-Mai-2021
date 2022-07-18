const User = require("../models/user.model");

exports.delete = (req, res) => {
    User.deleteOne({ _id: req.user.id })
        .then(() => {
            req.logout();
            console.log("User deleted");
            res.redirect("/");
        });
}