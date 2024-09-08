import { StateCreator } from 'zustand';

export interface UserSlice {
  isLoggedIn: boolean;
  firstName: string;
  profilePicUrl: string;
  username: string;
  email: string;
  isVerified: boolean;
  setUserState: (state: Partial<UserSlice>) => void;
  logout: () => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  isLoggedIn: false,
  firstName: '',
  profilePicUrl: '',
  username: '',
  email: '',
  isVerified: false,
  setUserState: (newState) => set((state) => ({ ...state, ...newState })),
  logout: () => set({
    isLoggedIn: false,
    firstName: '',
    username: '',
    email: '',
    isVerified: false,
  }),
});