const mongoose = require("mongoose");
const comment = new mongoose.Schema({
    text: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", comment);