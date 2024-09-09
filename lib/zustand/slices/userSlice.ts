import { StateCreator } from 'zustand';

export interface UserSlice {
  id: string;
  authId: string;
  isLoggedIn: boolean;
  username: string;
  email: string;
  firstName: string;
  lastName: string | null;
  profilePicUrl: string | null;
  dietaryPreferences: string[];
  skillLevel: string | null;
  favoriteCuisines: string[];
  interests: string[];
  allergies: string[];
  setUser: (state: Partial<UserSlice>) => void;
  logout: () => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  id: '',
  authId: '',
  isLoggedIn: false,
  username: '',
  email: '',
  firstName: '',
  lastName: null,
  profilePicUrl: null,
  dietaryPreferences: [],
  skillLevel: null,
  favoriteCuisines: [],
  interests: [],
  allergies: [],
  setUser: (newState) => set((state) => ({ ...state, ...newState })),
  logout: () => set({
    id: '',
    authId: '',
    isLoggedIn: false,
    username: '',
    email: '',
    firstName: '',
    lastName: null,
    profilePicUrl: null,
    dietaryPreferences: [],
    skillLevel: null,
    favoriteCuisines: [],
    interests: [],
    allergies: [],
  }),
});