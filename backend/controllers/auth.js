const passport = require("passport");
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const identicon = require("identicon")
const cloudinary = require("../config/cloudinary")

module.exports.login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error("Error during authentication:", err);
            res.status(500).error({ error: "Internal server error" })
            return next(err);
        }

        if (!user) {
            console.error("User not found");
            return res.status(401).json({ error: "No user exists" });
        }

        req.logIn(user, err => {
            if (err) {
                console.error("Error during login:", err);
                res.status(500).json({ error: "Internal server error" })
                return next(err);
            }
            console.log("Successfully authenticated:", req.user);
            res.json(req.user);
        });
    })(req, res, next);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.json('User logged out');
    })
}

module.exports.register = async (req, res, next) => {
    try {
        const doc = await User.findOne({ username: req.body.username })
        if (doc) {
            res.status(409).json({ error: "User already exists" })
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)

            const buffer = identicon.generateSync({ id: req.body.username, size: 56 })
            const dataUri = `data:image/png;base64,${buffer.toString('base64')}`;
            const avatar = await cloudinary.uploader.upload(dataUri, {
                public_id: `avatars/${req.body.username}`,
                folder: 'avatars',
                overwrite: true,
                resource_type: 'image',
                format: 'webp'
            })

            const newUser = new User({
                username: req.body.username,
                password: hashedPassword,
                avatar: avatar.secure_url
            })
            await newUser.save()
            res.json('User created')
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports.user = (req, res) => {
    if (req.user) {
        res.json(req.user)
    }
}