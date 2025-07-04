"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  UserPlus,
  Users,
  Search,
  Mail,
  User,
  Shield,
  Building,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const UserManagement = () => {
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [roles, setRoles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role_name: "",
    team_name: "",
  });

  // Color theme
  const colorTheme = {
    primary: "#5CAB7D",
    primaryLight: "#7DCCA0",
    primaryLighter: "#A8E6C3",
    primaryDark: "#3D8C5F",
    primaryDarker: "#2A6A45",
    white: "#FFFFFF",
    gray100: "#F3F4F6",
    gray200: "#E5E7EB",
    gray300: "#D1D5DB",
    gray400: "#9CA3AF",
    gray500: "#6B7280",
    gray600: "#4B5563",
    gray700: "#374151",
    gray800: "#1F2937",
    error: "#EF4444",
    success: "#10B981",
  };

  // Fetch users, roles and teams when component mounts
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch users, roles and teams in parallel
      const [usersResponse, rolesResponse, teamsResponse] = await Promise.all([
        axios.get("http://localhost:8080/getAllUsers"),
        axios.get("http://localhost:8080/getRoles"),
        axios.get("http://localhost:8080/getTeams"),
      ]);

      // 👇 ***Only adjustment: handle `userName` gracefully***
      const processedUsers = usersResponse.data.map((user) => {
        const splitName =
          user.userName && user.userName.includes(" ")
            ? user.userName.split(" ")
            : [user.userName, ""]; // ["john", ""] if single word
        return {
          id: user.id || user.userId || user._id,
          firstName:
            user.firstName ||
            user.first_name ||
            splitName[0] ||
            "", // pick first part of userName
          lastName:
            user.lastName ||
            user.last_name ||
            splitName.slice(1).join(" ") ||
            "", // rest of userName
          email: user.email || "",
          role: user.role || user.role_name || "",
          team: user.team || user.team_name || "",
          joinDate: user.joinDate || user.created_at || new Date().toISOString(),
          status: user.status || "Active",
        };
      });

      setUsers(processedUsers);
      setRoles(rolesResponse.data);
      setTeams(teamsResponse.data);
      console.log("Processed users:", processedUsers);
    } catch (error) {
      console.error("Error fetching data:", error);
      showNotification(
        "Error Loading Data",
        "Failed to load users, roles, or teams. Please try again.",
        "error"
      );
    } finally {
      setIsLoadingUsers(false);
    }
  };

  /* ----------------------------  rest of your code  --------------------------- */
  /* NOTHING below this point was modified                                                */

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    try {
      await axios.post("http://localhost:8080/addUser", newUser);
      await fetchAllData();
      const fullName = `${newUser.firstName} ${newUser.lastName}`;
      showNotification(
        "User Added Successfully",
        `${fullName} has been added to the system.`,
        "success"
      );
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role_name: "",
        team_name: "",
      });
      setShowAddUserForm(false);
    } catch (error) {
      console.error("Error adding user:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add user. Please try again.";
      setFormError(errorMessage);
      showNotification("Error Adding User", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleShowAddUserForm = () => {
    setShowAddUserForm(true);
    showNotification("Add New User", "Please fill in all required fields.", "info");
  };

  // Simple notification system
  const [notifications, setNotifications] = useState([]);

  const showNotification = (title, message, type = "info") => {
    const id = Date.now();
    const notification = { id, title, message, type };
    setNotifications((prev) => [...prev, notification]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower) ||
      user.team.toLowerCase().includes(searchLower)
    );
  });

  const getInitials = (firstName = "", lastName = "") =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const getAvatarColor = (name) => {
    const colors = [
      colorTheme.primary,
      colorTheme.primaryLight,
      colorTheme.primaryDark,
      "#8B5CF6",
      "#F59E0B",
      "#EF4444",
      "#3B82F6",
      "#10B981",
      "#F97316",
      "#6366F1",
    ];
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getTeamColor = (teamName) => {
    if (!teamName) return "bg-gray-100 text-gray-800";
    const hash = teamName
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-purple-100 text-purple-800",
      "bg-yellow-100 text-yellow-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-red-100 text-red-800",
      "bg-orange-100 text-orange-800",
      "bg-teal-100 text-teal-800",
      "bg-cyan-100 text-cyan-800",
    ];
    return colors[hash % colors.length];
  };

  const handleMouseEnter = (user, event) => {
    setHoveredUser(user);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredUser(null);
  };

 

  return (
    <div className="min-h-screen" style={{ backgroundColor: colorTheme.gray100 }}>
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg max-w-sm cursor-pointer transition-all duration-300 ${
              notification.type === 'success' ? 'bg-green-50 border-l-4 border-green-400' :
              notification.type === 'error' ? 'bg-red-50 border-l-4 border-red-400' :
              'bg-blue-50 border-l-4 border-blue-400'
            }`}
            onClick={() => removeNotification(notification.id)}
          >
            <div className="flex">
              <div className="flex-1">
                <h4 className={`text-sm font-medium ${
                  notification.type === 'success' ? 'text-green-800' :
                  notification.type === 'error' ? 'text-red-800' :
                  'text-blue-800'
                }`}>
                  {notification.title}
                </h4>
                <p className={`text-sm mt-1 ${
                  notification.type === 'success' ? 'text-green-600' :
                  notification.type === 'error' ? 'text-red-600' :
                  'text-blue-600'
                }`}>
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header with SuperNova branding */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <h1 className="text-2xl font-bold" style={{ color: colorTheme.gray800 }}>SuperNova</h1>
            </div>
            <div className="text-sm" style={{ color: colorTheme.gray600 }}>
              Admin Dashboard
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colorTheme.gray800 }}>Team Members</h1>
            <p style={{ color: colorTheme.gray600 }} className="mt-1">
              {isLoadingUsers ? 'Loading...' : `${filteredUsers.length} users in your organization`}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleShowAddUserForm} 
              className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all shadow-sm"
              style={{ 
                backgroundColor: colorTheme.primary
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = colorTheme.primaryLight}
              onMouseLeave={(e) => e.target.style.backgroundColor = colorTheme.primary}
            >
              <UserPlus className="h-4 w-4" />
              Add New User
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colorTheme.gray400 }} />
            <input 
              type="text" 
              placeholder="Search team members..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 shadow-sm transition-all"
              style={{ 
                border: `1px solid ${colorTheme.gray200}`,
                backgroundColor: colorTheme.white
              }}
              onFocus={(e) => e.target.style.borderColor = colorTheme.primary}
              onBlur={(e) => e.target.style.borderColor = colorTheme.gray200}
            />
          </div>
          {searchTerm && !isLoadingUsers && (
            <p className="mt-2 text-sm" style={{ color: colorTheme.gray500 }}>
              Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} matching "{searchTerm}"
            </p>
          )}
        </div>

        {showAddUserForm && (
          <Card className="mb-6 shadow-md" style={{ backgroundColor: colorTheme.white }}>
            <CardHeader>
              <CardTitle className="text-xl" style={{ color: colorTheme.primaryDarker }}>Add New Team Member</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {formError && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                  {formError}
                </div>
              )}
              <form onSubmit={handleAddUser}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colorTheme.gray700 }}>First Name</label>
                    <input 
                      type="text" 
                      name="firstName" 
                      value={newUser.firstName} 
                      onChange={handleInputChange} 
                      className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        border: `1px solid ${colorTheme.gray200}`,
                        backgroundColor: colorTheme.white
                      }}
                      onFocus={(e) => e.target.style.borderColor = colorTheme.primary}
                      onBlur={(e) => e.target.style.borderColor = colorTheme.gray200}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colorTheme.gray700 }}>Last Name</label>
                    <input 
                      type="text" 
                      name="lastName" 
                      value={newUser.lastName} 
                      onChange={handleInputChange} 
                      className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        border: `1px solid ${colorTheme.gray200}`,
                        backgroundColor: colorTheme.white
                      }}
                      onFocus={(e) => e.target.style.borderColor = colorTheme.primary}
                      onBlur={(e) => e.target.style.borderColor = colorTheme.gray200}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colorTheme.gray700 }}>Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={newUser.email} 
                      onChange={handleInputChange} 
                      className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        border: `1px solid ${colorTheme.gray200}`,
                        backgroundColor: colorTheme.white
                      }}
                      onFocus={(e) => e.target.style.borderColor = colorTheme.primary}
                      onBlur={(e) => e.target.style.borderColor = colorTheme.gray200}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colorTheme.gray700 }}>Password</label>
                    <input 
                      type="password" 
                      name="password" 
                      value={newUser.password} 
                      onChange={handleInputChange} 
                      className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        border: `1px solid ${colorTheme.gray200}`,
                        backgroundColor: colorTheme.white
                      }}
                      onFocus={(e) => e.target.style.borderColor = colorTheme.primary}
                      onBlur={(e) => e.target.style.borderColor = colorTheme.gray200}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colorTheme.gray700 }}>Role</label>
                    <select 
                      name="role_name" 
                      value={newUser.role_name} 
                      onChange={handleInputChange} 
                      className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        border: `1px solid ${colorTheme.gray200}`,
                        backgroundColor: colorTheme.white
                      }}
                      onFocus={(e) => e.target.style.borderColor = colorTheme.primary}
                      onBlur={(e) => e.target.style.borderColor = colorTheme.gray200}
                      required
                    >
                      <option value="">Select a role</option>
                      {roles.map((role, index) => (
                        <option key={index} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colorTheme.gray700 }}>Team</label>
                    <select 
                      name="team_name" 
                      value={newUser.team_name} 
                      onChange={handleInputChange} 
                      className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        border: `1px solid ${colorTheme.gray200}`,
                        backgroundColor: colorTheme.white
                      }}
                      onFocus={(e) => e.target.style.borderColor = colorTheme.primary}
                      onBlur={(e) => e.target.style.borderColor = colorTheme.gray200}
                      required
                    >
                      <option value="">Select a team</option>
                      {teams.map((team, index) => (
                        <option key={index} value={team}>
                          {team}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowAddUserForm(false)} 
                    className="px-6 py-2 rounded-lg transition-colors"
                    style={{ 
                      border: `1px solid ${colorTheme.gray200}`,
                      backgroundColor: colorTheme.white,
                      color: colorTheme.gray700
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = colorTheme.gray100}
                    onMouseLeave={(e) => e.target.style.backgroundColor = colorTheme.white}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 text-white rounded-lg transition-colors flex items-center gap-2"
                    style={{ backgroundColor: colorTheme.primary }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = colorTheme.primaryLight}
                    onMouseLeave={(e) => e.target.style.backgroundColor = colorTheme.primary}
                    disabled={loading}
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? 'Adding User...' : 'Add User'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoadingUsers ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: colorTheme.primary }} />
              <p style={{ color: colorTheme.gray600 }}>Loading team members...</p>
            </div>
          </div>
        ) : (
          <>
            {/* User Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 cursor-pointer group"
                  style={{ 
                    backgroundColor: colorTheme.white,
                    border: `1px solid ${colorTheme.gray100}`
                  }}
                  onMouseEnter={(e) => {
                    handleMouseEnter(user, e);
                    e.target.style.borderColor = colorTheme.primaryLight;
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={(e) => {
                    handleMouseLeave();
                    e.target.style.borderColor = colorTheme.gray100;
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg mb-3 group-hover:scale-110 transition-transform duration-200"
                      style={{ backgroundColor: getAvatarColor(user.firstName + user.lastName) }}
                    >
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    
                    {/* Name */}
                    <h3 className="font-semibold text-sm mb-1" style={{ color: colorTheme.gray800 }}>
                      {`${user.firstName} ${user.lastName}`.trim() || 'Unknown'}
                    </h3>
                    
                    {/* Email */}
                    <p className="text-xs mb-3 truncate w-full" style={{ color: colorTheme.gray500 }}>
                      {user.email}
                    </p>
                    
                    {/* Role and Team badges */}
                    <div className="flex flex-col gap-1 w-full">
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: user.role === 'Admin' ? colorTheme.primaryLighter : 
                                         user.role === 'Editor' ? '#DBEAFE' : colorTheme.gray100,
                          color: user.role === 'Admin' ? colorTheme.primaryDarker :
                                 user.role === 'Editor' ? '#1E40AF' : colorTheme.gray800
                        }}
                      >
                        {user.role || 'N/A'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getTeamColor(user.team)}`}>
                        {user.team || 'No Team'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? `No users match "${searchTerm}"` : "Get started by adding your first team member."}
                </p>
                <button 
                  onClick={() => {
                    handleShowAddUserForm();
                    setSearchTerm("");
                  }}
                  className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: colorTheme.primary }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = colorTheme.primaryLight}
                  onMouseLeave={(e) => e.target.style.backgroundColor = colorTheme.primary}
                >
                  <UserPlus className="h-4 w-4" />
                  Add First User
                </button>
              </div>
            )}
          </>
        )}

        {/* Hover Card */}
        {hoveredUser && (
          <div 
            className="fixed z-50 pointer-events-none"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 10,
              transform: 'translateY(-50%)'
            }}
          >
            <div 
              className="rounded-lg shadow-lg p-4 w-64"
              style={{ 
                backgroundColor: colorTheme.white,
                border: `1px solid ${colorTheme.gray200}`
              }}
            >
              <div className="flex items-center mb-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3"
                  style={{ backgroundColor: getAvatarColor(hoveredUser.firstName + hoveredUser.lastName) }}
                >
                  {getInitials(hoveredUser.firstName, hoveredUser.lastName)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {`${hoveredUser.firstName} ${hoveredUser.lastName}`.trim() || 'Unknown'}
                  </h4>
                  <p className="text-sm text-gray-500">{hoveredUser.role || 'N/A'}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="truncate">{hoveredUser.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{hoveredUser.team || 'No Team'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <span>Joined {new Date(hoveredUser.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    hoveredUser.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {hoveredUser.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;