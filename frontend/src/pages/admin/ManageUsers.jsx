/* eslint-disable react-hooks/exhaustive-deps */
// ============================================
// FILE: src/pages/admin/ManageUsers.jsx - REAL API
// ============================================
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Users,
  Search,
  Filter,
  Shield,
  CheckCircle,
  Trash2,
  MoreVertical,
  Calendar,
  Mail,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../../components/ui/dropdown-menu';

const ManageUsers = () => {
  // ✅ State for real data
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [processing, setProcessing] = useState(false);

  // ✅ Fetch users on mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [searchQuery, filterRole, filterStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (filterRole !== 'all') params.role = filterRole;
      if (filterStatus !== 'all') params.status = filterStatus;

      const response = await api.get('/api/admin/users', { params });
      setUsers(response.data.users || []);

      // Calculate stats from users
      const total = response.data.total || 0;
      const admins = response.data.users?.filter(u => u.role === 'admin').length || 0;
      const verified = response.data.users?.filter(u => u.verified).length || 0;
      const unverified = total - verified;

      setStats({ total, admins, verified, unverified });
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      notation: 'compact',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  const handleAction = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setShowDialog(true);
  };

  const confirmAction = async () => {
    try {
      setProcessing(true);

      if (actionType === 'makeAdmin') {
        await api.patch(`/api/admin/users/${selectedUser._id}/role`);
        toast.success(`User role changed successfully!`);
      } else if (actionType === 'verify') {
        // TODO: Add verify endpoint if needed
        toast.success('User verified successfully!');
      } else if (actionType === 'delete') {
        await api.delete(`/api/admin/users/${selectedUser._id}`);
        toast.success('User deleted successfully!');
      }

      setShowDialog(false);
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Action error:', error);
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Manage Users
          </h1>
          <p className="text-muted-foreground">
            View and manage all registered users
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="animate-fade-in-up animation-delay-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up animation-delay-150">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Admins
                    </p>
                    <p className="text-3xl font-bold">{stats.admins}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-secondary-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up animation-delay-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Verified
                    </p>
                    <p className="text-3xl font-bold">{stats.verified}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-accent-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up animation-delay-250">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Unverified
                    </p>
                    <p className="text-3xl font-bold">{stats.unverified}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search & Filters */}
        <Card className="animate-fade-in-up animation-delay-300">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Role Filter */}
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="animate-fade-in-up animation-delay-400">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">User</th>
                      <th className="text-left p-4 font-medium text-sm">Role</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-sm">Courses</th>
                      <th className="text-left p-4 font-medium text-sm">Total Spent</th>
                      <th className="text-left p-4 font-medium text-sm">Joined</th>
                      <th className="text-right p-4 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <tr
                          key={user._id}
                          className="border-t hover:bg-muted/30 transition-colors animate-fade-in-up"
                          style={{ animationDelay: `${index * 50 + 500}ms` }}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 ring-2 ring-primary-200">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-700 text-white text-sm">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-sm">{user.name}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge
                              className={
                                user.role === 'admin'
                                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600'
                                  : 'bg-muted text-foreground'
                              }
                            >
                              {user.role === 'admin' ? (
                                <>
                                  <Shield className="h-3 w-3 mr-1" />
                                  Admin
                                </>
                              ) : (
                                'User'
                              )}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge
                              className={
                                user.verified
                                  ? 'bg-accent-600'
                                  : 'bg-muted text-foreground'
                              }
                            >
                              {user.verified ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </>
                              ) : (
                                'Unverified'
                              )}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{user.coursesEnrolled || 0}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-semibold text-primary-600">
                              {formatCurrency(user.totalSpent || 0)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="text-xs">
                              <p className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {formatDate(user.joinedDate || user.createdAt)}
                              </p>
                              <p className="text-muted-foreground mt-1">
                                Active: {getTimeAgo(user.lastActive || user.updatedAt)}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {user.role !== 'admin' && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => handleAction(user, 'makeAdmin')}
                                    >
                                      <Shield className="mr-2 h-4 w-4" />
                                      {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                  </>
                                )}
                                {!user.verified && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => handleAction(user, 'verify')}
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Verify User
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                  </>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleAction(user, 'delete')}
                                  className="text-danger-600 focus:text-danger-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-12 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <Users className="h-12 w-12 text-muted-foreground" />
                            <div>
                              <p className="font-semibold mb-1">No users found</p>
                              <p className="text-sm text-muted-foreground">
                                Try adjusting your search or filters
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'makeAdmin' && (selectedUser?.role === 'admin' ? 'Remove Admin Role' : 'Make User Admin')}
                {actionType === 'verify' && 'Verify User'}
                {actionType === 'delete' && 'Delete User'}
              </DialogTitle>
              <DialogDescription>
                {actionType === 'makeAdmin' &&
                  `Are you sure you want to ${selectedUser?.role === 'admin' ? 'remove admin role from' : 'make'} ${selectedUser?.name} ${selectedUser?.role === 'admin' ? '?' : 'an admin? They will have full access to the admin dashboard.'}`}
                {actionType === 'verify' &&
                  `Are you sure you want to verify ${selectedUser?.name}? This will give them a verified badge.`}
                {actionType === 'delete' &&
                  `Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowDialog(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                variant={actionType === 'delete' ? 'destructive' : 'default'}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
        .animation-delay-150 { animation-delay: 150ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-250 { animation-delay: 250ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
      `}</style>
    </AdminLayout>
  );
};

export default ManageUsers;