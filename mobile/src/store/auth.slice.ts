import { login as loginApi, register as registerApi } from "@/api/auth";
import type { LoginResponse } from "@/api/auth";
import { storeToken, clearToken } from "@/api/client";
import { AppLogger } from "@/helper/applogger";
import type { AuthSlice } from "@/@types/store";

const logger = new AppLogger("AuthSlice");

type StoreSet = (fn: (state: any) => void) => void;

export const createAuthSlice = (set: StoreSet): AuthSlice => ({
  token: null,
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
      set((state: any) => {
        state.token = res.token;
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
      await registerApi(payload);
      set((state: any) => {
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

  logout() {
    clearToken();
    set((state: any) => {
      state.token = null;
    });
  },
});
