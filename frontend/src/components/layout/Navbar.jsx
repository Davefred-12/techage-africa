// src/components/layout/Navbar.jsx - JOBLADDA REDESIGN
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Settings,
  BookOpen,
  LayoutDashboard,
  TrendingUp,
  Award,
  Bell,
  ChevronDown,
  FileText,
  Search,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
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
  const navigate = useNavigate();
  const location = useLocation();
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
    {
      name: "AI Tools",
      path: "#",
      dropdown: [
        { name: "AI CV Maker", description: "Create ATS-optimized CVs", path: "/ai-cv-maker", icon: FileText },
        { name: "AI CV Scanner", description: "Free CV score & analysis", path: "/ai-cv-scanner", icon: Search },
        { name: "Job Readiness Scanner", description: "Know why you're not hired", path: "/job-readiness-scanner", icon: Zap },
      ],
    },
    { name: "Courses", path: "/courses" },
    { name: "Blog", path: "/blog" },
  ];

  const userMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/user" },
    { icon: BookOpen, label: "My Courses", path: "/user/my-courses" },
    { icon: Award, label: "Referrals & Rewards", path: "/user/referrals" },
    { icon: Bell, label: "Notifications", path: "/user/notifications" },
    { icon: TrendingUp, label: "Progress Tracking", path: "/user/progress" },
    { icon: Settings, label: "Profile & Settings", path: "/user/settings" },
  ];

  const handleLogoutClick = () => setShowLogoutDialog(true);

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutDialog(false);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const isActiveLink = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* 
        Navbar background: light gray (#f3f4f6 / gray-100) to match the design screenshot.
        The design shows a light gray navbar, NOT dark or white — match exactly.
      */}
      <nav className="sticky top-0 z-50 w-full bg-gray-300 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-[60px] items-center justify-between">

            {/* ── LOGO ── */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              {/* Orange square icon with "J" */}
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F88212] shadow-md shadow-orange-400/30">
                <span className="text-white font-black text-lg leading-none">J</span>
              </div>
              <span className="font-black text-[1.35rem] tracking-tight hidden sm:block">
                <span className="text-[#111827]">Job</span>
                <span className="text-[#F88212]">Ladda</span>
              </span>
            </Link>

            {/* ── DESKTOP NAV — pill style, no border ── */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <DropdownMenu key={link.name}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`flex items-center gap-1 px-4 py-1.5 text-sm font-semibold rounded-full transition-all outline-none focus:outline-none ${
                          link.dropdown.some((item) => isActiveLink(item.path))
                            ? "bg-[#111827] text-white"
                            : "text-gray-600 hover:text-[#111827] hover:bg-white"
                        }`}
                      >
                        {link.name}
                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      className="w-72 p-2 mt-2 rounded-2xl shadow-xl border border-gray-100 bg-white"
                    >
                      <DropdownMenuLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pt-1 pb-2">
                        Our Smart Tools
                      </DropdownMenuLabel>
                      {link.dropdown.map((item) => (
                        <DropdownMenuItem
                          key={item.name}
                          onClick={() => navigate(item.path)}
                          className="flex items-center gap-3 p-3 cursor-pointer rounded-xl hover:bg-orange-50 transition-all group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <item.icon className="h-4 w-4 text-[#F88212]" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#111827]">{item.name}</p>
                            <p className="text-xs text-gray-400">{item.description}</p>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-5 py-1.5 text-sm font-semibold rounded-full transition-all ${
                      isActiveLink(link.path)
                        ? "bg-[#111827] text-white shadow"
                        : "text-gray-500 hover:text-[#111827] hover:bg-gray-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>

            {/* ── RIGHT SIDE ── */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="hidden lg:block text-sm font-semibold text-gray-600 hover:text-[#111827] transition-colors px-2"
                  >
                    Sign In
                  </Link>
                  <Button
                    className="bg-[#F88212] hover:bg-[#EA7210] text-white font-bold px-5 h-9 rounded-full shadow-md shadow-orange-400/25 active:scale-95 transition-all text-sm"
                    onClick={() => navigate("/register")}
                  >
                    Get Started Free
                  </Button>
                </>
              )}

              {isAuthenticated && (
                <>
                  <NotificationBell />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                        <Avatar className="h-9 w-9 border-2 border-orange-200">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="bg-[#F88212] text-white font-bold text-sm">
                            {user ? getUserInitials(user.name) : "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-xl border-gray-100">
                      <DropdownMenuLabel className="font-bold text-sm px-3 py-2">
                        {user?.name}
                        <p className="text-xs text-gray-400 font-normal">{user?.email}</p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {userMenuItems.map((item) => (
                        <DropdownMenuItem
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className="flex items-center gap-2 p-2.5 rounded-xl cursor-pointer"
                        >
                          <item.icon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogoutClick}
                        className="flex items-center gap-2 p-2.5 rounded-xl cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm font-medium">Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              {/* Mobile toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9"
                onClick={toggleMenu}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* ── MOBILE MENU ── */}
          {isOpen && (
            <div className="md:hidden py-3 space-y-1 border-t border-gray-100 animate-fade-in">
              {navLinks.map((link) => (
                link.dropdown ? (
                  <div key={link.name}>
                    <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{link.name}</p>
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={toggleMenu}
                        className={`flex items-center gap-2.5 py-2.5 px-4 text-sm font-semibold rounded-xl transition-colors ${
                          isActiveLink(item.path)
                            ? "text-white bg-[#111827]"
                            : "text-gray-600 hover:text-[#111827] hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className={`h-4 w-4 ${isActiveLink(item.path) ? "text-orange-400" : "text-[#F88212]"}`} />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={toggleMenu}
                    className={`block py-2.5 px-4 text-sm font-semibold rounded-xl transition-colors ${
                      isActiveLink(link.path)
                        ? "text-white bg-[#111827]"
                        : "text-gray-600 hover:text-[#111827] hover:bg-gray-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              ))}

              {!isAuthenticated && (
                <div className="pt-3 mt-1 border-t border-gray-100 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full font-semibold rounded-xl h-11"
                    onClick={() => { navigate("/login"); toggleMenu(); }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full bg-[#F88212] hover:bg-[#EA7210] text-white font-bold rounded-xl h-11"
                    onClick={() => { navigate("/register"); toggleMenu(); }}
                  >
                    Get Started Free
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ── LOGOUT DIALOG ── */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[420px] max-w-[90vw] rounded-2xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-black">Confirm Logout</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Are you sure you want to log out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="w-full sm:w-auto rounded-full"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmLogout}
              className="w-full sm:w-auto rounded-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </>
  );
};

export default Navbar;