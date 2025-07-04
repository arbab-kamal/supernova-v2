"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Zap, FolderOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import ProjectModal from "./modal";
import { useDispatch } from "react-redux";
import { setProjects, setSelectedProject } from "@/store/projectSlice";

const ProjectDashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [localProjects, setLocalProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Color theme
  const colorTheme = {
    primary: '#5CAB7D',
    primaryLight: '#7DCCA0',
    primaryLighter: '#A8E6C3',
    primaryDark: '#3D8C5F',
    primaryDarker: '#2A6A45',
    white: '#FFFFFF',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    error: '#EF4444'
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/getProjects");
      
      const formattedProjects = response.data.map((projectTitle, index) => ({
        id: String(index + 1),
        title: projectTitle,
        admin: "Admin",
        adminAvatar: "/1.jpeg",
        chatCount: 0,
        promptCount: 0
      }));
      
      setLocalProjects(formattedProjects);
      // Also update Redux store
      dispatch(setProjects(formattedProjects));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects. Please try again.");
      setLoading(false);
    }
  };

  const handleProjectClick = (project) => {
    // Store the selected project in Redux
    dispatch(setSelectedProject(project));
    // Navigate to the chat page
    router.push(`/chat?projectId=${project.id}&projectTitle=${encodeURIComponent(project.title)}`);
  };

  const handleCreateProject = async (newProject) => {
    try {
      const response = await axios.post("http://localhost:8080/createProject", {
        projectTitle: newProject.title
      });
      
      fetchProjects();
      toast.success("Project created successfully!");
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: colorTheme.white }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold" style={{ color: colorTheme.gray800 }}>
          Project
        </h1>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-md"
          style={{ 
            backgroundColor: colorTheme.primary,
            minHeight: '40px',
            minWidth: '180px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = colorTheme.primaryLight;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = colorTheme.primary;
          }}
        >
          + Create New Project
        </Button>
      </div>

      <h2 className="text-sm mb-4" style={{ color: colorTheme.gray600 }}>
        All Projects
      </h2>

      {loading ? (
        <div 
          className="text-center py-12 text-lg" 
          style={{ color: colorTheme.gray500 }}
        >
          Loading projects...
        </div>
      ) : localProjects.length === 0 ? (
        <div 
          className="text-center py-12" 
          style={{ color: colorTheme.gray500 }}
        >
          No projects found. Create your first project to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-green-100"
              style={{ 
                backgroundColor: colorTheme.white,
                borderColor: colorTheme.gray200
              }}
              onClick={() => handleProjectClick(project)}
              onMouseEnter={(e) => {
                e.target.style.borderColor = colorTheme.primaryLight;
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = colorTheme.gray200;
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {/* Project Icon Header */}
              <div 
                className="flex items-center justify-center h-32 rounded-t-lg"
                style={{ backgroundColor: colorTheme.primaryLighter }}
              >
                <FolderOpen 
                  className="w-16 h-16"
                  style={{ color: colorTheme.primaryDark }}
                />
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 
                    className="font-medium text-lg"
                    style={{ color: colorTheme.gray800 }}
                  >
                    {project.title}
                  </h3>
                  <button
                    className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors duration-200"
                    style={{ 
                      minWidth: '32px',
                      minHeight: '32px'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle menu click
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = colorTheme.gray100;
                      e.target.style.color = colorTheme.gray600;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = colorTheme.gray400;
                    }}
                  >
                    •••
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={project.adminAvatar || "/book.jpg"}
                      className="w-6 h-6 rounded-full bg-gray-200"
                      alt="Admin"
                    />
                    <span 
                      className="text-sm"
                      style={{ color: colorTheme.gray600 }}
                    >
                      {project.admin || "Admin"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MessageSquare 
                        className="w-4 h-4"
                        style={{ color: colorTheme.primary }}
                      />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: colorTheme.primary }}
                      >
                        {project.chatCount || 0}
                      </span>
                      <span 
                        className="text-xs"
                        style={{ color: colorTheme.gray400 }}
                      >
                        AI Chat
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Zap 
                        className="w-4 h-4"
                        style={{ color: colorTheme.primary }}
                      />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: colorTheme.primary }}
                      >
                        {project.promptCount || 0}
                      </span>
                      <span 
                        className="text-xs"
                        style={{ color: colorTheme.gray400 }}
                      >
                        Prompt Assist
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <ProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateProject={handleCreateProject}
        hideDescription={true}
      />
    </div>
  );
};

export default ProjectDashboard;