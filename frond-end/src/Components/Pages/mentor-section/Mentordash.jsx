import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookPlus,
  Users,
  CalendarCheck,
  Bell,
  UserCog,
  LogOut,
  MessageCircle,
  Menu,
  X,
  TrendingUp,
  Clock,
  Star,
  Award,
  ChevronRight,
} from "lucide-react";
import useUserStore from "../../../../zustore/store";
import axios from "axios";


import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MentorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const { user, logout } = useUserStore();

  const sidebarItems = [
    { icon: <LayoutDashboard />, label: "Landing-page", to: "/", active: true },
    { icon: <BookPlus />, label: "Manage Roadmaps", to: "/mentor/roadmaps" },
    { icon: <Users />, label: "My Students", to: "/mentor/student" },
    { icon: <MessageCircle />, label: "Chat with Students", to: "/mentor/chat" },
    { icon: <Bell />, label: "Notifications", to: "/mentor/notification" },
    { icon: <UserCog />, label: "Edit Profile", to: "/mentor/editprofile" },
    { icon: <LogOut />, label: "Logout", to: "/logout", danger: true },
  ];

  const recentActivities = [
    { student: "Alice Johnson", action: "Completed React Fundamentals", time: "2 hours ago" },
    { student: "Bob Smith", action: "Started Advanced JavaScript", time: "4 hours ago" },
    { student: "Carol Davis", action: "Scheduled 1:1 session", time: "1 day ago" },
  ];

  
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Logged out successfully!");
        if (typeof logout === "function") logout();
        navigate("/login");
      } else {
        toast.error("Logout failed!");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during logout.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white/80 backdrop-blur-md shadow-sm border-b">
        <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
          MentorMate
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white/80 backdrop-blur-md shadow-xl w-full md:w-72 px-6 py-6 transition-all duration-300 z-10 border-r border-gray-200/50 ${
          sidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="hidden md:block mb-8">
          <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
            MentorMate
          </h1>
          <p className="text-sm text-gray-500 mt-1">⚡Mentor Dashboard</p>
        </div>

        <nav className="flex flex-col gap-2">
          {sidebarItems.map(({ icon, label, to, danger, active }) => (
            <button
              key={label}
              onClick={label === "Logout" ? handleLogout : () => navigate(to)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-left w-full transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-blue-500 to-blue-500 text-white shadow-lg transform scale-[1.02]"
                  : danger
                  ? "text-red-600 hover:bg-red-50 hover:shadow-md"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md hover:transform hover:scale-[1.02]"
              }`}
            >
              <span className={`transition-transform duration-200 ${active ? "" : "group-hover:scale-110"}`}>
                {icon}
              </span>
              <span className="font-medium">{label}</span>
              {!danger && !active && (
                <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Topbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Welcome back, {user?.fullName || "guest"} 👋
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Ready to inspire and guide your students today?
            </p>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="relative">
              <img
                src={user?.profilePicture}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-right">
              <h2 className="font-semibold text-gray-800">{user?.fullName}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Created Roadmaps" value="4" icon={<BookPlus size={24} />} gradient="from-blue-500 to-blue-600" bgGradient="from-blue-50 to-blue-100" change="+2 this month" />
          <StatCard title="Active Students" value="12" icon={<Users size={24} />} gradient="from-green-500 to-green-600" bgGradient="from-green-50 to-green-100" change="+3 this week" />
          <StatCard title="Completion Rate" value="87%" icon={<TrendingUp size={24} />} gradient="from-purple-500 to-purple-600" bgGradient="from-purple-50 to-purple-100" change="+5% this month" />
          <StatCard title="Next Session" value="Tomorrow 5 PM" icon={<Clock size={24} />} gradient="from-orange-500 to-orange-600" bgGradient="from-orange-50 to-orange-100" change="Live Q&A" />
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all duration-200">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-500 flex items-center justify-center text-white font-medium">
                      {activity.student.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{activity.student}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                    <div className="text-xs text-gray-400">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <div onClick={() => navigate("/mentor/createRoadmap")}>
                  <QuickActionButton icon={<BookPlus size={20} />} label="Create New Roadmap" color="from-blue-500 to-blue-600" />
                </div>
                <div>
                  <QuickActionButton icon={<CalendarCheck size={20} />} label="Schedule Session" color="from-green-500 to-green-600" />
                </div>
                <div onClick={() => navigate("/mentor/chat")}>
                  <QuickActionButton icon={<MessageCircle size={20} />} label="Message Students" color="from-purple-500 to-purple-600" />
                </div>
              </div>
            </div>

            {/* Achievement */}
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl shadow-lg border border-yellow-200/50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Award className="text-yellow-600" size={24} />
                <h3 className="text-lg font-semibold text-yellow-800">Achievement</h3>
              </div>
              <p className="text-yellow-700 mb-2">Congratulations! 🎉</p>
              <p className="text-sm text-yellow-600">You've helped 5 students complete their roadmaps this month!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, gradient, bgGradient, change }) => (
  <div className={`bg-gradient-to-br ${bgGradient} rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl hover:scale-105 transition-all duration-300 group`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
    </div>
    <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-800 mb-2">{value}</p>
    <p className="text-xs text-gray-500">{change}</p>
  </div>
);

const QuickActionButton = ({ icon, label, color }) => (
  <button className={`w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${color} text-white hover:shadow-lg hover:scale-105 transition-all duration-200 group`}>
    <span className="group-hover:scale-110 transition-transform duration-200">{icon}</span>
    <span className="font-medium">{label}</span>
    <ChevronRight size={16} className="ml-auto group-hover:translate-x-1 transition-transform duration-200" />
  </button>
);

export default MentorDashboard;
