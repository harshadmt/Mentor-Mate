import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ArrowLeft, Send, User, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useUserStore from '../../../../zustore/store';

const ChatWithStudent = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useUserStore();
  const [messages, setMessages] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Check authentication and mentor role
  useEffect(() => {
    if (!currentUser?._id || currentUser.role !== 'mentor') {
      toast.error('Please login as mentor to access messages');
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Fetch students who purchased roadmaps from this mentor
  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/mentor/students', {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          },
          withCredentials: true
        });
        
        if (res.data?.success) {
          setStudents(res.data.data || []);
        } else {
          throw new Error(res.data?.message || 'Failed to load students');
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        setError(err.message);
        toast.error(err.message);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [currentUser?._id, navigate]);

  // Fetch messages when a student is selected
  useEffect(() => {
    if (!selectedStudent?.id || !currentUser?._id) return;
    
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/message?receiverId=${selectedStudent.id}`,
          {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem('token')}` 
            },
            withCredentials: true
          }
        );
        
        if (res.data?.success) {
          setMessages(Array.isArray(res.data.data) ? res.data.data : []);
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
  }, [selectedStudent, currentUser?._id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedStudent?.id || !currentUser?._id) return;
    
    try {
      const res = await axios.post(
        'http://localhost:5000/api/message/send',
        {
          receiver: selectedStudent.id,
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
        setMessages(prev => [...prev, res.data]);
        setNewMessage('');
      } else {
        throw new Error(res.data?.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error(err.message);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
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
    <div className="flex h-screen bg-gray-50">
      <ToastContainer position="top-right" />
      
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <button 
            onClick={() => navigate('/mentor/mentordashboard')}
            className="mr-2 p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold">My Students</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {students.length > 0 ? (
            students.map(student => (
              <div 
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className={`p-4 border-b border-gray-100 cursor-pointer flex items-center ${
                  selectedStudent?.id === student.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  {student.profilePicture ? (
                    <img 
                      src={student.profilePicture} 
                      alt={student.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{student.fullName}</p>
                  <p className="text-xs text-gray-500">{student.email}</p>
                  <div className="flex items-center mt-1">
                    <BookOpen size={14} className="text-blue-500 mr-1" />
                    <span className="text-xs text-blue-500">
                      {student.purchasedRoadmaps?.length || 0} roadmaps
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No students found
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedStudent ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                {selectedStudent.profilePicture ? (
                  <img 
                    src={selectedStudent.profilePicture} 
                    alt={selectedStudent.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium">{selectedStudent.fullName}</p>
                <div className="flex items-center">
                  <BookOpen size={14} className="text-blue-500 mr-1" />
                  <span className="text-xs text-blue-500">
                    {selectedStudent.purchasedRoadmaps?.length || 0} purchased roadmaps
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.length > 0 ? (
                messages.map((message, index) => {
                  // Safely check message and sender
                  const isCurrentUser = message?.sender?._id === currentUser._id;
                  const messageContent = message?.content || '';
                  const messageDate = message?.createdAt ? format(new Date(message.createdAt), 'h:mm a') : '';

                  return (
                    <div 
                      key={index}
                      className={`mb-4 flex ${
                        isCurrentUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div 
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isCurrentUser
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                        }`}
                      >
                        <p>{messageContent}</p>
                        <p className={`text-xs mt-1 ${
                          isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {messageDate}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No messages yet. Start the conversation!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <Send size={18} className="mr-1" /> Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-6 max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                <User size={32} />
              </div>
              <h3 className="text-xl font-medium text-gray-700">Select a student</h3>
              <p className="text-gray-500 mt-2">Choose a student from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWithStudent;