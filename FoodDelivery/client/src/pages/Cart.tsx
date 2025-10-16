import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Minus, Plus, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurant?: string;
}

interface CartProps {
  items: CartItem[];
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  appliedOffer?: { id: string; title: string; description: string; discountValue: number } | null;
}

export default function Cart({ items, onRemoveFromCart, onUpdateQuantity, appliedOffer }: CartProps) {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const TAX_RATE = 0.05;
  const DELIVERY_FEE = 40;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const deliveryFee = appliedOffer?.title.includes("Free Delivery") ? 0 : DELIVERY_FEE;
  const offerDiscount = appliedOffer?.discountValue 
    ? Math.min((subtotal * appliedOffer.discountValue) / 100, 100)
    : 0;
  const total = Math.max(subtotal + tax + deliveryFee - offerDiscount, 0);

  const handleOrderClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setLocation(`/payment?subtotal=${subtotal}&tax=${tax}&delivery=${deliveryFee}&discount=${offerDiscount}&total=${total}`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-6 gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>

          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2" data-testid="empty-cart-title">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add items to get started</p>
            <Button onClick={() => setLocation("/")} data-testid="button-browse-menu">
              Browse Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6 gap-2"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <h1 className="text-3xl font-bold mb-6" data-testid="page-title">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} data-testid={`cart-item-${item.id}`}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1" data-testid={`item-name-${item.id}`}>{item.name}</h3>
                      {item.restaurant && (
                        <p className="text-sm text-muted-foreground mb-2">{item.restaurant}</p>
                      )}
                      <p className="font-bold" data-testid={`item-price-${item.id}`}>₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium" data-testid={`quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onRemoveFromCart(item.id)}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-lg">Order Summary</h3>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span data-testid="cart-subtotal">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (5%)</span>
                    <span data-testid="cart-tax">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span data-testid="cart-delivery-fee">₹{deliveryFee}</span>
                  </div>
                  {offerDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Offer Discount</span>
                      <span data-testid="cart-offer-discount">-₹{offerDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <Separator />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span data-testid="cart-total">₹{total.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleOrderClick}
                  data-testid="button-order"
                >
                  Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
