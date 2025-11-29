/* eslint-disable react-hooks/exhaustive-deps */
// ============================================
// FILE: src/pages/admin/RevenueAnalytics.jsx - REAL API
// ============================================
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react';

const RevenueAnalytics = () => {
  // ✅ State for real data
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [timeFilter, setTimeFilter] = useState('30days');

  // ✅ Fetch analytics on mount and when timeFilter changes
  useEffect(() => {
    fetchAnalytics();
  }, [timeFilter]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch all analytics data in parallel
      const [statsRes, chartRes, coursesRes, transactionsRes] = await Promise.all([
        api.get('/api/admin/analytics', { params: { period: timeFilter } }),
        api.get('/api/admin/analytics/revenue-chart'),
        api.get('/api/admin/analytics/top-courses'),
        api.get('/api/admin/analytics/recent-transactions')
      ]);

      setStats(statsRes.data.data);
      setRevenueData(chartRes.data.data || []);
      setTopCourses(coursesRes.data.data || []);
      setRecentTransactions(transactionsRes.data.data || []);
    } catch (error) {
      console.error('Fetch analytics error:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      notation: 'compact',
    }).format(amount);
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

  const handleExportReport = () => {
    // TODO: Implement export functionality
    toast.info('Export functionality coming soon!');
  };

  const maxRevenue = revenueData.length > 0 
    ? Math.max(...revenueData.map((d) => d.revenue)) 
    : 1;

  // ✅ Loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary-600 mb-4" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
              Revenue & Analytics
            </h1>
            <p className="text-muted-foreground">
              Track your revenue, orders, and business performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        {stats && (
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="animate-fade-in-up animation-delay-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full -mr-16 -mt-16" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <Badge
                    className={
                      stats.revenueGrowth > 0
                        ? 'bg-accent-100 text-accent-700'
                        : 'bg-danger-100 text-danger-700'
                    }
                  >
                    {stats.revenueGrowth > 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(stats.revenueGrowth).toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  vs previous period
                </p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up animation-delay-150 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary-500/20 to-transparent rounded-full -mr-16 -mt-16" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <Badge
                    className={
                      stats.ordersGrowth > 0
                        ? 'bg-accent-100 text-accent-700'
                        : 'bg-danger-100 text-danger-700'
                    }
                  >
                    {stats.ordersGrowth > 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(stats.ordersGrowth).toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total Orders
                </p>
                <p className="text-3xl font-bold">
                  {stats.totalOrders.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  vs previous period
                </p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up animation-delay-200 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-500/20 to-transparent rounded-full -mr-16 -mt-16" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <Badge
                    className={
                      stats.avgGrowth > 0
                        ? 'bg-accent-100 text-accent-700'
                        : 'bg-danger-100 text-danger-700'
                    }
                  >
                    {stats.avgGrowth > 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(stats.avgGrowth).toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Avg Order Value
                </p>
                <p className="text-3xl font-bold">
                  {formatCurrency(stats.avgOrderValue)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  per transaction
                </p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up animation-delay-250 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full -mr-16 -mt-16" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <Badge
                    className={
                      stats.studentsGrowth > 0
                        ? 'bg-accent-100 text-accent-700'
                        : 'bg-danger-100 text-danger-700'
                    }
                  >
                    {stats.studentsGrowth > 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(stats.studentsGrowth).toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Active Students
                </p>
                <p className="text-3xl font-bold">
                  {stats.activeStudents.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  enrolled students
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Revenue Chart */}
        <Card className="animate-fade-in-up animation-delay-300">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData.length > 0 ? (
              <div className="h-80 flex items-end justify-center gap-6 px-4">
                {revenueData.map((data, index) => {
                  const heightPercentage = (data.revenue / maxRevenue) * 100;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-3 group"
                      style={{ width: '60px' }}
                    >
                      {/* Bar */}
                      <div className="w-full relative">
                        {/* Tooltip on hover */}
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10">
                          <div className="text-center">
                            <p>{formatCurrency(data.revenue)}</p>
                            <p className="text-[10px] opacity-80 mt-0.5">
                              {data.orders} orders
                            </p>
                          </div>
                          {/* Arrow */}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45" />
                        </div>

                        {/* The bar itself */}
                        <div
                          className="w-full bg-gradient-to-t from-primary-500 via-primary-400 to-secondary-400 rounded-t-lg transition-all duration-500 group-hover:from-primary-600 group-hover:via-primary-500 group-hover:to-secondary-500 cursor-pointer"
                          style={{
                            height: `${Math.max(heightPercentage * 2.5, 40)}px`,
                            width: '40px'
                          }}
                        />
                      </div>

                      {/* Month label */}
                      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {data.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No revenue data yet</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Courses */}
          <Card className="animate-fade-in-up animation-delay-400">
            <CardHeader>
              <CardTitle>Top Performing Courses</CardTitle>
            </CardHeader>
            <CardContent>
              {topCourses.length > 0 ? (
                <div className="space-y-4">
                  {topCourses.map((course, index) => (
                    <div
                      key={course._id}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {course.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {course.enrollments} students
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-primary-600">
                          {formatCurrency(course.revenue)}
                        </p>
                        <Badge
                          className="bg-accent-100 text-accent-700 mt-1"
                          size="sm"
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {course.growth?.toFixed(1) || 0}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No course data yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="animate-fade-in-up animation-delay-450">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">
                        {transaction.user
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">
                          {transaction.user}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {transaction.course}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          ₦{transaction.amount.toLocaleString()}
                        </p>
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <Badge
                            className={
                              transaction.status === 'completed'
                                ? 'bg-accent-100 text-accent-700'
                                : 'bg-muted text-foreground'
                            }
                            size="sm"
                          >
                            {transaction.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {getTimeAgo(transaction.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No transactions yet</p>
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
        .animation-delay-150 { animation-delay: 150ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-250 { animation-delay: 250ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-450 { animation-delay: 450ms; }
      `}</style>
    </AdminLayout>
  );
};

export default RevenueAnalytics;