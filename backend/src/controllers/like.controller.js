const Post = require('../models/post.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');

const queueLikeNotification = async (postOwnerId, senderId, postId, senderName) => {
    try {
        await Notification.create({
            userId: postOwnerId,
            senderId,
            postId,
            type: 'like',
            status: 'pending',
            pushPayload: {
                title: 'Like',
                body: `${senderName} liked your post`,
                data: { type: 'like', postId: postId.toString() },
            },
        });
    } catch (err) {
        console.error('[Like] queueNotification failed:', err.message);
    }
};

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
            return res.status(200).json({ message: "unlike" });
        }

        await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
        res.status(200).json({ message: "like" });

        if (post.userId.toString() === userId) return;

        const liker = await User.findById(userId).select('name');
        queueLikeNotification(post.userId, userId, postId, liker?.name ?? 'Someone');

    } catch (error) {
        res.status(500).json({ error: "Failed to toggle like", details: error.message });
    }
};

module.exports = { toggleLike };