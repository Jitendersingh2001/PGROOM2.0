import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocationProvider } from "@/contexts/LocationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./pages/admin/Dashboard";
import OwnerDashboard from "./pages/owner/Dashboard";
import OwnerProperties from "./pages/owner/Properties";
import OwnerRooms from "./pages/owner/Rooms";
import OwnerTenants from "./pages/owner/Tenants";
import OwnerPayments from "./pages/owner/Payments";
import OwnerSupport from "./pages/owner/Support";
import TenantDashboard from "./pages/tenant/Dashboard";
import TenantRoom from "./pages/tenant/Room";
import TenantPayments from "./pages/tenant/Payments";
import TenantMaintenance from "./pages/tenant/Maintenance";
import TenantDocuments from "./pages/tenant/Documents";
import TenantProfile from "./pages/tenant/Profile";
import TenantSupport from "./pages/tenant/Support.tsx";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LocationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Login isRegisterRoute={true} />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Protected Admin routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute allowedRoles={[1]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />

                {/* Protected Owner routes */}
                <Route path="/owner/dashboard" element={
                  <ProtectedRoute allowedRoles={[2]}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/owner/properties" element={
                  <ProtectedRoute allowedRoles={[2]}>
                    <OwnerProperties />
                  </ProtectedRoute>
                } />
                <Route path="/owner/properties/:propertyId/rooms" element={
                  <ProtectedRoute allowedRoles={[2]}>
                    <OwnerRooms />
                  </ProtectedRoute>
                } />
                <Route path="/owner/tenants" element={
                  <ProtectedRoute allowedRoles={[2]}>
                    <OwnerTenants />
                  </ProtectedRoute>
                } />
                <Route path="/owner/payments" element={
                  <ProtectedRoute allowedRoles={[2]}>
                    <OwnerPayments />
                  </ProtectedRoute>
                } />
                <Route path="/owner/support" element={
                  <ProtectedRoute allowedRoles={[2]}>
                    <OwnerSupport />
                  </ProtectedRoute>
                } />

                {/* Protected Tenant routes */}
                <Route path="/tenant/dashboard" element={
                  <ProtectedRoute allowedRoles={[3]}>
                    <TenantDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/tenant/room" element={
                  <ProtectedRoute allowedRoles={[3]}>
                    <TenantRoom />
                  </ProtectedRoute>
                } />
                <Route path="/tenant/payments" element={
                  <ProtectedRoute allowedRoles={[3]}>
                    <TenantPayments />
                  </ProtectedRoute>
                } />
                <Route path="/tenant/maintenance" element={
                  <ProtectedRoute allowedRoles={[3]}>
                    <TenantMaintenance />
                  </ProtectedRoute>
                } />
                <Route path="/tenant/documents" element={
                  <ProtectedRoute allowedRoles={[3]}>
                    <TenantDocuments />
                  </ProtectedRoute>
                } />
                <Route path="/tenant/profile" element={
                  <ProtectedRoute allowedRoles={[3]}>
                    <TenantProfile />
                  </ProtectedRoute>
                } />
                <Route path="/tenant/support" element={
                  <ProtectedRoute allowedRoles={[3]}>
                    <TenantSupport />
                  </ProtectedRoute>
                } />

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </LocationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
