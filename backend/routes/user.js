const express = require("express");
const router = express.Router();
const { loginUser, signupUser, getUserInfo, followUser, unfollowUser } = require("../controllers/user");
const authMiddleware = require("../middleware/authMiddleware")

router.post('/login', loginUser)
router.post('/signup', signupUser)

router.get(('/userInfo/:id'), getUserInfo)
router.put(('/follow'), followUser)
router.put(('/unfollow'), unfollowUser)

module.exports = router;
