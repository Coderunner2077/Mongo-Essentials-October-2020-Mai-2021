const router = require("express").Router();
const userCtrl = require("../controllers/user");

const authCheck = (req, res, next) => {
    if(!req.user)
        res.redirect("/auth/login");
    else
        next();    
};

router.get("/", authCheck, (req, res) => {
    // res.send(`Hello ${req.user.username}, this is your profile page`); // 1.
    res.render("profile", { user: req.user });
});

router.get("/delete", authCheck, userCtrl.delete);

module.exports = router;