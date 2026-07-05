import { useEffect, useState, useCallback } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import { CartProvider } from "@/context/CartContext";
import { AdminDataProvider } from "@/context/AdminDataContext";
import CartDrawer from "@/components/CartDrawer";
import VideoLoader from "@/components/VideoLoader";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={Dashboard} />
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isAdmin = location === "/admin";
  const [loading, setLoading] = useState(!isAdmin);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleLoaderFinished = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <VideoLoader key="loader" onFinished={handleLoaderFinished} />
        )}
      </AnimatePresence>
      <CartProvider>
        <CartDrawer />
        <Toaster />
      </CartProvider>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminDataProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")} hashBased>
            <Router />
            <AppContent />
          </WouterRouter>
        </TooltipProvider>
      </AdminDataProvider>
    </QueryClientProvider>
  );
}

export default App;
