import type {
  LoginPayload,
  RegisterPayload,
  LoginResponse,
} from '@/api/auth';
import type { Post, Comment } from '@/@types/post';
import type { GetPostsParams } from '@/api/posts';
import type { User } from '@/@types/auth';

export interface AuthState {
  token: string | null;
  user: User | null;
  fcmToken: string | null;
  isPersist: boolean;
  authLoading: boolean;
  authError: string | null;
}

export interface AuthActions {
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  setFcmToken: (token: string | null) => void;
  restoreSession: () => Promise<void>;
  clearAuthError: () => void;
}

export type AuthSlice = AuthState & AuthActions;

export interface PostsState {
  posts: Post[];
  myPosts: Post[];
  postsLoading: boolean;
  postsError: string | null;
  commentsByPostId: Record<string, Comment[]>;
  commentsLoadingByPostId: Record<string, boolean>;
  commentsErrorByPostId: Record<string, string | null>;
}

export interface PostsActions {
  fetchPosts: (params?: GetPostsParams) => Promise<void>;
  fetchMyPosts: (params?: GetPostsParams) => Promise<void>;
  createPost: (text: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  loadComments: (postId: string) => Promise<void>;
}

export type PostsSlice = PostsState & PostsActions;

export type AppStore = AuthSlice & PostsSlice;

export type StoreSet = (fn: (state: any) => void) => void;
export type StoreGet = () => any;
