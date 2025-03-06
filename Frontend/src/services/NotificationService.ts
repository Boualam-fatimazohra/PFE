// src/services/NotificationService.ts
import apiClient from '../services/apiClient';
import { NotificationItem } from '../contexts/NotificationContext';

class NotificationService {
  /**
   * Fetches all notifications for the current user
   */
  async getNotifications(): Promise<NotificationItem[]> {
    const response = await apiClient.get('/notifications');
    return response.data;
  }

  /**
   * Sends a notification to the user's manager
   */
  async sendToManager(message: string, type: string = 'message'): Promise<void> {
    await apiClient.post('/notifications/send-to-manager', { message, type });
  }

  /**
   * Marks a notification as read
   */
  async markAsRead(id: string): Promise<void> {
    await apiClient.put(`/notifications/${id}/read`, {});
  }

  /**
   * Creates a general notification (admin only)
   */
  async createNotification(receiverId: string, message: string, type: string = 'message'): Promise<void> {
    await apiClient.post('/notifications/create', { 
      receiverId, 
      message, 
      type 
    });
  }
}

export default new NotificationService();