import React, { useCallback, useEffect, useState } from 'react';
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
import CommentSheet from '@/components/CommentSheet';
import { Colors } from '@/constants/colors';
import { useAppStore } from '@/store/store';

export default function ProfileScreen() {
    const { myPosts, postsLoading, fetchMyPosts, toggleLike, user } = useAppStore((state) => state);
    const [commentPostId, setCommentPostId] = useState<string | null>(null);

    useEffect(() => {
        fetchMyPosts();
    }, []);

    const onRefresh = useCallback(async () => {
        await fetchMyPosts();
    }, [fetchMyPosts]);

    const handleLike = useCallback(async (postId: string) => {
        await toggleLike(postId);
    }, [toggleLike]);

    const handleComment = useCallback((postId: string) => {
        setCommentPostId(postId);
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
                data={myPosts}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={<ProfileListHeader posts={myPosts} />}
                renderItem={({ item }) => (
                    <PostCard
                        post={item}
                        currentUserId={user?._id ?? ''}
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
                        <Ionicons name="create-outline" size={40} color={Colors.border} />
                        <Text style={styles.emptyText}>No posts yet</Text>
                    </View>
                }
            />

            <CommentSheet
                postId={commentPostId}
                onClose={() => setCommentPostId(null)}
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