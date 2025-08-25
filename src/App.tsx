import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ClientAuthProvider } from "@/contexts/ClientAuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ClientProtectedRoute } from "@/components/ClientProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import CheckIn from "./pages/CheckIn";
import PartsService from "./pages/PartsService";
import CheckOut from "./pages/CheckOut";
import ClientPortal from "./pages/ClientPortal";
import CheckInComplete from "./pages/CheckInComplete";
import AuthConfirm from "./pages/AuthConfirm";
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ClientAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/confirm" element={<AuthConfirm />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/check-in" element={
                <ProtectedRoute>
                  <CheckIn />
                </ProtectedRoute>
              } />
              <Route path="/parts-service" element={
                <ProtectedRoute>
                  <PartsService />
                </ProtectedRoute>
              } />
              <Route path="/check-out" element={
                <ProtectedRoute>
                  <CheckOut />
                </ProtectedRoute>
              } />
              <Route 
                path="/client/:clientId" 
                element={
                  <ClientProtectedRoute>
                    <ClientPortal />
                  </ClientProtectedRoute>
                } 
              />
              <Route path="/check-in-complete/:clientNumber" element={<CheckInComplete />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ClientAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
