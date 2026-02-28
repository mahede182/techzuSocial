import { saveFcmToken } from '@/api/auth';
import { AppLogger } from '@/helper/applogger';
import { getFcmToken, requestNotificationPermission } from '@/utils/notifications';

const logger = new AppLogger('Push');

export const registerPushToken = async (): Promise<string | null> => {
    try {
        const granted = await requestNotificationPermission();
        if (!granted) return null;

        const token = await getFcmToken();
        if (!token) return null;

        await saveFcmToken(token);
        return token;
    } catch (err) {
        logger.error('registerPushToken failed', err);
        return null;
    }
};
