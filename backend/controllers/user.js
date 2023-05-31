const User = require("../models/User")
const identicon = require("identicon")
const cloudinary = require("../config/cloudinary")
const jwt = require("jsonwebtoken")

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' })
}
// POST - LOGIN
const loginUser = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.login(username, password)

        const token = createToken(user._id)

        res.status(200).json({ username, token, id: user._id, avatar: user.avatar })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// POST - SIGNUP
const signupUser = async (req, res) => {
    const { username, password } = req.body

    try {
        if (!username || !password) {
            throw Error('Username and password cannot be empty.')
        }
        //Generate & store randomized user avatar
        const buffer = identicon.generateSync({ id: req.body.username, size: 56 })
        const dataUri = `data:image/png;base64,${buffer.toString('base64')}`;
        const avatar = await cloudinary.uploader.upload(dataUri, {
            public_id: `avatars/${req.body.username}`,
            folder: 'avatars',
            overwrite: true,
            resource_type: 'image',
            format: 'webp'
        })

        //Send username, password, and generated avatar to the static method in the User model
        const user = await User.signup(username, password, avatar.secure_url)

        //create token
        const token = createToken(user._id)

        res.status(200).json({ user, token })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.json(user || null);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving user info from database');
    }
}

module.exports = { signupUser, loginUser, getUserInfo }