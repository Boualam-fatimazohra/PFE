import { useState, useRef, useEffect } from 'react';
import { Bell, Calendar, BookOpen } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';
import * as React from 'react';
import NotificationStatusBadge from './NotificationStatusBadge';
import { io } from 'socket.io-client';
import axios from 'axios';

const NotificationBell: React.FC = () => {
  const {  
    unreadCount, 
    markAsRead, 
    processNotification,
  } = useNotifications();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/notifications', {
          withCredentials: true
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchNotifications();
    
    // Set up socket connection
    const socket = io('http://localhost:5000', { withCredentials: true });
    
    socket.on('connect', () => {
      console.log('Connected to socket server');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      socket.emit('join', { userId: user.userId, role: user.role });
    });
    
    socket.on('notification', () => {
      // Refresh notifications when new one arrives
      fetchNotifications();
      // Show a browser notification
      toast.info("Nouvelle notification reçue");
    });
    
    return () => {
      socket.disconnect();
    };
  }, []);
  
  // Safety check - ensure notifications is always an array
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current user role from localStorage
  const getUserRole = (): string => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        return user.role || '';
      }
    } catch (error) {
      console.error('Error getting user role:', error);
    }
    return '';
  };

  const userRole = getUserRole();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'formation':
        return <BookOpen size={16} className="text-blue-500" />;
      case 'evenement':
        return <Calendar size={16} className="text-green-500" />;
      default:
        return <Calendar size={16} className="text-blue-500" />;
    }
  };
  
  // Handle accepting a notification
  const handleAccept = async (id: string) => {
    try {
      await processNotification(id, 'accepted', responseText);
      setActiveNotification(null);
      setResponseText("");
      toast.success("Action acceptée avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'acceptation");
      console.error(error);
    }
  };

  // Handle declining a notification
  const handleDecline = async (id: string) => {
    try {
      await processNotification(id, 'declined', responseText);
      setActiveNotification(null);
      setResponseText("");
      toast.info("Action refusée");
    } catch (error) {
      toast.error("Erreur lors du refus");
      console.error(error);
    }
  };

  // Handle marking a notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      const notification = safeNotifications.find(n => n._id === id);
      if (notification && !notification.isRead) {
        await markAsRead(id);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Format the date relative to now
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: fr });
    } catch (e) {
      return 'Date inconnue';
    }
  };

  // Get notification type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'formation':
        return 'Formation';
      case 'evenement':
        return 'Événement';
      default:
        return 'Notification';
    }
  };

  // Function to determine if action buttons should be shown
  const shouldShowActionButtons = (notification: any) => {
    // Only show action buttons for managers on pending event notifications
    return (
      userRole === 'Manager' && 
      notification.status === 'pending' && 
      notification.type === 'evenement'
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 text-gray-100 hover:text-white hover:bg-gray-800 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 font-medium border-b">Notifications</div>
          
          <div className="max-h-96 overflow-y-auto">
            {safeNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Pas de notifications</div>
            ) : (
              safeNotifications.map((notification) => (
                <React.Fragment key={notification._id || `notification-${Math.random()}`}>
                  <div 
                    className={`p-3 border-b hover:bg-gray-50 ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleMarkAsRead(notification._id)}
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.sender?.prenom || ''} {notification.sender?.nom || ''}
                          </p>
                          <NotificationStatusBadge status={notification.status} />
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">
                          {userRole === 'Formateur' ? (
                            `Statut ${getTypeLabel(notification.type)}: ${
                              notification.status === 'accepted' ? 'Accepté' : 
                              notification.status === 'declined' ? 'Refusé' : 'En attente'
                            }`
                          ) : (
                            `Demande d'approbation: ${getTypeLabel(notification.type)}`
                          )}
                        </p>
                        
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(notification.createdAt)}
                        </p>
                        
                        {/* Action buttons - only show for Managers on pending event notifications */}
                        {shouldShowActionButtons(notification) && (
                          <div className="mt-2 flex justify-end">
                            {activeNotification !== notification._id ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveNotification(notification._id);
                                }}
                                className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                              >
                                Répondre
                              </button>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Response form - only show for active notification that requires action */}
                  {activeNotification === notification._id && shouldShowActionButtons(notification) && (
                    <div className="p-3 bg-gray-50 border-b">
                      {/* No textarea for Formateurs */}
                      {userRole === 'Manager' && (
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Commentaire (optionnel)..."
                          className="w-full p-2 border rounded text-sm mb-2"
                          rows={2}
                        />
                      )}
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveNotification(null);
                          }}
                          className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAccept(notification._id);
                          }}
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Accepter
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDecline(notification._id);
                          }}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Refuser
                        </button>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))
            )}
          </div>
          
          {safeNotifications.length > 5 && (
            <div className="p-2 bg-gray-50 text-center">
              <button className="text-sm text-blue-500 hover:text-blue-700">
                Voir toutes les notifications ({safeNotifications.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;