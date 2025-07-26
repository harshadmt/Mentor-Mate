import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const dummyStudents = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'online',
    lastSeen: 'Active now'
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'away',
    lastSeen: '2 min ago'
  },
  {
    id: 3,
    name: 'Carol Davis',
    email: 'carol@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'offline',
    lastSeen: '1 hour ago'
  }
];

const dummyMessages = {
  1: [
    { from: 'me', text: 'Hi Alice! How are you progressing with the project?', time: '09:32', status: 'read' },
    { from: 'them', text: 'Hey Mentor! Going well, just finished the wireframes 🎨', time: '09:33', status: 'read' },
    { from: 'them', text: 'Would love to get your feedback on them', time: '09:33', status: 'read' }
  ],
  2: [
    { from: 'me', text: 'Hi Bob, how\'s your progress on the backend?', time: '09:01', status: 'sent' },
    { from: 'them', text: 'I\'m doing well, thank you! Just deployed the API 🚀', time: '09:02', status: 'delivered' }
  ],
  3: [
    { from: 'me', text: 'Carol, ready for tomorrow\'s presentation?', time: '08:45', status: 'delivered' }
  ]
};

const quickReplies = [
  '👍 Well done!',
  '📅 Let\'s schedule a call',
  '📝 Send me your update',
  '🔥 Keep it up!',
  '❓ Need help?'
];

