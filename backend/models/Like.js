const mongoose = require("mongoose");
const like = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Like", like);