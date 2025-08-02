import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiCheckCircle,
  FiClock,
  FiAward,
  FiBookOpen,
  FiBarChart2,
  FiExternalLink,
  FiAlertCircle
} from 'react-icons/fi';

const PurchasedRoadmap = () => {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const stepRefs = useRef([]);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/student/my-roadmap',
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.data.success) {
          setRoadmaps(response.data.unlocked);
          if (response.data.unlocked.length > 0) {
            setSelectedRoadmap(response.data.unlocked[0]);
          }
        } else {
          setError(response.data.message || 'Failed to load roadmaps');
        }
      } catch (err) {
        console.error('Error fetching roadmaps:', err);
        const errorMessage = err.response?.data?.message || 'You do not have access to any roadmaps';
        setError(errorMessage);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, [navigate]);

  const getResourceIcon = (type) => {
    switch (type) {
      case 'video': return <span className="text-red-500">🎥</span>;
      case 'article': return <span className="text-blue-500">📄</span>;
      case 'exercise': return <span className="text-green-500">💻</span>;
      case 'cheatsheet': return <span className="text-yellow-500">📋</span>;
      case 'template': return <span className="text-purple-500">🚀</span>;
      default: return <span>📚</span>;
    }
  };

  const handleContinueLearning = () => {
    if (!selectedRoadmap || !selectedRoadmap.steps) {
      alert('No roadmap selected or no steps available.');
      return;
    }

    const firstUncompletedStepIndex = selectedRoadmap.steps.findIndex(step => !step.completed);
    
    if (firstUncompletedStepIndex === -1) {
      alert('Congratulations! You have completed all steps in this roadmap.');
      return;
    }

    const stepElement = stepRefs.current[firstUncompletedStepIndex];
    if (stepElement) {
      stepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <FiAlertCircle className="mx-auto text-red-500 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/student/roadmaps')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to My Roadmaps
          </button>
        </div>
      </div>
    );
  }

  if (roadmaps.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No unlocked roadmaps found</p>
          <button
            onClick={() => navigate('/student/studentdashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleSelectRoadmap = (roadmap) => {
    setSelectedRoadmap(roadmap);
    stepRefs.current = []; 
  };

  const completedSections = selectedRoadmap?.steps?.filter((s) => s.completed).length || 0;
  const totalSections = selectedRoadmap?.steps?.length || 0;
  const allResources = selectedRoadmap?.steps?.flatMap((s) => s.resources || []) || [];
  const completedResources = allResources.filter((r) => r.completed).length;
  const progress = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Roadmap List */}
      <div className="bg-white py-6 px-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">My Unlocked Roadmaps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap._id}
                onClick={() => handleSelectRoadmap(roadmap)}
                className={`p-4 rounded-lg cursor-pointer ${
                  selectedRoadmap?._id === roadmap._id
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-gray-100 hover:bg-gray-200'
                } border`}
              >
                <h3 className="text-lg font-semibold">{roadmap.title}</h3>
                <p className="text-sm text-gray-600 truncate">{roadmap.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Created by {roadmap.createdBy?.fullName || 'Unknown Mentor'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Roadmap Details */}
      {selectedRoadmap && (
        <>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-12 px-6">
            <div className="max-w-7xl mx-auto">
              <button
                onClick={() => navigate('/student/studentdashboard')}
                className="mb-6 flex items-center text-white/90 hover:text-white"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to dashboard
              </button>

              <div>
                <h1 className="text-4xl font-bold mb-2">{selectedRoadmap.title}</h1>
                <p className="text-lg text-white/90 max-w-3xl">{selectedRoadmap.description}</p>
                <p className="mt-2 text-sm text-white/70">
                  Created by <strong>{selectedRoadmap.createdBy?.fullName || 'Unknown Mentor'}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="max-w-7xl mx-auto px-6 -mt-6">
            <div className="bg-white rounded-xl shadow-lg p-1">
              <div className="relative h-4 bg-gray-200 rounded-lg overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2 px-2">
                <span className="text-sm font-medium text-gray-600">
                  {progress}% Complete
                </span>
                <span className="text-sm font-medium text-gray-600">
                  {completedSections}/{totalSections} Sections
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Learning Steps */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold flex items-center">
                    <FiBookOpen className="mr-2 text-blue-600" />
                    Learning Path
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {selectedRoadmap.steps?.map((step, index) => (
                    <div
                      key={index}
                      ref={(el) => (stepRefs.current[index] = el)}
                      className="p-6 hover:bg-gray-50"
                    >
                      <div className="flex items-start">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                            step.completed ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                          }`}
                        >
                          {step.completed ? (
                            <FiCheckCircle className="w-5 h-5" />
                          ) : (
                            <span className="font-bold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">
                            {step.title}
                            {step.completed && (
                              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                Completed
                              </span>
                            )}
                          </h3>
                          <p className="text-gray-600 mt-1">{step.description}</p>

                          {step.resources?.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <h4 className="text-sm font-medium text-gray-500 flex items-center">
                                <FiAward className="mr-1" /> Resources
                              </h4>
                              {step.resources.map((res, i) => (
                                <a
                                  key={i}
                                  href={res.url || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                                >
                                  <div className="mr-3 text-xl">{getResourceIcon(res.type)}</div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{res.name}</p>
                                    <p className="text-xs text-gray-500 flex items-center">
                                      <FiClock className="mr-1" />
                                      {res.duration || '—'} • {res.type}
                                    </p>
                                  </div>
                                  {res.completed ? (
                                    <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                      Completed
                                    </span>
                                  ) : (
                                    <FiExternalLink className="ml-2 text-gray-400" />
                                  )}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Progress */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-600 text-white">
                  <h3 className="text-lg font-bold flex items-center">
                    <FiBarChart2 className="mr-2" />
                    Your Progress
                  </h3>
                </div>
                <div className="p-6">
                  <div className="flex justify-between mb-4 text-gray-600">
                    <span>Overall Completion</span>
                    <span className="font-bold">{progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full mb-6">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Sections Completed</span>
                      <span className="font-semibold">
                        {completedSections}/{totalSections}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resources Completed</span>
                      <span className="font-semibold">
                        {completedResources}/{allResources.length}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleContinueLearning}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
                  >
                    Continue Learning
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PurchasedRoadmap;