import React, { useCallback, useEffect } from 'react';
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
import { CURRENT_USER_ID } from '@/constants/data';
import { useAppStore } from '@/store/store';

export default function FeedScreen() {
    const {
        posts,
        postsLoading,
        postsError,
        fetchPosts,
        toggleLike,
    } = useAppStore((state) => ({
        posts: state.posts,
        postsLoading: state.postsLoading,
        postsError: state.postsError,
        fetchPosts: state.fetchPosts,
        toggleLike: state.toggleLike,
    }));

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const onRefresh = useCallback(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleLike = useCallback((postId: string) => {
        toggleLike(postId);
    }, [toggleLike]);

    const handleComment = useCallback((_postId: string) => {
        // wire up comment screen later
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.logo}>techzu social</Text>
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
                        refreshing={postsLoading}
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