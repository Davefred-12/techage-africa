// ============================================
// FILE: src/context/NotificationContext.jsx
// ============================================
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import NotificationModal from '../components/NotificationModal';
import api from '../services/api';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastNotificationIdRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const isAuthenticatedRef = useRef(false);

  // Check if user is authenticated
  const checkAuthentication = useCallback(() => {
    const token = localStorage.getItem('token');
    isAuthenticatedRef.current = !!token;
    return !!token;
  }, []);

  // Fetch latest notification and check if it's new
  const checkForNewNotifications = useCallback(async () => {
    if (!checkAuthentication()) {
      return;
    }

    try {
      const response = await api.get('/api/user/notifications?limit=1');
      
      if (response.data.success && response.data.data.notifications.length > 0) {
        const latestNotification = response.data.data.notifications[0];
        
        // Check if this is a truly new notification (unread and different from last one)
        if (
          !latestNotification.read && 
          latestNotification._id !== lastNotificationIdRef.current
        ) {
          // Update the last notification ID
          lastNotificationIdRef.current = latestNotification._id;
          
          // Show the modal with the new notification
          setCurrentNotification(latestNotification);
          setModalOpen(true);
        }
        
        // Update unread count
        setUnreadCount(response.data.data.unreadCount || 0);
      }
    } catch (error) {
      // Silently handle errors - user might be logged out
      if (error.response?.status === 401) {
        isAuthenticatedRef.current = false;
        stopPolling();
      }
    }
  }, [checkAuthentication]);

  // Start polling for notifications
  const startPolling = useCallback(() => {
    if (!checkAuthentication()) return;

    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Initial check after 2 seconds (to avoid immediate popup on page load)
    setTimeout(() => {
      checkForNewNotifications();
    }, 2000);

    // Poll every 15 seconds
    pollingIntervalRef.current = setInterval(() => {
      checkForNewNotifications();
    }, 15000);
  }, [checkAuthentication, checkForNewNotifications]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Manually trigger notification check (useful after admin sends broadcast)
  const triggerNotificationCheck = useCallback(() => {
    checkForNewNotifications();
  }, [checkForNewNotifications]);

  // Show notification manually (for testing or manual triggers)
  const showNotification = useCallback((notification) => {
    setCurrentNotification(notification);
    setModalOpen(true);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setModalOpen(false);
    // Don't clear currentNotification immediately to allow for animation
    setTimeout(() => {
      setCurrentNotification(null);
    }, 300);
  }, []);

  // Initialize polling on mount
  useEffect(() => {
    if (checkAuthentication()) {
      startPolling();
    }

    // Cleanup on unmount
    return () => {
      stopPolling();
    };
  }, [checkAuthentication, startPolling, stopPolling]);

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        if (e.newValue) {
          // User logged in
          isAuthenticatedRef.current = true;
          startPolling();
        } else {
          // User logged out
          isAuthenticatedRef.current = false;
          stopPolling();
          setUnreadCount(0);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [startPolling, stopPolling]);

  const value = {
    unreadCount,
    showNotification,
    triggerNotificationCheck,
    modalOpen,
    currentNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationModal
        isOpen={modalOpen}
        onClose={closeModal}
        notification={currentNotification}
      />
    </NotificationContext.Provider>
  );
};