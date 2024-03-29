const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const User = new mongoose.Schema({
    username: String,
    password: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("userData", User, "userData");