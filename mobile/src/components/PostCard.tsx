import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from './Avatar';
import { Colors } from '@/constants/colors';
import { Post } from '@/@types/post';
import { timeAgo } from '@/utils/date';

interface PostCardProps {
    post: Post;
    currentUserId: string;
    onLike: (postId: string) => void;
    onComment: (postId: string) => void;
}

export default function PostCard({ post, currentUserId, onLike, onComment }: PostCardProps) {
    const liked = post.likes.includes(currentUserId);
    const authorName = post.userId?.name ?? 'Unknown';

    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <Avatar name={authorName} size={38} />
                <View style={styles.headerInfo}>
                    <Text style={styles.username}>{authorName}</Text>
                    <Text style={styles.time}>{timeAgo(post.createdAt)}</Text>
                </View>
            </View>

            {/* Post text */}
            <Text style={styles.postText}>{post.text}</Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.action} onPress={() => onLike(post._id)} activeOpacity={0.7}>
                    <Ionicons
                        name={liked ? 'heart' : 'heart-outline'}
                        size={20}
                        color={liked ? Colors.danger : Colors.textSecondary}
                    />
                    <Text style={[styles.actionCount, liked && styles.likedCount]}>
                        {post.likes.length}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.action} onPress={() => onComment(post._id)} activeOpacity={0.7}>
                    <Ionicons name="chatbubble-outline" size={20} color={Colors.textSecondary} />
                    <Text style={styles.actionCount}>{post.commentCount}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.background,
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 14,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerInfo: {
        marginLeft: 10,
    },
    username: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    time: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 1,
    },
    postText: {
        fontSize: 15,
        color: Colors.text,
        lineHeight: 22,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 10,
    },
    actions: {
        flexDirection: 'row',
        gap: 20,
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    actionCount: {
        fontSize: 13,
        color: Colors.textSecondary,
    },
    likedCount: {
        color: Colors.danger,
    },
});
