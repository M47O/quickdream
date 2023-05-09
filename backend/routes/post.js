const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts");
const authMiddleware = require("../middleware/authMiddleware")

router.get("/user/:id", postsController.getPostsByUserId)
router.get("/superlatives", postsController.getSuperlatives)
router.post("/create", authMiddleware, postsController.createPost)
router.put("/like", postsController.likePost)
router.put("/unlike", postsController.unlikePost)
router.delete("/delete", authMiddleware, postsController.deletePost)
module.exports = router;
