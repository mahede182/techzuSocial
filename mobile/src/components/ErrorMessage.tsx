import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';
import { useAppStore } from '@/store/store';

interface ErrorMessageProps {
    message: string | null | undefined;
}

const VISIBLE = 3500;
const DISMISS = 500;

export default function ErrorMessage({ message }: ErrorMessageProps) {
    const clearAuthError = useAppStore((s) => s.clearAuthError);

    const opacity = useSharedValue(0);
    const translateY = useSharedValue(-12);

    const dismiss = () => {
        opacity.value = withTiming(0, {
            duration: DISMISS,
            easing: Easing.out(Easing.ease),
        });
        translateY.value = withTiming(
            -12,
            { duration: DISMISS, easing: Easing.out(Easing.ease) },
            (finished) => {
                if (finished) runOnJS(clearAuthError)();
            }
        );
    };

    useEffect(() => {
        if (!message) return;

        opacity.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.ease) });
        translateY.value = withSpring(0, { damping: 18, stiffness: 180 });

        const timer = setTimeout(dismiss, VISIBLE);

        return () => {
            clearTimeout(timer);
            clearAuthError();
        };
    }, [message]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    if (!message) return null;

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <Text style={styles.text}>{message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF2F2',
        borderLeftWidth: 3,
        borderLeftColor: Colors.danger,
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginVertical: 8,
        width: '100%',
    },
    text: {
        color: Colors.danger,
        fontSize: 13,
        lineHeight: 18,
    },
});

