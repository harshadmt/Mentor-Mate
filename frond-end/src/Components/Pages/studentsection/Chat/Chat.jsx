import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, BookOpen, Send } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useUserStore from '../../../../../zustore/store';

const API_BASE_URL = 'http://localhost:5000';

const ChatWithMentor = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useUserStore();
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Check authentication and student role (simplified like ChatWithStudent)
  useEffect(() => {
    if (!currentUser?._id || currentUser.role !== 'student') {
      toast.error('Please login as a student to access messages');
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Fetch mentors
  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchMentors = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/student/mentors`, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          },
          withCredentials: true
        });

        if (res.data?.success) {
          const formattedMentors = (res.data.data || []).map(mentor => ({
            _id: mentor._id,
            fullName: mentor.fullName,
            email: mentor.email,
            profilePicture: mentor.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.fullName)}&background=random`,
            createdRoadmaps: mentor.createdRoadmaps || [],
          }));
          setMentors(formattedMentors);
        } else {
          throw new Error(res.data?.message || 'Failed to fetch mentors');
        }
      } catch (err) {
        console.error('Fetch mentors error:', err);
        setError(err.message);
        toast.error(err.message);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [currentUser?._id, navigate]);

  // Fetch messages when mentor is selected (using polling)
  useEffect(() => {
    if (!selectedMentor?._id || !currentUser?._id) return;
    
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/message?receiverId=${selectedMentor._id}`,
          {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem('token')}` 
            },
            withCredentials: true
          }
        );
        
        if (res.data?.success) {
          const formattedMessages = (res.data.data || []).map(msg => ({
            _id: msg._id,
            content: msg.content,
            createdAt: format(new Date(msg.createdAt || Date.now()), 'h:mm a'),
            sender: msg.sender?._id || msg.sender,
            isCurrentUser: (msg.sender?._id || msg.sender) === currentUser._id,
          }));
          setMessages(formattedMessages);
        } else {
          throw new Error(res.data?.message || 'Failed to load messages');
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        toast.error(err.message);
      }
    };
    
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    
    return () => clearInterval(interval);
  }, [selectedMentor, currentUser?._id]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedMentor?._id || !currentUser?._id) return;
    
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/message/send`,
        {
          receiver: selectedMentor._id,
          content: newMessage
        },
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          },
          withCredentials: true
        }
      );
      
      if (res.data?.success) {
        setNewMessage('');
        // Messages will update on next poll
      } else {
        throw new Error(res.data?.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error(err.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h3 className="text-xl font-medium text-red-500">Authentication Required</h3>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h3 className="text-xl font-medium text-red-500">Error Loading Chat</h3>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <button
            onClick={() => navigate('/student/studentdashboard')}
            className="mr-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <h2 className="text-lg font-semibold dark:text-white">My Mentors</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mentors.length > 0 ? (
            mentors.map(mentor => (
              <div
                key={mentor._id}
                onClick={() => setSelectedMentor(mentor)}
                className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer flex items-center ${
                  selectedMentor?._id === mentor._id ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center overflow-hidden">
                  <img
                    src={mentor.profilePicture}
                    alt={mentor.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-medium dark:text-white">{mentor.fullName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{mentor.email}</p>
                  <div className="flex items-center mt-1">
                    <BookOpen size={14} className="text-blue-500 dark:text-blue-300 mr-1" />
                    <span className="text-xs text-blue-500 dark:text-blue-300">
                      {mentor.createdRoadmaps?.length || 0} roadmaps
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No mentors found
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedMentor ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedMentor.profilePicture}
                  alt={selectedMentor.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3">
                <p className="font-medium dark:text-white">{selectedMentor.fullName}</p>
                <div className="flex items-center">
                  <BookOpen size={14} className="text-blue-500 dark:text-blue-300 mr-1" />
                  <span className="text-xs text-blue-500 dark:text-blue-300">
                    {selectedMentor.createdRoadmaps?.length || 0} created roadmaps
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`mb-4 flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isCurrentUser
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <p className="break-words">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isCurrentUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {message.createdAt}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <p>No messages yet with {selectedMentor.fullName}. Start the conversation!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${selectedMentor.fullName}...`}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 flex items-center justify-center disabled:opacity-50"
                >
                  <Send size={18} className="mr-1" /> Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center p-6 max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-300">
                <User size={32} />
              </div>
              <h3 className="text-xl font-medium text-gray-700 dark:text-white">Select a mentor</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Choose a mentor from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWithMentor;