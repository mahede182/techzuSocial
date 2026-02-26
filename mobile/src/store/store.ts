import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createAuthSlice } from './auth.slice';
import { createPostsSlice } from './posts.slice';
import type { AppStore } from '@/@types/store';

export const useAppStore = create<AppStore>()(
  immer((set, get) => ({
    ...createAuthSlice(set),
    ...createPostsSlice(set, get),
  })),
);