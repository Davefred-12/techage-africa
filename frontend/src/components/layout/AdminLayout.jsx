// ============================================
// FILE: src/components/layout/AdminLayout.jsx
// ============================================
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Upload,
  DollarSign,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Settings,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "../../context/authContext";
import { cn } from "../../lib/utils";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin",
    },
    {
      icon: Upload,
      label: "Upload Course",
      path: "/admin/upload",
    },
    {
      icon: BookOpen,
      label: "Manage Courses",
      path: "/admin/courses",
    },

    {
      icon: Users,
      label: "Manage Users",
      path: "/admin/users",
    },
    {
      icon: BookOpen,
      label: "Blog Management",
      path: "/admin/blog",
    },
    {
      icon: DollarSign,
      label: "Revenue & Analytics",
      path: "/admin/revenue",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/admin/settings",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-20 left-4 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-background shadow-lg"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-72 border-r bg-background transition-transform duration-300 ease-in-out overflow-y-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Admin Profile Section */}
          <div className="p-6 border-b bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
            <div className="flex items-center space-x-4 animate-fade-in">
              <Avatar className="h-16 w-16 ring-2 ring-primary-500 ring-offset-2 ring-offset-background">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-700 text-white text-xl font-bold">
                  {getInitials(user?.name || "Admin")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || "admin@techageafrica.com"}
                </p>
                <Badge className="mt-1 bg-gradient-to-r from-primary-600 to-secondary-600 text-xs">
                  {user?.role || "Admin"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-lg transition-all group animate-fade-in-left",
                  isActive(item.path)
                    ? "bg-primary-600 text-white shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      isActive(item.path)
                        ? "text-white"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {isActive(item.path) && (
                  <ChevronRight className="h-4 w-4 text-white" />
                )}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-danger-600 hover:text-danger-700 hover:bg-danger-50 dark:hover:bg-danger-900/20"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72">
        <main className="min-h-[calc(100vh-4rem)] p-6 lg:p-8 animate-fade-in-up">
          {children}
        </main>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

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

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
