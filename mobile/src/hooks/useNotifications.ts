import { useCallback } from 'react';
import {
    getMessaging,
    onMessage,
    onNotificationOpenedApp,
    getInitialNotification,
    setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { requestNotificationPermission, getFcmToken } from '@/utils/notifications';
import { saveFcmToken, removeFcmToken } from '@/api/auth';
import type { NotificationData } from '@/@types/notifications';
import { AppLogger } from '@/helper/applogger';
export type { NotificationData };

const logger = new AppLogger('useNotifications');

export const useNotifications = () => {
    const registerToken = useCallback(async (): Promise<string | null> => {
        const granted = await requestNotificationPermission();
        if (!granted) return null;

        const token = await getFcmToken();
        if (!token) return null;

        try {
            await saveFcmToken(token);
        } catch (error) {
            logger.error('saveFcmToken error:', error);
        }

        return token;
    }, []);


    const unregisterToken = useCallback(async (token: string | null) => {
        if (!token) return;
        try {
            await removeFcmToken(token);
        } catch (error) {
            logger.error('removeFcmToken error:', error);
        }
    }, []);

    const setupHandlers = useCallback(
        (onTap: (data: NotificationData) => void): (() => void) => {
            const m = getMessaging();

            setBackgroundMessageHandler(m, async (_remoteMessage) => { });

            const unsubscribeForeground = onMessage(
                m,
                async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
                    Toast.show({
                        type: 'info',
                        text1: remoteMessage.notification?.title ?? 'New notification',
                        text2: remoteMessage.notification?.body ?? '',
                        visibilityTime: 4000,
                    });
                }
            );

            const unsubscribeBackground = onNotificationOpenedApp(
                m,
                (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
                    if (remoteMessage.data) {
                        onTap(remoteMessage.data as NotificationData);
                    }
                }
            );

            return () => {
                unsubscribeForeground();
                unsubscribeBackground();
            };
        },
        []
    );

    const checkInitialNotification = useCallback(
        async (onTap: (data: NotificationData) => void) => {
            const remoteMessage = await getInitialNotification(getMessaging());
            if (remoteMessage?.data) {
                onTap(remoteMessage.data as NotificationData);
            }
        },
        []
    );

    return { registerToken, unregisterToken, setupHandlers, checkInitialNotification };
};
