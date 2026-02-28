import React, { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostCard from '@/components/PostCard';
import CommentSheet from '@/components/CommentSheet';
import { Colors } from '@/constants/colors';
import { useAppStore } from '@/store/store';
import EmptyPosts from '@/components/EmptyPosts';
import Header from '@/components/Header';
import { AppLogger } from '@/helper/applogger';

const logger = new AppLogger("FeedScreen");

export default function FeedScreen() {
    const {
        posts,
        postsLoading,
        fetchPosts,
        toggleLike,
        user,
    } = useAppStore((state) => state);
    const [commentPostId, setCommentPostId] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const onRefresh = useCallback(() => {
        fetchPosts();
    }, []);

    const handleLike = useCallback((postId: string) => {
        toggleLike(postId);
    }, []);

    const handleComment = useCallback((postId: string) => {
        setCommentPostId(postId);
    }, []);


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
                        onRefresh={onRefresh}
                        tintColor={Colors.primary}
                    />
                }
                ListEmptyComponent={<EmptyPosts />}
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
    }
});