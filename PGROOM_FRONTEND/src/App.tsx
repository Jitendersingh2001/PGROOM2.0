
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

                {/* Protected routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute allowedRoles={[1]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
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
                <Route path="/tenant/dashboard" element={
                  <ProtectedRoute allowedRoles={[3]}>
                    <TenantDashboard />
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
