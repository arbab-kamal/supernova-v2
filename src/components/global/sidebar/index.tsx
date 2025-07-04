"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Notebook, PlusCircle, Share, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { startNewChat, selectChatId, selectChatStatus } from "@/store/chatSlice";
import { selectCurrentProject } from "@/store/projectSlice";
import { 
  fetchChatHistory 
} from "@/store/historySlice";
import { setChatId } from "@/store/chatSlice";
import {
  MessageCircle,
  Wand2,
  Clock,
  Bookmark,
  ChevronDown,
  ChevronUp,
  FolderGit2,
  BarChart,
  MessageSquare,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import Drawer from "./Drawer/drawer";
import ShareNotes from "./Share";

const Sidebar = () => {
  const [notesOpen, setNotesOpen] = useState(false);
  // Local state for toggling sections, username and loading indicator
  const [isPromptOpen, setIsPromptOpen] = useState(true);
  const [isChatCountOpen, setIsChatCountOpen] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // chatCountList keeps a count for each chat (each element is the number of messages)
  const [chatCountList, setChatCountList] = useState<number[]>([]);
  // currentChatId will hold the latest chat id, which we increment every time a new chat is created.
  const [currentChatId, setCurrentChatId] = useState(0);
  // activeChatIndex holds the index of the chat that is currently active.
  const [activeChatIndex, setActiveChatIndex] = useState<number | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const chatId = useSelector(selectChatId);
  const chatStatus = useSelector(selectChatStatus);
  const selectedProject = useSelector(selectCurrentProject);

  // Create a new chat with an incremented chat id.
  const handleNewChat = async () => {
    // Increment the currentChatId by one
    const newChatId = currentChatId + 1;
    setCurrentChatId(newChatId);
  
    // Dispatch the new chat action with the newChatId
    dispatch(startNewChat(newChatId));
  
    // Mark the new chat as active
    setActiveChatIndex(chatCountList.length); // This will be the index of the new chat after it's added
  
    // Navigate to the chat page
    router.push('/chat')
  };

  // A robust method to retrieve the project name from the selected project
  const getProjectName = () => {
    if (typeof selectedProject === "string" && selectedProject.trim() !== "") {
      return selectedProject.trim();
    }
    if (typeof selectedProject === "object" && selectedProject !== null) {
      if (selectedProject.name && typeof selectedProject.name === "string") {
        return selectedProject.name.trim();
      }
      if (selectedProject.title && typeof selectedProject.title === "string") {
        return selectedProject.title.trim();
      }
      if (selectedProject.projectTitle && typeof selectedProject.projectTitle === "string") {
        return selectedProject.projectTitle.trim();
      }
    }
    return "default";
  };

  // Fetch username on mount
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get("http://localhost:8080/userName", {
          withCredentials: true,
        });
        if (typeof response.data === "string") {
          setUsername(response.data.trim());
        } else if (typeof response.data === "object" && response.data !== null) {
          if ("username" in response.data) {
            setUsername(response.data.username);
          } else {
            const firstValue = Object.values(response.data)[0];
            if (typeof firstValue === "string") {
              setUsername(firstValue);
            } else {
              throw new Error("Invalid data format");
            }
          }
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching username:", error);
        setUsername("Unknown User");
      }
    };
    fetchUsername();
  }, []);

  // Initial chat count fetch when the project is selected
  useEffect(() => {
    const fetchChatCount = async () => {
      if (!selectedProject) return;
      setIsLoading(true);
      try {
        const projectName = getProjectName();
        const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        const response = await axios.get(`${baseURL}/chatCount`, {
          params: { projectName },
          withCredentials: true,
        });
        if (Array.isArray(response.data)) {
          setChatCountList(response.data.map(count => Number(count) || 0));
        } else {
          setChatCountList([]);
        }
      } catch (err) {
        console.error("Error fetching chat count:", err);
        setChatCountList([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChatCount();
  }, [selectedProject]);

  // When a message is sent and chat status becomes completed, increment the count for the active chat.
  useEffect(() => {
    if (chatStatus === 'completed' && activeChatIndex !== null) {
      const updatedCounts = [...chatCountList];
      updatedCounts[activeChatIndex] = (updatedCounts[activeChatIndex] || 0) + 1;
      setChatCountList(updatedCounts);
    }
  }, [chatStatus]);

  // Sync with backend periodically (every 5 seconds)
  useEffect(() => {
    // Replace the existing syncWithBackend function with this:
const syncWithBackend = async () => {
  if (!selectedProject) return;
  try {
    const projectName = getProjectName();
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const response = await axios.get(`${baseURL}/chatCount`, {
      params: { projectName },
      withCredentials: true,
    });
    if (Array.isArray(response.data)) {
      // Simply use the backend data directly
      setChatCountList(response.data.map(count => Number(count) || 0));
    }
  } catch (err) {
    console.error("Error syncing with backend:", err);
  }
};
    const intervalId = setInterval(syncWithBackend, 5000);
    return () => clearInterval(intervalId);
  }, [selectedProject, activeChatIndex, chatCountList]);

  // Logout handler
  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:8080/logout", {
        withCredentials: true,
      });
      if (response.status === 200) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/auth";
      } else {
        throw new Error(`Logout failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  const navItems = [
    {
      id: "workspace",
      icon: FolderGit2,
      label: "Workspace",
      href: "/workspace",
    },
    {
      id: "Shared Notes",
      icon: FolderGit2,
      label: "Shared Notes",
      href: "/sharednotes",
    },
  ];

  // For truncating long text (if needed)
  const truncateText = (text: string, maxLength = 25) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleChatSelect = (index) => {
    setActiveChatIndex(index);
    // Set the chat ID to the selected chat's index + 1 (since chat IDs start at 1)
    const selectedChatId = index + 1;
    dispatch(setChatId(selectedChatId));
    
    // Fetch the chat history for this chat using fetchChatHistory instead
    const projectName = getProjectName();
    dispatch(fetchChatHistory({ 
      chatId: selectedChatId, 
      projectName 
    }));
    
    // Navigate to chat page if not already there
    if (pathname !== '/chat') {
      router.push('/chat');
    }
  };

  // Manual refresh for chat counts
  const handleManualRefresh = () => {
    const fetchChatCount = async () => {
      setIsLoading(true);
      try {
        const projectName = getProjectName();
        const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        const response = await axios.get(`${baseURL}/chatCount`, {
          params: { projectName },
          withCredentials: true,
        });
        if (Array.isArray(response.data)) {
          setChatCountList(response.data.map(count => Number(count) || 0));
        } else {
          setChatCountList([]);
        }
      } catch (err) {
        console.error("Error fetching chat count:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChatCount();
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-[#5CAB7D] to-[#3D8C5F] p-4 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-[#5CAB7D]" />
        </div>
        <h1 className="text-xl font-semibold">SuperNova</h1>
      </div>

      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        className="flex items-center gap-2 w-full p-3 rounded-lg hover:bg-white/10 text-left mb-4 transition-colors"
      >
        <PlusCircle className="w-5 h-5" />
        <span>New Chat</span>
      </button>

      {/* Middle Section */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Prompt Assist Section */}
        <div>
          <button className="flex items-center justify-between w-full mb-2 hover:bg-white/10 p-2 rounded-md transition-colors">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              <span className="font-medium">Prompt Assist</span>
            </div>
            {isPromptOpen ? (
              <ChevronDown
                className="w-4 h-4 cursor-pointer"
                onClick={() => setIsPromptOpen(!isPromptOpen)}
              />
            ) : (
              <ChevronUp
                className="w-4 h-4 cursor-pointer"
                onClick={() => setIsPromptOpen(!isPromptOpen)}
              />
            )}
          </button>
          {isPromptOpen && (
            <>
              <div className="text-xs text-white/70 mb-2 uppercase ml-6">
                SUGGESTION
              </div>
              <div className="space-y-2">
                <div className="ml-6 hover:bg-white/10 rounded-md p-2 cursor-pointer transition-colors">
                  <div className="font-medium">Risk</div>
                  <div className="text-sm text-white/70">
                    Analyzed Your BRD Technological Risk
                  </div>
                </div>
                <div className="ml-6 hover:bg-white/10 rounded-md p-2 cursor-pointer transition-colors">
                  <div className="font-medium">Tech Risk</div>
                  <div className="text-sm text-white/70">
                    Summarized The Document
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <Separator className="my-2 bg-white/20" />

        {/* Chat Count Section */}
        <div>
          <button className="flex items-center justify-between w-full mb-2 p-2 rounded-md hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium">Chat</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleManualRefresh();
                }}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                title="Refresh chat counts"
              >
                <Clock className="w-3 h-3 text-white" />
              </button>
              {isChatCountOpen ? (
                <ChevronDown
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => setIsChatCountOpen(!isChatCountOpen)}
                />
              ) : (
                <ChevronUp
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => setIsChatCountOpen(!isChatCountOpen)}
                />
              )}
            </div>
          </button>
          {isChatCountOpen && (
            <div className="ml-6 space-y-2 pr-2">
              {isLoading ? (
                <div className="text-center py-2">
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                </div>
              ) : chatCountList.length === 0 ? (
                <div className="text-xs text-white/70 italic py-2">No chat data available</div>
              ) : (
                chatCountList.map((count, index) => (
                  <button
                    key={index}
                    onClick={() => handleChatSelect(index)}
                    className={`flex items-center justify-between w-full bg-white/10 hover:bg-white/20 rounded-md p-2 mb-2 transition-colors ${
                      activeChatIndex === index ? 'ring-2 ring-white/40 bg-white/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-medium">Chat {index + 1}</span>
                    </div>
                    <div className="bg-[#2A6A45] px-2 py-1 rounded-full text-xs font-bold">
                      {count}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <Separator className="my-2 bg-white/20" />

      {/* Bottom Navigation */}
      <div className="space-y-2 mt-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.id}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-white hover:text-white transition-colors ${
                  isActive ? "bg-white/20 hover:bg-white/25" : "hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4 mr-2 text-white" />
                <span className="text-white">{item.label}</span>
              </Button>
            </Link>
          );
        })}
        <div className="w-full flex space-x-4">
          {/* Notes button */}
          <Button
            variant="ghost"
            onClick={() => setNotesOpen(true)}
            className="flex-1 flex justify-start items-center text-white hover:bg-white/10 transition-colors"
          >
            <Notebook className="w-4 h-4 mr-2 text-white" />
            <span>Notes</span>
          </Button>

          {/* Share button + modal */}
          <ShareNotes className="flex-1" />
        </div>

        <Separator className="my-2 bg-white/20" />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg cursor-pointer w-full transition-colors">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{username || "Loading..."}</div>
              <div className="text-xs text-white/70">Free Plan</div>
            </div>
            <ChevronDown className="w-4 h-4 text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-white text-gray-800 rounded-lg shadow-md mt-2">
            {/* <DropdownMenuItem>
              <Link href="/chat/account" className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <span>Account</span>
              </Link>
            </DropdownMenuItem> */}
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Drawer 
        open={notesOpen} 
        onClose={() => setNotesOpen(false)} 
      />
    </div>
  );
};

export default Sidebar;