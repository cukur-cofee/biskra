import { useEffect, useState, useCallback } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
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

function App() {
  // Support both direct pathname and hash-based routing
  const pathname = window.location.pathname;
  const isAdmin = pathname.includes("/admin") || window.location.hash === "#/admin";
  const [loading, setLoading] = useState(!isAdmin);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    
    // Handle redirect from 404.html with query parameter
    const params = new URLSearchParams(window.location.search);
    const redirectPath = params.get('p');
    
    if (redirectPath && redirectPath !== '/') {
      // Update the URL without reloading
      window.history.replaceState(null, '', window.location.pathname.replace(/\/$/, '') + redirectPath);
    }
  }, []);

  const handleLoaderFinished = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AdminDataProvider>
        <TooltipProvider>
          <AnimatePresence>
            {loading && (
              <VideoLoader key="loader" onFinished={handleLoaderFinished} />
            )}
          </AnimatePresence>
          <CartProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <CartDrawer />
            <Toaster />
          </CartProvider>
        </TooltipProvider>
      </AdminDataProvider>
    </QueryClientProvider>
  );
}

export default App;
