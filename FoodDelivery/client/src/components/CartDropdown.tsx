import { X, Minus, Plus, ShoppingBag, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  appliedOffer?: { id: string; title: string; description: string; discountValue: number } | null;
}

export function CartDropdown({ isOpen, onClose, items, total, onRemoveItem, onUpdateQuantity, appliedOffer }: CartDropdownProps) {
  const [, setLocation] = useLocation();
  
  const TAX_RATE = 0.05;
  const DELIVERY_FEE = 40;

  const subtotal = total;
  const tax = subtotal * TAX_RATE;
  const deliveryFee = appliedOffer?.title.includes("Free Delivery") ? 0 : DELIVERY_FEE;
  
  const offerDiscount = appliedOffer?.discountValue 
    ? Math.min((subtotal * appliedOffer.discountValue) / 100, 100)
    : 0;
  
  const grandTotal = Math.max(subtotal + tax + deliveryFee - offerDiscount, 0);

  const handleViewCart = () => {
    onClose();
    setLocation("/cart");
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} data-testid="cart-backdrop" />
      <AnimatePresence>
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-full sm:w-96 bg-background shadow-2xl z-50 flex flex-col"
          data-testid="cart-dropdown"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-lg">Your Cart</h3>
            <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-cart">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag className="h-20 w-20 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Add items to get started</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-card rounded-lg" data-testid={`cart-item-${item.id}`}>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                      <p className="text-sm font-semibold">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        data-testid={`button-decrease-${item.id}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium" data-testid={`quantity-${item.id}`}>{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        data-testid={`button-increase-${item.id}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => onRemoveItem(item.id)}
                      data-testid={`button-remove-${item.id}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t p-4 space-y-3">
                {appliedOffer && (
                  <div className="flex items-center gap-2 p-2 bg-accent/10 rounded-lg" data-testid="applied-offer">
                    <Tag className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{appliedOffer.title}</p>
                      <p className="text-xs text-muted-foreground">{appliedOffer.description}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
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
                    <span data-testid="cart-delivery-fee">
                      {deliveryFee === 0 ? <Badge variant="outline" className="text-xs">FREE</Badge> : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {offerDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Offer Discount</span>
                      <span data-testid="cart-offer-discount">-₹{offerDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total</span>
                  <span data-testid="cart-total">₹{grandTotal.toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleViewCart}
                  data-testid="button-view-cart"
                >
                  View Cart
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
