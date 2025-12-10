// ============================================
// FILE: src/App.jsx - UPDATED
// ============================================
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { NotificationProvider } from "./context/NotificationContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from './components/ui/sonner';

// Pages
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgetPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback"; // ✅ NEW - OAuth callback
import PaymentVerify from "./pages/PaymentVerify"; // ✅ NEW - Payment verification
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Services from "./pages/Services";
import TalkToExpert from "./pages/TalkToExpert";

// Components
import CookieConsent from "./components/CookieConsent";

// User Dashboard Pages
import UserDashboard from "./pages/user/UserDashboard";
import ProgressTracking from "./pages/user/ProgressTracking";
import MyCourses from "./pages/user/MyCourses";
import ReferralsRewards from "./pages/user/ReferralsRewards";
import Notifications from "./pages/user/Notifications";
import Settings from "./pages/user/Settings";
import CoursePlayer from "./pages/user/CoursePlayer";
import CertificateReview from "./pages/user/CertificateReview";

// Admin Dashboard Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageBlogs from "./pages/admin/ManageBlogs";
import BlogEditor from "./pages/admin/BlogEditor";
import UploadVideo from "./pages/admin/UploadVideo";
import AdminSettings from "./pages/admin/AdminSettings";
import RevenueAnalytics from "./pages/admin/RevenueAnalytics";
import AdminNotifications from "./pages/admin/AdminNotifications";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="light" storageKey="techage-theme">
        <NotificationProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              {/* ScrollToTop component*/}
              <ScrollToTop />
              <Navbar />
              <main className="flex-grow">
                <Routes>
                 {/* Public Routes */}
                 <Route path="/" element={<Home />} />
                 <Route path="/courses" element={<Courses />} />
                 <Route path="/courses/:slug" element={<CourseDetail />} />
                 <Route path="/about" element={<About />} />
                 <Route path="/contact" element={<Contact />} />
                 <Route path="/privacy" element={<Privacy />} />
                 <Route path="/blog" element={<Blog />} />
                 <Route path="/blog/:slug" element={<BlogPost />} />
                 <Route path="/services" element={<Services />} />
                 <Route path="/services/:serviceId" element={<TalkToExpert />} />
                 <Route path="/login" element={<Login />} />
                 <Route path="/register" element={<Register />} />
                 <Route path="/forgot-password" element={<ForgetPassword />} />
                 <Route path="/reset-password" element={<ResetPassword />} />
                 <Route path="/payment/verify" element={<PaymentVerify />} />
  
                 {/* ✅ NEW - OAuth Callback Route */}
                 <Route path="/auth/callback" element={<AuthCallback />} />

              {/* User Dashboard Routes */}
              <Route path="/user" element={<UserDashboard />} />
              <Route path="/user/progress" element={<ProgressTracking />} />
              <Route path="/user/my-courses" element={<MyCourses />} />
              <Route path="/user/referrals" element={<ReferralsRewards />} />
              <Route path="/user/notifications" element={<Notifications />} />
              <Route path="/user/settings" element={<Settings />} />
              <Route
                path="/user/courses/:id/learn"
                element={<CoursePlayer />}
              />
              <Route
                path="/user/courses/:id/certificate"
                element={<CertificateReview />}
              />

              {/* Admin Dashboard Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/courses" element={<ManageCourses />} />
              <Route path="/admin/blog" element={<ManageBlogs />} />
              <Route path="/admin/blog/create" element={<BlogEditor />} />
              <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/revenue" element={<RevenueAnalytics />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
              <Route path="/admin/upload" element={<UploadVideo />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
                </Routes>
              </main>
              <Footer />

              {/* Cookie Consent Popup */}
              <CookieConsent />

              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                richColors
                duration={4000}
                closeButton
              />
            </div>
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;