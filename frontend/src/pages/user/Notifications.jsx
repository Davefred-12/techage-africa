// ============================================
// FILE: src/pages/user/Notifications.jsx
// ============================================
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import api from '../../services/api';
import { toast } from 'sonner';
import { useNotification } from '../../context/NotificationContext';
import {
  Bell,
  BellRing,
  CheckCircle,
  Clock,
  Info,
  AlertTriangle,
  Gift,
  Users,
  Trophy,
  Trash2,
  RefreshCw,
} from 'lucide-react';

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { unreadCount: contextUnreadCount } = useNotification();
  const [localUnreadCount, setLocalUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Update local unread count from context
  useEffect(() => {
    setLocalUnreadCount(contextUnreadCount);
  }, [contextUnreadCount]);

  const fetchNotifications = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await api.get('/api/user/notifications');

      if (response.data.success) {
        setNotifications(response.data.data.notifications);
        setLocalUnreadCount(response.data.data.unreadCount);
      }
    } catch (error) {
      console.error('Notifications fetch error:', error);
      if (showLoading) {
        toast.error('Failed to load notifications');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications(false);
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await api.put(`/api/user/notifications/${notificationId}/read`);

      if (response.data.success) {
        setNotifications(prev =>
          prev.map(notification =>
            notification._id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
        setLocalUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Mark as read error:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await api.put('/api/user/notifications/mark-all-read');

      if (response.data.success) {
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        );
        setLocalUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Mark all as read error:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await api.delete(`/api/user/notifications/${notificationId}`);

      if (response.data.success) {
        setNotifications(prev =>
          prev.filter(notification => notification._id !== notificationId)
        );
        toast.success('Notification deleted');
      }
    } catch (error) {
      console.error('Delete notification error:', error);
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'admin_broadcast':
        return <BellRing className="h-5 w-5 text-primary-600" />;
      case 'announcement':
        return <BellRing className="h-5 w-5 text-green-600" />;
      case 'referral_reward':
        return <Gift className="h-5 w-5 text-accent-600" />;
      case 'course_completed':
        return <Trophy className="h-5 w-5 text-secondary-600" />;
      case 'referral_signup':
        return <Users className="h-5 w-5 text-blue-600" />;
      case 'system':
        return <Info className="h-5 w-5 text-gray-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getNotificationBadge = (type) => {
    switch (type) {
      case 'admin_broadcast':
        return <Badge className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">Admin</Badge>;
      case 'announcement':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Announcement</Badge>;
      case 'referral_reward':
        return <Badge className="bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300">Reward</Badge>;
      case 'course_completed':
        return <Badge className="bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300">Achievement</Badge>;
      case 'referral_signup':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Referral</Badge>;
      case 'system':
        return <Badge variant="secondary">System</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">Warning</Badge>;
      default:
        return <Badge variant="outline">General</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      if (diffInMinutes < 1) return 'Just now';
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading notifications...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
              Notifications
            </h1>
            <p className="text-muted-foreground">
              Stay updated with your latest activities and rewards
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleRefresh} 
              variant="outline"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {localUnreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read ({localUnreadCount})
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="animate-fade-in-up animation-delay-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Total Notifications
                  </p>
                  <p className="text-3xl font-bold">{notifications.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Unread
                  </p>
                  <p className="text-3xl font-bold text-accent-600">{localUnreadCount}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                  <BellRing className="h-6 w-6 text-accent-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    This Week
                  </p>
                  <p className="text-3xl font-bold text-secondary-600">
                    {notifications.filter(n => {
                      const notificationDate = new Date(n.createdAt);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return notificationDate > weekAgo;
                    }).length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-secondary-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <Card className="animate-fade-in-up animation-delay-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              All Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <div className="max-h-[600px] overflow-y-auto pr-4">
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <div
                      key={notification._id}
                      className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                        !notification.read
                          ? 'bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-800'
                          : 'bg-card'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                {getNotificationBadge(notification.type)}
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                                )}
                              </div>
                              <h4 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </h4>
                              <p className={`text-sm mt-1 ${!notification.read ? 'text-muted-foreground' : 'text-muted-foreground/80'}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground/60 mt-2">
                                {formatDate(notification.createdAt)}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              {!notification.read && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => markAsRead(notification._id)}
                                  className="h-8 w-8 p-0"
                                  title="Mark as read"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteNotification(notification._id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="Delete notification"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No notifications yet</h3>
                <p className="text-muted-foreground">
                  You'll receive notifications about your activities, rewards, and important updates here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
      `}</style>
    </DashboardLayout>
  );
};

export default Notifications;