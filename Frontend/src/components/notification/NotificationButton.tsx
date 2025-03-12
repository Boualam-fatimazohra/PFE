// src/components/notification/NotificationButton.tsx
import { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from 'react-toastify';

interface NotificationButtonProps {
  className?: string;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({ className }) => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('message');
  const [sending, setSending] = useState(false);
  
  const { sendNotification } = useNotifications();

  const handleSendNotification = async () => {
    if (!message.trim()) {
      toast.error('Le message ne peut pas être vide');
      return;
    }

    setSending(true);
    try {
      const success = await sendNotification(message, type);
      if (success) {
        toast.success('Notification envoyée avec succès');
        setMessage('');
        setShowModal(false);
      } else {
        toast.error('Erreur lors de l\'envoi de la notification');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la notification');
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${className}`}
      >
        <Bell size={18} />
        <span>Notifier Manager</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Envoyer une notification</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type de notification
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="message">Message</option>
                <option value="alert">Alerte</option>
                <option value="info">Information</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Votre message..."
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleSendNotification}
                disabled={sending || !message.trim()}
                className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
                  (sending || !message.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {sending ? 'Envoi...' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationButton;