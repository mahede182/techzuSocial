import * as ExpoNotifications from 'expo-notifications';
import messaging from '@react-native-firebase/messaging';

/**
 * Request OS notification permission using expo-notifications.
 *
 * Why expo-notifications instead of messaging().requestPermission():
 * - messaging().requestPermission() on Android silently returns AUTHORIZED
 *   without ever showing the OS dialog. It only triggers the real prompt on iOS.
 * - Android 13+ (API 33+) requires an explicit POST_NOTIFICATIONS permission.
 * - expo-notifications requestPermissionsAsync() correctly calls
 *   PermissionsAndroid.request() on Android 13+ and the iOS API on iOS.
 *
 * Must be called AFTER login — never on the splash screen.
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
    try {
        const { status } = await ExpoNotifications.requestPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('[Notifications] requestPermissionsAsync error:', error);
        return false;
    }
};

/**
 * Get the FCM registration token via @react-native-firebase/messaging.
 * Returns null if unavailable (permission denied, no network, etc.).
 */
export const getFcmToken = async (): Promise<string | null> => {
    try {
        const token = await messaging().getToken();
        return token || null;
    } catch (error) {
        console.error('[Notifications] getToken error:', error);
        return null;
    }
};
