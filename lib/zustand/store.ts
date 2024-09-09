import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserSlice, createUserSlice } from '@/lib/zustand/slices/userSlice';

type StoreState = UserSlice;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);