const { messaging } = require('../config/firebase');

const STALE_TOKEN_CODES = [
    'messaging/registration-token-not-registered',
    'messaging/invalid-registration-token',
];

const sendPushNotification = async (tokens, title, body, data = {}) => {
    const validTokens = (tokens || []).filter(Boolean);
    if (validTokens.length === 0) {
        return { failedTokens: [] };
    }

    const stringData = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
    );

    try {
        const response = await messaging.sendEachForMulticast({
            tokens: validTokens,
            notification: { title, body },
            data: stringData,
        });

        const failedTokens = [];
        response.responses.forEach((res, index) => {
            if (!res.success) {
                const code = res.error?.code;
                if (STALE_TOKEN_CODES.includes(code)) {
                    failedTokens.push(validTokens[index]);
                } else {
                    console.error(`[FCM] Token[${index}] non-stale error:`, code);
                }
            }
        });

        if (failedTokens.length > 0) {
            console.log(`[FCM] Removing ${failedTokens.length} stale token(s) from DB`);
        }

        return { failedTokens };
    } catch (error) {
        console.error('[FCM] sendEachForMulticast error:', error.message);
        return { failedTokens: [] };
    }
};

module.exports = { sendPushNotification };
