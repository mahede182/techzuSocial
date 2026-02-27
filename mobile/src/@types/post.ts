import { Ionicons } from "@expo/vector-icons";

export interface PostUser {
    _id: string;
    name: string;
}

export interface Post {
    _id: string;
    userId: PostUser;
    text: string;
    likes: string[];
    commentCount: number;
    createdAt: string;
}

export interface Comment {
    _id: string;
    postId: string;
    userId: PostUser;
    text: string;
    createdAt: string;
}

export interface SectionTitleProps {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
}

export interface ProfileStatsProps {
    postsCount: number;
    likesCount: number;
    commentsCount: number;
}

export interface ProfileInfoProps {
    name: string;
    email: string;
    onEditProfile?: () => void;
}

export interface ProfileHeaderProps {
    userName: string;
    userEmail: string;
    postsCount: number;
    likesCount: number;
    commentsCount: number;
    onEditProfile?: () => void;
}

export interface PostCardProps {
    post: Post;
    currentUserId: string;
    onLike: (postId: string) => void;
    onComment: (postId: string) => void;
}

export interface ProfileListHeaderProps {
    posts: Post[];
}