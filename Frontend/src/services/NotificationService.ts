// src/services/NotificationService.ts
import apiClient from './apiClient';
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
  async sendToManager(type: string, entityId: string): Promise<void> {
    await apiClient.post('/notifications/send-to-manager', { type, entityId });
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
  async createNotification(receiverId: string, type: string, entityId: string): Promise<void> {
    await apiClient.post('/notifications/create', {
      receiverId,
      type,
      entityId
    });
  }
    
  /**
   * Accept a notification
   */
  async acceptNotification(id: string): Promise<void> {
    await apiClient.put(`/notifications/${id}/process`, {
      status: "accepted"
    });
  }
    
  /**
   * Decline a notification
   */
  async declineNotification(id: string): Promise<void> {
    await apiClient.put(`/notifications/${id}/process`, {
      status: "declined"
    });
  }
}

export default new NotificationService();