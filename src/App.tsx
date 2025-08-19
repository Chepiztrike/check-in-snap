import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import CheckIn from "./pages/CheckIn";
import PartsService from "./pages/PartsService";
import CheckOut from "./pages/CheckOut";
import ClientPortal from "./pages/ClientPortal";
import CheckInComplete from "./pages/CheckInComplete";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={
              <ProtectedRoute>
                <Login />
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
            <Route path="/client/:clientId" element={<ClientPortal />} />
            <Route path="/check-in-complete/:clientNumber" element={<CheckInComplete />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
