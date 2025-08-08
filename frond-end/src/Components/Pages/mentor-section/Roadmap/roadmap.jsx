import React, { useEffect, useState } from 'react';
import { PlusCircle, Users, Star, TrendingUp, BookOpen, DollarSign, Eye, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const SeeRoadmaps = () => {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRoadmaps = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/roadmaps/myroadmaps', {
        withCredentials: true,
      });
      setRoadmaps(response.data);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Intermediate': return 'bg-blue-200 text-blue-800 border-blue-300';
      case 'Advanced': return 'bg-blue-300 text-blue-900 border-blue-400';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-blue-800">Loading your roadmaps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative w-full px-6 md:px-10 py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/mentor/mentordashboard')}
              className="p-2 rounded-lg bg-white hover:bg-blue-50 transition-colors duration-200 shadow-sm border border-blue-200"
            >
              <ArrowLeft className="w-5 h-5 text-blue-700" />
            </button>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-md">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                  Your Roadmaps
                </h2>
                <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
              </div>
              <p className="text-blue-600 text-lg">Manage and track your learning paths</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/mentor/createRoadmap')}
            className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <PlusCircle size={22} className="relative z-10" />
            <span className="relative z-10 font-semibold text-lg">Create Roadmap</span>
          </motion.button>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Roadmaps</p>
                <p className="text-3xl font-bold text-blue-800">{roadmaps.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full shadow-inner">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-blue-800">
                  {roadmaps.reduce((acc, rm) => acc + (rm.students?.length || 0), 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full shadow-inner">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-blue-800">
                  ₹{roadmaps.reduce((acc, rm) => acc + ((rm.students?.length || 0) * rm.price), 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full shadow-inner">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Roadmaps Grid */}
        {roadmaps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-16"
          >
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <BookOpen className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-blue-600 mb-2">No roadmaps found</h3>
            <p className="text-blue-500 mb-6">Create your first roadmap to get started</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/mentor/createRoadmap')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <PlusCircle size={20} />
              Create Your First Roadmap
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {roadmaps.map((rm, index) => (
              <motion.div
                key={rm._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-3xl shadow-lg p-8 border border-blue-100 hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 relative overflow-hidden"
              >
                {/* Gradient overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-6">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full border ${
                      rm.status === 'Active'
                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                        : 'bg-blue-200 text-blue-800 border-blue-300'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${rm.status === 'Active' ? 'bg-blue-500' : 'bg-blue-600'} animate-pulse`}></div>
                    {rm.status}
                  </span>
                  
                  {rm.rating && (
                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
                      <Star className="w-3 h-3 text-blue-500 fill-current" />
                      <span className="text-xs font-medium text-blue-700">{rm.rating}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-xl font-bold text-blue-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {rm.title}
                  </h3>
                  <p className="text-blue-600 text-sm line-clamp-2 leading-relaxed">
                    {rm.description}
                  </p>
                </div>

                {/* Metadata */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Users size={16} />
                      <span>{rm.students?.length || 0} Students</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-blue-700">
                      <DollarSign size={16} />
                      <span>₹{rm.price.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {rm.duration && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600">Duration: {rm.duration}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(rm.difficulty)}`}>
                        {rm.difficulty}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/mentor/viewroad/${rm._id}`)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Eye size={18} />
                  <span>View Details</span>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SeeRoadmaps;