import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/colors';

interface AppActivityIndicatorProps {
    variant?: 'fullscreen' | 'inline';
    color?: string;
    size?: 'small' | 'large';
}

export default function AppActivityIndicator({
    variant = 'fullscreen',
    color = Colors.primary,
    size = 'large',
}: AppActivityIndicatorProps) {
    if (variant === 'inline') {
        return <ActivityIndicator color={color} size={size} style={styles.inline} />;
    }

    return (
        <View style={styles.fullscreen}>
            <ActivityIndicator color={color} size={size} />
        </View>
    );
}

const styles = StyleSheet.create({
    fullscreen: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inline: {
        marginVertical: 16,
        alignSelf: 'center',
    },
});
