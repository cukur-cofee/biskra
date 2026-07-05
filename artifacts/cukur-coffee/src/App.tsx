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
  const isAdmin = window.location.pathname.endsWith("/admin");
  const [loading, setLoading] = useState(!isAdmin);

  useEffect(() => {
    document.documentElement.classList.add("dark");
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
