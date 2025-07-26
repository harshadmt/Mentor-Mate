import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./Components/LandingPage/Home";
import Signup from "./Components/Pages/Log-Sign/Signup";
import LoginPage from "./Components/Pages/Log-Sign/Login";
import StudentDashboard from "./Components/Pages/studentsection/dashboard";
import ProtectedRoute from "./ProtectedRoute";
import MentorDashboard from './Components/Pages/mentor-section/Mentordash';
import SeeRoadmaps from './Components/Pages/mentor-section/Roadmap/roadmap';
import ViewRoadmap from './Components/Pages/mentor-section/Roadmap/Viewroad';
import CreateRoadmap from './Components/Pages/mentor-section/Roadmap/createroadmap';
import AdminDashboard from './Components/Pages/Admin-section/Admin-Dash/Admin-dash';
import EditRoadmap from './Components/Pages/mentor-section/Roadmap/Roadmapedit';
import MyStudents from './Components/Pages/mentor-section/myStudent';
import ChatWithStudent from './Components/Pages/mentor-section/chat';
import NotificationsPage from './Components/Pages/mentor-section/Notification';
import EditProfile from './Components/Pages/mentor-section/editprofile';
import useUserStore from "../zustore/store"

function App() {
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser(); // call once on app load
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student/studentdashboard" element={<StudentDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["mentor"]} />}>
          <Route path="/mentor/mentordashboard" element={<MentorDashboard />} />
          <Route path='/mentor/roadmaps' element={<SeeRoadmaps />} />
          <Route path="/mentor/edit/:id" element={<EditRoadmap />} />
          <Route path="/mentor/viewroad/:id" element={<ViewRoadmap />} />
          <Route path='/mentor/createRoadmap' element={<CreateRoadmap />} />
          <Route path='/mentor/student' element={<MyStudents />} />
          <Route path='/mentor/chat' element={<ChatWithStudent />} />
          <Route path='/mentor/notification' element={<NotificationsPage />} />
          <Route path='/mentor/editprofile' element={<EditProfile />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/admindashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
