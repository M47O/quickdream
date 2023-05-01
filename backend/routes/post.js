const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts");

router.get("/:id", postsController.getPost)
router.post("/create", postsController.createPost)
// router.put("post/like", postsController.likePost)
// router.delete("/post", postsController.deletePost)

module.exports = router;
