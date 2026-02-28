import * as ExpoNotifications from 'expo-notifications';
import messaging from '@react-native-firebase/messaging';

export const requestNotificationPermission = async (): Promise<boolean> => {
    try {
        const { status } = await ExpoNotifications.requestPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('[Notifications] requestPermissionsAsync error:', error);
        return false;
    }
};

export const getFcmToken = async (): Promise<string | null> => {
    try {
        const token = await messaging().getToken();
        return token || null;
    } catch (error) {
        console.error('[Notifications] getToken error:', error);
        return null;
    }
};

export const subscribeToTokenRefresh = (
    onRefresh: (newToken: string) => void
): (() => void) => {
    return messaging().onTokenRefresh(onRefresh);
};