const ChatWithStudent = () => {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState(dummyStudents[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(dummyMessages);
  const [showTyping, setShowTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState('list');
  const [isAnimating, setIsAnimating] = useState(false);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    
    setIsAnimating(true);
    const newMsg = {
      from: 'me',
      text,
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'sent'
    };
    
    setMessages((prev) => ({
      ...prev,
      [selectedStudent.id]: [...(prev[selectedStudent.id] || []), newMsg]
    }));
    setMessage('');
    setShowTyping(true);
    
    setTimeout(() => {
      setShowTyping(false);
      setMessages((prev) => ({
        ...prev,
        [selectedStudent.id]: [
          ...(prev[selectedStudent.id] || []),
          {
            from: 'them',
            text: 'Thanks for your message! I\'ll get back to you soon 😊',
            time: new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            status: 'delivered'
          }
        ]
      }));
      setIsAnimating(false);
    }, 1400);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div
      className={`${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'
      } min-h-screen transition-all duration-500`}
    >
      {/* Header with glassmorphism effect */}
      <div
        className={`flex items-center justify-between p-6 shadow-xl sticky top-0 z-20 backdrop-blur-xl border-b ${
          darkMode 
            ? 'bg-gray-900/80 border-gray-700/50' 
            : 'bg-white/80 border-white/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/mentor/mentordashboard')}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-xl animate-pulse">
            💬
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mentor Chat
          </h2>
        </div>
        <button
          onClick={() => setDarkMode((dm) => !dm)}
          className={`rounded-full px-6 py-3 border-2 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
            darkMode 
              ? 'border-gray-600 hover:bg-gray-700 hover:border-gray-500' 
              : 'border-gray-300 hover:bg-gray-100 hover:border-gray-400'
          }`}
        >
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Rest of the component remains the same */}
      <div className="flex md:h-[calc(100vh-88px)] h-auto flex-col md:flex-row">
        {/* Student List with enhanced styling */}
        <div
          className={`${
            view === 'list' || window.innerWidth >= 768 ? 'block' : 'hidden'
          } md:block md:w-1/3 w-full backdrop-blur-xl border-r transition-all duration-300 ${
            darkMode 
              ? 'bg-gray-800/50 border-gray-700/50' 
              : 'bg-white/50 border-gray-200/50'
          }`}
        >
          <div className="p-6 font-bold text-lg border-b backdrop-blur-sm border-opacity-50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👨‍🎓</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Students ({dummyStudents.length})
              </span>
            </div>
          </div>
          
          <div className="space-y-2 p-4">
            {dummyStudents.map((stu, index) => (
              <div
                key={stu.id}
                onClick={() => {
                  setSelectedStudent(stu);
                  setView('chat');
                }}
                className={`flex items-center gap-4 p-4 cursor-pointer rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${
                  selectedStudent.id === stu.id 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-400/50 shadow-lg' 
                    : darkMode 
                      ? 'hover:bg-gray-700/50' 
                      : 'hover:bg-white/70'
                } animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <img
                    src={stu.avatar}
                    alt={stu.name}
                    className="rounded-full w-12 h-12 object-cover ring-2 ring-white/50 group-hover:ring-blue-400/50 transition-all duration-300"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(stu.status)}`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg truncate">{stu.name}</div>
                  <div className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stu.email}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {stu.lastSeen}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Chat Area */}
        <div
          className={`flex flex-col flex-1 ${
            view === 'chat' || window.innerWidth >= 768 ? 'block' : 'hidden'
          }`}
        >
          {/* Chat Header with enhanced design */}
          <div
            className={`flex items-center gap-4 p-6 border-b backdrop-blur-xl ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-white/50 border-gray-200/50'
            }`}
          >
            <button
              className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline transition-all duration-200 hover:scale-105"
              onClick={() => setView('list')}
            >
              ← Back to Students
            </button>
            <div className="relative">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="rounded-full w-12 h-12 object-cover ring-2 ring-blue-400/50"
              />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(selectedStudent.status)}`}></div>
            </div>
            <div>
              <span className="font-bold text-xl">{selectedStudent.name}</span>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {selectedStudent.lastSeen}
              </div>
            </div>
          </div>

          {/* Messages with enhanced styling */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gradient-to-br from-transparent via-blue-50/30 to-purple-50/30 dark:from-transparent dark:via-gray-800/30 dark:to-gray-900/30">
            {(messages[selectedStudent.id] || []).map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end gap-3 animate-slide-up ${
                  msg.from === 'me' ? 'justify-end flex-row-reverse' : 'justify-start'
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {msg.from === 'them' && (
                  <img
                    src={selectedStudent.avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full ring-2 ring-white/50"
                  />
                )}
                <div
                  className={`px-6 py-3 rounded-3xl shadow-lg max-w-xs transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                    msg.from === 'me'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : darkMode
                        ? 'bg-gray-700/80 text-white backdrop-blur-sm'
                        : 'bg-white/80 text-gray-900 backdrop-blur-sm'
                  }`}
                >
                  <div className="text-sm leading-relaxed">{msg.text}</div>
                  <div className="text-xs text-right mt-2 opacity-70">
                    {msg.time}{' '}
                    {msg.from === 'me' &&
                      (msg.status === 'read'
                        ? '✔✔'
                        : msg.status === 'delivered'
                        ? '✔'
                        : '⌛')}
                  </div>
                </div>
              </div>
            ))}

            {showTyping && (
              <div className="flex items-center gap-3 text-sm animate-bounce">
                <img
                  src={selectedStudent.avatar}
                  alt="typing"
                  className="w-8 h-8 rounded-full ring-2 ring-white/50"
                />
                <div className={`px-4 py-2 rounded-2xl ${darkMode ? 'bg-gray-700/80' : 'bg-white/80'} backdrop-blur-sm`}>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Quick Replies */}
          <div className="flex gap-3 p-4 flex-wrap">
            {quickReplies.map((reply, index) => (
              <button
                key={reply}
                className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50"
                onClick={() => sendMessage(reply)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Enhanced Input Section */}
          <div
            className={`flex p-6 gap-4 items-center border-t backdrop-blur-xl ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-white/50 border-gray-200/50'
            }`}
          >
            <div className="flex-1 relative">
              <input
                type="text"
                className={`w-full px-6 py-4 rounded-full border-2 focus:outline-none focus:ring-4 focus:ring-blue-300/50 transition-all duration-300 backdrop-blur-sm ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(message)}
                placeholder="Type your message..."
              />
            </div>
            <button
              onClick={() => sendMessage(message)}
              disabled={!message.trim() || isAnimating}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ChatWithStudent;