import React, { useState, useCallback } from 'react';
import {
    FlatList,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PostCard from '@/components/PostCard';
import { Colors } from '@/constants/colors';
import { Post } from '@/@types/post';
import { MOCK_POSTS, CURRENT_USER_ID } from '@/constants/mockData';

export default function FeedScreen() {
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 600);
    }, []);

    const handleLike = useCallback((postId: string) => {
        setPosts((prev) =>
            prev.map((p) => {
                if (p._id !== postId) return p;
                const liked = p.likes.includes(CURRENT_USER_ID);
                return {
                    ...p,
                    likes: liked
                        ? p.likes.filter((id) => id !== CURRENT_USER_ID)
                        : [...p.likes, CURRENT_USER_ID],
                };
            })
        );
    }, []);

    const handleComment = useCallback((_postId: string) => {
        // wire up comment screen later
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logo}>techzu</Text>
                <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                    <Ionicons name="notifications-outline" size={24} color={Colors.text} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <PostCard
                        post={item}
                        currentUserId={CURRENT_USER_ID}
                        onLike={handleLike}
                        onComment={handleComment}
                    />
                )}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Ionicons name="newspaper-outline" size={48} color={Colors.border} />
                        <Text style={styles.emptyText}>No posts yet</Text>
                        <Text style={styles.emptySubText}>Be the first to share something!</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    logo: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.primary,
        letterSpacing: -0.5,
    },
    iconBtn: {
        padding: 4,
    },
    list: {
        paddingTop: 12,
        paddingBottom: 120,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 80,
        gap: 8,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginTop: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
});