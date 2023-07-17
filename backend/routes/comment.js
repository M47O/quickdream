const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const authMiddleware = require("../middleware/authMiddleware")

router.post("/create", authMiddleware, commentsController.createComment)
router.delete("/delete", authMiddleware, commentsController.deleteComment)
router.delete("/deletePost", authMiddleware, commentsController.deletePostComments)
router.get("/:id", commentsController.getComments)

module.exports = router;