// src/contexts/NotificationContext.tsx
import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

interface Notification {
  _id: string;
  sender: {
    _id: string;
    nom: string;
    prenom: string;
  };
  receiver: string;
  isRead: boolean;
  type: "formation" | "evenement";
  status: "pending" | "accepted" | "declined";
  entityId: string;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  processNotification: (id: string, status: "accepted" | "declined", response?: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      console.log('Fetching notifications...');
      
      // Use your apiClient instead of axios directly
      const response = await apiClient.get('/notifications');
      
      console.log('API response status:', response.status);
      console.log('API response data type:', typeof response.data);
      
      // Check if response data is actually an array
      if (Array.isArray(response.data)) {
        console.log('Received notifications array with length:', response.data.length);
        setNotifications(response.data);
        setUnreadCount(response.data.filter(n => !n.isRead).length);
      } else {
        console.error('Expected array but got:', response.data);
        console.error('Response data snippet:', JSON.stringify(response.data).substring(0, 200));
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data type:', typeof error.response.data);
        console.error('Response data snippet:', 
          typeof error.response.data === 'string' 
            ? error.response.data.substring(0, 200) 
            : JSON.stringify(error.response.data).substring(0, 200)
        );
      }
      
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      
      // Update state to reflect the change
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const processNotification = async (id: string, status: "accepted" | "declined", response?: string) => {
    try {
      await apiClient.put(`/notifications/${id}/process`, {
        status,
        response
      });
      
      // Update state to reflect the change
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, status, isRead: true } : n)
      );
      
      // Update unread count if it was previously unread
      const wasUnread = notifications.find(n => n._id === id)?.isRead === false;
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Refresh notifications to get any updated data
      fetchNotifications();
    } catch (error) {
      console.error('Error processing notification:', error);
      throw error;
    }
  };

  // Set up websocket connection to receive real-time notifications
  useEffect(() => {
    fetchNotifications();
    
    // Set up socket.io listener for new notifications
    const socket = (window as any).socket;
    
    if (socket) {
      socket.on('notification', (data: any) => {
        // Refresh all notifications when we get a new one
        fetchNotifications();
      });
    }
    
    // Set up polling for notifications every minute as a fallback
    const interval = setInterval(fetchNotifications, 60000);
    
    return () => {
      clearInterval(interval);
      if (socket) {
        socket.off('notification');
      }
    };
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      fetchNotifications,
      markAsRead,
      processNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};