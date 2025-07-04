"use client";
import React, { useState, useCallback, useEffect } from "react";
import { File, X } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectCurrentProject } from "@/store/projectSlice";

const MIN_SIDEBAR_WIDTH = 256;
const MAX_SIDEBAR_WIDTH = 800;

const colorTheme = {
  primary: "#5CAB7D",
  primaryLight: "#7DCCA0",
  primaryLighter: "#A8E6C3",
  primarySoft: "#ECF9F2",
  primaryDark: "#3D8C5F",
  primaryDarker: "#2A6A45",
  white: "#FFFFFF",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
};

const RightSidebar = () => {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get the selected project from Redux store
  const selectedProjectObj = useSelector(selectCurrentProject);
  
  // Extract the project name from the object
  const getProjectName = (projectObj) => {
    if (!projectObj) return null;
    if (typeof projectObj === 'string') return projectObj;
    // Try to extract the name from common property names
    return projectObj.name || projectObj.title || projectObj.projectName || 
           projectObj.projectTitle || projectObj.id || "unknown";
  };
  
  const selectedProject = getProjectName(selectedProjectObj);

  // Handle mouse move event for resizing
  const handleMouseMove = useCallback(
    (event) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - event.clientX;
      if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
        setSidebarWidth(newWidth);
      }
    },
    [isResizing]
  );

  // Handle mouse up event to stop resizing
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add and remove event listeners for dragging
  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Fetch files from backend using axios
  const fetchFiles = async () => {
    if (!selectedProject) {
      setError("No project selected");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `http://localhost:8080/getDocuments?projectName=${selectedProject}`, 
        { withCredentials: true }
      );
      
      // Assuming the response data structure matches what we need
      const fileNames = response.data;
      setDocuments(fileNames);
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) 
          ? err.response?.data?.message || err.message
          : "Failed to fetch files";
      setError(errorMessage);
      console.error("Error fetching files:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initial file fetch and refetch when selected project changes
  useEffect(() => {
    fetchFiles();
  }, [selectedProject]);

  return (
    <>
      {/* Sidebar */}
      <div
        className="h-full flex flex-col overflow-hidden"
        style={{ 
          width: `${sidebarWidth}px`,
          backgroundColor: colorTheme.white
        }}
      >
        {/* Files Section */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold" style={{ color: colorTheme.primaryDark }}>
              Your Documents
            </h2>
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="text-center py-4" style={{ color: colorTheme.gray500 }}>
                Loading documents...
              </div>
            ) : error ? (
              <div 
                className="p-3 rounded-lg flex items-center justify-between"
                style={{ 
                  backgroundColor: colorTheme.primarySoft, 
                  color: colorTheme.primaryDarker 
                }}
              >
                <span>{error}</span>
                <button onClick={() => setError(null)}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-4" style={{ color: colorTheme.gray400 }}>
                No documents found
              </div>
            ) : (
              documents.map((fileName, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 rounded-lg cursor-pointer transition-colors"
                  style={{
                    ':hover': {
                      backgroundColor: colorTheme.primarySoft
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colorTheme.primarySoft;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <File className="h-5 w-5 mr-3" style={{ color: colorTheme.gray400 }} />
                  <span className="text-sm truncate" style={{ color: colorTheme.primaryDark }}>
                    {fileName}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;