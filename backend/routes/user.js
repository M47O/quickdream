const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const authMiddleware = require("../middleware/authMiddleware")

router.get("/myPosts", authMiddleware, postsController.getMyPosts)
router.get("/user/:id", postsController.getPostsByUserId)
router.post("/create", authMiddleware, postsController.createPost)
// router.put("post/like", postsController.likePost)
router.delete("/delete", authMiddleware, postsController.deletePost)
module.exports = router;
