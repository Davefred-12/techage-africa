// ============================================
// FILE: src/pages/admin/AdminSettings.jsx - REAL API
// ============================================
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "../../context/authContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  User,
  Mail,
  Lock,
  Save,
  Upload,
  Settings,
  CreditCard,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user, updateUser, refreshUser } = useAuth(); // ✅ ADD refreshUser

  // Profile Schema
  const profileSchema = z.object({
    fullName: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    bio: z.string().optional(),
  });

  // Password Schema
  const passwordSchema = z
    .object({
      currentPassword: z
        .string()
        .min(6, "Password must be at least 6 characters"),
      newPassword: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  // Site Settings Schema
  const siteSchema = z.object({
    siteName: z.string().min(3, "Site name is required"),
    siteDescription: z.string().optional(),
    supportEmail: z.string().email("Invalid email"),
    currency: z.string(),
  });

  // Email Settings Schema
  const emailSchema = z.object({
    smtpHost: z.string().min(3, "SMTP host is required"),
    smtpPort: z.string(),
    smtpUser: z.string().email("Invalid email"),
    smtpPassword: z.string().min(6, "Password required"),
    fromEmail: z.string().email("Invalid email"),
    fromName: z.string().min(3, "Name required"),
  });

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const siteForm = useForm({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      siteName: "TechAge Africa",
      siteDescription:
        "Empowering Africa's future through digital skills, brand visibility, and tech-driven opportunities.",
      supportEmail: "support@techageafrica.com",
      currency: "NGN",
    },
  });

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      smtpHost: "smtp.resend.com",
      smtpPort: "587",
      smtpUser: "resend",
      smtpPassword: "",
      fromEmail: "noreply@techageafrica.com",
      fromName: "TechAge Africa",
    },
  });

  // ✅ Handle profile update with API
  const handleProfileSubmit = async (data) => {
    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      if (data.phone) formData.append("phone", data.phone);
      if (data.bio) formData.append("bio", data.bio);

      const response = await api.put("/api/admin/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        // Update user in context
        updateUser(response.data.data);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Handle password change with API
  const handlePasswordSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await api.put("/api/admin/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (response.data.success) {
        toast.success("Password changed successfully!");
        passwordForm.reset();
      }
    } catch (error) {
      console.error("Password change error:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Handle site settings with API
  const handleSiteSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await api.put("/api/admin/site-settings", data);

      if (response.data.success) {
        toast.success("Site settings updated successfully!");
      }
    } catch (error) {
      console.error("Site settings error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update site settings"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Handle email settings with API
  const handleEmailSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await api.put("/api/admin/email-settings", data);

      if (response.data.success) {
        toast.success("Email settings updated successfully!");
      }
    } catch (error) {
      console.error("Email settings error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update email settings"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Handle image upload with API
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      setUploading(true);

      // Preview locally
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("fullName", user?.name || "");
      formData.append("email", user?.email || "");

      const response = await api.put("/api/admin/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Profile image updated successfully!");
        updateUser(response.data.data);
        await refreshUser();
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Password", icon: Lock },
    { id: "site", label: "Site Settings", icon: Settings },
    { id: "email", label: "Email Settings", icon: Mail },
    { id: "payment", label: "Payment Gateway", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Admin Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your profile and site configuration
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar Tabs */}
          <Card className="animate-fade-in-up animation-delay-100 lg:col-span-1 h-fit">
            <CardContent className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                          : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <Card className="animate-fade-in-up animation-delay-200">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                    className="space-y-6"
                  >
                    {/* Profile Image */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="h-24 w-24 ring-4 ring-primary-200">
                          <AvatarImage src={profileImage || user?.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-2xl">
                            {user?.name
                              ? user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)
                              : "AD"}
                          </AvatarFallback>
                        </Avatar>
                        {uploading && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="image-upload"
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          {uploading ? "Uploading..." : "Upload Photo"}
                        </Label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          JPG, PNG or GIF. Max size 2MB.
                        </p>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        {...profileForm.register("fullName")}
                        placeholder="Your full name"
                      />
                      {profileForm.formState.errors.fullName && (
                        <p className="text-sm text-danger-600 mt-1">
                          {profileForm.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...profileForm.register("email")}
                        placeholder="your@email.com"
                      />
                      {profileForm.formState.errors.email && (
                        <p className="text-sm text-danger-600 mt-1">
                          {profileForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        {...profileForm.register("phone")}
                        placeholder="+234 800 000 0000"
                      />
                      {profileForm.formState.errors.phone && (
                        <p className="text-sm text-danger-600 mt-1">
                          {profileForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Bio */}
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        {...profileForm.register("bio")}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-gradient-to-r from-primary-600 to-secondary-600"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <Card className="animate-fade-in-up animation-delay-200">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                    className="space-y-6"
                  >
                    {/* Current Password */}
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          {...passwordForm.register("currentPassword")}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="text-sm text-danger-600 mt-1">
                          {
                            passwordForm.formState.errors.currentPassword
                              .message
                          }
                        </p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          {...passwordForm.register("newPassword")}
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-sm text-danger-600 mt-1">
                          {passwordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...passwordForm.register("confirmPassword")}
                        placeholder="Confirm new password"
                      />
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-danger-600 mt-1">
                          {
                            passwordForm.formState.errors.confirmPassword
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-gradient-to-r from-primary-600 to-secondary-600"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Site Settings Tab */}
            {activeTab === "site" && (
              <Card className="animate-fade-in-up animation-delay-200">
                <CardHeader>
                  <CardTitle>Site Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={siteForm.handleSubmit(handleSiteSubmit)}
                    className="space-y-6"
                  >
                    <div>
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        {...siteForm.register("siteName")}
                        placeholder="TechAge Africa"
                      />
                      {siteForm.formState.errors.siteName && (
                        <p className="text-sm text-danger-600 mt-1">
                          {siteForm.formState.errors.siteName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="siteDescription">Site Description</Label>
                      <Textarea
                        id="siteDescription"
                        {...siteForm.register("siteDescription")}
                        placeholder="Brief description of your site..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="supportEmail">Support Email</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        {...siteForm.register("supportEmail")}
                        placeholder="support@example.com"
                      />
                      {siteForm.formState.errors.supportEmail && (
                        <p className="text-sm text-danger-600 mt-1">
                          {siteForm.formState.errors.supportEmail.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Controller
                        name="currency"
                        control={siteForm.control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NGN">NGN (₦)</SelectItem>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-gradient-to-r from-primary-600 to-secondary-600"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Settings
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Email Settings Tab */}
            {activeTab === "email" && (
              <Card className="animate-fade-in-up animation-delay-200">
                <CardHeader>
                  <CardTitle>Email Configuration (Resend)</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="smtpHost">SMTP Host</Label>
                        <Input
                          id="smtpHost"
                          {...emailForm.register("smtpHost")}
                          placeholder="smtp.resend.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="smtpPort">SMTP Port</Label>
                        <Input
                          id="smtpPort"
                          {...emailForm.register("smtpPort")}
                          placeholder="587"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="smtpUser">SMTP Username</Label>
                      <Input
                        id="smtpUser"
                        {...emailForm.register("smtpUser")}
                        placeholder="resend"
                      />
                    </div>

                    <div>
                      <Label htmlFor="smtpPassword">
                        SMTP Password / API Key
                      </Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        {...emailForm.register("smtpPassword")}
                        placeholder="Enter your Resend API key"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="fromEmail">From Email</Label>
                        <Input
                          id="fromEmail"
                          type="email"
                          {...emailForm.register("fromEmail")}
                          placeholder="noreply@example.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="fromName">From Name</Label>
                        <Input
                          id="fromName"
                          {...emailForm.register("fromName")}
                          placeholder="TechAge Africa"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-gradient-to-r from-primary-600 to-secondary-600"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Configuration
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Payment Gateway Tab */}
            {activeTab === "payment" && (
              <Card className="animate-fade-in-up animation-delay-200">
                <CardHeader>
                  <CardTitle>Payment Gateway (Paystack)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm mb-1">
                          Paystack Integration
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Your Paystack credentials are configured via
                          environment variables (.env file). Contact your
                          developer to update payment settings.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Status</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge className="bg-accent-600">Configured</Badge>
                      <p className="text-sm text-muted-foreground">
                        Paystack is active and accepting payments
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <Card className="animate-fade-in-up animation-delay-200">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Notification preferences coming soon! You'll be able to
                      manage email notifications for enrollments, reviews, and
                      revenue reports.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
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
      `}</style>
    </AdminLayout>
  );
};

export default AdminSettings;
