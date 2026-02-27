import React, { useMemo } from 'react';
import { ProfileListHeaderProps } from '@/@types/post';
import ProfileHeader from './ProfileHeader';
import { useAppStore } from '@/store/store';
import { useRouter } from 'expo-router';

export default function ProfileListHeader({ posts }: ProfileListHeaderProps) {
    const { logout, user } = useAppStore((state) => state);
    const router = useRouter();
    const onLogout = () => {
        logout();
        router.replace('/(auth)/login');
    };
    const stats = useMemo(() => {
        const totalLikes = posts.reduce((s, p) => s + p.likes.length, 0);
        const totalComments = posts.reduce((s, p) => s + p.commentCount, 0);

        return {
            postsCount: posts.length,
            likesCount: totalLikes,
            commentsCount: totalComments,
        };
    }, [posts]);

    return (
        <ProfileHeader
            userName={user?.name ?? ''}
            userEmail={user?.email ?? ''}
            postsCount={stats.postsCount}
            likesCount={stats.likesCount}
            commentsCount={stats.commentsCount}
            onLogout={onLogout}
        />
    );
}
