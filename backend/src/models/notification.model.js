const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    type: { type: String, enum: ['like', 'comment'], required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },

    status: {
        type: String,
        enum: ['pending', 'processing', 'sent', 'failed'],
        default: 'pending',
        index: true,
    },
    failReason: { type: String, default: null },

    pushPayload: {
        title: String,
        body: String,
        data: { type: Map, of: String },
    },
});

module.exports = mongoose.model('Notification', notificationSchema);
