const express = require("express");
const router = express.Router();
const { createPost, getPosts } = require("../controllers/post.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, createPost);
router.get("/", auth, getPosts);

module.exports = router;