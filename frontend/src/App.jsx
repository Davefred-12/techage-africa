// ============================================
// FILE: src/App.jsx - UPDATED
// ============================================
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/ScrollToTop";

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

// User Dashboard Pages
import UserDashboard from "./pages/user/UserDashboard";
import ProgressTracking from "./pages/user/ProgressTracking";
import MyCourses from "./pages/user/MyCourses";
import OrderHistory from "./pages/user/OrderHistory";
import Settings from "./pages/user/Settings";
import CoursePlayer from "./pages/user/CoursePlayer";
import CertificateReview from "./pages/user/CertificateReview";

// Admin Dashboard Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageUsers from "./pages/admin/ManageUsers";
import UploadVideo from "./pages/admin/UploadVideo";
import AdminSettings from "./pages/admin/AdminSettings";
import RevenueAnalytics from "./pages/admin/RevenueAnalytics";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="techage-theme">
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
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
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
              <Route path="/user/orders" element={<OrderHistory />} />
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
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/revenue" element={<RevenueAnalytics />} />
              <Route path="/admin/upload" element={<UploadVideo />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;