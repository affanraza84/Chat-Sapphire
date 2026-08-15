import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export interface UserProfile {
  _id: string;
  fullName: string;
  profilePic?: string;
  bio?: string;
  status?: string;
}

interface ProfileModalState {
  isOpen: boolean;
  userId: string | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
  fetchProfile: (id: string) => Promise<void>;
}

export const useProfileModalStore = create<ProfileModalState>((set, get) => ({
  isOpen: false,
  userId: null,
  profile: null,
  loading: false,
  error: null,
  openModal: (id: string) => {
    set({ isOpen: true, userId: id, profile: null, error: null });
    get().fetchProfile(id);
  },
  closeModal: () => {
    set({ isOpen: false, userId: null, profile: null, error: null });
  },
  fetchProfile: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/user/${id}`);
      if (res.data.success) {
        set({ profile: res.data.user as UserProfile, loading: false });
      } else {
        set({ error: res.data.message || 'Failed to load profile', loading: false });
        toast.error(res.data.message || 'Failed to load profile');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Network error';
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
    }
  },
}));
