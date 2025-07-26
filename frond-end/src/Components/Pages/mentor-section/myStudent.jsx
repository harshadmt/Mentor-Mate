import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const MyStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simple mock data for testing
  const mockStudents = [
    { 
      name: "Emma Johnson", 
      email: "emma@email.com",
      course: "React Basics",
      progress: 85
    },
    { 
      name: "Alex Chen", 
      email: "alex@email.com",
      course: "JavaScript",
      progress: 70
    },
    { 
      name: "Sarah Williams", 
      email: "sarah@email.com",
      course: "HTML & CSS",
      progress: 95
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setStudents(mockStudents);
      setLoading(false);
    }, 1000);
  }, []);

  // Simple loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 relative">
          <button 
            onClick={() => navigate('/mentor/mentordashboard')}
            className="absolute left-6 top-6 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="text-center px-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              👨‍🏫 My Students
            </h1>
            <p className="text-gray-600">
              Manage and track your students' progress
            </p>
            
            {/* Simple stats */}
            <div className="flex gap-4 mt-4 justify-center">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-blue-600 font-semibold">
                  Total: {students.length}
                </span>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <span className="text-green-600 font-semibold">
                  Active: {students.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Students List */}
        {students.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {students.map((student, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                {/* Student Avatar */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {student.email}
                    </p>
                  </div>
                </div>

                {/* Course Info */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Course:</p>
                  <p className="font-medium text-gray-800">
                    {student.course}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-800">
                      {student.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Students Yet
            </h3>
            <p className="text-gray-600 mb-6">
              When students enroll in your courses, they'll appear here.
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors">
              Invite Students
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStudents;