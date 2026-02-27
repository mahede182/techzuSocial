import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PostCard from '@/components/PostCard';
import ProfileListHeader from '@/components/ProfileListHeader';
import { Colors } from '@/constants/colors';
import { Post } from '@/@types/post';
import { CURRENT_USER, MOCK_POSTS } from '@/constants/data';

export default function ProfileScreen() {
    const myPosts = MOCK_POSTS.filter(p => p.userId._id === CURRENT_USER._id);
    const [posts, setPosts] = useState<Post[]>(myPosts);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 600);
    }, []);

    const handleLike = useCallback((postId: string) => {
        setPosts((prev) =>
            prev.map((p) => {
                if (p._id !== postId) return p;
                const liked = p.likes.includes(CURRENT_USER._id);
                return {
                    ...p,
                    likes: liked
                        ? p.likes.filter((id) => id !== CURRENT_USER._id)
                        : [...p.likes, CURRENT_USER._id],
                };
            })
        );
    }, []);

    const handleComment = useCallback((_postId: string) => {
        // wire up comment screen later
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.topBar}>
                <Text style={styles.topBarTitle}>Profile</Text>
                <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                    <Ionicons name="settings-outline" size={22} color={Colors.text} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={<ProfileListHeader posts={posts} />}
                renderItem={({ item }) => (
                    <PostCard
                        post={item}
                        currentUserId={CURRENT_USER._id}
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
                        <Ionicons name="create-outline" size={40} color={Colors.border} />
                        <Text style={styles.emptyText}>No posts yet</Text>
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
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    topBarTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    iconBtn: { padding: 4 },
    list: {
        paddingBottom: 120,
    },
    center: {
        alignItems: 'center',
        paddingTop: 60,
        gap: 8,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
});