import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiUser, FiMail, FiLock, FiAward, FiEdit2,
  FiLink, FiCheck, FiArrowLeft
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
    bio: "",
    profilePicture: "", // Changed from null to empty string for URL
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          withCredentials: true,
        });

        const { fullName, email, role, bio, profilePicture } = res.data.user || {}; 
       
        setFormData({
          fullName: fullName || "",
          email: email || "",
          password: "",
          role: role || "student",
          bio: bio || "",
          profilePicture: profilePicture || ""
        });

      } catch (err) {
        setError("Failed to load profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBioChange = (e) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setFormData(prev => ({ ...prev, bio: value }));
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validate URL if provided
    if (formData.profilePicture && !validateUrl(formData.profilePicture)) {
      setError("Please enter a valid URL for profile picture");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/user/updateprofile", 
        {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password || undefined, // Only send if changed
          role: formData.role,
          bio: formData.bio,
          profilePicture: formData.profilePicture || null
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Success:", response.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Profile update failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
            <button 
              onClick={() => navigate('/mentor/mentordashboard')}
              className="absolute left-6 top-6 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center px-10">
              <h2 className="text-3xl font-bold flex items-center justify-center">
                <FiEdit2 className="mr-3" /> Edit Your Profile
              </h2>
              <p className="text-center text-indigo-100 mt-2">
                Update your information to keep your profile fresh
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Profile Picture URL */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg mb-4">
                {formData.profilePicture ? (
                  <img 
                    src={formData.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "";
                    }}
                  />
                ) : (
                  <FiUser className="text-gray-400 text-5xl" />
                )}
              </div>
              
              <div className="w-full max-w-md">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FiLink className="mr-2 text-indigo-600" /> Profile Picture URL
                </label>
                <input
                  type="url"
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="https://example.com/profile.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">Enter a direct image URL</p>
              </div>
            </div>

            {/* Rest of the form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FiUser className="mr-2 text-indigo-600" /> Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FiMail className="mr-2 text-indigo-600" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FiLock className="mr-2 text-indigo-600" /> Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FiAward className="mr-2 text-indigo-600" /> Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                  required
                >
                  <option value="student">Student</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">About You</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleBioChange}
                rows="4"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                placeholder="Tell us about yourself..."
                maxLength="200"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length}/200 characters
              </p>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg">
                Profile updated successfully!
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center py-3 px-6 rounded-xl font-medium text-white transition-all ${
                  isSubmitting
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Make sure your information is up-to-date to get the best experience.
        </div>
      </div>
    </div>
  );
};

export default EditProfile;