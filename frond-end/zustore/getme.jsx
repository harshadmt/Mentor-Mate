// Just fetch and set user in zustand — minimal version
import { useEffect } from "react";
import axios from "axios";
import useUserStore from "./store"

const FetchUser = () => {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };
    getUser();
  }, [setUser]);

  return null;
};

export default FetchUser;
