const express = require("express");
const router = express.Router();
const { createPost, getPosts, getMyPosts } = require("../controllers/post.controller");
const auth = require("../middleware/auth.middleware");
const { addComment, getComments } = require("../controllers/comment.controller");
const { toggleLike } = require("../controllers/like.controller");

router.post("/", auth, createPost);
router.get("/", auth, getPosts);
router.get("/me", auth, getMyPosts);
router.post("/:postId/like", auth, toggleLike);
router.post("/:postId/comments", auth, addComment);
router.get("/:postId/comments", auth, getComments);

module.exports = router;