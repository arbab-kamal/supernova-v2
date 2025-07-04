"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, Mail } from "lucide-react";
import Typewriter from "./typewriter";
import { useTheme } from "next-themes";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentProject } from "@/store/projectSlice";
import { selectChatId, selectResetFlag } from "@/store/chatSlice";
import {
  selectChatHistory,
  selectHistoryLoading,
  selectConversationMessages,
  selectHasFetchedHistory,
  clearHistory,
  fetchChatHistory,
} from "@/store/historySlice";
import { useLanguage } from "@/providers/language-providers";

// Updated color theme with pastel green palette
const colorTheme = {
  primary: "#5CAB7D",
  primaryLight: "#7DCCA0",
  primaryLighter: "#A8E6C3",
  primarySoft: "#FFFFFF",
  primaryDark: "#3D8C5F",
  primaryDarker: "#2A6A45",
  white: "#ECF9F2", // Changed from white to soft green
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
};

// Updated theme colors function
const getThemeColors = (isDarkMode) => {
  if (isDarkMode) {
    return {
      bg: {
        main: "#1F2937",
        secondary: "#374151",
        tertiary: "#4B5563",
      },
      text: {
        primary: "#F9FAFB",
        secondary: "#D1D5DB",
      },
      primary: {
        main: colorTheme.primary,
        light: colorTheme.primaryLight,
        dark: colorTheme.primaryDark,
      },
      input: {
        bg: "#374151",
        border: "#4B5563",
      },
      border: "#4B5563",
    };
  } else {
    return {
      bg: {
        main: colorTheme.primarySoft,
        secondary: colorTheme.gray100,
        tertiary: colorTheme.primarySoft,
      },
      text: {
        primary: "#1F2937",
        secondary: colorTheme.gray500,
      },
      primary: {
        main: colorTheme.primary,
        light: colorTheme.primaryLight,
        dark: colorTheme.primaryDark,
      },
      input: {
        bg: colorTheme.white, // Now uses soft green
        border: colorTheme.gray200,
      },
      border: colorTheme.gray200,
    };
  }
};

