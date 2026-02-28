import * as ExpoNotifications from 'expo-notifications';
import {
    getMessaging,
    getToken,
    onTokenRefresh,
} from '@react-native-firebase/messaging';
import { AppLogger } from '@/helper/applogger';

const logger = new AppLogger('Notifications');

export const requestNotificationPermission = async (): Promise<boolean> => {
    try {
        const { status } = await ExpoNotifications.requestPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        logger.error('requestPermissionsAsync error:', error);
        return false;
    }
};

export const getFcmToken = async (): Promise<string | null> => {
    try {
        const token = await getToken(getMessaging());
        return token || null;
    } catch (error) {
        logger.error('getToken error:', error);
        return null;
    }
};

export const subscribeToTokenRefresh = (
    onRefresh: (newToken: string) => void
): (() => void) => {
    return onTokenRefresh(getMessaging(), onRefresh);
};
