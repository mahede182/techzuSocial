import React, { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostCard from '@/components/PostCard';
import CommentSheet from '@/components/CommentSheet';
import { Colors } from '@/constants/colors';
import { useAppStore } from '@/store/store';
import EmptyPosts from '@/components/EmptyPosts';
import Header from '@/components/Header';
import { useDebounce } from '@/hooks/useDebounce';

export default function FeedScreen() {
    const {
        posts,
        postsLoading,
        postsLoadingMore,
        postsHasMore,
        fetchPosts,
        loadMorePosts,
        toggleLike,
        user,
    } = useAppStore((state) => state);
    const [commentPostId, setCommentPostId] = useState<string | null>(null);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        fetchPosts().finally(() => setHasLoaded(true));
    }, []);

    const handleLike = useDebounce(
        useCallback((postId: string) => { toggleLike(postId); }, [toggleLike]),
        400,
    );

    const handleComment = useCallback((postId: string) => {
        setCommentPostId(postId);
    }, []);

    const handleEndReached = useCallback(() => {
        if (postsHasMore && !postsLoadingMore) loadMorePosts();
    }, [postsHasMore, postsLoadingMore, loadMorePosts]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header />

            <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
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
                        onRefresh={fetchPosts}
                        tintColor={Colors.primary}
                    />
                }
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.4}
                ListEmptyComponent={
                    !hasLoaded ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                        </View>
                    ) : (
                        <EmptyPosts />
                    )
                }
                ListFooterComponent={
                    postsLoadingMore ? (
                        <View style={styles.footer}>
                            <ActivityIndicator color={Colors.primary} />
                        </View>
                    ) : null
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
    list: {
        paddingTop: 12,
        paddingBottom: 120,
    },
    footer: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        paddingTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
});