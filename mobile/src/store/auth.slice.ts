import { login as loginApi, register as registerApi, getMe, removeFcmToken } from "@/api/auth";
import type { LoginResponse, RegisterResponse } from "@/@types/api";
import { storeToken, clearToken, getToken } from "@/api/client";
import { AppLogger } from "@/helper/applogger";
import { registerPushToken } from "@/utils/push";
import type { AuthSlice, StoreGet, StoreSet } from "@/@types/store";


const logger = new AppLogger("AuthSlice");

export const createAuthSlice = (set: StoreSet, get: StoreGet): AuthSlice => ({
  token: null,
  user: null,
  fcmToken: null,
  isPersist: false,
  authLoading: false,
  authError: null,

  async restoreSession() {
    try {
      const storedToken = await getToken();
      if (!storedToken) {
        set((state: any) => { state.isPersist = true; });
        return;
      }
      const user = await getMe();
      set((state: any) => {
        state.token = storedToken;
        state.user = user;
        state.isPersist = true;
      });
    } catch {
      clearToken();
      set((state: any) => { state.isPersist = true; });
    }
  },

  async login(payload) {
    set((state: any) => {
      state.authLoading = true;
      state.authError = null;
    });
    try {
      const res: LoginResponse = await loginApi(payload);
      await storeToken(res.token);
      const user = await getMe();
      const fcmToken = await registerPushToken();
      set((state: any) => {
        state.token = res.token;
        state.user = user;
        state.fcmToken = fcmToken;
        state.authLoading = false;
      });
    } catch (err) {
      set((state: any) => {
        state.authLoading = false;
        state.authError =
          err instanceof Error ? err.message : "Failed to login";
      });
    }
  },

  async register(payload) {
    set((state: any) => {
      state.authLoading = true;
      state.authError = null;
    });
    try {
      const res: RegisterResponse = await registerApi(payload);
      await storeToken(res.token);
      const user = await getMe();
      const fcmToken = await registerPushToken();
      set((state: any) => {
        state.token = res.token;
        state.user = user;
        state.fcmToken = fcmToken;
        state.authLoading = false;
      });
    } catch (err) {
      set((state: any) => {
        state.authLoading = false;
        state.authError =
          err instanceof Error ? err.message : "Failed to register";
      });
    }
  },

  async fetchProfile() {
    try {
      const user = await getMe();
      set((state: any) => {
        state.user = user;
      });
    } catch {
      logger.error("Failed to fetch profile");
    }
  },

  setFcmToken(token: string | null) {
    set((state: any) => { state.fcmToken = token; });
  },

  clearAuthError() {
    set((state: any) => { state.authError = null; });
  },

  logout() {
    const currentFcmToken: string | null = get().fcmToken;
    if (currentFcmToken) {
      removeFcmToken(currentFcmToken).catch((err: unknown) =>
        logger.error('removeFcmToken on logout failed', err)
      );
    }
    clearToken();
    set((state: any) => {
      state.token = null;
      state.user = null;
      state.fcmToken = null;
    });
  },
});
