import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  FiArrowLeft,
  FiMail,
  FiBook,
  FiUser,
  FiMessageSquare,
  FiCalendar,
  FiDollarSign,
} from 'react-icons/fi';

const MentorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await axios.get(
          `http://localhost:5000/api/student/mentor/${id}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          console.log('Mentor data fetched:', response.data.data);
          setMentor(response.data.data);
        } else {
          console.warn('Failed to load mentor data:', response.data.message);
          setError(response.data.message || 'Failed to load mentor profile');
        }
      } catch (err) {
        console.error('Error fetching mentor data:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setError(err.response?.data?.message || 'Unable to load mentor profile');
        if (err.response?.status === 401) {
          navigate('/login');
        } else if (err.response?.status === 404 || err.response?.status === 403) {
          setError(err.response.data.message || 'Mentor not found or you do not have access to this profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading mentor profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-center">
              <FiUser className="text-3xl mr-3" />
              <h2 className="text-2xl font-bold">Profile Error</h2>
            </div>
          </div>
          <div className="p-6 text-center">
            <p className="text-gray-700 mb-6 text-lg">{error}</p>
            <button
              onClick={() => navigate('/student/mentors')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Back to Mentors
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/student/mentor')}
          className="flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Mentors
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row items-start md:items-end -mt-16">
              <img
                src={mentor.profilePicture || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80'}
                alt={mentor.fullName}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="mt-4 md:mt-0 md:ml-6">
                <h1 className="text-3xl font-bold text-gray-800">{mentor.fullName}</h1>
                <p className="text-xl text-blue-600">{mentor.bio || 'Professional Mentor'}</p>
                {mentor.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {mentor.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4 md:mt-0 md:ml-auto">
                <button
                  className="flex items-center px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                  disabled
                >
                  <FiMessageSquare className="mr-2" />
                  Contact Mentor
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">About {mentor.fullName.split(' ')[0]}</h2>
              <p className="text-gray-600 mb-6">{mentor.bio || 'This mentor hasn\'t added a bio yet.'}</p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FiBook className="mt-1 mr-4 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-gray-700">Roadmaps Created</h3>
                    <p className="text-gray-600">{mentor.roadmapsCount || 0} roadmap{mentor.roadmapsCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FiMail className="mt-1 mr-4 text-blue-400" />
                  <div>
                    <h3 className="font-semibold text-gray-700">Contact</h3>
                    <p className="text-gray-600">{mentor.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Created Roadmaps</h2>
              {mentor.createdRoadmaps.length === 0 ? (
                <div className="text-center py-8">
                  <FiBook className="mx-auto text-gray-400 text-4xl mb-3" />
                  <p className="text-gray-500">This mentor hasn't created any roadmaps yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {mentor.createdRoadmaps.map((roadmap) => (
                    <div
                      key={roadmap._id}
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-center">
                        <div className="md:flex-1">
                          <h3 className="text-lg font-bold text-gray-800 mb-1">{roadmap.title}</h3>
                          <p className="text-gray-600 mb-3">{roadmap.description}</p>
                          {roadmap.price > 0 && (
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                              <FiDollarSign className="mr-2" />
                              <span>Price: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(roadmap.price)}</span>
                            </div>
                          )}
                          {roadmap.resources?.length > 0 && (
                            <div className="mb-3">
                              <h4 className="text-sm font-semibold text-gray-700">Resources:</h4>
                              <ul className="list-disc list-inside text-gray-600 text-sm">
                                {roadmap.resources.map((resource, index) => (
                                  <li key={index}>
                                    {resource.name} ({resource.type})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {roadmap.steps?.length > 0 && (
                            <div className="mb-3">
                              <h4 className="text-sm font-semibold text-gray-700">Steps:</h4>
                              <ul className="list-decimal list-inside text-gray-600 text-sm">
                                {roadmap.steps.map((step, index) => (
                                  <li key={index}>
                                    {step.title} - Week {step.week}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-500">
                            <FiCalendar className="mr-2" />
                            <span>Last updated: {new Date(roadmap.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-4">
                          <button
                            onClick={() => navigate(`/student/roadmaps/${roadmap._id}`)}
                            className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
                          >
                            View Roadmap
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;