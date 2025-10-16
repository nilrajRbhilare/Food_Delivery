import { X, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import type { FoodItem } from "@/lib/mockData";
import { useState } from "react";

interface FoodDetailModalProps {
  item: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: FoodItem) => void;
}

export function FoodDetailModal({ item, isOpen, onClose, onAddToCart }: FoodDetailModalProps) {
  const [comment, setComment] = useState("");

  if (!item || !isOpen) return null;

  const handleAddToCart = () => {
    onAddToCart(item);
    if (comment) {
      console.log("Order comment:", comment);
    }
    setComment("");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          data-testid="food-detail-backdrop"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-background rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          data-testid="food-detail-modal"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 z-10"
            data-testid="button-close-detail"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {item.offer && (
              <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground text-sm">
                {item.offer}
              </Badge>
            )}
          </div>

          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h2 className="text-2xl font-bold mb-1" data-testid="detail-food-name">{item.name}</h2>
                  <p className="text-muted-foreground" data-testid="detail-restaurant">{item.restaurant}</p>
                </div>
                {item.isVeg && (
                  <div className="h-6 w-6 border-2 border-green-600 flex items-center justify-center bg-white rounded-sm flex-shrink-0">
                    <div className="h-3 w-3 bg-green-600 rounded-full"></div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold" data-testid="detail-rating">{item.rating}</span>
                </div>
                <div className="text-2xl font-bold" data-testid="detail-price">₹{item.price}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground" data-testid="detail-description">{item.description}</p>
            </div>

            <div>
              <Label htmlFor="comment" className="mb-2 block">Add a comment (optional)</Label>
              <Textarea
                id="comment"
                placeholder="Any special instructions or preferences..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
                data-testid="input-comment"
              />
            </div>

            <Button
              className="w-full gap-2"
              size="lg"
              onClick={handleAddToCart}
              data-testid="button-add-to-cart-detail"
            >
              <Plus className="h-5 w-5" />
              Add to Cart - ₹{item.price}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
