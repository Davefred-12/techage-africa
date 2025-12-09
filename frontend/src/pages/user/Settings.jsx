// ============================================
// FILE: src/pages/user/Settings.jsx - REAL API
// ============================================
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useAuth } from '../../context/authContext';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Lock,
  Upload,
  CheckCircle,
  Eye,
  EyeOff,
  Bell,
  Shield,
  Loader2,
} from 'lucide-react';

// Validation schemas
const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  bio: z.string().max(200, 'Bio must be less than 200 characters').optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { user, updateUser, refreshUser } = useAuth();

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    },
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  // ✅ Handle profile update
  const handleProfileUpdate = async (data) => {
    try {
      setIsUpdating(true);
      const response = await api.put('/api/user/profile', data);

      if (response.data.success) {
        updateUser(response.data.data);
        await refreshUser();
        setSuccessMessage('Profile updated successfully!');
        toast.success('Profile updated!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  // ✅ Handle password change
  const handlePasswordChange = async (data) => {
    try {
      setIsUpdating(true);
      const response = await api.put('/api/user/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (response.data.success) {
        setSuccessMessage('Password changed successfully!');
        toast.success('Password changed!');
        resetPasswordForm();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsUpdating(false);
    }
  };

  // ✅ Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    try {
      setUploading(true);

      // Upload to server
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.put('/api/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Profile image updated successfully!');
        
        // ✅ Update local state immediately
        setProfileImage(response.data.data.avatar);
        
        // ✅ Update context
        updateUser(response.data.data);
        
        // ✅ Refresh from server to ensure sync
        await refreshUser();
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Profile & Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg flex items-center gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-accent-600" />
            <p className="text-sm text-accent-700 dark:text-accent-400">
              {successMessage}
            </p>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in-up animation-delay-200">
          <TabsList className="grid w-full md:w-auto grid-cols-3 gap-2">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            {/* Profile Picture */}
            <Card className="animate-fade-in-up animation-delay-300">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <Avatar className="h-32 w-32 ring-4 ring-primary-500 ring-offset-4 ring-offset-background">
                    <AvatarImage src={profileImage || user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-700 text-white text-4xl font-bold">
                      {getInitials(user?.name || 'User')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3 text-center md:text-left">
                    <p className="text-sm text-muted-foreground">
                      Upload a new profile picture. Recommended size: 400x400px
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <label htmlFor="avatar-upload">
                        <Button variant="outline" className="cursor-pointer" asChild disabled={uploading}>
                          <span>
                            {uploading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Photo
                              </>
                            )}
                          </span>
                        </Button>
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                      <Button variant="ghost" onClick={() => setProfileImage('')}>
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Information */}
            <Card className="animate-fade-in-up animation-delay-400">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitProfile(handleProfileUpdate)} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          {...registerProfile('fullName')}
                          placeholder="John Doe"
                          className={`pl-10 ${profileErrors.fullName ? 'border-danger-500' : ''}`}
                        />
                      </div>
                      {profileErrors.fullName && (
                        <p className="text-sm text-danger-600 mt-1">
                          {profileErrors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          {...registerProfile('email')}
                          type="email"
                          placeholder="john@example.com"
                          className={`pl-10 ${profileErrors.email ? 'border-danger-500' : ''}`}
                        />
                      </div>
                      {profileErrors.email && (
                        <p className="text-sm text-danger-600 mt-1">
                          {profileErrors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number (Optional)
                    </label>
                    <Input
                      {...registerProfile('phone')}
                      placeholder="+234 123 456 7890"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Bio (Optional)
                    </label>
                    <textarea
                      {...registerProfile('bio')}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    />
                    {profileErrors.bio && (
                      <p className="text-sm text-danger-600 mt-1">
                        {profileErrors.bio.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" disabled={isUpdating} className="w-full md:w-auto">
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 mt-6">
            <Card className="animate-fade-in-up animation-delay-300">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPassword(handlePasswordChange)} className="space-y-5">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        {...registerPassword('currentPassword')}
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="Enter current password"
                        className={`pl-10 pr-10 ${passwordErrors.currentPassword ? 'border-danger-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-sm text-danger-600 mt-1">
                        {passwordErrors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        {...registerPassword('newPassword')}
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Min. 8 characters"
                        className={`pl-10 pr-10 ${passwordErrors.newPassword ? 'border-danger-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-sm text-danger-600 mt-1">
                        {passwordErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        {...registerPassword('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter new password"
                        className={`pl-10 pr-10 ${passwordErrors.confirmPassword ? 'border-danger-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-sm text-danger-600 mt-1">
                        {passwordErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">Password requirements:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>At least 8 characters</li>
                      <li>Include uppercase and lowercase letters</li>
                      <li>Include at least one number</li>
                    </ul>
                  </div>

                  <Button type="submit" disabled={isUpdating} className="w-full md:w-auto">
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Changing Password...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card className="animate-fade-in-up animation-delay-300">
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Course Updates', description: 'Get notified about new lessons and course updates' },
                  { label: 'Progress Reports', description: 'Weekly reports about your learning progress' },
                  { label: 'Certificates', description: 'Notifications when you earn a certificate' },
                  { label: 'Promotions', description: 'Special offers and discounts on courses' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
      `}</style>
    </DashboardLayout>
  );
};

export default Settings;