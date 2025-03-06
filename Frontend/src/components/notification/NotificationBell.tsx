// src/components/notification/NotificationBell.tsx
import { useState, useRef, useEffect } from 'react';
import { Bell, MessageSquare, AlertTriangle, Info, Check } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';
import * as React from 'react';

const NotificationBell: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    acceptNotification, 
    declineNotification 
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      case 'message':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'alert':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'info':
        return <Info size={16} className="text-green-500" />;
      default:
        return <MessageSquare size={16} className="text-blue-500" />;
    }
  };

  const handleAccept = async (id: string) => {
    await acceptNotification(id, responseText);
    setActiveNotification(null);
    setResponseText("");
    toast.success("Notification acceptée");
  };

  const handleDecline = async (id: string) => {
    await declineNotification(id, responseText);
    setActiveNotification(null);
    setResponseText("");
    toast.info("Notification refusée");
  };

  // Handle marking a notification as read
  const handleMarkAsRead = async (id: string) => {
    if (!notifications.find(n => n._id === id)?.isRead) {
      await markAsRead(id);
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full"
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
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Pas de notifications</div>
            ) : (
              notifications.map((notification) => (
                <React.Fragment key={notification._id}>
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
                        <p className="text-sm font-medium text-gray-900">
                          {notification.sender.prenom} {notification.sender.nom}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </span>
                          
                          {/* Status indicator */}
                          {notification.status !== 'pending' && (
                            <span className={`text-xs font-medium ${
                              notification.status === 'accepted' 
                                ? 'text-green-500' 
                                : 'text-red-500'
                            }`}>
                              {notification.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                            </span>
                          )}
                        </div>
                        
                        {/* Response display if there's any */}
                        {notification.response && (
                          <div className="mt-1 p-1.5 bg-gray-50 rounded-sm text-xs text-gray-700">
                            <span className="font-medium">Réponse:</span> {notification.response}
                          </div>
                        )}
                        
                        {/* Action buttons for Manager */}
                        {notification.status === 'pending' && (
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
                  
                  {/* Response form when a notification is active */}
                  {activeNotification === notification._id && (
                    <div className="p-3 bg-gray-50 border-b">
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Votre réponse..."
                        className="w-full p-2 border rounded text-sm mb-2"
                        rows={2}
                      />
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
          
          {notifications.length > 5 && (
            <div className="p-2 bg-gray-50 text-center">
              <button className="text-sm text-blue-500 hover:text-blue-700">
                Voir toutes les notifications ({notifications.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;