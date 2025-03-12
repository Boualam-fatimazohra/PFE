// src/components/notification/NotificationStatusBadge.tsx
import * as React from 'react';
import { Check, X, Clock } from 'lucide-react';

interface NotificationStatusBadgeProps {
  status: 'pending' | 'accepted' | 'declined';
  className?: string;
}

const NotificationStatusBadge: React.FC<NotificationStatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'accepted':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: <Check size={14} className="text-green-600" />,
          label: 'Acceptée'
        };
      case 'declined':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          icon: <X size={14} className="text-red-600" />,
          label: 'Refusée'
        };
      case 'pending':
      default:
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          icon: <Clock size={14} className="text-yellow-600" />,
          label: 'En attente'
        };
    }
  };

  const { bgColor, textColor, icon, label } = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bgColor} ${textColor} ${className}`}>
      <span className="mr-1">{icon}</span>
      {label}
    </span>
  );
};

export default NotificationStatusBadge;