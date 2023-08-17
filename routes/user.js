const express = require('express');
const {login, register, updateProfile} = require("../controllers/UserController");
const {auth} = require("../middlewares/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/profile", auth, updateProfile);

module.exports = router;