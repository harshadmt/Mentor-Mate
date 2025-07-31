import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllRoadmaps = () => {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [expandedStep, setExpandedStep] = useState(null);

  const fetchRoadmaps = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/roadmaps/getall', {
        withCredentials: true
      });
      setRoadmaps(response.data.data);
    } catch (error) {
      console.error('Error fetching roadmaps:', error.message);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleUnlockClick = (roadmap) => {
    if (roadmap.isPurchased) {
      navigate(`/roadmap/${roadmap._id}`);
      return;
    }
    setSelectedRoadmap(roadmap);
    setIsModalOpen(true);
    setPaymentStatus(null);
    setSelectedPaymentMethod(null);
    setShowAllSteps(false);
    setExpandedStep(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoadmap(null);
    setPaymentStatus(null);
    setSelectedPaymentMethod(null);
    setShowAllSteps(false);
    setExpandedStep(null);
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }

    try {
      setPaymentStatus('processing');
      
      const response = await axios.post(
        'http://localhost:5000/api/payments/process',
        {
          roadmapId: selectedRoadmap._id,
          amount: selectedRoadmap.price * 1.18,
          paymentMethod: selectedPaymentMethod
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setPaymentStatus('success');
        await fetchRoadmaps();
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      setPaymentStatus('failed');
      console.error("Payment failed:", error.message);
    }
  };

  const toggleShowAllSteps = () => {
    setShowAllSteps(!showAllSteps);
  };

  const toggleExpandStep = (stepIndex) => {
    setExpandedStep(expandedStep === stepIndex ? null : stepIndex);
  };

  const paymentMethods = [
    { id: 'paytm', name: 'Paytm', icon: '📱', color: 'border-blue-500' },
    { id: 'phonepe', name: 'PhonePe', icon: '💜', color: 'border-purple-500' },
    { id: 'googlepay', name: 'Google Pay', icon: '🔵', color: 'border-green-500' },
    { id: 'upi', name: 'UPI', icon: '🏦', color: 'border-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <button 
        onClick={() => navigate('/student/studentdashboard')}
        className="mb-8 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>

      {/* Backdrop blur overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"></div>
      )}
      
      <div className={`transition-all duration-300 ${isModalOpen ? "blur-sm pointer-events-none" : ""}`}>
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🚀 Learning Roadmaps
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Carefully crafted learning paths designed by industry experts to accelerate your career growth
          </p>
          <div className="mt-8 inline-flex items-center space-x-8 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Expert-designed curricula
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Progress tracking
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Real-world projects
            </span>
          </div>
        </div>

        {roadmaps.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-xl text-gray-500">No roadmaps available at the moment.</p>
            <p className="text-gray-400 mt-2">Check back soon for amazing learning content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap._id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-1"
              >
                {/* Top gradient bar */}
                <div className={`h-2 ${roadmap.color || 'bg-gradient-to-r from-indigo-500 to-blue-500'}`}></div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {roadmap.title}
                    </h3>
                    {roadmap.isPurchased && (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                        ✅ Owned
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {roadmap.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-indigo-600">₹{roadmap.price}</div>
                      <div className="text-xs text-gray-500">Price</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">{roadmap.rating}</div>
                      <div className="text-xs text-gray-500">⭐ Rating</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">{roadmap.steps?.length || 0}</div>
                      <div className="text-xs text-gray-500">📚 Steps</div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-orange-600">{roadmap.students}</div>
                      <div className="text-xs text-gray-500">👥 Students</div>
                    </div>
                  </div>

                  {/* Creator */}
                  {roadmap.createdBy && (
                    <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={roadmap.createdBy.profilePicture || "/default-avatar.png"}
                        alt="creator"
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{roadmap.createdBy.fullName}</div>
                        <div className="text-sm text-gray-500">Course Instructor</div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => handleUnlockClick(roadmap)}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      roadmap.isPurchased
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-green-200"
                        : "bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 shadow-lg hover:shadow-indigo-200"
                    } transform hover:scale-105`}
                  >
                    {roadmap.isPurchased ? "🎯 Continue Learning" : "🔓 Unlock Roadmap"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && selectedRoadmap && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className={`${selectedRoadmap.color || 'bg-gradient-to-r from-indigo-500 to-blue-600'} p-6 text-white relative`}>
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/20 rounded-full"
                disabled={paymentStatus === 'processing'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-3xl font-bold mb-2">{selectedRoadmap.title}</h2>
              <p className="text-white/90 text-lg">{selectedRoadmap.description}</p>
            </div>

            <div className="p-6">
              {paymentStatus === null && (
                <>
                  {/* Course Preview */}
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Left Column - Course Details */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">📚 Learning Path Steps</h3>
                      <div className="space-y-4">
                        {(showAllSteps ? selectedRoadmap.steps : selectedRoadmap.steps?.slice(0, 4)).map((step, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{step.title}</h4>
                                {step.description && (
                                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                                )}
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {step.resources?.map((resource, resIndex) => (
                                    <span key={resIndex} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                                      {resource.type === 'video' ? '🎥 Video' : 
                                       resource.type === 'article' ? '📄 Article' : 
                                       resource.type === 'exercise' ? '💪 Exercise' : '📚 Resource'}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {selectedRoadmap.steps?.length > 4 && (
                        <button
                          onClick={toggleShowAllSteps}
                          className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                        >
                          {showAllSteps ? (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                              </svg>
                              Show Less Steps
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                              Show All {selectedRoadmap.steps.length} Steps
                            </>
                          )}
                        </button>
                      )}

                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-3">📎 Included Resources</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRoadmap.resources?.map((resource, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {resource.type === 'video' ? '🎥 Video' : 
                               resource.type === 'article' ? '📄 Article' : 
                               resource.type === 'exercise' ? '💪 Exercise' : '📚 Resource'}: {resource.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Payment */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">💳 Payment Details</h3>
                      
                      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Course Price:</span>
                            <span className="font-semibold">₹{selectedRoadmap.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">GST (18%):</span>
                            <span className="font-semibold">₹{(selectedRoadmap.price * 0.18).toFixed(2)}</span>
                          </div>
                          <div className="border-t border-gray-200 pt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                              <span className="text-2xl font-bold text-indigo-600">₹{(selectedRoadmap.price * 1.18).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Methods */}
                      <h4 className="font-semibold text-gray-900 mb-4">Choose Payment Method</h4>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setSelectedPaymentMethod(method.id)}
                            className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                              selectedPaymentMethod === method.id
                                ? `${method.color} bg-blue-50 border-solid`
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-2xl mb-1">{method.icon}</div>
                            <div className="text-sm font-medium">{method.name}</div>
                          </button>
                        ))}
                      </div>

                      <button 
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        onClick={handlePayment}
                      >
                        🚀 Secure Payment ₹{(selectedRoadmap.price * 1.18).toFixed(2)}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Payment Status States */}
              {paymentStatus === 'processing' && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 absolute top-0"></div>
                  </div>
                  <h3 className="text-2xl font-bold mt-6 mb-2">Processing Payment...</h3>
                  <p className="text-gray-600">Please wait while we process your payment securely</p>
                </div>
              )}

              {paymentStatus === 'success' && (
                <div className="p-6">
                  {/* Success Message */}
                  <div className="text-center mb-10 bg-green-50 rounded-xl py-6 px-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
                    <p className="text-gray-600 mb-4">
                      You now have full access to <span className="font-semibold">"{selectedRoadmap.title}"</span>
                    </p>
                    <button 
                      onClick={() => navigate(`/roadmap/${selectedRoadmap._id}`)}
                      className="inline-flex items-center px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Go to Roadmap Dashboard
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </button>
                  </div>

                  {/* Full Curriculum */}
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200 flex items-center">
                      <svg className="w-6 h-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      Full Curriculum
                    </h3>

                    <div className="space-y-4">
                      {selectedRoadmap.steps?.map((step, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                          <div className="p-5">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-lg w-10 h-10 flex items-center justify-center font-bold mr-4">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                                {step.description && (
                                  <p className="text-gray-600 mt-1">{step.description}</p>
                                )}
                              </div>
                            </div>

                            {/* Resources for this step */}
                            {step.resources?.length > 0 && (
                              <div className="mt-4 pl-14">
                                <h5 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
                                  </svg>
                                  Learning Resources
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {step.resources.map((resource, resIndex) => (
                                    <div key={resIndex} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                                      <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                          {resource.type === 'video' && (
                                            <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                              </svg>
                                            </div>
                                          )}
                                          {resource.type === 'article' && (
                                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                                              </svg>
                                            </div>
                                          )}
                                          {resource.type === 'exercise' && (
                                            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                              </svg>
                                            </div>
                                          )}
                                        </div>
                                        <div className="ml-3">
                                          <h6 className="text-sm font-medium text-gray-900">{resource.name}</h6>
                                          <div className="mt-1 flex items-center text-xs text-gray-500">
                                            {resource.duration && (
                                              <span className="flex items-center mr-3">
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                {resource.duration}
                                              </span>
                                            )}
                                            <span className="capitalize">{resource.type}</span>
                                          </div>
                                          <a 
                                            href={resource.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-block mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                          >
                                            Access Resource →
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Resources */}
                  {selectedRoadmap.resources?.length > 0 && (
                    <div className="mb-10">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200 flex items-center">
                        <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                        </svg>
                        Additional Resources
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedRoadmap.resources.map((resource, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mr-4">
                                {resource.type === 'video' && (
                                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                    </svg>
                                  </div>
                                )}
                                {resource.type === 'article' && (
                                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                                    </svg>
                                  </div>
                                )}
                                {resource.type === 'exercise' && (
                                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{resource.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
                                <div className="mt-3">
                                  <a 
                                    href={resource.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                  >
                                    Open Resource
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Final CTA */}
                  <div className="text-center mt-8">
                    <button 
                      onClick={() => navigate(`/roadmap/${selectedRoadmap._id}`)}
                      className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                      Start Learning Now
                    </button>
                  </div>
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-red-600">❌ Payment Failed</h3>
                  <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
                    We couldn't process your payment. Please check your payment details and try again.
                  </p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setPaymentStatus(null)}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                    >
                      🔄 Try Again
                    </button>
                    <button 
                      onClick={closeModal}
                      className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRoadmaps;