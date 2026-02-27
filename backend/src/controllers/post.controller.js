const Post = require('../models/post.model');

const createPost = async (req, res) => {
    try {
        const { text } = req.body;

        const userId = req.user.id;

        if (!text || !userId) {
            return res.status(400).json({ error: "Text and userId are required" });
        }

        const newPost = new Post({
            userId,
            text
        })
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.error("Create Post Error:", error);
        res.status(500).json({ error: "Failed to create Post", details: error.message })
    }
}

const getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit

        const posts = await Post.find().populate('userId', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to get Posts" })
    }
}

const getMyPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const userId = req.user.id;

        const posts = await Post.find({ userId }).populate('userId', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to get user posts" });
    }
}

module.exports = { createPost, getPosts, getMyPosts };