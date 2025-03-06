// src/components/notification/NotificationBell.tsx
import { useState, useRef, useEffect } from 'react';
import { Bell, MessageSquare, AlertTriangle, Info, Check } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
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
              notifications.slice(0, 5).map((notification) => (
                <div 
                  key={notification._id} 
                  className={`p-3 border-b hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {notification.sender.prenom} {notification.sender.nom}
                      </p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="text-xs text-blue-500 hover:text-blue-700 flex items-center"
                          >
                            <Check size={12} className="mr-1" /> Marquer comme lu
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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