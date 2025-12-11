// ============================================
// FILE: src/pages/admin/AdminNotifications.jsx
// ============================================
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import api from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Bell,
  Send,
  Users,
  MessageSquare,
  AlertTriangle,
  Info,
  CheckCircle,
  Loader2,
  History,
  UserCheck,
  Search,
} from 'lucide-react';

// Validation schema
const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  message: z.string().min(1, 'Message is required').max(500, 'Message must be less than 500 characters'),
  type: z.enum(['admin_broadcast', 'system', 'announcement', 'warning']).default('admin_broadcast'),
});

const AdminNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [sendToAll, setSendToAll] = useState(true);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: '',
      message: '',
      type: 'admin_broadcast',
    },
  });

  useEffect(() => {
    fetchStats();
    fetchRecentNotifications();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await api.get('/api/user/notifications/admin/users');
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleUserToggle = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllUsers = () => {
    setSelectedUsers(users.map(user => user._id));
  };

  const handleClearSelection = () => {
    setSelectedUsers([]);
  };

  const filteredUsers = (users || []).filter(user =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/user/notifications/admin/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch notification stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchRecentNotifications = async () => {
    try {
      const response = await api.get('/api/user/notifications/admin/recent');
      if (response.data.success) {
        setRecentNotifications(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch recent notifications:', error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let response;

      if (sendToAll) {
        // Broadcast to all users
        response = await api.post('/api/user/notifications/broadcast', data);
        if (response.data.success) {
          toast.success('Notification sent successfully to all users!');
        }
      } else {
        // Send to selected users
        if (selectedUsers.length === 0) {
          toast.error('Please select at least one user');
          setLoading(false);
          return;
        }

        const promises = selectedUsers.map(userId =>
          api.post('/api/user/notifications/send', {
            userId,
            ...data
          })
        );

        const results = await Promise.allSettled(promises);
        const successCount = results.filter(result => result.status === 'fulfilled').length;

        if (successCount > 0) {
          toast.success(`Notification sent to ${successCount} user${successCount > 1 ? 's' : ''}!`);
        }

        if (successCount < selectedUsers.length) {
          toast.warning(`Failed to send to ${selectedUsers.length - successCount} user${selectedUsers.length - successCount > 1 ? 's' : ''}`);
        }
      }

      form.reset();
      setSelectedUsers([]);
      fetchStats();
      fetchRecentNotifications();
    } catch (error) {
      console.error('Notification error:', error);
      toast.error(error.response?.data?.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'admin_broadcast':
        return <Bell className="h-4 w-4 text-primary-600" />;
      case 'system':
        return <Info className="h-4 w-4 text-blue-600" />;
      case 'announcement':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'admin_broadcast':
        return <Badge className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">Broadcast</Badge>;
      case 'system':
        return <Badge variant="secondary">System</Badge>;
      case 'announcement':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Announcement</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">Warning</Badge>;
      default:
        return <Badge variant="outline">General</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Admin Notifications
          </h1>
          <p className="text-muted-foreground">
            Send broadcast notifications to all users and manage notification history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="animate-fade-in-up animation-delay-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total Users
                </p>
                <p className="text-3xl font-bold">
                  {statsLoading ? '...' : (stats?.totalUsers || 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-accent-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total Notifications
                </p>
                <p className="text-3xl font-bold">
                  {statsLoading ? '...' : (stats?.totalNotifications || 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-secondary-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Delivered Today
                </p>
                <p className="text-3xl font-bold">
                  {statsLoading ? '...' : (stats?.deliveredToday || 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-400">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Broadcasts Sent
                </p>
                <p className="text-3xl font-bold">
                  {statsLoading ? '...' : (stats?.broadcastsSent || 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Send Notification Form */}
          <Card className="lg:col-span-2 animate-fade-in-up animation-delay-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Broadcast Notification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Recipients Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Send To</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={sendToAll}
                          onChange={() => {
                            setSendToAll(true);
                            setSelectedUsers([]);
                          }}
                          className="text-primary"
                        />
                        <span className="text-sm">All Users</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={!sendToAll}
                          onChange={() => setSendToAll(false)}
                          className="text-primary"
                        />
                        <span className="text-sm">Select Users</span>
                      </label>
                    </div>

                    {!sendToAll && (
                      <div className="flex items-center gap-2">
                        <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" type="button" className="flex-1">
                              <UserCheck className="h-4 w-4 mr-2" />
                              {selectedUsers.length === 0
                                ? 'Select Users'
                                : `${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''} selected`
                              }
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
                            <DialogHeader>
                              <DialogTitle>Select Recipients</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Search */}
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  placeholder="Search users..."
                                  value={userSearch}
                                  onChange={(e) => setUserSearch(e.target.value)}
                                  className="pl-10"
                                />
                              </div>

                              {/* Action buttons */}
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={handleSelectAllUsers}
                                >
                                  Select All
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={handleClearSelection}
                                >
                                  Clear All
                                </Button>
                              </div>

                              {/* User list */}
                              <div className="max-h-96 overflow-y-auto space-y-2">
                                {filteredUsers.map((user) => (
                                  <label
                                    key={user._id}
                                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                                  >
                                    <Checkbox
                                      checked={selectedUsers.includes(user._id)}
                                      onCheckedChange={() => handleUserToggle(user._id)}
                                    />
                                    <div className="flex items-center gap-3 flex-1">
                                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-semibold text-primary">
                                          {user.name.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{user.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                      </div>
                                    </div>
                                  </label>
                                ))}
                              </div>

                              <div className="flex justify-end gap-2 pt-4 border-t">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setUserDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  onClick={() => setUserDialogOpen(false)}
                                >
                                  Done ({selectedUsers.length})
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notification Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select notification type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin_broadcast">
                              <div className="flex items-center gap-2">
                                <Bell className="h-4 w-4" />
                                Admin Broadcast
                              </div>
                            </SelectItem>
                            <SelectItem value="announcement">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Announcement
                              </div>
                            </SelectItem>
                            <SelectItem value="system">
                              <div className="flex items-center gap-2">
                                <Info className="h-4 w-4" />
                                System Message
                              </div>
                            </SelectItem>
                            <SelectItem value="warning">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                Warning
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter notification title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter notification message"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          {field.value?.length || 0}/500 characters
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        {sendToAll
                          ? 'Send to All Users'
                          : `Send to ${selectedUsers.length} User${selectedUsers.length !== 1 ? 's' : ''}`
                        }
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card className="animate-fade-in-up animation-delay-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Broadcasts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentNotifications.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {recentNotifications.map((notification, index) => (
                    <div
                      key={notification._id}
                      className="p-3 rounded-lg border bg-muted/50"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getTypeBadge(notification.type)}
                          </div>
                          <h4 className="font-semibold text-sm line-clamp-1">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground/60 mt-2">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No broadcasts sent yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-700 { animation-delay: 700ms; }
      `}</style>
    </AdminLayout>
  );
};

export default AdminNotifications;
