const passport = require("passport");
const User = require('../models/User')
const bcrypt = require('bcryptjs')

exports.login = (req, res, next) => {
    console.log("login endpoint hit")
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error("Error during authentication:", err);
            return res.status(500).json("Internal server error");
        }
        if (!user) {
            console.error("User not found");
            return res.status(401).json("No user exists");
        }
        req.logIn(user, err => {
            if (err) {
                console.error("Error during login:", err);
                return res.status(500).json("Internal server error");
            }
            console.log("Successfully authenticated:", req.user);
            return res.json(req.user);
        });
    })(req, res, next);
}

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.json('User logged out');
    })
}

exports.register = async (req, res, next) => {
    try {
        const doc = await User.findOne({ username: req.body.username })
        if (doc) {
            res.json("User already exists")
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)

            const newUser = new User({
                username: req.body.username,
                password: hashedPassword
            })
            await newUser.save()
            res.json('User created')
        }
    } catch (err) {
        console.log(err)
    }
}

exports.user = (req, res) => {
    if (req.user) {
        res.json(req.user)
    }
}