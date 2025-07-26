import React, { useEffect, useState } from 'react';
import { PlusCircle, Users, Star, TrendingUp, BookOpen, DollarSign, Eye, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SeeRoadmaps = () => {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);

  const fetchRoadmaps = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/roadmaps/myroadmaps', {
        withCredentials: true,
      });
      setRoadmaps(response.data);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative w-full px-6 md:px-10 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/mentor/mentordashboard')}
              className="p-2 rounded-lg bg-white/80 hover:bg-white transition-colors duration-200 shadow-sm border border-gray-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Your Roadmaps
                </h2>
                <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
              </div>
              <p className="text-gray-600 text-lg">Manage and track your learning paths</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/mentor/createRoadmap')}
            className="group relative flex items-center gap-3 bg-blue-600 via-blue-500 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <PlusCircle size={22} className="relative z-10" />
            <span className="relative z-10 font-semibold text-lg">Create Roadmap</span>
          </button>
        </div>

        {/* Rest of the component remains the same */}
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Roadmaps</p>
                <p className="text-3xl font-bold text-gray-800">{roadmaps.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-gray-800">
                  {roadmaps.reduce((acc, rm) => acc + (rm.students?.length || 0), 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-800">
                  ₹{roadmaps.reduce((acc, rm) => acc + ((rm.students?.length || 0) * rm.price), 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Roadmaps Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((rm, index) => (
            <div
              key={rm._id}
              className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20 hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-500 hover:bg-white/95 relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-6">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full border ${
                    rm.status === 'Active'
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${rm.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                  {rm.status}
                </span>
                
                {rm.rating && (
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium text-yellow-700">{rm.rating}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-4 mb-6">
                <h3 className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                  {rm.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                  {rm.description}
                </p>
              </div>

              {/* Metadata */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={16} />
                    <span>{rm.students?.length || 0} Students</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-green-600">
                    <DollarSign size={16} />
                    <span>₹{rm.price.toLocaleString()}</span>
                  </div>
                </div>
                
                {rm.duration && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration: {rm.duration}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(rm.difficulty)}`}>
                      {rm.difficulty}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate(`/mentor/viewroad/${rm._id}`)}
                className="group/btn w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity duration-300"></div>
                <Eye size={18} />
                <span>View Details</span>
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {roadmaps.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No roadmaps found</h3>
            <p className="text-gray-500 mb-6">Create your first roadmap to get started</p>
            <button
              onClick={() => navigate('/mentor/createRoadmap')}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300"
            >
              <PlusCircle size={20} />
              Create Your First Roadmap
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeeRoadmaps;