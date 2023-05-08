const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const authMiddleware = require("../middleware/authMiddleware")

router.get(("/userInfo/:id"), userController.getUserInfo)

module.exports = router;
