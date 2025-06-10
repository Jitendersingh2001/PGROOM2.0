import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import TenantNavbar from '@/components/tenant/TenantNavbar';
import TenantSidebar from '@/components/tenant/TenantSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  UserCircle, 
  Mail, 
  Phone, 
  Save, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Shield,
  Settings,
  User,
  KeyRound
} from 'lucide-react';
import { toast } from 'sonner';

const TenantProfile = () => {
  const { isAuthenticated, userRole } = useAuth();
  
  // Parse JWT token to get user data
  const getUserFromToken = () => {
    const token = localStorage.getItem('auth_token_encrypted');
    if (!token) return null;
    
    try {
      // Decrypt and parse token if needed
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken;
    } catch (error) {
      return null;
    }
  };

  const userData = getUserFromToken();
  
  // State for form data
  const [formData, setFormData] = useState({
    name: userData ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() : '',
    email: userData?.email || '',
    phone: userData?.mobileNo || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // State for UI interactions
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' or 'security'

  // Update form data when user data changes
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.firstName && userData.lastName 
          ? `${userData.firstName} ${userData.lastName}` 
          : userData.firstName || userData.lastName || '',
        email: userData.email || '',
        phone: userData.mobileNo || '',
      }));
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      // TODO: Implement profile update API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      toast.success('Personal information updated successfully');
    } catch (error) {
      toast.error('Failed to update personal information');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // Validate passwords
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement password change API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      toast.success('Password updated successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (userData?.firstName && userData?.lastName) {
      return (userData.firstName[0] + userData.lastName[0]).toUpperCase();
    }
    return userData?.email?.[0]?.toUpperCase() || 'U';
  };

  const tabVariants = {
    inactive: { opacity: 0.7, y: 2 },
    active: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout
      navbar={<TenantNavbar />}
      sidebar={<TenantSidebar />}
    >
      <motion.div 
        className="w-full max-w-[98%] mx-auto space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
              <p className="text-muted-foreground">Manage your account information and security settings</p>
            </div>
          </div>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Profile Avatar */}
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className="text-xl font-semibold bg-primary/20 text-primary">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h2 className="text-2xl font-bold">
                      {userData?.firstName && userData?.lastName 
                        ? `${userData.firstName} ${userData.lastName}` 
                        : userData?.firstName || userData?.lastName || 'User'}
                    </h2>
                  </div>
                  <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
                    <Mail className="h-4 w-4" />
                    {userData?.email || 'No email available'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Member since {userData?.iat ? new Date(userData.iat * 1000).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    }) : 'Recently'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <motion.button
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'personal' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('personal')}
              variants={tabVariants}
              animate={activeTab === 'personal' ? 'active' : 'inactive'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <User className="h-4 w-4" />
              Personal Info
            </motion.button>
            <motion.button
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'security' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('security')}
              variants={tabVariants}
              animate={activeTab === 'security' ? 'active' : 'inactive'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Shield className="h-4 w-4" />
              Security
            </motion.button>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'personal' && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Personal Information</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Update your personal details and contact information
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                          <UserCircle className="h-4 w-4 text-muted-foreground" />
                          Full Name
                        </Label>
                        <div className="relative group">
                          <Input
                            id="name"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="transition-all focus:shadow-md"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          Email Address
                        </Label>
                        <div className="relative group">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="transition-all focus:shadow-md"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          Phone Number
                        </Label>
                        <div className="relative group">
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="transition-all focus:shadow-md"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-end">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          type="submit" 
                          disabled={isLoading}
                          className="min-w-[120px]"
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <Save className="h-4 w-4" />
                            </motion.div>
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </motion.div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <KeyRound className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Security Settings</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Manage your password and account security
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="space-y-4">
                      {/* Current Password */}
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-sm font-medium flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          Current Password
                        </Label>
                        <div className="relative group">
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter your current password"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="pr-10 transition-all focus:shadow-md"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-medium flex items-center gap-2">
                          <KeyRound className="h-4 w-4 text-muted-foreground" />
                          New Password
                        </Label>
                        <div className="relative group">
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="pr-10 transition-all focus:shadow-md"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          Confirm New Password
                        </Label>
                        <div className="relative group">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="pr-10 transition-all focus:shadow-md"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        Password Requirements
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• At least 6 characters long</li>
                        <li>• Contains both letters and numbers</li>
                        <li>• Different from your current password</li>
                      </ul>
                    </div>

                    <Separator />

                    <div className="flex justify-end">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          type="submit" 
                          variant="outline"
                          disabled={isLoading}
                          className="min-w-[140px] border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <KeyRound className="h-4 w-4" />
                            </motion.div>
                          ) : (
                            <KeyRound className="h-4 w-4 mr-2" />
                          )}
                          {isLoading ? 'Updating...' : 'Update Password'}
                        </Button>
                      </motion.div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
};

export default TenantProfile;
