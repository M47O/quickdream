const mongoose = require("mongoose")
const bcrypt = require("bcrypt")


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true },
    followedUsers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
})

//static SIGNUP method
userSchema.statics.signup = async function (username, password, avatar) {

    //because User is being exported and doesn't necessarily exist yet, refer to the model as this
    const exists = await this.findOne({ username })

    if (exists) {
        throw Error('Username already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ username, password: hash, avatar })

    return user
}

//static LOGIN method
userSchema.statics.login = async function (username, password) {
    if (!username || !password) {
        throw Error('Username and password cannot be empty.')
    }

    const user = await this.findOne({ username })

    if (!user) {
        throw Error("Incorrect username")
    }

    //user.password is the hashed password stored as a property of the user document in the db, password is the plain text password
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error('Incorrect password')
    }

    return user
}

module.exports = mongoose.model("User", userSchema)