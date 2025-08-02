import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiAlertCircle, FiArrowLeft, FiMail, FiMessageSquare, FiBook } from 'react-icons/fi';

const Mentors = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await axios.get(
          'http://localhost:5000/api/student/mentors',
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.success) {
          console.log('Mentors fetched:', response.data.data); // Debug log
          setMentors(response.data.data);
        } else {
          console.warn('Failed to load mentors:', response.data.message);
          setError(response.data.message || 'Failed to load mentors');
        }
      } catch (err) {
        console.error('Error fetching mentors:', err);
        const errorMessage = err.response?.data?.message || 'Unable to fetch mentors';
        setError(errorMessage);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your mentors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-500 p-6 text-white">
            <div className="flex items-center justify-center">
              <FiAlertCircle className="text-3xl mr-3" />
              <h2 className="text-2xl font-bold">Oops!</h2>
            </div>
          </div>
          <div className="p-6 text-center">
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => navigate('/student/studentdashboard')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Mentors</h1>
            <p className="text-gray-600">
              Connect with industry experts guiding your learning journey
            </p>
          </div>
          <button
            onClick={() => navigate('/student/studentdashboard')}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
        </div>

        {/* Mentor List */}
        {mentors.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiUser className="text-blue-500 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">No Mentors Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't purchased any roadmaps yet. Explore our roadmaps to connect with expert mentors.
            </p>
            <button
              onClick={() => navigate('/student/roadmaps')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Browse Roadmaps
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <div
                key={mentor._id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="flex flex-col items-center text-center mb-4">
                  <img
                    src={mentor.profilePicture || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80'}
                    alt={mentor.fullName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm mb-4"
                  />
                  <h3 className="text-lg font-bold text-gray-800">{mentor.fullName}</h3>
                  <p className="text-gray-500 text-sm">{mentor.bio || 'Professional Mentor'}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <FiMail className="mr-2 text-blue-500" />
                    <span className="text-sm truncate">{mentor.email}</span>
                  </div>
                  <div className="flex items-start text-gray-600">
                    <FiBook className="mt-0.5 mr-2 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Roadmaps Created</p>
                      <p className="text-xs text-gray-500">
                        {mentor.roadmapsCount} roadmap{mentor.roadmapsCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    className="flex-1 flex items-center justify-center py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    disabled
                  >
                    <FiMessageSquare className="mr-2" />
                    Message
                  </button>
                  <button
                    onClick={() => navigate(`/student/mentorprofile/${mentor._id}`)}
                    className="flex-1 flex items-center justify-center py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mentors;