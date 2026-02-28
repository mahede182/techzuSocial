import { login as loginApi, register as registerApi, getMe } from "@/api/auth";
import type { LoginResponse, RegisterResponse } from "@/api/auth";
import { storeToken, clearToken } from "@/api/client";
import { AppLogger } from "@/helper/applogger";
import type { AuthSlice } from "@/@types/store";

const logger = new AppLogger("AuthSlice");

type StoreSet = (fn: (state: any) => void) => void;

export const createAuthSlice = (set: StoreSet): AuthSlice => ({
  token: null,
  user: null,
  authLoading: false,
  authError: null,

  async login(payload) {
    set((state: any) => {
      state.authLoading = true;
      state.authError = null;
    });
    try {
      const res: LoginResponse = await loginApi(payload);
      await storeToken(res.token);
      const user = await getMe();
      set((state: any) => {
        state.token = res.token;
        state.user = user;
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
      set((state: any) => {
        state.token = res.token;
        state.user = user;
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

  logout() {
    clearToken();
    set((state: any) => {
      state.token = null;
      state.user = null;
    });
  },
});
