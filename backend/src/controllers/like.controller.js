const Post = require('../models/post.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');
const { sendPushNotification } = require('../utils/notification.util');

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

        const [liker, postOwner] = await Promise.all([
            User.findById(userId).select('name'),
            User.findById(post.userId).select('fcmTokens'),
        ]);

        if (!postOwner?.fcmTokens?.length) return;

        await Notification.create({
            userId: post.userId,
            senderId: userId,
            postId,
            type: 'like',
        });

        const { failedTokens } = await sendPushNotification(
            postOwner.fcmTokens,
            'Like',
            `${liker?.name ?? 'Mr. X'} liked your post`,
            { type: 'like', postId: postId.toString() }
        );

        if (failedTokens.length > 0) {
            await User.findByIdAndUpdate(post.userId, {
                $pullAll: { fcmTokens: failedTokens },
            });
        }

    } catch (error) {
        res.status(500).json({ error: "Failed to toggle like", details: error.message });
    }
};

module.exports = { toggleLike };