// src/store/useUserStore.js
import { create } from 'zustand';
import axios from 'axios';

const useUserStore = create((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),

  fetchUser: async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        withCredentials: true,
      });
      set({ user: res.data.user }); // adjust according to your backend response structure
    } catch (err) {
      console.error("Error fetching user", err);
    }
  },
}));

export default useUserStore;
