import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiAward, FiBookOpen, FiBarChart2, FiExternalLink } from 'react-icons/fi';

const PurchasedRoadmap = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Sample data - replace with actual data from your API
  const roadmap = {
    _id: id,
    title: "Full Stack Web Development",
    description: "Master modern web development with this comprehensive roadmap covering frontend, backend, and DevOps.",
    progress: 35,
    rating: 4.8,
    students: 1250,
    color: "from-blue-500 to-purple-600",
    steps: [
      {
        title: "HTML & CSS Fundamentals",
        description: "Learn the building blocks of web development",
        completed: true,
        resources: [
          { type: 'video', name: 'HTML Crash Course', duration: '2h 15m', url: '#', completed: true },
          { type: 'article', name: 'CSS Grid Guide', duration: '45m', url: '#', completed: true },
          { type: 'exercise', name: 'Build Portfolio Page', duration: '1h 30m', url: '#', completed: false }
        ]
      },
      {
        title: "JavaScript Mastery",
        description: "Deep dive into modern JavaScript concepts",
        completed: true,
        resources: [
          { type: 'video', name: 'ES6 Features', duration: '3h', url: '#', completed: true },
          { type: 'article', name: 'Async/Await Patterns', duration: '30m', url: '#', completed: false }
        ]
      },
      {
        title: "React Framework",
        description: "Build interactive UIs with React",
        completed: false,
        resources: [
          { type: 'video', name: 'React Basics', duration: '4h', url: '#', completed: false },
          { type: 'exercise', name: 'Todo App Project', duration: '2h', url: '#', completed: false }
        ]
      },
      {
        title: "Node.js Backend",
        description: "Create server-side applications with Node",
        completed: false,
        resources: []
      }
    ],
    resources: [
      { type: 'cheatsheet', name: 'JavaScript Cheat Sheet', description: 'Quick reference guide', url: '#' },
      { type: 'template', name: 'Starter Project Template', description: 'Pre-configured setup', url: '#' }
    ]
  };

  const getResourceIcon = (type) => {
    switch(type) {
      case 'video': return <span className="text-red-500">🎥</span>;
      case 'article': return <span className="text-blue-500">📄</span>;
      case 'exercise': return <span className="text-green-500">💻</span>;
      case 'cheatsheet': return <span className="text-yellow-500">📋</span>;
      case 'template': return <span className="text-purple-500">🚀</span>;
      default: return <span>📚</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${roadmap.color} text-white py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => navigate('/student/roadmaps')}
            className="mb-6 flex items-center text-white/90 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Roadmaps
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{roadmap.title}</h1>
              <p className="text-lg text-white/90 max-w-3xl">{roadmap.description}</p>
            </div>
            
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{roadmap.rating}</div>
                <div className="text-sm opacity-80">Rating</div>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">{roadmap.students}+</div>
                <div className="text-sm opacity-80">Students</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-xl shadow-lg p-1">
          <div className="relative h-4 bg-gray-200 rounded-lg overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500"
              style={{ width: `${roadmap.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2 px-2">
            <span className="text-sm font-medium text-gray-600">
              {roadmap.progress}% Complete
            </span>
            <span className="text-sm font-medium text-gray-600">
              {roadmap.steps.filter(s => s.completed).length}/{roadmap.steps.length} Sections
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Curriculum */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold flex items-center">
                <FiBookOpen className="mr-2 text-blue-600" />
                Learning Path
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {roadmap.steps.map((step, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      step.completed ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {step.completed ? (
                        <FiCheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold flex items-center">
                        {step.title}
                        {step.completed && (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            Completed
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-600 mt-1">{step.description}</p>
                      
                      {step.resources.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <h4 className="text-sm font-medium text-gray-500 flex items-center">
                            <FiAward className="mr-1" /> Resources
                          </h4>
                          
                          <div className="space-y-2">
                            {step.resources.map((resource, resIndex) => (
                              <a
                                key={resIndex}
                                href={resource.url}
                                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                              >
                                <div className="flex-shrink-0 mr-3 text-xl">
                                  {getResourceIcon(resource.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {resource.name}
                                  </p>
                                  <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <FiClock className="mr-1" />
                                    {resource.duration}
                                    <span className="mx-2">•</span>
                                    <span className="capitalize">{resource.type}</span>
                                  </div>
                                </div>
                                {resource.completed ? (
                                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                    Completed
                                  </span>
                                ) : (
                                  <FiExternalLink className="ml-2 text-gray-400" />
                                )}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Resources & Stats */}
        <div className="space-y-6">
          {/* Completion Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <h3 className="text-lg font-bold flex items-center">
                <FiBarChart2 className="mr-2" />
                Your Progress
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Overall Completion</span>
                <span className="font-bold">{roadmap.progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-green-500 rounded-full"
                  style={{ width: `${roadmap.progress}%` }}
                ></div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sections Completed</span>
                  <span className="font-bold">
                    {roadmap.steps.filter(s => s.completed).length}/{roadmap.steps.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Resources Completed</span>
                  <span className="font-bold">
                    {roadmap.steps.flatMap(s => s.resources).filter(r => r.completed).length}/
                    {roadmap.steps.flatMap(s => s.resources).length}
                  </span>
                </div>
              </div>
              
              <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                Continue Learning
              </button>
            </div>
          </div>

          {/* Additional Resources */}
          {roadmap.resources.length > 0 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold flex items-center">
                  <FiAward className="mr-2 text-blue-600" />
                  Bonus Resources
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {roadmap.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      className="flex items-start p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex-shrink-0 mr-3 text-xl mt-1">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {resource.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {resource.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Certificate */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-yellow-200">
            <div className="p-6 bg-gradient-to-r from-yellow-100 to-yellow-50">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-yellow-400 rounded-lg text-white mr-4">
                  <FiAward className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Earn Your Certificate</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Complete all sections to unlock your certificate of completion
                  </p>
                  <div className="mt-3 h-2 bg-yellow-200 rounded-full">
                    <div 
                      className="h-2 bg-yellow-500 rounded-full"
                      style={{ width: `${roadmap.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasedRoadmap;