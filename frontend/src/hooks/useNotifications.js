// ============================================
// FILE: src/hooks/useNotifications.js
// ============================================
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastNotification, setLastNotification] = useState(null);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await api.get('/api/user/notifications');
      if (response.data.success) {
        const unread = response.data.data.notifications.filter(n => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  // Fetch recent notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/user/notifications?limit=5');
      if (response.data.success) {
        setNotifications(response.data.data.notifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await api.put(`/api/user/notifications/${notificationId}/read`);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await api.put('/api/user/notifications/mark-all-read');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, []);

  // Check for new notifications (polling)
  const checkForNewNotifications = useCallback(async () => {
    try {
      const response = await api.get('/api/user/notifications?limit=1');
      if (response.data.success && response.data.data.notifications.length > 0) {
        const latestNotification = response.data.data.notifications[0];

        // Check if this is a new notification
        if (!lastNotification || latestNotification._id !== lastNotification._id) {
          setLastNotification(latestNotification);

          // Update unread count
          await fetchUnreadCount();

          // Return the new notification for modal display
          return latestNotification;
        }
      }
    } catch (error) {
      console.error('Failed to check for new notifications:', error);
    }
    return null;
  }, [lastNotification, fetchUnreadCount]);

  // Initialize
  useEffect(() => {
    fetchUnreadCount();
    fetchNotifications();
  }, [fetchUnreadCount, fetchNotifications]);

  return {
    unreadCount,
    notifications,
    loading,
    fetchUnreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    checkForNewNotifications,
  };
};