import { FoodDetailModal } from "../FoodDetailModal";
import { foodItems } from "@/lib/mockData";

export default function FoodDetailModalExample() {
  return (
    <FoodDetailModal
      item={foodItems[0]}
      isOpen={true}
      onClose={() => console.log("Close modal")}
      onAddToCart={(item) => console.log("Add to cart:", item)}
    />
  );
}
