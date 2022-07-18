const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
const User = require("../models/user.model");

passport.serializeUser((user, done) => { // 13. ...to this one that is subsequently called
    done(null, user.id); // 14. here we are attaching the user id to a cookie
});

passport.deserializeUser((id, done) => { // 15. this is to deserialize currentUser with the id sent by the cookie
    User.findById(id)
        .then(user => {
            if(user)
                done(null, user); // 16. Current User retrieved from database and subsequently attached to the request
            else
                done(null, false, { message: "No such user found!" });
        })
        .catch(err => done(err));
});

// 2. went to www.console.developers.google.com, activated Google+ API, created a project and these IDs
passport.use(new GoogleStrategy({
    callbackURL: "/auth/google/redirect",
    clientID: keys.google.clientID, // 3. keeping these secret (added keys.js to .gitignore)
    clientSecret: keys.google.clientSecret
}, (accessToken, refreshToken, profile, done) => { // 4. Warning: this callback is 2nd parameter of new GoogleStrategy (not of passport.use())
        // 1. passport callback fx
        // 5. accessToken: allows to alter user's Google profile
        // 6. refresh token: refreshes the accessToken which expires after a certain amount of time
        // 7. profile: the information passport comes back with when it takes back that code to google (the code initially sent in url query)
        // 8. done: function we call when we are done with this callback fx
        // console.log("passport callback function fired"); // 9. 
        // console.log(profile); // 10.
        /* // 11
        new User({
            username: profile.displayName,
            googleId: profile.id
        }).save().then(user => {
            console.log("new user is created: " + user);
        });
        */ 
        User.findOne({ googleId: profile.id })
            .then(currentUser => {
                if(currentUser) {
                    console.log("User exists: " + currentUser);
                    done(null, currentUser); // 12. this fx call passes currentUser to...
                }
                else {
                    new User({
                        username: profile.displayName,
                        googleId: profile.id,
                        thumbnail: profile._json.picture
                    }).save().then(newUser => {
                        console.log("new user is created: " + newUser);
                        done(null, newUser); // 17. forgot to add this and the page kept loading...
                    });
                }  
            });
    })
); 

module.exports = passport;