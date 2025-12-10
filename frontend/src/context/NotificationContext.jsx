// ============================================
// FILE: src/context/NotificationContext.jsx
// ============================================
import { createContext, useState } from 'react';
import NotificationModal from '../components/NotificationModal';

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  // Poll for new notifications every 30 seconds - disabled to prevent infinite refresh
  // const pollForNotifications = useCallback(async () => {
  //   const newNotification = await checkForNewNotifications();
  //   if (newNotification && !newNotification.read) {
  //     setCurrentNotification(newNotification);
  //     setModalOpen(true);
  //   }
  // }, [checkForNewNotifications]);

  // useEffect(() => {
  //   // Set up polling interval
  //   const interval = setInterval(pollForNotifications, 30000); // 30 seconds

  //   // Initial check after a short delay
  //   const timeout = setTimeout(pollForNotifications, 1000);

  //   return () => {
  //     clearInterval(interval);
  //     clearTimeout(timeout);
  //   };
  // }, [pollForNotifications]);

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

export { NotificationProvider };