import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiBookOpen, FiBarChart2, FiAward, FiLock } from "react-icons/fi";

const AllRoadmaps = () => {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);

  const fetchRoadmaps = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/roadmaps/getall', {
        withCredentials: true
      });
      setRoadmaps(response.data.data);
    } catch (error) {
      console.error('Error fetching roadmaps:', error.message);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleUnlockClick = (roadmap) => {
    if (roadmap.isPurchased) {
      navigate(`/roadmap/${roadmap._id}`);
      return;
    }
    // Here you would implement your unlock logic
    // For now, we'll just navigate to the roadmap
    navigate(`/roadmap/${roadmap._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <button 
        onClick={() => navigate('/student/studentdashboard')}
        className="mb-8 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>

      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
          🚀 Learning Roadmaps
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Carefully crafted learning paths designed by industry experts to accelerate your career growth
        </p>
        <div className="mt-8 inline-flex items-center space-x-8 text-sm text-gray-500">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Expert-designed curricula
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Progress tracking
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Real-world projects
          </span>
        </div>
      </div>

      {roadmaps.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-xl text-gray-500">No roadmaps available at the moment.</p>
          <p className="text-gray-400 mt-2">Check back soon for amazing learning content!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap._id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-1"
            >
              {/* Top gradient bar */}
              <div className={`h-2 ${roadmap.color || 'bg-gradient-to-r from-indigo-500 to-blue-500'}`}></div>
              
              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {roadmap.title}
                  </h3>
                  {roadmap.isPurchased && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                      ✅ Owned
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {roadmap.description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-indigo-600">{roadmap.steps?.length || 0}</div>
                    <div className="text-xs text-gray-500">📚 Steps</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">{roadmap.rating}</div>
                    <div className="text-xs text-gray-500">⭐ Rating</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{roadmap.students}</div>
                    <div className="text-xs text-gray-500">👥 Students</div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-orange-600">{roadmap.resources?.length || 0}</div>
                    <div className="text-xs text-gray-500">📚 Resources</div>
                  </div>
                </div>

                {/* Creator */}
                {roadmap.createdBy && (
                  <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={roadmap.createdBy.profilePicture || "/default-avatar.png"}
                      alt="creator"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{roadmap.createdBy.fullName}</div>
                      <div className="text-sm text-gray-500">Course Instructor</div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleUnlockClick(roadmap)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    roadmap.isPurchased
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-green-200"
                      : "bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 shadow-lg hover:shadow-indigo-200"
                  } transform hover:scale-105 flex items-center justify-center`}
                >
                  {roadmap.isPurchased ? (
                    <>
                      <FiBookOpen className="mr-2" />
                      Continue Learning
                    </>
                  ) : (
                    <>
                      <FiLock className="mr-2" />
                      Unlock Roadmap
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllRoadmaps;