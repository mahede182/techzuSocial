import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    cancelAnimation,
} from 'react-native-reanimated';
import Avatar from './Avatar';
import { Colors } from '@/constants/colors';
import { timeAgo } from '@/utils/date';
import type { Comment } from '@/@types/post';

interface CommentItemProps {
    item: Comment;
}

const CommentItem = React.memo(({ item }: CommentItemProps) => {
    const shimmer = useSharedValue(0.4);
    const hasName = Boolean(item.userId?.name);

    useEffect(() => {
        if (!hasName) {
            shimmer.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
        } else {
            cancelAnimation(shimmer);
            shimmer.value = 1;
        }
        return () => cancelAnimation(shimmer);
    }, [hasName]);

    const shimmerStyle = useAnimatedStyle(() => ({ opacity: shimmer.value }));

    return (
        <View style={styles.commentRow}>
            <Avatar name={item.userId?.name ?? '?'} size={36} />
            <View style={styles.commentBody}>
                <View style={styles.commentMeta}>
                    {hasName ? (
                        <Text style={styles.commentAuthor}>{item.userId.name}</Text>
                    ) : (
                        <Animated.View style={[styles.nameSkeleton, shimmerStyle]} />
                    )}
                    <Text style={styles.commentTime}>{timeAgo(item.createdAt)}</Text>
                </View>
                <Text style={styles.commentText}>{item.text}</Text>
            </View>
        </View>
    );
});

CommentItem.displayName = 'CommentItem';

export default CommentItem;

const styles = StyleSheet.create({
    commentRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 14,
    },
    commentBody: {
        flex: 1,
    },
    commentMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 2,
    },
    commentAuthor: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text,
    },
    commentTime: {
        fontSize: 11,
        color: Colors.textSecondary,
    },
    commentText: {
        fontSize: 14,
        color: Colors.text,
        lineHeight: 20,
    },
    nameSkeleton: {
        height: 16,
        width: 88,
        borderRadius: 8,
        backgroundColor: Colors.border,
    },
});