// Email Modal Component
const EmailModal = ({ messageContent, onClose, colors, isDarkMode }) => {
  const [emailId, setEmailId] = useState("");
  const [subject, setSubject] = useState("AI Chat Message");
  const [body, setBody] = useState(messageContent);
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const baseURL =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const response = await axios.post(`${baseURL}/send-email`, null, {
        params: {
          emailId,
          subject,
          body,
        },
      });

      setSendResult({ success: true, message: "Email sent successfully!" });

      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error sending email:", error);
      setSendResult({
        success: false,
        message: "Failed to send email. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="rounded-lg shadow-lg p-6 w-full max-w-md"
        style={{ backgroundColor: colors.bg.main }}
      >
        <h3
          className="text-lg font-medium mb-4"
          style={{ color: colors.text.primary }}
        >
          Send Message as Email
        </h3>

        {sendResult && (
          <div
            className={`p-3 mb-4 rounded-md ${
              sendResult.success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {sendResult.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="emailId"
              className="block mb-2 text-sm font-medium"
              style={{ color: colors.text.secondary }}
            >
              Recipient Email
            </label>
            <input
              id="emailId"
              type="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.input.bg,
                borderColor: colors.input.border,
                color: colors.text.primary,
                focusRingColor: colorTheme.primary,
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="subject"
              className="block mb-2 text-sm font-medium"
              style={{ color: colors.text.secondary }}
            >
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.input.bg,
                borderColor: colors.input.border,
                color: colors.text.primary,
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="body"
              className="block mb-2 text-sm font-medium"
              style={{ color: colors.text.secondary }}
            >
              Message
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.input.bg,
                borderColor: colors.input.border,
                color: colors.text.primary,
              }}
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-opacity-80 transition-colors"
              style={{
                backgroundColor: colorTheme.white,
                borderColor: colors.border,
                color: colors.text.primary,
              }}
              disabled={isSending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: colorTheme.primary,
                color: colorTheme.white,
              }}
              disabled={isSending}
            >
              {isSending ? (
                <div
                  className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mx-auto"
                  style={{
                    borderColor: colorTheme.white,
                    borderTopColor: "transparent",
                  }}
                ></div>
              ) : (
                "Send Email"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Unified Welcome Component
const WelcomeMessage = ({ colors, language, userName, userInitial }) => {
  const getGreeting = () => {
    if (language === "arabic") {
      return userName 
        ? `أهلاً وسهلاً، ${userName}!`
        : "أهلاً وسهلاً!";
    }
    return userName 
      ? `Hi ${userName}, how can I help you today?`
      : "Hi, how can I help you today?";
  };

  const getSubtext = () => {
    if (language === "arabic") {
      return "لا تتردد في طرح أي أسئلة حول مشروعك!";
    }
    return "Feel free to ask any questions about your project!";
  };

  return (
    <div className="flex items-center justify-center h-full px-4">
      <div className="flex flex-col items-center text-center gap-4">
        {/* User Avatar */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center border-2"
          style={{
            backgroundColor: colors.bg.tertiary,
            borderColor: colorTheme.primary,
            color: colors.text.primary,
          }}
        >
          <span className="text-xl font-semibold">
            {userInitial || "U"}
          </span>
        </div>
        
        {/* Welcome Message */}
        <div className="space-y-2">
          <h3
            className="text-2xl font-semibold leading-snug max-w-none"
            style={{ color: colors.text.primary }}
          >
            {getGreeting()}
          </h3>
          <p
            className="text-base max-w-md"
            style={{ color: colors.text.secondary }}
          >
            {getSubtext()}
          </p>
        </div>
        
        {/* Decorative element */}
        <div className="flex items-center gap-2 mt-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colorTheme.primary }}
          />
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colorTheme.primaryLight }}
          />
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colorTheme.primaryLighter }}
          />
        </div>
      </div>
    </div>
  );
};

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [userInitial, setUserInitial] = useState("");
  const [userName, setUserName] = useState(""); // Add full username state
  const [hoveredMessageIndex, setHoveredMessageIndex] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedMessageContent, setSelectedMessageContent] = useState("");

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);

  // Redux state
  const dispatch = useDispatch();
  const chatId = useSelector(selectChatId);
  const resetFlag = useSelector(selectResetFlag);
  const selectedProject = useSelector(selectCurrentProject);
  const chatHistory = useSelector(selectChatHistory);
  const historyLoading = useSelector(selectHistoryLoading);
  const conversationMessages = useSelector(selectConversationMessages);
  const hasFetchedHistory = useSelector(selectHasFetchedHistory);
  const messagesEndRef = useRef(null);
  const { language } = useLanguage();

  // Function to get project name - robust method to handle different formats
  const getProjectName = useCallback(() => {
    // Handle string case
    if (typeof selectedProject === "string" && selectedProject.trim() !== "") {
      console.log("Using project name from Redux (string):", selectedProject);
      return selectedProject.trim();
    }

    // Handle object with name property
    if (
      typeof selectedProject === "object" &&
      selectedProject !== null &&
      selectedProject.name &&
      typeof selectedProject.name === "string" &&
      selectedProject.name.trim() !== ""
    ) {
      console.log(
        "Using project name from Redux (object.name):",
        selectedProject.name
      );
      return selectedProject.name.trim();
    }

    // Handle object with title property (matching backend ProjectEntity.projectTitle)
    if (
      typeof selectedProject === "object" &&
      selectedProject !== null &&
      selectedProject.title &&
      typeof selectedProject.title === "string" &&
      selectedProject.title.trim() !== ""
    ) {
      console.log(
        "Using project title from Redux (object.title):",
        selectedProject.title
      );
      return selectedProject.title.trim();
    }

    // Handle object with projectTitle property (exact match to backend field)
    if (
      typeof selectedProject === "object" &&
      selectedProject !== null &&
      selectedProject.projectTitle &&
      typeof selectedProject.projectTitle === "string" &&
      selectedProject.projectTitle.trim() !== ""
    ) {
      console.log(
        "Using projectTitle from Redux:",
        selectedProject.projectTitle
      );
      return selectedProject.projectTitle.trim();
    }

    // Fallback with warning
    console.warn(
      "No valid project name found, using 'default'. This may cause backend errors if no project with this title exists."
    );
    return "default";
  }, [selectedProject]);

  // Immediately detect first-time users when component mounts
  useEffect(() => {
    // If no chatId, this is a new user, so skip the first load spinner
    if (!chatId) {
      console.log("No chatId - first time user detected");
      setIsFirstLoad(false);
    }
  }, [chatId]);

  // Enhanced user data fetching
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const baseURL =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        const response = await axios.get(`${baseURL}/userName`, {
          withCredentials: true,
        });

        let name = "";

        // Handle different response formats
        if (typeof response.data === "string") {
          name = response.data.trim();
        } else if (
          typeof response.data === "object" &&
          response.data !== null
        ) {
          if ("username" in response.data) {
            name = response.data.username;
          } else if ("name" in response.data) {
            name = response.data.name;
          } else {
            // Try to get the first value in the object
            const firstValue = Object.values(response.data)[0];
            if (typeof firstValue === "string") {
              name = firstValue;
            } else {
              throw new Error("Invalid data format");
            }
          }
        } else {
          throw new Error("Invalid data format");
        }

        // Set both full name and initial
        if (name && name.length > 0) {
          setUserName(name);
          setUserInitial(name.charAt(0).toUpperCase());
        } else {
          setUserName("");
          setUserInitial("U"); // Fallback if name is empty
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
        // Only set fallback if it's not a 401 (unauthorized) error
        if (!(error.response && error.response.status === 401)) {
          setUserName("");
          setUserInitial("U");
        }
      }
    };

    fetchUserName();
  }, []);

  // Reset messages when resetFlag changes (triggered by the new chat action)
  useEffect(() => {
    setMessages([]);
    dispatch(clearHistory());
  }, [resetFlag, dispatch]);

  // Enhanced debugging of state changes
  useEffect(() => {
    console.log("Current state:", {
      chatId,
      isFirstLoad,
      historyLoading,
      chatHistory: chatHistory?.length || 0,
      messages: messages?.length || 0,
      conversationMessages: conversationMessages?.length || 0,
      hasFetchedHistory,
      currentLanguage: language,
      userName,
      userInitial,
    });
  }, [
    chatId,
    isFirstLoad,
    historyLoading,
    chatHistory,
    messages,
    conversationMessages,
    hasFetchedHistory,
    language,
    userName,
    userInitial,
  ]);

  // Load chat history when chatId changes or when history is loaded
  useEffect(() => {
    // For first time users (no chatId), immediately set isFirstLoad to false
    if (!chatId) {
      setIsFirstLoad(false);
      return;
    }

    // If history has been fetched and chatHistory is empty or null, stop further fetches
    if (
      chatId &&
      hasFetchedHistory &&
      (!chatHistory || chatHistory.length === 0)
    ) {
      console.log("History fetched, but no records exist.");
      setIsFirstLoad(false);
      return;
    }

    // If we have a chat ID but chatHistory is empty and not loading, fetch chat history
    if (
      chatId &&
      (!chatHistory || chatHistory.length === 0) &&
      !historyLoading
    ) {
      console.log(`Fetching chat history for chatId ${chatId}`);
      dispatch(
        fetchChatHistory({
          chatId: chatId,
          projectName: getProjectName(),
        })
      );
    } else if (conversationMessages && conversationMessages.length > 0) {
      console.log(
        `Setting ${conversationMessages.length} messages from conversation`
      );
      setMessages(conversationMessages);
      setIsFirstLoad(false); // History loaded, not first load anymore
    }

    // Final safeguard: if history loading completes, update firstLoad state
    if (!historyLoading && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [
    chatId,
    chatHistory,
    conversationMessages,
    historyLoading,
    hasFetchedHistory,
    dispatch,
    getProjectName,
    isFirstLoad,
  ]);

  // Clean up history data when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearHistory());
    };
  }, [dispatch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchAIResponse = async (query) => {
    setIsLoading(true);
    try {
      const baseURL =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      // Get project name using the robust method
      const projectName = getProjectName();

      // Use language-specific endpoint
      const endpoint = language === "arabic" ? "/rag-arabic" : "/rag";

      console.log(
        `Sending request to ${endpoint}: query=${query}, chatId=${chatId}, projectName=${projectName}, language=${language}`
      );

      const response = await axios.get(`${baseURL}${endpoint}`, {
        params: {
          query,
          chatId,
          projectName,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(`Received response from ${endpoint}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${language} RAG response:`, error);
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          `Server responded with ${error.response.status}: ${JSON.stringify(
            error.response.data
          )}`
        );
        return `Error: ${error.response.status} - Please try again or check your input.`;
      }
      return "Sorry, I couldn't process your request. Please try again.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      const userMessage = { text: inputValue, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");

      try {
        // Log current language before making request
        console.log(`Submitting with current language: ${language}`);

        const aiResponse = await fetchAIResponse(inputValue);
        const aiMessage = {
          text: aiResponse || "No response received",
          sender: "ai",
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Error handling submission:", error);
        const errorMessage = {
          text: "An error occurred while processing your request.",
          sender: "ai",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    }
  };

  // Email handling functions
  const handleEmailClick = (messageContent) => {
    setSelectedMessageContent(messageContent);
    setEmailModalOpen(true);
  };

  // Simplified loading condition - only show for returning users with a chatId
  if (historyLoading && chatId) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full"
        style={{ backgroundColor: colors.bg.main }}
      >
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{
            borderColor: colorTheme.primaryLighter,
            borderTopColor: colorTheme.primary,
          }}
        ></div>
        <p className="mt-4 text-sm" style={{ color: colors.text.secondary }}>
          Loading chat history...
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full relative"
      style={{
        backgroundColor: colors.bg.main,
      }}
    >
      {/* Messages container - Fixed height calculation */}
      <div
        className="flex-1 overflow-y-auto pb-24"
        style={{
          minHeight: messages.length === 0 ? "0" : "auto",
        }}
      >
        {messages.length === 0 ? (
          <WelcomeMessage 
            colors={colors} 
            language={language} 
            userName={userName}
            userInitial={userInitial}
          />
        ) : (
          <div className="space-y-6 px-4 py-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "ai" && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: colorTheme.primarySoft,
                      color: colorTheme.primary,
                    }}
                  >
                    <span className="text-sm font-medium">AI</span>
                  </div>
                )}
                <div
                  className={`px-6 py-4 rounded-2xl ${
                    message.sender === "user"
                      ? "rounded-tr-none"
                      : "rounded-tl-none"
                  } max-w-[75%] whitespace-pre-wrap break-words relative group`}
                  style={{
                    backgroundColor: colorTheme.primary,
                    color: colorTheme.white,
                  }}
                  onMouseEnter={() =>
                    message.sender === "ai" && setHoveredMessageIndex(index)
                  }
                  onMouseLeave={() => setHoveredMessageIndex(null)}
                >
                  {message.sender === "ai" &&
                  index === messages.length - 1 &&
                  !chatId ? (
                    <Typewriter text={message.text} speed={20} />
                  ) : (
                    message.text
                  )}

                  {/* Email button that shows on hover for AI messages */}
                  {message.sender === "ai" && hoveredMessageIndex === index && (
                    <button
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-opacity-20 hover:bg-opacity-30 transition-opacity"
                      style={{
                        backgroundColor: colorTheme.white,
                      }}
                      onClick={() => handleEmailClick(message.text)}
                      title="Send as email"
                    >
                      <Mail size={16} style={{ color: colorTheme.white }} />
                    </button>
                  )}
                </div>
                {message.sender === "user" && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: colors.bg.tertiary,
                      color: colors.text.primary,
                    }}
                  >
                    <span className="text-sm font-medium">
                      {userInitial || "U"}
                    </span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Fixed input form at bottom - Updated to be responsive */}
      <div
        className="absolute bottom-0 left-0 right-0 border-t p-4 bg-opacity-95 backdrop-blur-sm"
        style={{
          backgroundColor: colors.bg.main,
          borderColor: colors.border,
          zIndex: 10,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  language === "arabic"
                    ? "اسألني أي شيء..."
                    : "Ask me anything..."
                }
                className="flex-1 px-4 py-3 border rounded-full focus:outline-none focus:ring-2 transition-all text-base"
                style={{
                  backgroundColor: colors.input.bg,
                  borderColor: colors.input.border,
                  color: colors.text.primary,
                  "--tw-ring-color": colorTheme.primary,
                }}
              />
              <button
                type="submit"
                className="p-3 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0"
                style={{
                  backgroundColor: colorTheme.primary,
                  color: colorTheme.white,
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div
                    className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                    style={{
                      borderColor: colorTheme.white,
                      borderTopColor: "transparent",
                    }}
                  ></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Email Modal */}
      {emailModalOpen && (
        <EmailModal
          messageContent={selectedMessageContent}
          onClose={() => setEmailModalOpen(false)}
          colors={colors}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default Chatbox;