// ============================================
// FILE: src/pages/user/OrderHistory.jsx - REAL API
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  CheckCircle,
  Download,
  Calendar,
  CreditCard,
  Receipt,
  ArrowRight,
  ShoppingBag,
  Loader2,
} from 'lucide-react';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);

  // ✅ Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/user/orders');

        if (response.data.success) {
          setOrders(response.data.data.orders);
          setTotalSpent(response.data.data.totalSpent);
        }
      } catch (error) {
        console.error('Orders fetch error:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Order History
          </h1>
          <p className="text-muted-foreground">
            View and manage your course purchases
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="animate-fade-in-up animation-delay-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold">{orders.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Total Spent
                  </p>
                  <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-secondary-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-4 animate-fade-in-up animation-delay-300">
            {orders.map((order, index) => (
              <Card
                key={order.id}
                className="hover:shadow-lg transition-all animate-fade-in-up"
                style={{ animationDelay: `${index * 100 + 400}ms` }}
              >
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-12 gap-6 items-center">
                    {/* Course Thumbnail */}
                    <div className="md:col-span-2">
                      <div 
                        className="aspect-video rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => navigate('/user/my-courses')}
                      >
                        <img
                          src={order.course.thumbnail}
                          alt={order.course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="md:col-span-6 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 
                          className="font-bold text-lg hover:text-primary-600 transition-colors cursor-pointer"
                          onClick={() => navigate('/user/my-courses')}
                        >
                          {order.course.title}
                        </h3>
                        <Badge className="bg-accent-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Paid
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Receipt className="h-4 w-4" />
                          {order.id}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {order.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    {/* Amount & Actions */}
                    <div className="md:col-span-4 flex md:flex-col items-start md:items-end justify-between gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">
                          {formatCurrency(order.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Payment {order.status}
                        </p>
                      </div>

                      <div className="flex gap-2">
                       
                        <Button
                          size="sm"
                          onClick={() => navigate('/user/my-courses')}
                        >
                          View Course
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="animate-fade-in-up animation-delay-400">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't purchased any courses. Start learning today!
              </p>
              <Button onClick={() => navigate('/courses')}>
                Browse Courses
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Help Card */}
        <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-2 animate-fade-in-up animation-delay-500">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg mb-1">Need help with your order?</h3>
                <p className="text-sm text-muted-foreground">
                  Contact our support team for assistance with payments or refunds
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate('/contact')}>
                Contact Support
              </Button>
            </div>
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
        .animation-delay-500 { animation-delay: 500ms; }
      `}</style>
    </DashboardLayout>
  );
};

export default OrderHistory;