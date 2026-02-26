const Post = require('../models/post.model');

const toggleLike = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
            res.status(200).json({ message: "unlike" });
        } else {
            await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
            res.status(200).json({ message: "like" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to toggle like", details: error.message })
    }
}

module.exports = { toggleLike };