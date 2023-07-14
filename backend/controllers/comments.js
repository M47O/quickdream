const Comment = require("../models/Comment");

const createComment = async (req, res) => {
    try {
        const comment = await Comment.create({
            message: req.body.message,
            author: req.user._id,
            post: req.body.post
        })
        return res.json(post)
    } catch (err) {
        console.log(err)
    }
}

const deleteComment = async (req, res) => {
    try {
        await Comment.deleteOne({ _id: req.body.id })
    } catch (err) {
        console.log(err)
    }
}

const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.id }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving comments from database');
    }
}

module.exports = {
    createComment,
    deleteComment,
    getComments
}