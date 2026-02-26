import { Post } from '@/@types/post';

export const CURRENT_USER_ID = 'user1';
export const CURRENT_USER = {
    _id: 'user1',
    name: 'Alex Johnson',
    email: 'alex@techzu.com'
};

export const MOCK_POSTS: Post[] = [
    {
        _id: 'p1',
        userId: { _id: 'user1', name: 'Alex Johnson' },
        text: 'Just shipped a new feature that cut our load time by 40%. Optimizing database queries really pays off! 🚀',
        likes: ['user2', 'user3'],
        commentCount: 4,
        createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    }
];

export const TAB_ICONS = {
  index: 'home',
  create: 'add',
  profile: 'person',
};

export const AVATAR_COLORS = [
    '#007AFF', '#5856D6', '#FF9500',
    '#34C759', '#FF2D55', '#AF52DE',
    '#00C7BE', '#FF6B35',
];

export const MAX_CHARS = 500;