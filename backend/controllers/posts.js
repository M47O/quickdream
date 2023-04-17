const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
// const Comment = require("../models/Comment");
const User = require("../models/User")

exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        // const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: "desc"})
        res.json(post)
    } catch (err) {
        console.log(err)
    }
}

exports.createPost = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path)

        await Post.create({
            title: req.body.title,
            image: result.secure_url,
            cloudinaryId: result.public_id,
            caption: req.body.caption,
            likes: 0,
            user: req.user.id
        })
    } catch (err) {
        console.log(err)
    }
}

exports.deletePost = async (req, res) => {
    try {
        let post = await Post.findById({ _id: req.params.id })
        //Delete from cloudinary
        await cloudinary.uploader.destroy(post.cloudinaryId)
        //Delete from db
        await Post.remove({ _id: req.params.id })
        console.log("Deleted post")
    } catch (err) {
        console.log(err)
    }
}
