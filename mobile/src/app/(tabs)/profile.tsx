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
import Avatar from '@/components/Avatar';
import PostCard from '@/components/PostCard';
import { Colors } from '@/constants/colors';
import { Post } from '@/@types/post';
import { CURRENT_USER, MOCK_POSTS } from '@/constants/mockData';

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

    const totalLikes = posts.reduce((s, p) => s + p.likes.length, 0);
    const totalComments = posts.reduce((s, p) => s + p.commentCount, 0);

    const ListHeader = () => (
        <View style={styles.profileHeader}>
            <View style={styles.avatarRow}>
                <Avatar name={CURRENT_USER.name} size={72} />
                <View style={styles.statsRow}>
                    <StatItem label="Posts" value={posts.length} />
                    <StatItem label="Likes" value={totalLikes} />
                    <StatItem label="Comments" value={totalComments} />
                </View>
            </View>

            <Text style={styles.name}>{CURRENT_USER.name}</Text>
            <Text style={styles.email}>{CURRENT_USER.email}</Text>

            <TouchableOpacity style={styles.editBtn} activeOpacity={0.8}>
                <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>

            <View style={styles.sectionTitle}>
                <Ionicons name="grid-outline" size={16} color={Colors.text} />
                <Text style={styles.sectionTitleText}>My Posts</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header bar */}
            <View style={styles.topBar}>
                <Text style={styles.topBarTitle}>Profile</Text>
                <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                    <Ionicons name="settings-outline" size={22} color={Colors.text} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={<ListHeader />}
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

function StatItem({ label, value }: { label: string; value: number }) {
    return (
        <View style={styles.statItem}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
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
    profileHeader: {
        backgroundColor: Colors.background,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 24,
        flex: 1,
        justifyContent: 'space-around',
    },
    statItem: { alignItems: 'center' },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    name: {
        fontSize: 17,
        fontWeight: '600',
        color: Colors.text,
    },
    email: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    editBtn: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingVertical: 8,
        alignItems: 'center',
    },
    editBtnText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
    },
    sectionTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    sectionTitleText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
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