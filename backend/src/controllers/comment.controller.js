const Post = require('../models/post.model');
const Comment = require('../models/comments.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');
const { sendPushNotification } = require('../utils/notification.util');

const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.postId;
        const userId = req.user.id;

        if (!text || !text.trim()) {
            return res.status(400).json({ error: "Comment text is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const newComment = new Comment({ postId, userId, text });
        const savedComment = await newComment.save();
        await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
        res.status(201).json(savedComment);

        if (post.userId.toString() === userId) return;

        const [commenter, postOwner] = await Promise.all([
            User.findById(userId).select('name'),
            User.findById(post.userId).select('fcmTokens'),
        ]);

        if (!postOwner?.fcmTokens?.length) return;

        await Notification.create({
            userId: post.userId,
            senderId: userId,
            postId,
            type: 'comment',
        });

        const { failedTokens } = await sendPushNotification(
            postOwner.fcmTokens,
            'Comment',
            `${commenter?.name ?? 'Mr. X'} commented on your post`,
            { type: 'comment', postId: postId.toString() }
        );

        if (failedTokens.length > 0) {
            await User.findByIdAndUpdate(post.userId, {
                $pullAll: { fcmTokens: failedTokens },
            });
        }

    } catch (error) {
        res.status(500).json({ error: "Failed to add comment", details: error.message });
    }
};

const getComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({ postId }).populate('userId', 'name').sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: "Failed to get comments", details: error.message })
    }
}

module.exports = { addComment, getComments };