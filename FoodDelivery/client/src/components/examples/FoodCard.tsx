import { FoodCard } from "../FoodCard";
import { foodItems } from "@/lib/mockData";

export default function FoodCardExample() {
  return (
    <div className="p-4">
      <FoodCard
        item={foodItems[0]}
        onAddToCart={(item) => console.log("Add to cart:", item)}
        onClick={(item) => console.log("View details:", item)}
      />
    </div>
  );
}
