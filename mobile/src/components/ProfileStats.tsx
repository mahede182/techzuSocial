import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProfileStatsProps } from '@/@types/post';
import StatItem from './StatItem';

export default function ProfileStats({ postsCount, likesCount, commentsCount }: ProfileStatsProps) {
    return (
        <View style={styles.statsRow}>
            <StatItem label="Posts" value={postsCount} />
            <StatItem label="Likes" value={likesCount} />
            <StatItem label="Comments" value={commentsCount} />
        </View>
    );
}

const styles = StyleSheet.create({
    statsRow: {
        flexDirection: 'row',
        gap: 24,
        flex: 1,
        justifyContent: 'space-around',
    }
});
