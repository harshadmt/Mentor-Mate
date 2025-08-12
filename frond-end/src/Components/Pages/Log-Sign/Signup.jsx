import React, { useState } from 'react';
import axios from 'axios';
import signupImage from '../../../assets/img.jpg';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: '',
    bio: '',
    skills: [],
    agree: false,
  });
  const [currentSkill, setCurrentSkill] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) {
      toast.error('Please select a role');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const payload = { ...formData, role };
      await axios.post('http://localhost:5000/api/auth/register', payload);
      toast.success('Signup successful! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-8">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse 2s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shimmer {
          background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 50%, #3b82f6 100%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .input-focus:focus {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.15);
        }

        .skill-tag {
          transition: all 0.3s ease;
        }

        .skill-tag:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
        }

        .role-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .role-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
        }

        .gradient-border {
          position: relative;
          background: linear-gradient(45deg, #3b82f6, #60a5fa, #93c5fd);
          padding: 2px;
          border-radius: 12px;
        }

        .gradient-border-inner {
          background: white;
          border-radius: 10px;
        }
      `}</style>
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="glass-effect shadow-2xl rounded-3xl overflow-hidden w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 animate-fadeInUp">
        
        {/* Left Side with Enhanced Gradient */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 p-12 flex flex-col justify-center relative overflow-hidden animate-slideInLeft">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/5 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          </div>
          
          <div className="relative z-10">
            <button onClick={() => navigate('/')} className="group mb-8 transition-all duration-300 hover:scale-105">
              <div className="text-white font-bold text-4xl mb-2 flex items-center gap-3">
                <span className="animate-pulse-slow">⚡</span> 
                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Mentor Mate
                </span>
              </div>
            </button>
            
            <h1 className="text-4xl font-bold text-white mb-4 tracking-wide">Join MentorMate</h1>
            <p className="text-blue-100 mb-8 text-lg">Your Gateway to Guided Learning Excellence</p>
            
            <div className="mb-8 transform hover:scale-105 transition-all duration-300">
              <img 
                src={signupImage} 
                alt="Signup" 
                className="rounded-2xl w-full h-auto shadow-2xl border-4 border-white/20" 
              />
            </div>
            
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-blue-900 flex items-center gap-2">
                <span className="text-2xl">🌟</span>
                Why Choose MentorMate?
              </h2>
              <ul className="text-blue-800 space-y-3">
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:translate-x-2">
                  <span className="text-xl">🔍</span>
                  <span className="font-medium">Personalized learning paths tailored for you</span>
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:translate-x-2">
                  <span className="text-xl">👨‍🏫</span>
                  <span className="font-medium">Learn from verified industry mentors</span>
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:translate-x-2">
                  <span className="text-xl">📈</span>
                  <span className="font-medium">Track your progress with analytics</span>
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:translate-x-2">
                  <span className="text-xl">💬</span>
                  <span className="font-medium">Interactive discussions & real-time feedback</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Form with Enhanced Animation */}
        <div className="p-12 flex justify-center items-center bg-gradient-to-br from-white to-blue-50 animate-slideInRight">
          <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                Create Your Account
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto rounded-full"></div>
            </div>

            {/* Role Selection with Enhanced Animation */}
            <div className="flex gap-4 mb-6">
              <div 
                onClick={() => setRole('student')} 
                className={`role-card border-2 rounded-2xl p-6 cursor-pointer flex-1 text-center ${
                  role === 'student' 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg' 
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="text-3xl mb-2">🎓</div>
                <div className="font-bold text-gray-800">Student</div>
                <div className="text-sm text-gray-600 mt-1">Learn & Grow</div>
              </div>
              <div 
                onClick={() => setRole('mentor')} 
                className={`role-card border-2 rounded-2xl p-6 cursor-pointer flex-1 text-center ${
                  role === 'mentor' 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg' 
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="text-3xl mb-2">🧑‍🏫</div>
                <div className="font-bold text-gray-800">Mentor</div>
                <div className="text-sm text-gray-600 mt-1">Teach & Guide</div>
              </div>
            </div>

            {/* Form Inputs with Enhanced Styling */}
            <div className="space-y-4">
              <div className="gradient-border">
                <div className="gradient-border-inner">
                  <input 
                    type="text" 
                    name="fullName" 
                    placeholder="Full Name" 
                    onChange={handleChange} 
                    className="w-full px-6 py-4 border-0 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none input-focus transition-all duration-300" 
                    required 
                  />
                </div>
              </div>

              <div className="gradient-border">
                <div className="gradient-border-inner">
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Email Address" 
                    onChange={handleChange} 
                    className="w-full px-6 py-4 border-0 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none input-focus transition-all duration-300" 
                    required 
                  />
                </div>
              </div>

              <div className="gradient-border">
                <div className="gradient-border-inner">
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    onChange={handleChange} 
                    className="w-full px-6 py-4 border-0 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none input-focus transition-all duration-300" 
                    required 
                  />
                </div>
              </div>

              <div className="gradient-border">
                <div className="gradient-border-inner">
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    placeholder="Confirm Password" 
                    onChange={handleChange} 
                    className="w-full px-6 py-4 border-0 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none input-focus transition-all duration-300" 
                    required 
                  />
                </div>
              </div>

              <div className="gradient-border">
                <div className="gradient-border-inner">
                  <input 
                    type="text" 
                    name="profilePicture" 
                    placeholder="Profile Picture URL (Optional)" 
                    onChange={handleChange} 
                    className="w-full px-6 py-4 border-0 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none input-focus transition-all duration-300" 
                  />
                </div>
              </div>

              <div className="gradient-border">
                <div className="gradient-border-inner">
                  <textarea 
                    name="bio" 
                    placeholder="Tell us about yourself (Optional)" 
                    onChange={handleChange} 
                    className="w-full px-6 py-4 border-0 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none input-focus transition-all duration-300 h-24 resize-none" 
                  />
                </div>
              </div>
            </div>

            {/* Skills Section for Mentor */}
            {role === 'mentor' && (
              <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  Your Skills & Expertise
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    placeholder="Add your skills (e.g., React, Python)"
                    className="flex-1 px-4 py-3 border border-blue-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Add
                  </button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="skill-tag flex items-center bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full font-medium shadow-sm">
                        <span className="mr-2">🔹</span>
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-blue-600 hover:text-red-500 font-bold text-lg transition-colors duration-200"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Terms Agreement */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <input 
                type="checkbox" 
                name="agree" 
                onChange={handleChange} 
                className="mt-1 w-5 h-5 text-blue-600 border-2 border-blue-300 rounded focus:ring-blue-500 transition-all duration-200" 
                required 
              />
              <label className="text-gray-700 leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium underline transition-colors duration-200">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium underline transition-colors duration-200">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-shimmer"
            >
              <span className="flex items-center justify-center gap-2">
                <span>Create Account</span>
                <span className="text-xl">🚀</span>
              </span>
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <a 
                href="/login" 
                className="text-blue-600 hover:text-blue-800 font-semibold underline transition-all duration-200 hover:no-underline"
              >
                Log In Here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;