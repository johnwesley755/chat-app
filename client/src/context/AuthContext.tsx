import React, { createContext, useReducer, useEffect } from 'react';
import { AuthState, User } from '../types/auth.types';
import * as authService from '../services/authService';
import { AxiosError } from 'axios';

interface AuthContextProps {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => void;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: true,
  error: null,
};

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'USER_LOADED'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'AUTH_ERROR':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.type === 'AUTH_ERROR' ? action.payload : null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextProps>({
  state: initialState,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUserProfile: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (localStorage.getItem('token')) {
          const user = await authService.getCurrentUser();
          dispatch({ type: 'USER_LOADED', payload: user });
        } else {
          dispatch({ type: 'AUTH_ERROR', payload: 'No token found' });
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        dispatch({ type: 'AUTH_ERROR', payload: 'Failed to load user' });
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await authService.login({ email, password });
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: data, token: data.token },
      });
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || 'Login failed'
        : 'Login failed';
        
      dispatch({
        type: 'AUTH_ERROR',
        payload: errorMessage,
      });
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const data = await authService.register({ username, email, password });
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { user: data, token: data.token },
      });
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || 'Registration failed'
        : 'Registration failed';
        
      dispatch({
        type: 'AUTH_ERROR',
        payload: errorMessage,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      // We're using the error variable here by logging it
      console.error('Logout error:', error);
    }
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (state.user) {
      dispatch({
        type: 'UPDATE_USER',
        payload: { ...state.user, ...userData },
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};