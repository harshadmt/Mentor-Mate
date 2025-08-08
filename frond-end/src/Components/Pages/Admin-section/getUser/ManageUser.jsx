import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaLock, FaUnlock, FaTimes, FaUser, FaEnvelope, FaUserTag, FaCalendarAlt, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const navigate = useNavigate();

  // Default profile image
  const defaultProfilePic = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'%3E%3Cpath d='M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z'/%3E%3C/svg%3E";

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:5000/api/admin/users", {
        withCredentials: true,
      });
      
      if (response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } else if (Array.isArray(response.data)) {
        setUsers(response.data);
        setFilteredUsers(response.data);
      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.response?.data?.message || "Failed to load users. Please try again.");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Search users
  useEffect(() => {
    const filtered = users.filter(user => 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, users]);

  // Block/Unblock user
  const toggleBlock = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/blockuser/${id}`,
        {},
        { withCredentials: true }
      );
      fetchUsers();
      if (selectedUser?._id === id) {
        setSelectedUser(prev => ({
          ...prev,
          isBlocked: !prev.isBlocked
        }));
      }
    } catch (error) {
      console.error("Error toggling user block status:", error);
      setError(error.response?.data?.message || "Failed to update user status");
    }
  };

  // View user details
  const viewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedUser(null), 300);
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 md:p-8 bg-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">User Management</h1>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition duration-200 shadow-sm flex items-center justify-center"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="float-right font-bold"
            >
              &times;
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No matching users found" : "No users found"}
            </p>
            <button
              onClick={fetchUsers}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-4 text-left">User</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Role</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-blue-50 hover:bg-blue-50 transition"
                    >
                      <td className="p-4">
                        <div className="flex items-center">
                          <img
                            src={user.profilePicture || defaultProfilePic}
                            alt="Profile"
                            className="w-10 h-10 rounded-full border-2 border-blue-200 mr-3 bg-gray-100"
                          />
                          <span className="font-medium text-blue-800">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-blue-600">{user.email}</td>
                      <td className="p-4">
                        <span className="capitalize px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {user.isBlocked ? (
                          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium inline-flex items-center">
                            <FaLock className="mr-1" size={12} />
                            Blocked
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium inline-flex items-center">
                            <FaUnlock className="mr-1" size={12} />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => toggleBlock(user._id)}
                            className={`px-3 py-1 rounded-lg text-white text-sm font-medium flex items-center transition-all ${
                              user.isBlocked
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-red-500 hover:bg-red-600"
                            }`}
                          >
                            {user.isBlocked ? (
                              <>
                                <FaUnlock className="mr-1" size={12} />
                                Unblock
                              </>
                            ) : (
                              <>
                                <FaLock className="mr-1" size={12} />
                                Block
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => viewUser(user)}
                            className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium flex items-center"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredUsers.length > usersPerPage && (
              <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <button
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg flex items-center ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  <FaChevronLeft className="mr-2" />
                  Previous
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-10 h-10 rounded-full ${currentPage === number ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg flex items-center ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  Next
                  <FaChevronRight className="ml-2" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {showModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-blue-800">User Details</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="flex flex-col items-center mb-6">
                  <img
                    src={selectedUser.profilePicture || defaultProfilePic}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-blue-100 object-cover shadow-md mb-4 bg-gray-100"
                  />
                  <h3 className="text-xl font-bold text-center text-blue-800">{selectedUser.fullName}</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <FaEnvelope className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-blue-800">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <FaUserTag className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium text-blue-800 capitalize">{selectedUser.role}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <FaCalendarAlt className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Created</p>
                      <p className="font-medium text-blue-800">
                        {new Date(selectedUser.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      {selectedUser.isBlocked ? (
                        <FaLock className="text-red-600" />
                      ) : (
                        <FaUnlock className="text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`font-medium ${
                        selectedUser.isBlocked ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {selectedUser.isBlocked ? "Blocked" : "Active"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center space-x-4">
                  <button
                    onClick={() => toggleBlock(selectedUser._id)}
                    className={`px-4 py-2 rounded-lg text-white font-medium flex items-center ${
                      selectedUser.isBlocked
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {selectedUser.isBlocked ? (
                      <>
                        <FaUnlock className="mr-2" />
                        Unblock User
                      </>
                    ) : (
                      <>
                        <FaLock className="mr-2" />
                        Block User
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;