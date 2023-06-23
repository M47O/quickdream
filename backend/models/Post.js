const mongoose = require("mongoose")
const post = new mongoose.Schema({
    title: String,
    prompt: String,
    image: String,
    cloudinaryId: String,
    likes: Number,
    likedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    bookmarkedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    authorUsername: {
        type: String,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Post", post)