// src/contexts/NotificationContext.tsx
import * as React from 'react';
import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
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
  type: 'formation' | 'evenement';
  isRead: boolean;
  status: 'pending' | 'accepted' | 'declined';
  entityId: string;
  createdAt: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  sendNotification: (type: string, entityId: string) => Promise<boolean>;
  markAsRead: (id: string) => Promise<void>;
  acceptNotification: (id: string) => Promise<void>;
  declineNotification: (id: string) => Promise<void>;
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

  // Use useCallback to memoize the fetchNotifications function
  const fetchNotifications = useCallback(async () => {
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
  }, []);

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
          // Show toast notification based on notification type
          const notificationType = data.type === 'formation' ? 'Nouvelle formation' : 'Nouvel événement';
          toast.info(`${notificationType} à examiner`);
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
  }, [fetchNotifications]); // Add fetchNotifications to dependency array

  const sendNotification = async (type: string, entityId: string): Promise<boolean> => {
    try {
      await NotificationService.sendToManager(type, entityId);
      // Refresh notifications after sending
      await fetchNotifications();
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

  const acceptNotification = async (id: string) => {
    try {
      await NotificationService.acceptNotification(id);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === id 
            ? { ...notification, isRead: true, status: "accepted" } 
            : notification
        )
      );
    } catch (err) {
      console.error('Error accepting notification:', err);
      setError("Erreur lors de l'acceptation de la notification");
    }
  };

  const declineNotification = async (id: string) => {
    try {
      await NotificationService.declineNotification(id);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === id 
            ? { ...notification, isRead: true, status: "declined" } 
            : notification
        )
      );
    } catch (err) {
      console.error('Error declining notification:', err);
      setError("Erreur lors du refus de la notification");
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
        acceptNotification,
        declineNotification,
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