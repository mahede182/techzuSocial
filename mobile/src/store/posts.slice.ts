import { createPost as createPostApi, getPosts as getPostsApi } from "@/api/posts";
import { toggleLike as toggleLikeApi } from "@/api/like";
import {
  addComment as addCommentApi,
  getComments as getCommentsApi,
} from "@/api/comments";
import { AppLogger } from "@/helper/applogger";
import type { PostsSlice } from "@/@types/store";

type StoreSet = (fn: (state: any) => void) => void;
type StoreGet = () => any;

const logger = new AppLogger("PostsSlice");

export const createPostsSlice = (set: StoreSet, get: StoreGet): PostsSlice => ({
  posts: [],
  postsLoading: false,
  postsError: null,
  commentsByPostId: {},
  commentsLoadingByPostId: {},
  commentsErrorByPostId: {},

  async fetchPosts(params) {
    set((state: any) => {
      state.postsLoading = true;
      state.postsError = null;
    });
    try {
      const posts = await getPostsApi(params ?? {});
      set((state: any) => {
        state.posts = posts;
        state.postsLoading = false;
      });
    } catch (err) {
      set((state: any) => {
        state.postsLoading = false;
        state.postsError =
          err instanceof Error ? err.message : "Failed to load posts";
      });
    }
  },

  async createPost(text) {
    try {
      const newPost = await createPostApi({ text });
      set((state: any) => {
        state.posts = [newPost, ...state.posts];
      });
    } catch {
        logger.error("Failed to create post");
    }
  },

  async toggleLike(postId) {
    try {
      await toggleLikeApi(postId);
      const { fetchPosts } = get();
      await fetchPosts();
    } catch {
      logger.error("Failed to toggle like");
    }
  },

  async addComment(postId, text) {
    try {
      const newComment = await addCommentApi(postId, { text });
      set((state: any) => {
        const existing = state.commentsByPostId[postId] ?? [];
        state.commentsByPostId[postId] = [newComment, ...existing];
      });
      const { fetchPosts } = get();
      await fetchPosts();
    } catch {
      logger.error("Failed to add comment");
    }
  },

  async loadComments(postId) {
    set((state: any) => {
      state.commentsLoadingByPostId[postId] = true;
      state.commentsErrorByPostId[postId] = null;
    });
    try {
      const comments = await getCommentsApi(postId);
      set((state: any) => {
        state.commentsByPostId[postId] = comments;
        state.commentsLoadingByPostId[postId] = false;
      });
    } catch (err) {
      set((state: any) => {
        state.commentsLoadingByPostId[postId] = false;
        state.commentsErrorByPostId[postId] =
          err instanceof Error ? err.message : "Failed to load comments";
      });
      logger.error("Failed to load comments");
    }
  },
});
