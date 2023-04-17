const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts");

router.get("/post/:id", postsController.getPost)
router.post("/post", postsController.createPost)
router.put("post/like", postsController.likePost)
router.delete("/post", postsController.deletePost)

module.exports = router;
