import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserCircle2,
  Flag,
  DollarSign,
  FileText,
  LogOut,
  Menu,
  X,
  TrendingUp,
  AlertTriangle,
  Shield,
  Activity,
  ChevronRight,
  Bell,
  Settings,
  BarChart3,
  Globe,
} from "lucide-react";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = (path) => console.log(`Navigate to: ${path}`);

  const admin = {
    name: "Admin Manager",
    email: "admin@example.com",
    profilePic: "https://i.pravatar.cc/150?img=65",
  };

  const sidebarItems = [
    { icon: <LayoutDashboard />, label: "Dashboard", to: "/admin/dashboard", active: true },
    { icon: <Users />, label: "All Users", to: "/admin/users" },
    { icon: <UserCheck />, label: "Mentor Requests", to: "/admin/mentor-requests", badge: "12" },
    { icon: <Flag />, label: "Reported Issues", to: "/admin/reports", badge: "23" },
    { icon: <FileText />, label: "All Roadmaps", to: "/admin/roadmaps" },
    { icon: <BarChart3 />, label: "Analytics", to: "/admin/analytics" },
    { icon: <Settings />, label: "Settings", to: "/admin/settings" },
    { icon: <LogOut />, label: "Logout", to: "/logout", danger: true },
  ];

  const recentActivities = [
    { action: "New mentor application", user: "Sarah Johnson", time: "5 min ago", type: "mentor" },
    { action: "Roadmap reported", user: "Mike Chen", time: "15 min ago", type: "report" },
    { action: "User registered", user: "Emma Wilson", time: "1 hour ago", type: "user" },
    { action: "Payment processed", user: "John Doe", time: "2 hours ago", type: "payment" },
  ];

  const systemAlerts = [
    { message: "Server load is high", severity: "warning", time: "10 min ago" },
    { message: "Monthly backup completed", severity: "success", time: "2 hours ago" },
    { message: "New security update available", severity: "info", time: "1 day ago" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow-sm border-b border-gray-200">
        <div className="font-bold text-xl text-gray-800">
          AdminPanel
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg w-full md:w-72 px-6 py-6 transition-all duration-300 z-10 border-r border-gray-200 ${
          sidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        {/* Logo */}
        <div className="hidden md:block mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-800">
                AdminPanel
              </h1>
              <p className="text-xs text-gray-500">System Control</p>
            </div>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex flex-col gap-2">
          {sidebarItems.map(({ icon, label, to, danger, active, badge }) => (
            <button
              key={label}
              onClick={() => navigate(to)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-left w-full transition-all duration-200 relative ${
                active
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md transform scale-105"
                  : danger
                  ? "text-red-500 hover:bg-red-50 hover:shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:shadow-sm hover:transform hover:scale-105"
              }`}
            >
              <span className={`transition-transform duration-200 ${active ? "" : "group-hover:scale-110"}`}>
                {icon}
              </span>
              <span className="font-medium flex-1">{label}</span>
              {badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                  {badge}
                </span>
              )}
              {!danger && !active && (
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto bg-gray-50">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {admin.name} 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Monitor and manage your platform with confidence
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="relative p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-200">
              <Bell className="text-gray-600" size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            
            {/* Profile */}
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="relative">
                <img
                  src={admin.profilePic}
                  alt="Admin"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-gray-800">{admin.name}</p>
                <p className="text-sm text-gray-500">{admin.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            icon={<Users />} 
            title="Total Users" 
            value="1,024" 
            change="+12%" 
            gradient="from-blue-500 to-blue-600"
            trend="up"
          />
          <StatsCard 
            icon={<UserCheck />} 
            title="Active Mentors" 
            value="150" 
            change="+8%" 
            gradient="from-green-500 to-green-600"
            trend="up"
          />
          <StatsCard 
            icon={<UserCircle2 />} 
            title="Students" 
            value="874" 
            change="+15%" 
            gradient="from-purple-500 to-purple-600"
            trend="up"
          />
          <StatsCard 
            icon={<Flag />} 
            title="Open Issues" 
            value="23" 
            change="-5%" 
            gradient="from-orange-500 to-red-500"
            trend="down"
            alert
          />
          <StatsCard 
            icon={<DollarSign />} 
            title="Revenue" 
            value="$12.5K" 
            change="+22%" 
            gradient="from-emerald-500 to-teal-500"
            trend="up"
          />
          <StatsCard 
            icon={<FileText />} 
            title="Roadmaps" 
            value="78" 
            change="+6%" 
            gradient="from-indigo-500 to-purple-500"
            trend="up"
          />
          <StatsCard 
            icon={<Globe />} 
            title="Active Sessions" 
            value="245" 
            change="+18%" 
            gradient="from-pink-500 to-rose-500"
            trend="up"
          />
          <StatsCard 
            icon={<Activity />} 
            title="Server Load" 
            value="67%" 
            change="+3%" 
            gradient="from-yellow-500 to-orange-500"
            trend="up"
          />
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Recent Activities</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-gray-100">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                      activity.type === 'mentor' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      activity.type === 'report' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                      activity.type === 'user' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      'bg-gradient-to-r from-purple-500 to-purple-600'
                    }`}>
                      {activity.type === 'mentor' ? <UserCheck size={16} /> :
                       activity.type === 'report' ? <Flag size={16} /> :
                       activity.type === 'user' ? <Users size={16} /> :
                       <DollarSign size={16} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.user}</p>
                    </div>
                    <div className="text-xs text-gray-400">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Alerts */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">System Alerts</h3>
              <div className="space-y-3">
                {systemAlerts.map((alert, index) => (
                  <div key={index} className={`p-4 rounded-xl border ${
                    alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    alert.severity === 'success' ? 'bg-green-50 border-green-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${
                        alert.severity === 'warning' ? 'text-yellow-600' :
                        alert.severity === 'success' ? 'text-green-600' :
                        'text-blue-600'
                      }`}>
                        {alert.severity === 'warning' ? <AlertTriangle size={16} /> :
                         alert.severity === 'success' ? <UserCheck size={16} /> :
                         <Bell size={16} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 mb-1">{alert.message}</p>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <QuickActionButton 
                  icon={<UserCheck />} 
                  label="Review Applications"
                  gradient="from-blue-500 to-blue-600"
                />
                <QuickActionButton 
                  icon={<Flag />} 
                  label="Handle Reports"
                  gradient="from-red-500 to-orange-500"
                />
                <QuickActionButton 
                  icon={<BarChart3 />} 
                  label="View Analytics"
                  gradient="from-purple-500 to-purple-600"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatsCard = ({ icon, title, value, change, gradient, trend, alert }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:scale-105 transition-all duration-300 group relative overflow-hidden">
    {alert && (
      <div className="absolute top-2 right-2">
        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
      </div>
    )}
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        <TrendingUp className={`w-4 h-4 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
        {change}
      </div>
    </div>
    <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

const QuickActionButton = ({ icon, label, gradient }) => (
  <button className={`w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${gradient} text-white hover:shadow-md hover:scale-105 transition-all duration-200 group`}>
    <span className="group-hover:scale-110 transition-transform duration-200">{icon}</span>
    <span className="font-medium flex-1 text-left">{label}</span>
    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
  </button>
);

export default AdminDashboard;