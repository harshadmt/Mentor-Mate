// src/store/useUserStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; 
import axios from 'axios';

const useUserStore = create(

  persist(
    (set) => ({
      
      user: null,
      setUser: (userData) => set({ user: userData }),

      fetchUser: async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/user/profile", {
            withCredentials: true,
          });
          set({ user: res.data.user }); 
        } catch (err) {
          console.error("Error fetching user", err);
         
          set({ user: null });
        }
      },
    }),
    {
      name: 'user-storage', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);

export default useUserStore;