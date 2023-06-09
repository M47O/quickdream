const Post = require("../models/Post");
// const Comment = require("../models/Comment");
const User = require("../models/User")
const openai = require("../config/openai")
const cloudinary = require("../config/cloudinary")


const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
        res.json(posts);
    } catch (err) {
        console.error(err)
        res.status(500).send('Error retrieving posts from database')
    }
}

const likePost = async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.body.id })

        console.log('Id: ', req.body.id)
        console.log('Liker: ', req.body.liker)

        if (!post.likedBy.includes(req.body.liker)) {
            await Post.findOneAndUpdate(
                { _id: req.body.id },
                {
                    $push: { likedBy: req.body.liker },
                    $inc: { likes: 1 }
                },
            )
        }
        res.send("Successfully liked post")
    } catch (err) {
        console.log("Error liking post: ", err)
    }
}

const unlikePost = async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.body.id })

        if (post.likedBy.includes(req.body.liker)) {
            await Post.findOneAndUpdate(
                { _id: req.body.id },
                {
                    $pull: { likedBy: req.body.liker },
                    $inc: { likes: -1 }
                },
            )
        }
        res.send("Successfully unliked post")
    } catch (err) {
        console.log("Error unliking post: ", err)
    }
}

const getPostsByUserId = async (req, res) => {
    try {
        const posts = await Post.find({ authorId: req.params.id }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving posts from database');
    }
}

const getSuperlatives = async (req, res) => {
    try {
        const mostLikedPosts = await Post.find().sort({ likes: -1 }).limit(3)
        const mostRecentPosts = await Post.find().sort({ createdAt: -1 }).limit(3)
        res.json({ mostLikedPosts, mostRecentPosts })
    } catch (err) {
        console.error(err)
        res.status(500).send('Error retrieving superlative posts from database')
    }
}

const createPost = async (req, res) => {
    try {
        const response = await openai.createImage({
            prompt: req.body.prompt,
            n: 1,
            size: '512x512'
        })

        const generatedImage = await response.data.data[0].url
        console.log(generatedImage)

        let public_id = `${req.body.username}/${req.body.title}`
        let idExists;
        try {
            idExists = await cloudinary.api.resource(`posts/${public_id}`);
        } catch (err) {
            idExists = false
        }

        let counter = 2;
        while (idExists) {
            // add suffix and check again
            public_id = `${req.body.username}/${req.body.title}-${counter}`;
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
            authorId: req.user._id,
            authorUsername: req.body.username
        })
        console.log(req.user)
        return res.json(post)

    } catch (err) {
        console.log(err)
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.body.id })
        //Delete from cloudinary
        await cloudinary.uploader.destroy(post.cloudinaryId)
        //Delete from db
        await Post.deleteOne({ _id: req.body.id })
        console.log("Deleted post")
    } catch (err) {
        console.log(err)
    }
}

module.exports = { getAllPosts, likePost, unlikePost, getPostsByUserId, getSuperlatives, createPost, deletePost }