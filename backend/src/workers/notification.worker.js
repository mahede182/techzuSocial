const Notification = require('../models/notification.model');
const { sendPushNotification } = require('../utils/notification.util');

const BATCH_SIZE = 10;

const run = async () => {
    try {
        const now = new Date();
        const claimId = `${process.pid}-${now.getTime()}`;

        const claimed = await Notification.updateMany(
            { status: 'pending' },
            { $set: { status: 'processing', failReason: claimId } },
            { limit: BATCH_SIZE }
        );

        if (claimed.modifiedCount === 0) return 0;

        const notifications = await Notification.find({
            status: 'processing',
            failReason: claimId,
        });

        let processed = 0;

        for (const notification of notifications) {
            try {
                const { title, body, data } = notification.pushPayload ?? {};

                const dataObj = data instanceof Map ? Object.fromEntries(data) : (data ?? {});

                await sendPushNotification(notification.userId, title, body, dataObj);

                await Notification.findByIdAndUpdate(notification._id, {
                    status: 'sent',
                    failReason: null,
                });

                processed++;
            } catch (err) {
                await Notification.findByIdAndUpdate(notification._id, {
                    status: 'failed',
                    failReason: err.message ?? 'unknown',
                });
                console.error(`[Worker] notification ${notification._id} failed:`, err.message);
            }
        }

        if (processed > 0) {
            console.log(`[Worker] processed ${processed} notification(s)`);
        }

        return processed;
    } catch (err) {
        console.error('[Worker] run() error:', err.message);
        return 0;
    }
};

const start = (intervalMs = 10_000) => {
    console.log(`[Worker] started — polling every ${intervalMs / 1000}s`);
    run();
    setInterval(run, intervalMs);
};

module.exports = { run, start };
