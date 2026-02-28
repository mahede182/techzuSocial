const { messaging } = require('../config/firebase');
const User = require('../models/user.model');

const STALE_CODES = new Set([
    'messaging/registration-token-not-registered',
    'messaging/invalid-registration-token',
    'messaging/mismatched-credential',
]);


const sendPushNotification = async (userId, title, body, data = {}) => {
    const user = await User.findById(userId).select('fcmTokens');
    const tokens = (user?.fcmTokens ?? []).filter(Boolean);

    if (!tokens.length) {
        console.log(`[FCM] user ${userId} has no tokens — skipping`);
        return { sent: 0, failedTokens: [] };
    }

    const stringData = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
    );

    try {
        const response = await messaging.sendEachForMulticast({
            tokens,
            notification: { title, body },
            data: stringData,
            android: {
                priority: 'high',
                notification: { channelId: 'default', sound: 'default' },
            },
            apns: {
                payload: { aps: { sound: 'default', badge: 1 } },
            },
        });

        const failedTokens = [];
        response.responses.forEach((res, idx) => {
            if (!res.success) {
                const code = res.error?.code;
                if (STALE_CODES.has(code)) {
                    failedTokens.push(tokens[idx]);
                } else {
                    console.warn(`[FCM] transient error for token[${idx}]: ${code}`);
                }
            }
        });

        if (failedTokens.length > 0) {
            console.log(`[FCM] removing ${failedTokens.length} stale token(s) for user ${userId}`);
            await User.findByIdAndUpdate(userId, {
                $pullAll: { fcmTokens: failedTokens },
            });
        }

        const sent = response.responses.filter((r) => r.success).length;
        console.log(`[FCM] userId=${userId} sent=${sent} stale=${failedTokens.length}`);
        return { sent, failedTokens };

    } catch (error) {
        console.error('[FCM] sendEachForMulticast error:', error.message);
        return { sent: 0, failedTokens: [] };
    }
};

module.exports = { sendPushNotification };
