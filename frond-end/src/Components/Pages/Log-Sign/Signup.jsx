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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <ToastContainer />
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-6xl grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side with Gradient */}
        <div className="bg-gradient-to-r from-blue-100 to-blue-300 p-10 flex flex-col justify-center rounded-tl-2xl rounded-bl-2xl">
          <button onClick={()=>navigate('/')}><div className="text-blue-600 font-bold text-3xl mb-2">⚡ Mentor Mate</div></button>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Join MentorMate</h1>
          <p className="text-gray-700 mb-6">Your Gateway to Guided Learning</p>
          <img src={signupImage} alt="Signup" className="rounded-lg w-full h-auto mb-6" />
          <h2 className="text-xl font-semibold mb-2">Why Choose MentorMate?</h2>
          <ul className="text-gray-800 text-sm list-disc pl-4 space-y-1">
            <li>🔍 Personalized learning paths</li>
            <li>👨‍🏫 Learn from verified mentors</li>
            <li>📈 Track your progress easily</li>
            <li>💬 Interactive discussions & feedback</li>
          </ul>
        </div>

        {/* Right Form */}
        <div className="p-10 flex justify-center items-center">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Create Your Account</h2>

            <div className="flex gap-4 mb-2">
              <div onClick={() => setRole('student')} className={`border rounded-lg p-4 cursor-pointer flex-1 text-center ${role === 'student' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                🎓 <strong>Student</strong>
              </div>
              <div onClick={() => setRole('mentor')} className={`border rounded-lg p-4 cursor-pointer flex-1 text-center ${role === 'mentor' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                🧑‍🏫 <strong>Mentor</strong>
              </div>
            </div>

            <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} className="w-full px-4 py-2 border rounded-md text-sm" required />
            <input type="email" name="email" placeholder="Email Address" onChange={handleChange} className="w-full px-4 py-2 border rounded-md text-sm" required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full px-4 py-2 border rounded-md text-sm" required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="w-full px-4 py-2 border rounded-md text-sm" required />
            <input type="text" name="profilePicture" placeholder="Profile Picture URL" onChange={handleChange} className="w-full px-4 py-2 border rounded-md text-sm" />
            <textarea name="bio" placeholder="Tell us about yourself" onChange={handleChange} className="w-full px-4 py-2 border rounded-md text-sm h-24" />

            {role === 'mentor' && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    placeholder="Add your skills"
                    className="flex-1 px-4 py-2 border rounded-md text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-start text-sm">
              <input type="checkbox" name="agree" onChange={handleChange} className="mr-2 mt-1" required />
              <label>
                I agree to the <a href="#" className="text-blue-600 underline">Terms of Service</a> and <a href="#" className="text-blue-600 underline">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md font-semibold">
              Create Account
            </button>
            <p className="text-center text-sm mt-4">
              Already have an account? <a href="/login" className="text-blue-600 underline">Log In</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;