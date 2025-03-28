import React, { createContext, useReducer, useEffect, useContext, useCallback } from 'react';
import { Chat, ChatState, Message } from '../types/chat.types';
import * as chatService from '../services/chatService';
import * as messageService from '../services/messageService';
import { AuthContext } from './AuthContext';
import { getSocket } from '../services/socket';
import { AxiosError } from 'axios';
import { debounce } from '../utils/debounce';

interface ChatContextProps {
  state: ChatState;
  getChats: () => Promise<void>;
  accessChat: (userId: string) => Promise<void>;
  createGroupChat: (users: string[], name: string) => Promise<Chat>; // Changed return type to Chat
  updateGroupChat: (chatId: string, chatName: string) => Promise<void>;
  addUserToGroup: (chatId: string, userId: string) => Promise<void>;
  removeUserFromGroup: (chatId: string, userId: string) => Promise<void>;
  selectChat: (chat: Chat) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  setTyping: (isTyping: boolean) => void;
}

const initialState: ChatState = {
  chats: [],
  selectedChat: null,
  messages: [],
  loading: false,
  error: null,
};

type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CHATS'; payload: Chat[] }
  | { type: 'SET_SELECTED_CHAT'; payload: Chat }
  | { type: 'UPDATE_CHAT'; payload: Chat }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_CHATS':
      return {
        ...state,
        chats: action.payload,
      };
    case 'SET_SELECTED_CHAT':
      return {
        ...state,
        selectedChat: action.payload,
      };
    case 'UPDATE_CHAT':
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat._id === action.payload._id ? action.payload : chat
        ),
        selectedChat:
          state.selectedChat?._id === action.payload._id
            ? action.payload
            : state.selectedChat,
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload,
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const ChatContext = createContext<ChatContextProps>({
  state: initialState,
  getChats: async () => {},
  accessChat: async () => {},
  createGroupChat: async () => { return {} as Chat; }, // Fix return type to match interface
  updateGroupChat: async () => {},
  addUserToGroup: async () => {},
  removeUserFromGroup: async () => {},
  selectChat: async () => {},
  sendMessage: async () => {},
  setTyping: () => {},
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { state: authState } = useContext(AuthContext);
  
  // Create a debounced version of getChats
  const debouncedGetChats = useCallback(
    debounce(async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const data = await chatService.getChats();
        dispatch({ type: 'SET_CHATS', payload: data });
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        const errorMessage = error instanceof AxiosError 
          ? error.response?.data?.message || 'Failed to fetch chats'
          : 'Failed to fetch chats';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
    }, 2000),
    []
  );

  useEffect(() => {
    if (authState.isAuthenticated) {
      debouncedGetChats();
    }
  }, [authState.isAuthenticated, debouncedGetChats]);

  useEffect(() => {
    if (!authState.isAuthenticated) return;
  
    // Get the socket with the auth token
    const socket = getSocket(authState.token || '');
  
    // Setup socket connection
    if (authState.user) {
      socket.emit('setup', { _id: authState.user._id });
    }

    // Listen for new messages
    socket.on('new_message', (newMessageReceived: Message) => {
      if (
        !state.selectedChat || // if chat is not selected or doesn't match current chat
        state.selectedChat._id !== newMessageReceived.chat._id
      ) {
        // Notification logic here
      } else {
        dispatch({ type: 'ADD_MESSAGE', payload: newMessageReceived });
      }

      // Update chat list to show latest message
      dispatch({
        type: 'SET_CHATS',
        payload: state.chats.map((chat) => {
          if (chat._id === newMessageReceived.chat._id) {
            return { ...chat, latestMessage: newMessageReceived };
          }
          return chat;
        }),
      });
    });

    return () => {
      socket.off('new_message');
    };
  }, [authState.isAuthenticated, authState.user, state.selectedChat, state.chats]);

  // Replace the original getChats with the debounced version
  const getChats = debouncedGetChats;

  const accessChat = async (userId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await chatService.accessChat(userId);
      
      // Add chat to chats array if it doesn't exist
      if (!state.chats.find((c) => c._id === data._id)) {
        dispatch({ type: 'SET_CHATS', payload: [data, ...state.chats] });
      }
      
      dispatch({ type: 'SET_SELECTED_CHAT', payload: data });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      // Load messages for this chat
      await fetchMessages(data._id);
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || 'Failed to access chat'
        : 'Failed to access chat';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const createGroupChat = async (users: string[], name: string): Promise<Chat> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await chatService.createGroupChat(users, name);
      dispatch({ type: 'SET_CHATS', payload: [data, ...state.chats] });
      dispatch({ type: 'SET_LOADING', payload: false });
      return data; // Return the chat data
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || 'Failed to create group chat'
        : 'Failed to create group chat';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error; // Re-throw to allow caller to handle
    }
  };

  const updateGroupChat = async (chatId: string, chatName: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await chatService.updateGroupChat(chatId, chatName);
      dispatch({ type: 'UPDATE_CHAT', payload: data });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || 'Failed to update group chat'
        : 'Failed to update group chat';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const addUserToGroup = async (chatId: string, userId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await chatService.addUserToGroup(chatId, userId);
      dispatch({ type: 'UPDATE_CHAT', payload: data });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || 'Failed to add user to group'
        : 'Failed to add user to group';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const removeUserFromGroup = async (chatId: string, userId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await chatService.removeUserFromGroup(chatId, userId);
      dispatch({ type: 'UPDATE_CHAT', payload: data });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || 'Failed to remove user from group'
        : 'Failed to remove user from group';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const selectChat = async (chat: Chat) => {
    dispatch({ type: 'SET_SELECTED_CHAT', payload: chat });
    await fetchMessages(chat._id);
    
    // Join socket room - pass the token here too
    const socket = getSocket(authState.token || '');
    socket.emit('join_chat', chat._id);
    
    // Mark messages as read
    await messageService.markMessagesAsRead(chat._id);
  };

  const fetchMessages = async (chatId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await messageService.getMessages(chatId);
      dispatch({ type: 'SET_MESSAGES', payload: data });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      // Mark messages as read
      await messageService.markMessagesAsRead(chatId);
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || 'Failed to fetch messages'
        : 'Failed to fetch messages';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const sendMessage = async (content: string) => {
    if (!state.selectedChat) return;
    
    try {
      const data = await messageService.sendMessage(content, state.selectedChat._id);
      dispatch({ type: 'ADD_MESSAGE', payload: data });
      
      // Socket emit new message - pass the token here too
      const socket = getSocket(authState.token || '');
      socket.emit('new_message', data);
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || 'Failed to send message'
        : 'Failed to send message';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const setTyping = (isTyping: boolean) => {
    if (!state.selectedChat) return;
    
    const socket = getSocket(authState.token || '');
    if (isTyping) {
      socket.emit('typing', state.selectedChat._id);
    } else {
      socket.emit('stop_typing', state.selectedChat._id);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        state,
        getChats,
        accessChat,
        createGroupChat,
        updateGroupChat,
        addUserToGroup,
        removeUserFromGroup,
        selectChat,
        sendMessage,
        setTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};