import { CategorySection } from "../CategorySection";
import { foodItems } from "@/lib/mockData";

export default function CategorySectionExample() {
  const chineseItems = foodItems.filter(item => item.category === "Chinese");
  
  return (
    <CategorySection
      title="Chinese"
      items={chineseItems}
      onAddToCart={(item) => console.log("Add to cart:", item)}
      onItemClick={(item) => console.log("View details:", item)}
    />
  );
}
