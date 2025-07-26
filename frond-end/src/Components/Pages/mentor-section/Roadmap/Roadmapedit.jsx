import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowLeft } from 'lucide-react'; // Added ArrowLeft import

const EditRoadmap = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    resources: [{ type: '', name: '' }],
    steps: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/roadmaps/${id}`, {
          withCredentials: true,
        });
        const data = res.data;
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          resources: data.resources.length > 0 ? data.resources : [{ type: '', name: '' }],
          steps: data.steps || [],
        });
      } catch (err) {
        toast.error("Failed to fetch roadmap details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoadmap();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStepChange = (index, e) => {
    const newSteps = [...formData.steps];
    newSteps[index][e.target.name] = e.target.value;
    setFormData({ ...formData, steps: newSteps });
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { title: '', description: '', week: formData.steps.length + 1 }],
    });
  };

  const removeStep = (index) => {
    const newSteps = [...formData.steps];
    newSteps.splice(index, 1);
    setFormData({ ...formData, steps: newSteps });
  };

  const handleResourceChange = (index, e) => {
    const newResources = [...formData.resources];
    newResources[index][e.target.name] = e.target.value;
    setFormData({ ...formData, resources: newResources });
  };

  const addResource = () => {
    setFormData({
      ...formData,
      resources: [...formData.resources, { type: '', name: '' }],
    });
  };

  const removeResource = (index) => {
    const newResources = [...formData.resources];
    newResources.splice(index, 1);
    setFormData({ ...formData, resources: newResources });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updatedData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        steps: formData.steps,
        resources: formData.resources.filter(res => res.type && res.name),
      };

      await axios.put(`http://localhost:5000/api/roadmaps/${id}`, updatedData, {
        withCredentials: true,
      });

      toast.success("Roadmap updated successfully!");
      setTimeout(() => navigate("/mentor/roadmaps"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong while updating.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading roadmap details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-6 sm:px-8 sm:py-8 relative">
            <button 
              onClick={() => navigate(-1)} 
              className="absolute left-6 top-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Edit Roadmap</h2>
              <p className="text-blue-100 mt-1">Refine your learning path</p>
            </div>
          </div>
          
          {/* Form Content */}
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter roadmap title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                      required
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe what this roadmap is about"
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                      required
                    />
                  </div>
                  
                  <div className="w-full sm:w-1/3">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                        required
                      />
                      <span className="absolute left-3 top-3 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resources Section */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Learning Resources</h3>
                    <p className="text-sm text-gray-500 mt-1">Add helpful links, videos, books etc.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addResource}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Resource
                  </button>
                </div>
                
                {formData.resources.length === 0 ? (
                  <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h4 className="mt-3 text-lg font-medium text-gray-700">No resources added</h4>
                    <p className="mt-1 text-gray-500">Click the button above to add your first resource</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.resources.map((res, index) => (
                      <div key={index} className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Resource Type <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="type"
                              value={res.type}
                              onChange={(e) => handleResourceChange(index, e)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                              required
                            >
                              <option value="">Select type</option>
                              <option value="url">URL</option>
                              <option value="video">Video</option>
                              <option value="book">Book</option>
                              <option value="article">Article</option>
                              <option value="document">Document</option>
                              <option value="course">Course</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Resource Name/Link <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="name"
                              placeholder={res.type === 'url' ? 'https://example.com' : 'Resource name'}
                              value={res.name}
                              onChange={(e) => handleResourceChange(index, e)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                              required
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeResource(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition"
                          title="Remove resource"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Steps Section */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Learning Steps</h3>
                    <p className="text-sm text-gray-500 mt-1">Break down your roadmap into manageable steps</p>
                  </div>
                  <button
                    type="button"
                    onClick={addStep}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Step
                  </button>
                </div>
                
                {formData.steps.length === 0 ? (
                  <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <h4 className="mt-3 text-lg font-medium text-gray-700">No steps added</h4>
                    <p className="mt-1 text-gray-500">Click the button above to add your first step</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {formData.steps.map((step, index) => (
                      <div key={index} className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-semibold mr-3">
                              {index + 1}
                            </div>
                            <h4 className="text-lg font-medium text-gray-800">Step {index + 1}</h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeStep(index)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition"
                            title="Remove step"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="space-y-5 pl-11">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={step.title}
                              onChange={(e) => handleStepChange(index, e)}
                              placeholder={`Step ${index + 1} title`}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              name="description"
                              value={step.description}
                              onChange={(e) => handleStepChange(index, e)}
                              placeholder="Detailed description of this step"
                              rows="3"
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                              required
                            />
                          </div>
                          
                          <div className="w-full sm:w-1/4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Week <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="week"
                              value={step.week}
                              onChange={(e) => handleStepChange(index, e)}
                              min="1"
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/mentor/roadmaps")}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Roadmap"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default EditRoadmap;