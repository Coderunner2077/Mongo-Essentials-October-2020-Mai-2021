const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./user");


mongoose.Promise = global.Promise;

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully!");
});

const app = express();

app.use(bodyParser.urlencoded({ expanded: false }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUnitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

/*
// if I was using passport-local and not passport-local-mongoose:
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username }, function(err, user) {
            if(err)
                return done(err);
            if(!user)
                return done(null, false, { message: "No such user found" });
            if(!user.verifyPassword(password))
                return done(null, false, { message: "Password incorrect" });
            return done(null, user);
        });
    }
))
*/

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "static/index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "static/login.html"));
});

app.get("/secret", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    console.log("req.session.passport", req.session.passport);
    res.sendFile(path.join(__dirname, "static/secret-page.html"));
});

app.get("/dashboard", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    console.log("req.user", req.user);
    res.send(
        `Hello ${req.user.username}. Your session ID is ${req.sessionID}
        and your session expires in ${req.session.cookie.maxAge / 1000 } seconds.<br /><br />
        <a href="/logout">Log Out</a><br /><br />
        <a href="/secret">Members Only</a>
        `
    );
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});

app.post("/login", passport.authenticate("local", { failureRedirect: "/login"}), (req, res) => {
    console.log("login req.user", req.user);
    res.redirect("/dashboard");
});

const normalizePort = val => {
    let port = parseInt(val, 10);
    if(isNaN(port))
        return val;
    if(port >= 0)
        return port;
    return false;
}

const port = normalizePort(process.env.PORT || 4000);

app.listen(port, () => {
    console.log("This app is listening on port "+ port);
});

