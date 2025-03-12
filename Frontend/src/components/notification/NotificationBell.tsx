// src/components/notification/NotificationBell.tsx
import { useState, useRef, useEffect } from 'react';
import { Bell, Calendar, BookOpen, Check, X } from 'lucide-react';
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
      case 'formation':
        return <BookOpen size={16} className="text-blue-500" />;
      case 'evenement':
        return <Calendar size={16} className="text-green-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  // Get notification title based on type
  const getNotificationTitle = (type: string) => {
    switch (type) {
      case 'formation':
        return 'Nouvelle formation créée';
      case 'evenement':
        return 'Nouvel événement à approuver';
      default:
        return 'Notification';
    }
  };

  const handleAccept = async (id: string) => {
    await acceptNotification(id);
    setActiveNotification(null);
    toast.success("Approuvé avec succès");
  };

  const handleDecline = async (id: string) => {
    await declineNotification(id);
    setActiveNotification(null);
    toast.info("Refusé");
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
        className="relative p-2 text-white hover:bg-gray-700 rounded-full"
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
                          {getNotificationTitle(notification.type)}
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
                              {notification.status === 'accepted' ? 'Approuvé' : 'Refusé'}
                            </span>
                          )}
                        </div>
                        
                        {/* Reference to entityId - could be enhanced to show actual entity details */}
                        <div className="mt-1 text-xs text-gray-500">
  ID: {notification.entityId ? notification.entityId.substring(0, 8) + '...' : 'N/A'}
</div>for
                        
                        {/* Action buttons for Manager */}
                        {notification.status === 'pending' && (
                          <div className="mt-2 flex justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAccept(notification._id);
                              }}
                              className="text-xs bg-green-500 text-white px-2 py-1 rounded flex items-center"
                            >
                              <Check size={12} className="mr-1" />
                              Approuver
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDecline(notification._id);
                              }}
                              className="text-xs bg-red-500 text-white px-2 py-1 rounded flex items-center"
                            >
                              <X size={12} className="mr-1" />
                              Refuser
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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