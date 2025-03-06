// src/contexts/NotificationContext.tsx
import * as React from 'react';
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import NotificationService from '../services/NotificationService';

// Define interfaces
export interface NotificationItem {
  _id: string;
  sender: {
    _id: string;
    nom: string;
    prenom: string;
  };
  receiver: string;
  message: string;
  type: 'message' | 'alert' | 'info';
  isRead: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  sendNotification: (message: string, type: string) => Promise<boolean>;
  markAsRead: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider component
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  // Use the base URL but connect to the root for socket
  const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_URL, { withCredentials: true });
    setSocket(newSocket);

    // Get user info from localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        newSocket.on('connect', () => {
          console.log('Connected to notification socket');
          newSocket.emit('join', {
            userId: user.userId,
            role: user.role
          });
        });

        newSocket.on('notification', (data) => {
          // Update notifications when a new one arrives
          fetchNotifications();
          // Show toast notification
          toast.info(`Nouvelle notification: ${data.message}`);
        });
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }

    // Initial fetch
    fetchNotifications();

    // Cleanup on unmount
    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const notificationsData = await NotificationService.getNotifications();
      setNotifications(notificationsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async (message: string, type: string = 'message'): Promise<boolean> => {
    try {
      await NotificationService.sendToManager(message, type);
      return true;
    } catch (err) {
      console.error('Error sending notification:', err);
      setError('Erreur lors de l\'envoi de la notification');
      return false;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === id ? { ...notification, isRead: true } : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Erreur lors du marquage de la notification');
    }
  };

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        sendNotification,
        markAsRead,
        loading,
        error
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};