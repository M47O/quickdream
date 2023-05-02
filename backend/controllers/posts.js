const Post = require("../models/Post");
// const Comment = require("../models/Comment");
const User = require("../models/User")
const openai = require("../config/openai")
const cloudinary = require("../config/cloudinary")


module.exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        // const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: "desc"})
        res.json(post)
    } catch (err) {
        console.log(err)
    }
}

module.exports.createPost = async (req, res) => {
    try {
        const response = await openai.createImage({
            prompt: req.body.prompt,
            n: 1,
            size: '512x512'
        })

        const generatedImage = await response.data.data[0].url
        console.log(generatedImage)

        const result = await cloudinary.uploader.upload(generatedImage, {
            public_id: `posts/${req.user.username}/${req.body.title}`,
            folder: 'posts',
            overwrite: true,
            resource_type: 'image',
            format: 'webp'
        })

        const post = await Post.create({
            title: req.body.title,
            prompt: req.body.caption,
            image: result.secure_url,
            cloudinaryId: result.public_id,
            caption: req.body.caption,
            likes: 0,
            author: req.user._id
        })
        return res.json(post)

    } catch (err) {
        console.log(err)
    }
}

// module.exports.deletePost = async (req, res) => {
//     try {
//         let post = await Post.findById({ _id: req.params.id })
//         //Delete from cloudinary
//         await cloudinary.uploader.destroy(post.cloudinaryId)
//         //Delete from db
//         await Post.remove({ _id: req.params.id })
//         console.log("Deleted post")
//     } catch (err) {
//         console.log(err)
//     }
// }
