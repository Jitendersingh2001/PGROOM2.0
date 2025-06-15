import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import TenantNavbar from '@/components/tenant/TenantNavbar';
import TenantSidebar from '@/components/tenant/TenantSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  KeyRound,
  Edit,
  X
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
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

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
      setIsEditingProfile(false); // Exit edit mode after successful save
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
      setIsEditingPassword(false); // Exit edit mode after successful save
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelProfileEdit = () => {
    setIsEditingProfile(false);
    // Reset form data to original values
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
  };

  return (
    <DashboardLayout
      navbar={<TenantNavbar />}
      sidebar={<TenantSidebar />}
    >
      <div className="w-full px-6 lg:px-8 space-y-6">
        {/* Modern Header Section - Full Width */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary via-green-600 to-emerald-700 dark:from-primary dark:via-green-500 dark:to-emerald-600 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">
                    Profile Settings
                  </h1>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2 text-green-200">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">Manage your account information</span>
                    </div>
                    <div className="flex items-start gap-2 text-green-200">
                      <Shield className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span className="text-xs leading-relaxed">Update personal details and security settings</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-4">
                <Badge variant="outline" className="bg-green-50/20 text-green-100 border-green-300/40 px-4 py-2 text-sm font-medium">
                  Tenant Profile
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Settings Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Profile Information Card - Left Side */}
          <Card className="xl:col-span-2 overflow-hidden shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <User className="h-6 w-6 text-primary" />
                  Personal Information
                </CardTitle>
                <div className="flex items-center gap-2">
                  {!isEditingProfile ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleCancelProfileEdit}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6">
                <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Full Name */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Full Name</span>
                      </div>
                      <div className="flex-1 ml-4">
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="border-0 bg-transparent p-0 text-right font-semibold focus:ring-0"
                          disabled={isLoading || !isEditingProfile}
                          readOnly={!isEditingProfile}
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Email Address</span>
                      </div>
                      <div className="flex-1 ml-4">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="border-0 bg-transparent p-0 text-right font-semibold focus:ring-0"
                          disabled={isLoading || !isEditingProfile}
                          readOnly={!isEditingProfile}
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg md:col-span-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Phone Number</span>
                      </div>
                      <div className="flex-1 ml-4">
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="border-0 bg-transparent p-0 text-right font-semibold focus:ring-0"
                          disabled={isLoading || !isEditingProfile}
                          readOnly={!isEditingProfile}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {isEditingProfile && (
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="min-w-[120px]"
                      >
                        {isLoading ? (
                          <>
                            <Save className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings - Right Side */}
          <div className="xl:col-span-1 space-y-6">
            {/* Security Settings */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <KeyRound className="h-6 w-6 text-primary" />
                    Security Settings
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {!isEditingPassword ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditingPassword(true)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setIsEditingPassword(false);
                            setFormData(prev => ({
                              ...prev,
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: ''
                            }));
                          }}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!isEditingPassword ? (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-muted-foreground mb-2">Password Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Click "Edit" to change your password and security settings
                      </p>
                    </div>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        <span>Password is secure and protected</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Shield className="h-3 w-3 text-emerald-500" />
                        <span>Account security is active</span>
                      </div>
                    </div>
                  </div>
                ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-4">
                    {/* Current Password */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Current Password</span>
                      </div>
                      <div className="flex-1 ml-4 relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter current password"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="border-0 bg-transparent p-0 text-right font-semibold focus:ring-0 pr-8"
                          disabled={isLoading || !isEditingPassword}
                          readOnly={!isEditingPassword}
                        />
                        <button
                          type="button"
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          disabled={!isEditingPassword}
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
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">New Password</span>
                      </div>
                      <div className="flex-1 ml-4 relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="border-0 bg-transparent p-0 text-right font-semibold focus:ring-0 pr-8"
                          disabled={isLoading || !isEditingPassword}
                          readOnly={!isEditingPassword}
                        />
                        <button
                          type="button"
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          disabled={!isEditingPassword}
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
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Confirm Password</span>
                      </div>
                      <div className="flex-1 ml-4 relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="border-0 bg-transparent p-0 text-right font-semibold focus:ring-0 pr-8"
                          disabled={isLoading || !isEditingPassword}
                          readOnly={!isEditingPassword}
                        />
                        <button
                          type="button"
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={!isEditingPassword}
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

                  <Separator />

                  {/* Password Requirements - Only show when editing */}
                  {isEditingPassword && (
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <h4 className="text-sm font-medium mb-3 flex items-center justify-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        Password Requirements
                      </h4>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          <span>At least 6 characters long</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          <span>Contains letters and numbers</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          <span>Different from current password</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {isEditingPassword && (
                    <div className="flex justify-center">
                      <Button 
                        type="submit" 
                        variant="outline"
                        disabled={isLoading}
                        className="min-w-[140px] border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        {isLoading ? (
                          <>
                            <KeyRound className="h-4 w-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <KeyRound className="h-4 w-4 mr-2" />
                            Update Password
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TenantProfile;
