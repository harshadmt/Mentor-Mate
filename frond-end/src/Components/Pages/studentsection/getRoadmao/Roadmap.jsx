import React, { useState } from 'react';
import { Lock, Unlock, CheckCircle, PlayCircle, Clock, Star, ArrowRight, CreditCard } from 'lucide-react';

const RoadmapSystem = () => {
  const [unlockedRoadmaps, setUnlockedRoadmaps] = useState(new Set());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  // Sample data adapted to match your Mongoose schema
  const roadmaps = [
    {
      _id: "1",
      title: "Full Stack Web Development",
      description: "Master modern web development from frontend to backend",
      price: 99,
      steps: [
        { title: "HTML & CSS Fundamentals", description: "Learn the building blocks of web development", week: 1 },
        { title: "JavaScript Mastery", description: "Master the language of the web", week: 2 },
        { title: "React Development", description: "Build interactive user interfaces", week: 4 },
        { title: "Node.js & Express", description: "Create server-side applications", week: 6 },
        { title: "Database Integration", description: "Work with MongoDB and SQL", week: 8 },
        { title: "Deployment & DevOps", description: "Deploy your applications", week: 10 }
      ],
      resources: [
        { type: "video", name: "Introduction to Web Development" },
        { type: "article", name: "CSS Best Practices" },
        { type: "exercise", name: "JavaScript Challenges" }
      ],
      color: "from-purple-500 to-pink-500",
      rating: 4.9,
      students: 15420
    },
    {
      _id: "2",
      title: "Mobile App Development",
      description: "Build native iOS and Android apps with React Native",
      price: 129,
      steps: [
        { title: "React Native Basics", description: "Get started with mobile development", week: 1 },
        { title: "Navigation & Routing", description: "Implement app navigation", week: 3 },
        { title: "State Management", description: "Manage your app state effectively", week: 5 },
        { title: "Native APIs & Features", description: "Access device capabilities", week: 7 },
        { title: "UI/UX Design Patterns", description: "Create beautiful interfaces", week: 9 },
        { title: "Testing & Deployment", description: "Publish your apps", week: 11 }
      ],
      resources: [
        { type: "video", name: "React Native Setup Guide" },
        { type: "article", name: "Mobile UI Patterns" },
        { type: "exercise", name: "App Building Challenge" }
      ],
      color: "from-blue-500 to-cyan-500",
      rating: 4.8,
      students: 8930
    },
    {
      _id: "3",
      title: "Data Science & Machine Learning",
      description: "Learn Python, statistics, and ML algorithms",
      price: 149,
      steps: [
        { title: "Python for Data Science", description: "Python fundamentals for data", week: 1 },
        { title: "Statistics & Probability", description: "Essential math for ML", week: 3 },
        { title: "Data Visualization", description: "Communicate insights", week: 5 },
        { title: "Machine Learning Basics", description: "Introduction to algorithms", week: 7 },
        { title: "Deep Learning", description: "Neural networks and beyond", week: 9 },
        { title: "MLOps & Deployment", description: "Productionize your models", week: 11 }
      ],
      resources: [
        { type: "video", name: "Python Data Science Intro" },
        { type: "article", name: "ML Algorithms Explained" },
        { type: "exercise", name: "Data Analysis Project" }
      ],
      color: "from-green-500 to-teal-500",
      rating: 4.7,
      students: 12350
    }
  ];

  const handleUnlock = (roadmap) => {
    setSelectedRoadmap(roadmap);
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    if (selectedRoadmap) {
      setUnlockedRoadmaps(prev => new Set([...prev, selectedRoadmap._id]));
      setShowPaymentModal(false);
      setSelectedRoadmap(null);
    }
  };

  const calculateDuration = (steps) => {
    if (!steps || steps.length === 0) return "0 weeks";
    const maxWeek = Math.max(...steps.map(step => step.week));
    return `${maxWeek} weeks`;
  };

  const calculateLessonCount = (resources) => {
    if (!resources) return 0;
    return resources.length * 4; // Approximate conversion
  };

  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <h3 className="text-2xl font-bold mb-4">Unlock Roadmap</h3>
        <div className="mb-6">
          <h4 className="font-semibold text-lg">{selectedRoadmap?.title}</h4>
          <p className="text-gray-600 mt-2">{selectedRoadmap?.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {calculateDuration(selectedRoadmap?.steps)}
            </span>
            <span className="flex items-center gap-1">
              <PlayCircle className="w-4 h-4" />
              {calculateLessonCount(selectedRoadmap?.resources)} lessons
            </span>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg">Total Amount:</span>
            <span className="text-2xl font-bold text-green-600">${selectedRoadmap?.price}</span>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handlePayment}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              <CreditCard className="w-5 h-5" />
              Complete Payment
            </button>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const RoadmapCard = ({ roadmap }) => {
    const isUnlocked = unlockedRoadmaps.has(roadmap._id);
    
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className={`h-32 bg-gradient-to-r ${roadmap.color} relative`}>
          <div className="absolute top-4 right-4">
            {isUnlocked ? (
              <div className="bg-green-500 text-white p-2 rounded-full">
                <Unlock className="w-5 h-5" />
              </div>
            ) : (
              <div className="bg-white bg-opacity-20 text-white p-2 rounded-full">
                <Lock className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="absolute bottom-4 left-6">
            <div className="text-white text-2xl font-bold">${roadmap.price}</div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{roadmap.title}</h3>
          <p className="text-gray-600 mb-4">{roadmap.description}</p>
          
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              {roadmap.rating}
            </span>
            <span>{roadmap.students.toLocaleString()} students</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {calculateDuration(roadmap.steps)}
            </span>
          </div>
          
          <div className="space-y-3 mb-6">
            {roadmap.steps.map((step, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                isUnlocked ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  {isUnlocked ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-xs text-gray-500">Week {step.week}</div>
                  </div>
                </div>
                {isUnlocked && (
                  <ArrowRight className="w-4 h-4 text-green-500" />
                )}
              </div>
            ))}
          </div>
          
          {isUnlocked ? (
            <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-all">
              <PlayCircle className="w-5 h-5" />
              Start Learning
            </button>
          ) : (
            <button
              onClick={() => handleUnlock(roadmap)}
              className={`w-full bg-gradient-to-r ${roadmap.color} text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all`}
            >
              <Lock className="w-5 h-5" />
              Unlock for ${roadmap.price}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Learning Roadmaps</h1>
          <p className="text-xl text-gray-600">Choose your path and start your journey to mastery</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {roadmaps.map(roadmap => (
            <RoadmapCard key={roadmap._id} roadmap={roadmap} />
          ))}
        </div>
        
        {unlockedRoadmaps.size > 0 && (
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-green-600">🎉 Your Unlocked Roadmaps</h2>
            <p className="text-gray-600 mb-4">
              You have access to {unlockedRoadmaps.size} roadmap{unlockedRoadmaps.size > 1 ? 's' : ''}. 
              Continue your learning journey!
            </p>
            <div className="flex gap-4">
              <button className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all">
                View My Progress
              </button>
              <button className="border border-green-500 text-green-500 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-all">
                Download Materials
              </button>
            </div>
          </div>
        )}
      </div>
      
      {showPaymentModal && <PaymentModal />}
    </div>
  );
};

export default RoadmapSystem;