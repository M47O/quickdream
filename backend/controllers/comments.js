const Comment = require("../models/Comment");

const createComment = async (req, res) => {
    try {
        const comment = await Comment.create({
            message: req.body.message,
            author: req.user._id,
            post: req.body.post
        })
        const populatedResponse = await comment.populate('author', ['username', 'avatar'])

        return res.json(populatedResponse)
    } catch (err) {
        console.log(err)
    }
}

const deleteComment = async (req, res) => {
    try {
        await Comment.deleteOne({ _id: req.body.id })
        res.status(202).send('Comment deleted successfully')
    } catch (err) {
        console.log(err)
    }
}

const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.id }).populate('author', ['username', 'avatar']).sort({ createdAt: -1 });
        res.json(comments);
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