import React from 'react';
import { Bell, MessageSquareText, CalendarCheck, BookOpen, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const notifications = [
  {
    id: 1,
    title: 'New Message from Student A',
    description: 'Student A sent you a new message regarding roadmap progress.',
    icon: <MessageSquareText className="text-blue-600" size={22} />,
    time: '2 mins ago',
    read: false,
  },
  {
    id: 2,
    title: 'Session Scheduled',
    description: 'You have scheduled a session with Student B for tomorrow.',
    icon: <CalendarCheck className="text-green-600" size={22} />,
    time: '1 hour ago',
    read: true,
  },
  {
    id: 3,
    title: 'Roadmap Purchased',
    description: 'Student C unlocked your "Frontend Roadmap".',
    icon: <BookOpen className="text-purple-600" size={22} />,
    time: 'Yesterday',
    read: false,
  },
];

const NotificationsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6 relative">
          <button 
            onClick={() => navigate('/mentor/mentordashboard')}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors absolute left-0"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-3 ml-12">
            <Bell className="text-blue-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {notifications.map((note) => (
            <div
              key={note.id}
              className={`flex items-start gap-4 p-4 rounded-xl transition hover:bg-gray-50 ${
                note.read ? 'bg-white' : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <div className="mt-1">{note.icon}</div>
              <div className="flex-1">
                <h4 className="text-sm md:text-base font-semibold text-gray-800">
                  {note.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">{note.description}</p>
              </div>
              <span className="text-xs text-gray-400">{note.time}</span>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              You have no notifications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;