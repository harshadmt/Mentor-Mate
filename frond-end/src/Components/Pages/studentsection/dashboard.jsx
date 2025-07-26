import React, { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  CalendarDays,
  MessageSquare,
  Bell,
  UserCog,
  LogOut,
  Menu,
  X,

} from "lucide-react";

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100">
        <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          MentorMate
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-gray-100 rounded-lg"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white/90 backdrop-blur-xl shadow-xl w-full md:w-72 px-6 py-6 space-y-4 transition-all duration-300 z-10 border-r border-gray-100 ${
          sidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden md:block mb-8">
          MentorMate
        </div>
        <nav className="flex flex-col gap-3 mt-4">
          <SidebarLink icon={<GraduationCap />} label="Dashboard" active />
          <SidebarLink icon={<BookOpen />} label="Roadmap" />
          <SidebarLink icon={<MessageSquare />} label="Chat with Mentor" />
          <SidebarLink icon={<CalendarDays />} label="Mentor" />
          <SidebarLink icon={<Bell />} label="Notifications" badge="3" />
          <SidebarLink icon={<UserCog />} label="Edit Profile" />
          <div className="mt-8 pt-4 border-t border-gray-100">
            <SidebarLink icon={<LogOut />} label="Logout" danger />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Welcome back, Harshad 👋
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-700">Harshad Kumar</p>
              <p className="text-xs text-gray-500">Full Stack Student</p>
            </div>
            <div className="relative">
              <img
                src="https://i.pravatar.cc/40"
                alt="avatar"
                className="w-12 h-12 rounded-full border-3 border-white shadow-lg ring-2 ring-blue-100"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<BookOpen className="w-6 h-6" />} 
            title="Enrolled Courses" 
            value="5" 
            change="+2 this month"
            color="blue"
          />
          <StatCard 
            icon={<GraduationCap className="w-6 h-6" />} 
            title="Progress" 
            value="68%" 
            change="+12% this week"
            color="green"
          />
          <StatCard 
            icon={<CalendarDays className="w-6 h-6" />} 
            title="Study Hours" 
            value="42h" 
            change="This month"
            color="purple"
          />
          <StatCard 
            icon={<MessageSquare className="w-6 h-6" />} 
            title="Live Sessions" 
            value="8" 
            change="Completed"
            color="orange"
          />
        </div>

        {/* Main Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card
              title="Next Session"
              subtitle="Don't miss your upcoming class"
              icon={<CalendarDays className="w-5 h-5" />}
            >
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <div>
                  <h3 className="font-semibold text-gray-800">React Advanced Concepts</h3>
                  <p className="text-sm text-gray-600">Today at 6:00 PM</p>
                  <p className="text-xs text-blue-600 mt-1">with Mentor Rahul</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">6:00</div>
                  <div className="text-xs text-gray-500">PM</div>
                </div>
              </div>
            </Card>

            <Card
              title="This Week's Schedule"
              subtitle="Your learning roadmap"
              icon={<CalendarDays className="w-5 h-5" />}
            >
              <div className="space-y-3">
                {[
                  { day: "Monday", topic: "HTML & CSS Fundamentals", time: "3:00 - 4:00 PM", color: "bg-red-100 text-red-700" },
                  { day: "Wednesday", topic: "JavaScript Essentials", time: "4:00 - 5:00 PM", color: "bg-yellow-100 text-yellow-700" },
                  { day: "Friday", topic: "React Basics", time: "6:00 - 7:00 PM", color: "bg-blue-100 text-blue-700" },
                ].map((session, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${session.color.split(' ')[0]}`}></div>
                      <div>
                        <p className="font-medium text-gray-800">{session.topic}</p>
                        <p className="text-sm text-gray-500">{session.day}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{session.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card
              title="Latest Message"
              subtitle="From your mentor"
              icon={<MessageSquare className="w-5 h-5" />}
            >
              <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-100">
                <div className="flex items-start gap-3">
                  <img
                    src="https://i.pravatar.cc/32"
                    alt="mentor"
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Mentor Rahul</p>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      "Hi Harshad! Great progress on the React components. Don't forget to practice hooks before our next session. 🚀"
                    </p>
                    <p className="text-xs text-gray-400 mt-2">2 hours ago</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title="Recent Notifications"
              subtitle="Stay updated"
              icon={<Bell className="w-5 h-5" />}
            >
              <div className="space-y-3">
                {[
                  { text: "New blog added: Mastering Redux", type: "blog", time: "1h ago" },
                  { text: "Session with Rahul scheduled", type: "session", time: "3h ago" },
                  { text: "React Quiz unlocked", type: "quiz", time: "5h ago" },
                ].map((notification, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{notification.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sidebar Link Component
const SidebarLink = ({ icon, label, danger, active, badge }) => (
  <a
    href="#"
    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
      active
        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
        : danger
        ? "text-red-600 hover:bg-red-50 hover:text-red-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
    }`}
  >
    <div className="flex items-center gap-3">
      <span className={`w-5 h-5 transition-transform ${active ? '' : 'group-hover:scale-110'}`}>{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
    {badge && (
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
        {badge}
      </span>
    )}
  </a>
);

// Stat Card Component
const StatCard = ({ icon, title, value, change, color }) => {
  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorMap[color]} text-white shadow-lg`}>
          {icon}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        <span className="text-xs text-gray-500">{change}</span>
      </div>
    </div>
  );
};

// Main Card Component
const Card = ({ title, subtitle, icon, children }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
};

export default StudentDashboard;