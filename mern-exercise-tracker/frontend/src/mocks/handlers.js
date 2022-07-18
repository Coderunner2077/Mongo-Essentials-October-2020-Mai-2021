import { rest } from 'msw';

export const baseUrl = "http://localhost:5000/api";

export const handlers = [
    rest.get(`${baseUrl}/home`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json("Welcome to Exercise Tracker Application!")
        );
    }),

    rest.post(`${baseUrl}/auth/signin`, (req, res, ctx) => {
        let auth = {
            id: `${req.body.username}_id`, username: req.body.username, email: `${req.body.username}@mail.com`,
            accessToken: `${req.body.username}_token`, signedAt: Date.now(), 
            expiresIn: 86400
        };
        switch(req.body.username) {
            case "test_user":
                auth.roles = ["ROLE_USER"]
                break;
            case "test_mod":
                auth.roles = ["ROLE_USER", "ROLE_MODERATOR"]
                break;
            case "test_admin":
                auth.roles = ["ROLE_USER", "ROLE_ADMIN", "ROLE_MODERATOR"]
                break;
            default:
                auth.roles = ["ROLE_USER"]
        }
        return res(
            ctx.status(200),
            ctx.json(auth)
        );
    }),

    rest.get(`${baseUrl}/test/user/:id`, (req, res, ctx) => {
        let username = req.params.id.substring(0, req.params.id.indexOf("_id"));
        let user = {
            id: `${req.params.id}`, username, email: `${username}@mail.com`,
        };
        switch(username) {
            case "test_user":
                user.roles = ["user"]
                break;
            case "test_mod":
                user.roles = ["user", "moderator"]
                break;
            case "test_admin":
                user.roles = ["user", "admin", "moderator"]
                break;
            default:
                user.roles = ["user"]
        }
        
        return res(
            ctx.status(200),
            ctx.json(user)
        );
    }),

    rest.put(`${baseUrl}/auth/update/:id`, (req, res, ctx) => {
        const user = {
            id: req.params.id, username: "test_user", email: "test_user@mail.com",
                password: "user_password", roles: ["user"]
        };
        
        req.userId = req.body.password === "admin_password" ? "test_admin_id" : "test_user_id";


        let passwordValid = false;
        let isOwner = req.userId === req.params.id;
       
        if(req.userId !== "test_admin_id" && isOwner)
            passwordValid = req.body.password == user.password;
        else {
            const adminPass = "admin_password";
            passwordValid = req.body.password === adminPass;
        }

        if(!passwordValid)
            return res(ctx.status(401), ctx.json({ message: "Incorrect password!"}));

        const updates = {};
        if(isOwner) {
            if(req.body.username && user.username !== req.body.username)
                updates.username = req.body.username;
            if(req.body.email && user.email !== req.body.email)
                updates.email = req.body.email;
            if(req.body.newPassword) {
                const samePassword = req.body.newPassword === user.password;
                if(!samePassword)
                    updates.password = "hashed_" + req.body.newPassword;
            }
        }
       
        if(!isOwner && req.body.roles) {
            const roles = req.body.roles.map(name => { return { id: name + "_id", name }});
                if(roles)
                    updates.roles = roles;
        }

        if(Object.keys(updates).length === 0)
            return res(ctx.status(400), ctx.json({ message: "No changes to update!"}));
        
        // database call to update here
        delete updates.password;
                    
        if(updates.roles)
            updates.roles = updates.roles.map(role => `ROLE_${role.name.toUpperCase()}`);
        if(updates.username) {
            // we change corresponding Exercise usernames
        } 
        return res(
            ctx.status(200),
            ctx.json({ updates, message: "User updated!"})
        );
    }),

    rest.post(`${baseUrl}/exercises/add`, (req, res, ctx) => {
        let date = req.body.username && req.body.description && req.body.duration && req.body.date;
        
        if(typeof date === "string")
            return res(
                ctx.status(200),
                ctx.json({ message: "New Exercise added successfully!", id: "exercise_id" })
            );
        return res(
            ctx.status(400),
            ctx.json({ message: "Frontend Error! Something wrong with the request"})
        );
    }),

    rest.put(`${baseUrl}/exercises/update/:id`, (req, res, ctx) => {
        let date = req.body.description && req.body.duration && req.body.date;
       
        if(typeof date === "number") {
            return res(
                ctx.status(200),
                ctx.json({ message: "Exercise updated!" })
            );
        }
        return res(
            ctx.status(400),
            ctx.json({ message: "Frontend Error! Something wrong with the request"})
        );
    }),

    rest.get(`${baseUrl}/exercises/:id`, (req, res, ctx) => {
        let date = new Date();
        return res(ctx.status(200),
            ctx.json({ id: req.params.id, username: "test_user", user: "test_user_id", 
                description: "This is a test description", date: date.toString(), duration: 30 
            })
        )
    }),

    rest.get("*", (req, res, ctx) => {
        console.error("Error: An unhandled request sent the url " + req.url.toString());
        return res(
            ctx.status(500),
            ctx.json({ message: "Ops! Something went wrong..." })
        );
    })
];