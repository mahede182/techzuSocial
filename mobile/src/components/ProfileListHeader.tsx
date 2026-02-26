import React, { useMemo } from 'react';
import { ProfileListHeaderProps } from '@/@types/post';
import { CURRENT_USER } from '@/constants/data';
import ProfileHeader from './ProfileHeader';

export default function ProfileListHeader({ posts }: ProfileListHeaderProps) {
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
            userName={CURRENT_USER.name}
            userEmail={CURRENT_USER.email}
            postsCount={stats.postsCount}
            likesCount={stats.likesCount}
            commentsCount={stats.commentsCount}
        />
    );
}
