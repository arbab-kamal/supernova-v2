import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  chatHistory: [],
  conversationMessages: [],
  loading: false,
  conversationLoading: false,
  error: null,
  currentChatId: null,
  currentProjectName: null,
  hasFetchedHistory: false, // <-- added flag
};

export const fetchChatHistory = createAsyncThunk(
  'history/fetchChatHistory',
  async ({ chatId, projectName }, { rejectWithValue }) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const response = await axios.get(`${baseURL}/chatHistory`, {
        params: { chatId, projectName },
        withCredentials: true,
      });
      
      // Transform the data to match the expected format for messages
      const messages = [];
      response.data.forEach(item => {
        messages.push({
          text: item.question,
          sender: 'user'
        });
        messages.push({
          text: item.reply,
          sender: 'ai'
        });
      });
      
      return { 
        data: response.data,
        messages: messages,
        chatId, 
        projectName 
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch chat history');
    }
  }
);

export const fetchConversationById = createAsyncThunk(
  'history/fetchConversationById',
  async ({ conversationId, projectName }, { rejectWithValue }) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const response = await axios.get(`${baseURL}/conversation`, {
        params: { conversationId, projectName },
        withCredentials: true,
      });
      
      const messages = response.data.map(item => ({
        text: item.isUser ? item.question : item.reply,
        sender: item.isUser ? 'user' : 'ai'
      }));
      
      return messages;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch conversation');
    }
  }
);

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    clearHistory: (state) => {
      state.chatHistory = [];
      state.hasFetchedHistory = false; // reset the flag if needed
    },
    clearConversation: (state) => {
      state.conversationMessages = [];
    },
    setCurrentChat: (state, action) => {
      state.currentChatId = action.payload.chatId;
      state.currentProjectName = action.payload.projectName;
    },
    addToHistory: (state, action) => {
      const existingIndex = state.chatHistory.findIndex(
        chat => chat.id === action.payload.id
      );
      if (existingIndex === -1) {
        state.chatHistory.unshift(action.payload);
      } else {
        state.chatHistory[existingIndex] = {
          ...state.chatHistory[existingIndex],
          ...action.payload
        };
      }
    },
    updateChatTitle: (state, action) => {
      const { chatId, title } = action.payload;
      const chatIndex = state.chatHistory.findIndex(chat => chat.id === chatId);
      if (chatIndex !== -1) {
        state.chatHistory[chatIndex].title = title;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.chatHistory = action.payload.data;
        state.conversationMessages = action.payload.messages;
        state.currentChatId = action.payload.chatId;
        state.currentProjectName = action.payload.projectName;
        state.loading = false;
        state.hasFetchedHistory = true; // mark as fetched even if empty
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hasFetchedHistory = true; // mark as fetched to prevent re-dispatch
      })
      .addCase(fetchConversationById.pending, (state) => {
        state.conversationLoading = true;
        state.error = null;
      })
      .addCase(fetchConversationById.fulfilled, (state, action) => {
        state.conversationMessages = action.payload;
        state.conversationLoading = false;
      })
      .addCase(fetchConversationById.rejected, (state, action) => {
        state.conversationLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearHistory, 
  clearConversation, 
  setCurrentChat, 
  addToHistory, 
  updateChatTitle 
} = historySlice.actions;

// Selectors
export const selectChatHistory = (state) => state.history.chatHistory;
export const selectConversationMessages = (state) => state.history.conversationMessages;
export const selectHistoryLoading = (state) => state.history.loading;
export const selectConversationLoading = (state) => state.history.conversationLoading;
export const selectHistoryError = (state) => state.history.error;
export const selectCurrentChatId = (state) => state.history.currentChatId;
export const selectCurrentProjectName = (state) => state.history.currentProjectName;
export const selectHasFetchedHistory = (state) => state.history.hasFetchedHistory;

export default historySlice.reducer;
