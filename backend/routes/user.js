const express = require("express");
const router = express.Router();
const { loginUser, signupUser, getUserInfo } = require("../controllers/user");
const authMiddleware = require("../middleware/authMiddleware")

router.post('/login', loginUser)
router.post('/signup', signupUser)

router.get(("/userInfo/:id"), getUserInfo)
module.exports = router;
