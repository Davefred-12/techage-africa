// src/components/layout/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  BookOpen,
  LayoutDashboard,
  TrendingUp,
  Shield,
  Award,
  Bell
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../ThemeProvider";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useAuth } from "../../context/authContext";
import NotificationBell from "../NotificationBell";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  const getUserInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Services", path: "/services" },
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const userMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/user" },
    { icon: BookOpen, label: "My Courses", path: "/user/my-courses" },
    {
      icon: Award,
      label: "Referrals & Rewards",
      path: "/user/referrals",
    },
    {
      icon: Bell,
      label: "Notifications",
      path: "/user/notifications",
    },
    { icon: TrendingUp, label: "Progress Tracking", path: "/user/progress" },
    { icon: Settings, label: "Profile & Settings", path: "/user/settings" },
  ];

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutDialog(false);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="font-heading font-bold text-xl hidden sm:block">
              TechAge Africa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center space-x-4">

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* --- Notification Bell (PLACED HERE) --- */}
            {isAuthenticated && <NotificationBell />}

            {/* Auth Buttons / User Menu */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10 ring-2 ring-primary-500 ring-offset-2 ring-offset-background cursor-pointer hover:ring-primary-600 transition-all">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-700 text-white font-semibold">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      {user.role === "admin" && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 mt-1">
                          <Shield className="h-3 w-3" />
                          Admin
                        </span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Admin Section */}
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => navigate("/admin")}
                        className="cursor-pointer bg-primary-50 dark:bg-primary-900/20"
                      >
                        <Shield className="mr-2 h-4 w-4 text-primary-600" />
                        <span className="font-semibold text-primary-600">
                          Admin Dashboard
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {/* User Menu Items */}
                  {userMenuItems.map((item) => (
                    <DropdownMenuItem
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="cursor-pointer"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogoutClick}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button onClick={() => navigate("/login")}>Login</Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 animate-fade-in border-t">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={toggleMenu}
                className="block py-2 px-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {!isAuthenticated && (
              <div className="pt-2 border-t">
                <Button
                  className="w-full"
                  onClick={() => {
                    navigate("/login");
                    toggleMenu();
                  }}
                >
                  Login
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logout Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
