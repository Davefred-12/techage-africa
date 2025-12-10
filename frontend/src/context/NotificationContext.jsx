// ============================================
// FILE: src/context/NotificationContext.jsx
// ============================================
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import NotificationModal from '../components/NotificationModal';

const NotificationContext = createContext();

const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

const NotificationProvider = ({ children }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const { checkForNewNotifications } = useNotifications();

  // Poll for new notifications every 30 seconds
  const pollForNotifications = useCallback(async () => {
    const newNotification = await checkForNewNotifications();
    if (newNotification && !newNotification.read) {
      setCurrentNotification(newNotification);
      setModalOpen(true);
    }
  }, [checkForNewNotifications]);

  useEffect(() => {
    // Set up polling interval
    const interval = setInterval(pollForNotifications, 30000); // 30 seconds

    // Initial check after a short delay
    const timeout = setTimeout(pollForNotifications, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pollForNotifications]);

  const closeModal = () => {
    setModalOpen(false);
    setCurrentNotification(null);
  };

  const value = {
    showNotification: (notification) => {
      setCurrentNotification(notification);
      setModalOpen(true);
    },
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

export { NotificationProvider, useNotificationContext };