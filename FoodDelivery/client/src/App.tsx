import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { useState } from "react";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import TrackOrder from "@/pages/TrackOrder";
import Cart from "@/pages/Cart";
import Payment from "@/pages/Payment";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

function Router() {
  const [cartItems, setCartItems] = useState<Array<{ id: string; name: string; price: number; quantity: number; restaurant?: string }>>([]);
  const [appliedOffer, setAppliedOffer] = useState<{ id: string; title: string; description: string; discountValue: number } | null>(null);

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveFromCart(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  return (
    <Switch>
      <Route path="/profile" component={Profile} />
      <Route path="/track-order" component={TrackOrder} />
      <Route path="/admin" component={Admin} />
      <Route path="/cart">
        <Cart 
          items={cartItems} 
          onRemoveFromCart={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          appliedOffer={appliedOffer}
        />
      </Route>
      <Route path="/payment">
        <Payment 
          items={cartItems} 
          onClearCart={() => {
            setCartItems([]);
            setAppliedOffer(null);
          }} 
        />
      </Route>
      <Route path={/^\/$/}>
        <Home 
          cartItems={cartItems} 
          setCartItems={setCartItems} 
          appliedOffer={appliedOffer}
          setAppliedOffer={setAppliedOffer}
        />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
