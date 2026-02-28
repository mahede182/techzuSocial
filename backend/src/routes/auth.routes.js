const express = require("express");
const { register, login, getMe, saveToken, removeToken } = require("../controllers/auth.controller");
const auth = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);

router.put("/token", auth, saveToken);
router.delete("/token", auth, removeToken);

module.exports = router;