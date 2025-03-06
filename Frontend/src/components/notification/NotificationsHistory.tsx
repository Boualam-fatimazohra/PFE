// src/pages/NotificationsHistory.tsx
import * as React from 'react';
import { useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import NotificationStatusBadge from './NotificationStatusBadge';
import { MessageSquare, AlertTriangle, Info } from 'lucide-react';

const NotificationsHistory: React.FC = () => {
  const { notifications, fetchNotifications, loading } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Format date relative to now
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: fr 
      });
    } catch (e) {
      return 'Date inconnue';
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Historique des notifications</h1>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Aucune notification trouvée
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <li key={notification._id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.sender.prenom} {notification.sender.nom}
                        </p>
                        <NotificationStatusBadge status={notification.status} />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      {notification.response && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <span className="font-medium">Réponse:</span> {notification.response}
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsHistory;