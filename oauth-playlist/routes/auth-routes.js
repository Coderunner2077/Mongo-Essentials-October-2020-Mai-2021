const router = require("express").Router();
const passport = require("passport");

// 1. auth login
router.get("/login", (req, res) => {
    res.render("login", { user: req.user });
});

router.get("/logout", (req, res) => {
    // 2. handle with passport
    // res.send("logging out"); // 9.
    req.logout();
    res.redirect("/");
});

router.get("/google", passport.authenticate("google", {
    scope: ["profile"] // 0. in scope option I write what I want to retrieve from the Google user data
}));

// 3. callback route for google to redirect to
// 4. passport middleware here uses the code sent by google in url query and retrieve user profile thanks to it
// 5. then before (req, res) => {} gets called, the passport callback function is fired
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    // res.send("You reached the callback URI"); // 6.
    // res.send(req.user); // 7. now we are logged in and user is saved in the request thanks to passport // 8.
    res.redirect("/profile");
});

module.exports = router;