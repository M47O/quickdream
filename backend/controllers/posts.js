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

module.exports.getMyPosts = async (req, res) => {
    try {
        const myPosts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 })
        res.json(myPosts)
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

        let public_id = `${req.user.username}/${req.body.title}`
        let idExists;
        try {
            idExists = await cloudinary.api.resource(`posts/${public_id}`);
        } catch (err) {
            idExists = false
        }

        let counter = 2;
        while (idExists) {
            // add suffix and check again
            public_id = `${req.user.username}/${req.body.title}-${counter}`;
            try {
                idExists = await cloudinary.api.resource(`posts/${public_id}`);
            } catch (err) {
                idExists = false
            }
            counter++;
        }


        const result = await cloudinary.uploader.upload(generatedImage, {
            public_id,
            folder: 'posts',
            overwrite: false,
            resource_type: 'image',
            format: 'webp'
        })

        const post = await Post.create({
            title: req.body.title,
            prompt: req.body.prompt,
            image: result.secure_url,
            cloudinaryId: result.public_id,
            likes: 0,
            author: req.user._id
        })
        return res.json(post)

    } catch (err) {
        console.log(err)
    }
}

module.exports.deletePost = async (req, res) => {
    try {
        let post = await Post.findById({ _id: req.body.id })
        //Delete from cloudinary
        await cloudinary.uploader.destroy(post.cloudinaryId)
        //Delete from db
        await Post.remove({ _id: req.body.id })
        console.log("Deleted post")
    } catch (err) {
        console.log(err)
    }
}
