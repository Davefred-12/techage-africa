// ============================================
// FILE: src/components/NotificationBell.jsx
// ============================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellRing, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { Button } from './ui/button';

/**
 * NotificationBell Component
 * Shows notification icon with unread count badge
 * Add this to your navbar/header
 */
const NotificationBell = () => {
  const navigate = useNavigate();
  const { unreadCount } = useNotification();
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger bell animation when unread count changes
  const handleClick = () => {
    navigate('/user/notifications');
  };

  // Animate bell when new notification arrives
  if (unreadCount > 0 && !isAnimating) {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  }

  return (
    <button
      onClick={handleClick}
      className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors group"
      aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
    >
      {/* Bell Icon */}
      {unreadCount > 0 ? (
        <BellRing 
          className={`h-5 w-5 text-foreground ${isAnimating ? 'animate-ring' : ''}`} 
        />
      ) : (
        <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
      )}

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-600 text-white text-xs font-semibold rounded-full flex items-center justify-center animate-pulse-badge">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}

      <style>{`
        @keyframes ring {
          0%, 100% { transform: rotate(0deg); }
          10%, 30% { transform: rotate(-10deg); }
          20%, 40% { transform: rotate(10deg); }
          50% { transform: rotate(0deg); }
        }

        @keyframes pulse-badge {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.1);
            opacity: 0.9;
          }
        }

        .animate-ring {
          animation: ring 0.5s ease-in-out;
        }

        .animate-pulse-badge {
          animation: pulse-badge 2s ease-in-out infinite;
        }
      `}</style>
    </button>
  );
};

export default NotificationBell;