import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { getInitials, colorForName } from '@/utils/avatar';

interface AvatarProps {
    name: string;
    size?: number;
}

export default function Avatar({ name, size = 40 }: AvatarProps) {
    const bg = colorForName(name);
    const initials = getInitials(name);
    const fontSize = size * 0.38;

    return (
        <View
            style={[
                styles.circle,
                { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
            ]}
        >
            <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    circle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        color: '#fff',
        fontWeight: '600',
    },
});
