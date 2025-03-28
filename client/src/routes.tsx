import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AuthGuard from './components/auth/AuthGuard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  
  // This helps preserve the state when navigating between chat routes
  const isChatRoute = location.pathname.startsWith('/chat');
  
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthGuard requireAuth={false} />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      
      {/* Protected routes */}
      <Route element={<AuthGuard requireAuth={true} />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/chat" replace />} />
          
          {/* Use the same component for both chat routes to prevent remounting */}
          <Route 
            path="/chat" 
            element={<ChatPage key="chat-main" />} 
          />
          <Route 
            path="/chat/:id" 
            element={<ChatPage key="chat-detail" />} 
          />
          
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      
      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;