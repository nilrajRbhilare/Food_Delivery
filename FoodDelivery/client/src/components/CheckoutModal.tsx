import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          data-testid="checkout-backdrop"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-background rounded-3xl shadow-2xl w-full max-w-md p-8 text-center"
          data-testid="checkout-modal"
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 z-10"
            onClick={onClose}
            data-testid="button-close-checkout"
          >
            <X className="h-5 w-5" />
          </Button>

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

          <h2 className="text-2xl font-bold mb-2" data-testid="checkout-title">Order Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Your order has been placed successfully. You'll receive a confirmation shortly.
          </p>

          <div className="space-y-3">
            <Button className="w-full" onClick={onClose} data-testid="button-continue-shopping">
              Continue Shopping
            </Button>
            <Button variant="outline" className="w-full" data-testid="button-track-order">
              Track Order
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
