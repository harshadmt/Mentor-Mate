import React, { useEffect, useState } from 'react';
import { PlusCircle, Users, Star, TrendingUp, BookOpen, DollarSign, Eye, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
            }}
            className="mx-auto w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent mb-6"
          ></motion.div>
          <motion.p 
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xl font-medium text-blue-800"
          >
            Loading your roadmaps...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Floating animated bubbles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            y: Math.random() * 100,
            x: Math.random() * 100,
            opacity: 0.3
          }}
          animate={{ 
            y: [Math.random() * 100, Math.random() * -100],
            x: [Math.random() * 100, Math.random() * -100],
          }}
          transition={{
            duration: 20 + Math.random() * 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          className={`absolute rounded-full ${i % 3 === 0 ? 'bg-blue-200' : i % 2 === 0 ? 'bg-indigo-200' : 'bg-sky-200'}`}
          style={{
            width: `${10 + Math.random() * 30}px`,
            height: `${10 + Math.random() * 30}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: 'blur(8px)',
            opacity: 0.3
          }}
        />
      ))}

      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "backOut" }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
        >
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/mentor/mentordashboard')}
              className="p-2 rounded-lg bg-white hover:bg-blue-50 transition-all duration-200 shadow-sm border border-blue-200 hover:shadow-md"
            >
              <ArrowLeft className="w-5 h-5 text-blue-700" />
            </motion.button>
            <div className="space-y-2">
              <motion.div 
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3"
              >
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
                  className="p-2 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-xl shadow-md"
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </motion.div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-indigo-600 bg-clip-text text-transparent">
                  Your Roadmaps
                </h2>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </motion.div>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-blue-600 text-lg"
              >
                Manage and track your learning paths
              </motion.p>
            </div>
          </div>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/mentor/createRoadmap')}
            className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <PlusCircle size={22} className="relative z-10" />
            </motion.div>
            <span className="relative z-10 font-semibold text-lg">Create Roadmap</span>
          </motion.button>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              icon: <BookOpen className="w-6 h-6 text-blue-600" />,
              title: "Total Roadmaps",
              value: roadmaps.length,
              color: "from-blue-100 to-blue-200"
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-30 -z-10" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">{stat.title}</p>
                  <motion.p 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="text-3xl font-bold text-blue-800"
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <motion.div 
                  whileHover={{ rotate: 10 }}
                  className={`p-3 bg-gradient-to-br ${stat.color} rounded-full shadow-inner`}
                >
                  {stat.icon}
                </motion.div>
              </div>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                className="h-1 bg-gradient-to-r from-blue-400 to-blue-200 mt-4 rounded-full"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Roadmaps Grid */}
        {roadmaps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
              className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-inner"
            >
              <BookOpen className="w-12 h-12 text-blue-400" />
            </motion.div>
            <h3 className="text-xl font-semibold text-blue-600 mb-2">No roadmaps found</h3>
            <p className="text-blue-500 mb-6">Create your first roadmap to get started</p>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 5px 15px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/mentor/createRoadmap')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <PlusCircle size={20} />
              </motion.div>
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
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 10
                }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 15px 30px -5px rgba(59, 130, 246, 0.3)"
                }}
                className="group bg-white rounded-3xl shadow-xl p-8 border border-blue-100 hover:shadow-2xl transform transition-all duration-300 relative overflow-hidden"
              >
                {/* Gradient overlay */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.2 }}
                  className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-2xl transition-opacity duration-500"
                />
                
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-6">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full border ${
                      rm.status === 'Active'
                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                        : 'bg-blue-200 text-blue-800 border-blue-300'
                    }`}
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-2 h-2 rounded-full ${rm.status === 'Active' ? 'bg-blue-500' : 'bg-blue-600'}`}
                    />
                    {rm.status}
                  </motion.span>
                  
                  {rm.rating && (
                    <motion.div 
                      whileHover={{ rotate: 10 }}
                      className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full border border-blue-200"
                    >
                      <Star className="w-3 h-3 text-blue-500 fill-current" />
                      <span className="text-xs font-medium text-blue-700">{rm.rating}</span>
                    </motion.div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-4 mb-6 relative z-10">
                  <motion.h3 
                    whileHover={{ color: "#2563eb" }}
                    className="text-xl font-bold text-blue-800 line-clamp-2 transition-colors duration-300"
                  >
                    {rm.title}
                  </motion.h3>
                  <motion.p 
                    whileHover={{ color: "#1d4ed8" }}
                    className="text-blue-600 text-sm line-clamp-2 leading-relaxed transition-colors duration-300"
                  >
                    {rm.description}
                  </motion.p>
                </div>

                {/* Metadata */}
                <div className="space-y-3 mb-6 relative z-10">
                  <div className="flex items-center justify-between text-sm">
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 text-blue-600"
                    >
                      
                    </motion.div>
                    <motion.div 
                      whileHover={{ x: -5 }}
                      className="flex items-center gap-2 font-bold text-blue-700"
                    >
                      <DollarSign size={16} />
                      <span>₹{rm.price.toLocaleString()}</span>
                    </motion.div>
                  </div>
                  
                  {rm.duration && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600">Duration: {rm.duration}</span>
                      <motion.span 
                        whileHover={{ scale: 1.1 }}
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(rm.difficulty)}`}
                      >
                        {rm.difficulty}
                      </motion.span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    background: "linear-gradient(to right, #2563eb, #4338ca)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/mentor/viewroad/${rm._id}`)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
                >
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-0 h-full w-8 bg-white opacity-20 transform -skew-x-12"
                  />
                  <Eye size={18} />
                  <span>View Details</span>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Floating CTA at bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-10"
      >
        <motion.button
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/mentor/createRoadmap')}
          className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <PlusCircle size={24} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SeeRoadmaps;