const mongoose = require("mongoose")
const post = new mongoose.Schema({
    title: String,
    prompt: String,
    image: String,
    cloudinaryId: String,
    likes: Number,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Post", post)