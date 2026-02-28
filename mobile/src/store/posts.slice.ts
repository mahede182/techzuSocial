import { createPost as createPostApi, getPosts as getPostsApi, getMyPosts as getMyPostsApi } from "@/api/posts";
import { toggleLike as toggleLikeApi } from "@/api/like";
import {
  addComment as addCommentApi,
  getComments as getCommentsApi,
} from "@/api/comments";
import { AppLogger } from "@/helper/applogger";
import type { PostsSlice, StoreSet, StoreGet } from '@/@types/store';

const logger = new AppLogger("PostsSlice");
const PAGE_SIZE = 10;

export const createPostsSlice = (set: StoreSet, get: StoreGet): PostsSlice => ({
  posts: [],
  myPosts: [],
  postsLoading: false,
  postsLoadingMore: false,
  postsHasMore: true,
  postsPage: 1,
  postsError: null,
  commentsByPostId: {},
  commentsLoadingByPostId: {},
  commentsErrorByPostId: {},

  // Reset to page 1 — pull-to-refresh and initial load
  async fetchPosts() {
    set((state: any) => {
      state.postsLoading = true;
      state.postsError = null;
    });
    try {
      const posts = await getPostsApi({ page: 1, limit: PAGE_SIZE });
      set((state: any) => {
        state.posts = posts;
        state.postsPage = 1;
        state.postsHasMore = posts.length === PAGE_SIZE;
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

  // Append next page — FlatList onEndReached
  async loadMorePosts() {
    const { postsLoading, postsLoadingMore, postsHasMore, postsPage } = get();
    if (postsLoading || postsLoadingMore || !postsHasMore) return;
    const nextPage = postsPage + 1;
    set((state: any) => { state.postsLoadingMore = true; });
    try {
      const more = await getPostsApi({ page: nextPage, limit: PAGE_SIZE });
      set((state: any) => {
        state.posts = [...state.posts, ...more];
        state.postsPage = nextPage;
        state.postsHasMore = more.length === PAGE_SIZE;
        state.postsLoadingMore = false;
      });
    } catch {
      set((state: any) => { state.postsLoadingMore = false; });
      logger.error("Failed to load more posts");
    }
  },

  async createPost(text) {
    try {
      const newPost = await createPostApi({ text });
      const currentUser = get().user;
      const enriched = {
        ...newPost,
        userId:
          newPost.userId && typeof (newPost.userId as any).name === 'string'
            ? newPost.userId
            : { _id: currentUser?._id ?? '', name: currentUser?.name ?? '' },
      };
      set((state: any) => {
        state.posts = [enriched, ...state.posts];
        state.myPosts = [enriched, ...state.myPosts];
      });
    } catch {
      logger.error("Failed to create post");
    }
  },

  async fetchMyPosts(params) {
    set((state: any) => {
      state.postsLoading = true;
      state.postsError = null;
    });
    try {
      const myPosts = await getMyPostsApi(params ?? {});
      set((state: any) => {
        state.myPosts = myPosts;
        state.postsLoading = false;
      });
    } catch (err) {
      set((state: any) => {
        state.postsLoading = false;
        state.postsError =
          err instanceof Error ? err.message : "Failed to load your posts";
      });
    }
  },

  async toggleLike(postId) {
    // Optimistic update — flip immediately, revert on failure
    const userId = get().user?._id ?? '';
    const flip = (posts: any[]) => posts.forEach((p) => {
      if (p._id !== postId) return;
      const liked = p.likes.includes(userId);
      p.likes = liked ? p.likes.filter((id: string) => id !== userId) : [...p.likes, userId];
    });
    set((state: any) => { flip(state.posts); flip(state.myPosts); });
    try {
      await toggleLikeApi(postId);
    } catch {
      // Revert
      set((state: any) => { flip(state.posts); flip(state.myPosts); });
      logger.error("Failed to toggle like");
    }
  },

  async addComment(postId, text) {
    try {
      const newComment = await addCommentApi(postId, { text });
      const currentUser = get().user;
      const enriched = {
        ...newComment,
        userId:
          newComment.userId && typeof (newComment.userId as any).name === 'string'
            ? newComment.userId
            : { _id: currentUser?._id ?? '', name: currentUser?.name ?? '' },
      };
      set((state: any) => {
        const existing = state.commentsByPostId[postId] ?? [];
        state.commentsByPostId[postId] = [enriched, ...existing];
        const inc = (p: any) => { if (p._id === postId) p.commentCount += 1; };
        state.posts.forEach(inc);
        state.myPosts.forEach(inc);
      });
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
