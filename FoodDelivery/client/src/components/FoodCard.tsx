import { Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import type { FoodItem } from "@/lib/mockData";

interface FoodCardProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem) => void;
  onClick: (item: FoodItem) => void;
}

export function FoodCard({ item, onAddToCart, onClick }: FoodCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="overflow-hidden cursor-pointer group flex-shrink-0 w-72 hover-elevate"
        onClick={() => onClick(item)}
        data-testid={`food-card-${item.id}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {item.offer && (
            <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground" data-testid={`offer-badge-${item.id}`}>
              {item.offer}
            </Badge>
          )}
          {item.isVeg && (
            <div className="absolute top-3 left-3 h-5 w-5 border-2 border-green-600 flex items-center justify-center bg-white rounded-sm">
              <div className="h-2.5 w-2.5 bg-green-600 rounded-full"></div>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate" data-testid={`food-name-${item.id}`}>{item.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{item.restaurant}</p>
            </div>
            <Button
              size="icon"
              className="flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(item);
              }}
              data-testid={`button-add-${item.id}`}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="font-medium text-sm" data-testid={`rating-${item.id}`}>{item.rating}</span>
            </div>
            <span className="font-bold" data-testid={`price-${item.id}`}>₹{item.price}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
