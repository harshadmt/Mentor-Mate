import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiVideo, FiMic, FiImage, FiMoreVertical, FiChevronLeft, FiMoon, FiSun, FiSearch } from 'react-icons/fi';
import { BsCheck2All, BsCheck2, BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import { RiEmojiStickerLine } from 'react-icons/ri';

const students = [
  { id: 1, name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?img=1', status: 'online', role: 'UI/UX Designer', lastSeen: '2 min ago' },
  { id: 2, name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?img=2', status: 'away', role: 'Backend Developer', lastSeen: '30 min ago' },
  { id: 3, name: 'Carol Williams', avatar: 'https://i.pravatar.cc/150?img=3', status: 'offline', role: 'Data Scientist', lastSeen: '2 hours ago' },
  { id: 4, name: 'David Lee', avatar: 'https://i.pravatar.cc/150?img=4', status: 'online', role: 'Frontend Developer', lastSeen: 'just now' },
  { id: 5, name: 'Eva Garcia', avatar: 'https://i.pravatar.cc/150?img=5', status: 'online', role: 'Product Manager', lastSeen: '5 min ago' }
];

const initialMessages = {
  1: [
    { id: 1, from: 'me', text: 'Hey Alice, how’s the project going?', time: '09:30', status: 'read' },
    { id: 2, from: 'them', text: 'All good! Just finished the design phase 😄', time: '09:32', status: 'read' },
    { id: 3, from: 'them', text: 'Would you like to review the mockups?', time: '09:33', status: 'read' },
    { id: 4, from: 'me', text: 'Absolutely! Send them over when ready.', time: '09:35', status: 'read' },
    { id: 5, from: 'them', text: 'Here you go: [design-mockup.pdf]', time: '09:36', status: 'read' }
  ],
  2: [
    { id: 1, from: 'me', text: 'Bob, any updates on the backend?', time: '09:00', status: 'sent' },
    { id: 2, from: 'them', text: 'Working on the API endpoints now', time: '09:15', status: 'read' }
  ],
  3: [],
  4: [
    { id: 1, from: 'them', text: 'Hey, can we sync up about the new features?', time: '10:00', status: 'read' }
  ],
  5: [
    { id: 1, from: 'them', text: 'The roadmap looks great! Let me know when we can present it', time: '11:30', status: 'read' }
  ]
};

const quickReplies = ['Great work!', 'Let’s discuss', 'Need assistance?', 'Thanks!', 'On my way'];

const ChatApp = () => {
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const localVideoRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Filter students based on search query
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Focus input when student changes
    inputRef.current?.focus();
  }, [selectedStudent]);

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setIsVideoCall(true);
    } catch (err) {
      console.error('Error accessing media devices:', err);
    }
  };

  const endVideoCall = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsVideoCall(false);
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      from: 'me',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    
    setMessages(prev => ({
      ...prev,
      [selectedStudent.id]: [...(prev[selectedStudent.id] || []), newMsg]
    }));
    
    setNewMessage('');
    setIsTyping(false);
    
    // Simulate typing indicator
    setTimeout(() => {
      setIsTyping(true);
      
      // Then send reply after 1-3 seconds
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => ({
          ...prev,
          [selectedStudent.id]: [
            ...(prev[selectedStudent.id] || []),
            {
              id: Date.now(),
              from: 'them',
              text: getRandomReply(),
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'delivered'
            }
          ]
        }));
      }, 1000 + Math.random() * 2000);
    }, 500);
  };

  const getRandomReply = () => {
    const replies = [
      'Got it! I’ll respond soon 😊',
      'Thanks for your message!',
      'Let me check and get back to you.',
      'Working on it right now!',
      'Perfect, thanks for the update!',
      'Can we discuss this in our next meeting?',
      'I appreciate your feedback!',
      'Let me know if you need anything else.'
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const getStatusColor = (status) => {
    return status === 'online' ? 'bg-green-500' : 
           status === 'away' ? 'bg-yellow-500' : 
           'bg-gray-400';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(newMessage);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-300 font-sans`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.history.back()} 
            className="p-2 hover:bg-indigo-700 rounded-full transition transform hover:scale-105"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Mentor Hub</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="p-2 hover:bg-indigo-700 rounded-full transition transform hover:scale-105"
          >
            {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {/* Student List - Desktop */}
        <div className={`hidden md:block w-80 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-56px)]">
            {filteredStudents.map((student) => (
              <motion.div
                key={student.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { 
                  setSelectedStudent(student); 
                }}
                className={`flex items-center gap-3 p-4 cursor-pointer transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-50'} ${
                  selectedStudent.id === student.id ? (darkMode ? 'bg-gray-700' : 'bg-indigo-100') : ''
                }`}
              >
                <div className="relative">
                  <img 
                    src={student.avatar} 
                    alt={student.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                  />
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${getStatusColor(student.status)} border-2 border-white`}></span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{student.name}</p>
                  <p className="text-sm truncate text-gray-500 dark:text-gray-400">{student.role}</p>
                </div>
                <div className="flex flex-col items-end">
                  {(messages[student.id] || []).length > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      darkMode ? 'bg-indigo-600' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {(messages[student.id] || []).length}
                    </span>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{student.lastSeen}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden fixed bottom-6 right-6 z-20 p-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110"
        >
          <FiMoreVertical className="w-6 h-6" />
        </button>

        {/* Student List - Mobile (Bottom Sheet) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="md:hidden fixed inset-0 z-10 bg-white dark:bg-gray-800 rounded-t-3xl shadow-xl pt-4"
            >
              <div className="flex justify-center mb-2">
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              </div>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="overflow-y-auto h-[calc(100%-60px)] pb-20">
                {filteredStudents.map((student) => (
                  <motion.div
                    key={student.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { 
                      setSelectedStudent(student); 
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 p-4 cursor-pointer transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-50'} ${
                      selectedStudent.id === student.id ? (darkMode ? 'bg-gray-700' : 'bg-indigo-100') : ''
                    }`}
                  >
                    <div className="relative">
                      <img 
                        src={student.avatar} 
                        alt={student.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                      />
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${getStatusColor(student.status)} border-2 border-white`}></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{student.name}</p>
                      <p className="text-sm truncate text-gray-500 dark:text-gray-400">{student.role}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      {(messages[student.id] || []).length > 0 && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          darkMode ? 'bg-indigo-600' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {(messages[student.id] || []).length}
                        </span>
                      )}
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{student.lastSeen}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat/Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex items-center gap-3 shadow-sm`}>
            <button 
              className="md:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition transform hover:scale-105"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <div className="relative">
              <img 
                src={selectedStudent.avatar} 
                alt={selectedStudent.name} 
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
              />
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${getStatusColor(selectedStudent.status)} border-2 border-white`}></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{selectedStudent.name}</p>
              <div className="flex items-center gap-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {selectedStudent.status === 'online' ? 'Online' : selectedStudent.status === 'away' ? 'Away' : 'Offline'}
                </p>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center"
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-400">• typing</span>
                    <div className="flex ml-1 space-x-1">
                      <motion.span 
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="inline-block w-1 h-1 bg-gray-400 rounded-full"
                      />
                      <motion.span 
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        className="inline-block w-1 h-1 bg-gray-400 rounded-full"
                      />
                      <motion.span 
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        className="inline-block w-1 h-1 bg-gray-400 rounded-full"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={startVideoCall} 
                className="p-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full hover:from-indigo-700 hover:to-blue-700 transition shadow-lg transform hover:scale-105"
              >
                <FiVideo className="w-5 h-5" />
              </button>
              <button className="p-3 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition">
                <BsThreeDotsVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {isVideoCall ? (
            <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <div className="relative w-full max-w-4xl">
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full max-h-[70vh] rounded-2xl shadow-2xl object-cover"
                ></video>
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
                  <button className="p-4 bg-white text-indigo-600 rounded-full shadow-lg hover:bg-gray-100 transition transform hover:scale-110">
                    <FiMic className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={endVideoCall} 
                    className="p-4 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition transform hover:scale-110"
                  >
                    <IoMdClose className="w-6 h-6" />
                  </button>
                  <button className="p-4 bg-white text-indigo-600 rounded-full shadow-lg hover:bg-gray-100 transition transform hover:scale-110">
                    <FiVideo className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                {(messages[selectedStudent.id] || []).map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`max-w-xs md:max-w-md p-4 rounded-2xl shadow ${
                        msg.from === 'me' 
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-tr-none' 
                          : 'bg-white dark:bg-gray-700 dark:text-white rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <div className="flex items-center justify-end mt-1 space-x-1">
                        <span className="text-xs opacity-70">{msg.time}</span>
                        {msg.from === 'me' && (
                          <span className="text-xs">
                            {msg.status === 'read' ? (
                              <BsCheck2All className="text-blue-300" />
                            ) : msg.status === 'sent' ? (
                              <BsCheck2 className="opacity-50" />
                            ) : (
                              <span className="inline-block w-3 h-3 rounded-full bg-gray-400 animate-pulse"></span>
                            )}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-xs p-4 rounded-2xl shadow bg-white dark:bg-gray-700 dark:text-white rounded-tl-none">
                      <div className="flex space-x-1">
                        <motion.span 
                          animate={{ y: [0, -3, 0] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="inline-block w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.span 
                          animate={{ y: [0, -3, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                          className="inline-block w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.span 
                          animate={{ y: [0, -3, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                          className="inline-block w-2 h-2 bg-gray-400 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="px-4 pt-2 pb-1 overflow-x-auto">
                <div className="flex gap-2 pb-2">
                  {quickReplies.map((reply) => (
                    <motion.button
                      key={reply}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => sendMessage(reply)}
                      className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm hover:bg-indigo-200 dark:hover:bg-indigo-800 transition whitespace-nowrap shadow-sm"
                    >
                      {reply}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} shadow-md`}>
                <div className="flex gap-2 items-center">
                  <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition transform hover:scale-110">
                    <RiEmojiStickerLine className="w-6 h-6" />
                  </button>
                  <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition transform hover:scale-110">
                    <FiImage className="w-6 h-6" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        if (e.target.value.trim()) setIsTyping(true);
                        else setIsTyping(false);
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="w-full pl-4 pr-12 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                      <FiMic className="w-5 h-5" />
                    </button>
                  </div>
                  <button 
                    onClick={() => sendMessage(newMessage)} 
                    disabled={!newMessage.trim()} 
                    className={`p-3 rounded-full transition shadow-lg transform hover:scale-105 ${
                      newMessage.trim() 
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-400'
                    }`}
                  >
                    <FiSend className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;