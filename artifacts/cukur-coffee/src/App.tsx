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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    // Finish loading immediately when component mounts
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLoaderFinished = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AdminDataProvider>
        <TooltipProvider>
          <AnimatePresence mode="wait">
            {loading ? (
              <VideoLoader key="loader" onFinished={handleLoaderFinished} />
            ) : (
              <CartProvider key="content">
                <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")} hashBased>
                  <Router />
                </WouterRouter>
                <CartDrawer />
                <Toaster />
              </CartProvider>
            )}
          </AnimatePresence>
        </TooltipProvider>
      </AdminDataProvider>
    </QueryClientProvider>
  );
}

export default App;
