const express = require("express");
const authRoutes = require("./routes/auth-routes");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const passport = require("passport");
const profileRoutes = require("./routes/profile-routes");

mongoose.Promise = global.Promise;

const app = express();

mongoose.connect(keys.mongodb.dbURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB connection successfully established");
});

app.use(cookieSession({  // 1. initializing cookie session with the options to use for our cookie
    maxAge: 24 * 60 * 60 * 1000, 
    keys: [keys.session.cookieKey] // 2. key to encrypt our user id
})); 

// 3. initilize passport
app.use(passport.initialize()); // 4. middleware initializing passport
app.use(passport.session()); // 5. using session cookies to control our loggin in 

app.set("view engine", "ejs");

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req, res) => {
    console.log("req.user: " + req.user);
    res.render("home", { user: req.user });
});

app.listen(3000, () => {
    console.log("app now listening on port 3000");
})