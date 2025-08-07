import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, BookOpen, BarChart2, User } from 'lucide-react';
import axios from 'axios';

const MyStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/mentor/students', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
     
        
        setStudents(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);
   
  const handleViewStudent = (studentId) => {
    navigate(`/mentor/students/${studentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-500"></div>
          
          <button 
            onClick={() => navigate('/mentor/mentordashboard')}
            className="absolute left-6 top-6 p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 mr-1" />
            <span className="text-sm font-medium">Back</span>
          </button>
          
          <div className="text-center px-4 md:px-10 pt-2">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                My Students
              </span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Track and support your students' learning journey. See who's enrolled in your roadmaps and monitor their progress.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              <div className="bg-blue-50 px-5 py-3 rounded-xl flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Students</p>
                  <p className="text-lg font-bold text-blue-600">{students.length}</p>
                </div>
              </div>
              
              <div className="bg-green-50 px-5 py-3 rounded-xl flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Active Learners</p>
                  <p className="text-lg font-bold text-green-600">{students.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Students List */}
        {students.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => (
              <div 
                key={student.id} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
              >
                {/* Student Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 flex items-center">
                  <div className="relative">
                    {student.profilePicture ? (
                      <img 
                        src={student.profilePicture} 
                        alt={student.fullName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {student.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800">
                      {student.fullName}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Mail className="w-4 h-4 mr-1" />
                      <span>{student.email}</span>
                    </div>
                  </div>
                </div>

                {/* Student Details */}
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <BookOpen className="w-4 h-4 mr-2" />
                      <span>Enrolled Roadmaps</span>
                    </div>
                    {student.purchasedRoadmaps && student.purchasedRoadmaps.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {student.purchasedRoadmaps.slice(0, 3).map((roadmap, idx) => (
                          <span 
                            key={idx} 
                            className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded"
                          >
                            {roadmap.title}
                          </span>
                        ))}
                        {student.purchasedRoadmaps.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            +{student.purchasedRoadmaps.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No roadmaps yet</p>
                    )}
                  </div>

                  {/* Progress (placeholder - would need actual progress data) */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div className="flex items-center text-gray-600">
                        <BarChart2 className="w-4 h-4 mr-2" />
                        <span>Engagement</span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {Math.floor(Math.random() * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={() => handleViewStudent(student.id)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg transition-all transform hover:scale-[1.02]"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center max-w-3xl mx-auto">
            <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Students Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              When students enroll in your roadmaps, they'll appear here. Share your roadmaps to attract learners!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors">
                Share Your Roadmaps
              </button>
              <button 
                onClick={() => navigate('/mentor/roadmaps')}
                className="border border-blue-500 text-blue-500 hover:bg-blue-50 py-2 px-6 rounded-lg transition-colors"
              >
                Create New Roadmap
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStudents;