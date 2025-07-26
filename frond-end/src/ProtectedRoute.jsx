import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProtectedRoute = ({ allowedRoles }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard', {
          withCredentials: true, 
        });

        
       
        if (allowedRoles.includes(res?.data?.user?.role)) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      } catch (err) {
        setAuth(false);
      }
    };
    checkAuth();
  }, [allowedRoles]);

  

  if (auth === null) return <div>Loading...</div>;
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
