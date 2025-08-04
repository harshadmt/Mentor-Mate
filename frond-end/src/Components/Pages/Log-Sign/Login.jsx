import React, { useState } from 'react';
import axios from 'axios';
import { User, Laptop, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useUserStore from '../../../../zustore/store';


const LoginPage = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
 const {setUser} = useUserStore
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/login`,
        { email, password, role },
        { withCredentials: true }
      );

      const { token, user } = response.data;

      toast.success(response.data.message);
      // const data = response.data

      setTimeout(() => {
        if (user.role === 'student') navigate('/student/studentdashboard');
        else if (user.role === 'mentor') navigate('/mentor/mentordashboard');
        else if (user.role === 'admin') navigate('/admin/admindashboard');
      }, 1500);
            // setUser()

      
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed.';
      toast.error(message, { position: 'top-right' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <ToastContainer />

      <div className="bg-white w-full max-w-5xl shadow-lg rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side Form */}
        <div className="p-8 sm:p-10 md:p-12">
          <button onClick={()=>navigate('/')}><h1 className="text-3xl font-bold text-blue-600 mb-1">⚡ MentorMate</h1></button>
          <p className="text-sm text-gray-500 mb-6">Sign in to continue your journey</p>

          {/* Role Selection */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setRole('student')}
              className={`flex-1 py-2 px-3 border rounded-lg text-sm flex items-center justify-center gap-2 ${
                role === 'student'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              <User size={18} /> Student
            </button>
            <button
              onClick={() => setRole('mentor')}
              className={`flex-1 py-2 px-3 border rounded-lg text-sm flex items-center justify-center gap-2 ${
                role === 'mentor'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              <Laptop size={18} /> Mentor
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 px-3 border rounded-lg text-sm flex items-center justify-center gap-2 ${
                role === 'admin'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              <ShieldCheck size={18} /> Admin
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium"
            >
              Sign In
            </button>

            <p className="text-center text-sm text-gray-600 mt-2">
              Don’t have an account?
              <a href="/signup" className="text-blue-600 hover:underline ml-1">Create account</a>
            </p>
          </form>
        </div>

        {/* Right Side Image/Info Section (hidden on small screens) */}
        <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-green-400 text-white p-8">
          <h2 className="text-2xl font-bold mb-2 text-center">Empower Your Learning Journey</h2>
          <p className="text-sm text-center max-w-sm">Connect with mentors, track your progress, and achieve your goals with personalized support.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
