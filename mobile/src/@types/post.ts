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
