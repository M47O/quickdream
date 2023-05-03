const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts");
const authMiddleware = require("../middleware/authMiddleware")

router.get("/myPosts", authMiddleware, postsController.getMyPosts)

router.post("/create", authMiddleware, postsController.createPost)
// router.put("post/like", postsController.likePost)
router.delete("/delete", authMiddleware, postsController.deletePost)
module.exports = router;
