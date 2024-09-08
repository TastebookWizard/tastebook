import { create } from 'zustand';
import { UserSlice, createUserSlice } from '@/lib/zustand/slices/userSlice';

type StoreState = UserSlice;

export const useStore = create<StoreState>()((...a) => ({
  ...createUserSlice(...a),
}));