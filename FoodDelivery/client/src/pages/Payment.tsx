import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, CreditCard, Smartphone, Banknote, Tag, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentProps {
  items?: Array<{ id: string; name: string; price: number; quantity: number }>;
  onClearCart?: () => void;
}

const validCoupons = {
  SAVE10: 50,
  FOOD50: 100,
};

export default function Payment({ items = [], onClearCart }: PaymentProps) {
  const [location, setLocation] = useLocation();
  const { addOrder } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi" | "banking">("cod");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const urlSubtotal = parseFloat(searchParams.get("subtotal") || "0");
  const urlTax = parseFloat(searchParams.get("tax") || "0");
  const urlDeliveryFee = parseFloat(searchParams.get("delivery") || "0");
  const urlOfferDiscount = parseFloat(searchParams.get("discount") || "0");
  const urlCartTotal = parseFloat(searchParams.get("total") || "0");

  const TAX_RATE = 0.05;
  const DELIVERY_FEE = 40;

  const itemsSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const subtotal = urlSubtotal > 0 ? urlSubtotal : itemsSubtotal;
  const tax = urlTax > 0 ? urlTax : itemsSubtotal * TAX_RATE;
  const deliveryFee = urlDeliveryFee >= 0 ? urlDeliveryFee : DELIVERY_FEE;
  const offerDiscount = urlOfferDiscount || 0;

  const orderTotal = urlCartTotal > 0 ? urlCartTotal : (subtotal + tax + deliveryFee - offerDiscount);
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(orderTotal - couponDiscount, 0);

  const handleApplyCoupon = () => {
    const upperCode = couponCode.toUpperCase() as keyof typeof validCoupons;
    if (validCoupons[upperCode]) {
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount: validCoupons[upperCode] });
    } else {
      setAppliedCoupon({ code: couponCode, discount: 0 });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handlePayment = () => {
    // Generate unique order ID
    const orderId = `ORD${Date.now().toString().slice(-6)}`;
    
    // Get current date and time
    const now = new Date();
    const deliveryDate = new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(now);
    const deliveryTime = new Intl.DateTimeFormat('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    }).format(new Date(now.getTime() + 30 * 60000)); // Estimated delivery in 30 mins
    
    // Get restaurant ID from admin profiles
    // For now, cycle through available restaurants to distribute orders fairly
    // In a real app, user would select which restaurant they're ordering from
    const adminProfiles = JSON.parse(localStorage.getItem('foodhub_admin_profiles') || '{}');
    const adminEmails = Object.keys(adminProfiles);
    
    let restaurantId: string | undefined;
    let restaurantName = "FoodHub";
    
    if (adminEmails.length > 0) {
      // Get last order index for round-robin distribution
      const lastOrderIndex = parseInt(localStorage.getItem('last_restaurant_order_index') || '0');
      const nextIndex = lastOrderIndex % adminEmails.length;
      const selectedEmail = adminEmails[nextIndex];
      
      restaurantId = adminProfiles[selectedEmail].restaurantId;
      restaurantName = adminProfiles[selectedEmail].restaurantName;
      
      // Update index for next order
      localStorage.setItem('last_restaurant_order_index', (nextIndex + 1).toString());
    }
    
    // Create order object
    const order = {
      id: orderId,
      items: items.map(item => `${item.name} (x${item.quantity})`),
      total: finalTotal,
      restaurant: restaurantName,
      restaurantId: restaurantId,
      status: "New" as const,
      deliveryDate,
      deliveryTime,
      paymentMethod,
      orderDate: now.toISOString(),
    };
    
    // Save order to logged-in user's record
    addOrder(order);
    
    setShowSuccessPopup(true);
    if (onClearCart) {
      onClearCart();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/cart")}
          className="mb-6 gap-2"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Button>

        <h1 className="text-3xl font-bold mb-6" data-testid="page-title">Payment</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between" data-testid={`payment-item-${item.id}`}>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Apply Coupon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!appliedCoupon ? (
                  <>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        data-testid="input-coupon"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={!couponCode}
                        data-testid="button-apply-coupon"
                      >
                        Apply
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Valid coupons: SAVE10 (₹50 off), FOOD50 (₹100 off)
                    </p>
                  </>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg" data-testid="applied-coupon">
                    <div>
                      <p className="font-medium text-green-700 dark:text-green-300">
                        {appliedCoupon.code} applied
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Discount: ₹{appliedCoupon.discount}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveCoupon}
                      data-testid="button-remove-coupon"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover-elevate" data-testid="payment-cod">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Banknote className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-xs text-muted-foreground">Pay when you receive</p>
                      </div>
                    </Label>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover-elevate" data-testid="payment-upi">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone className="h-5 w-5" />
                      <div>
                        <p className="font-medium">UPI</p>
                        <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                      </div>
                    </Label>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover-elevate" data-testid="payment-banking">
                    <RadioGroupItem value="banking" id="banking" />
                    <Label htmlFor="banking" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Debit/Credit Card or NetBanking</p>
                        <p className="text-xs text-muted-foreground">Visa, MasterCard, AmEx, etc.</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-lg">Payment Summary</h3>
                <Separator />
                <div className="space-y-2">
                  {subtotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                  )}
                  {tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                  )}
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>₹{deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  {offerDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Offer Discount</span>
                      <span>-₹{offerDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {subtotal === 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Order Total</span>
                      <span data-testid="payment-subtotal">₹{orderTotal.toFixed(2)}</span>
                    </div>
                  )}
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Coupon Discount</span>
                      <span data-testid="payment-discount">-₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <Separator />
                <div className="flex justify-between items-center font-bold text-xl">
                  <span>Total</span>
                  <span data-testid="payment-total">₹{finalTotal.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePayment}
                  data-testid="button-pay"
                >
                  Pay ₹{finalTotal.toFixed(2)}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccessPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowSuccessPopup(false)}
              data-testid="success-backdrop"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-background rounded-3xl shadow-2xl w-full max-w-md p-8 text-center"
              data-testid="success-popup"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <div className="w-24 h-24 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
              </motion.div>

              <h2 className="text-2xl font-bold mb-2" data-testid="success-title">Order placed successfully!</h2>
              <p className="text-muted-foreground mb-6">
                Your order has been placed. Thank you for ordering with FoodHub!
              </p>

              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setShowSuccessPopup(false);
                    setLocation("/");
                  }}
                  data-testid="button-order-more"
                >
                  Order More
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setShowSuccessPopup(false);
                    setLocation("/track-order");
                  }}
                  data-testid="button-track-order-success"
                >
                  Track Order
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
