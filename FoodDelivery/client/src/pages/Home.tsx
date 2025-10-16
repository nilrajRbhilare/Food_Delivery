import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { FilterBar, FilterState } from "@/components/FilterBar";
import { CategorySection } from "@/components/CategorySection";
import { FoodDetailModal } from "@/components/FoodDetailModal";
import { BackToTop } from "@/components/BackToTop";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useData, MenuItem } from "@/contexts/DataContext";
import { type FoodItem } from "@/lib/mockData";

interface CartItem extends FoodItem {
  quantity: number;
}

interface HomeProps {
  cartItems: Array<{ id: string; name: string; price: number; quantity: number; restaurant?: string }>;
  setCartItems: React.Dispatch<React.SetStateAction<Array<{ id: string; name: string; price: number; quantity: number; restaurant?: string }>>>;
  appliedOffer: { id: string; title: string; description: string; discountValue: number } | null;
  setAppliedOffer: React.Dispatch<React.SetStateAction<{ id: string; title: string; description: string; discountValue: number } | null>>;
}

export default function Home({ cartItems, setCartItems, appliedOffer, setAppliedOffer }: HomeProps) {
  const { menuItems, isInitialized } = useData();
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    vegOnly: false,
    priceRange: "all",
    nearby: false,
    rating: "all",
    hasOffers: false,
    sortBy: "default",
  });

  // Loading is true only when data hasn't been initialized yet
  const loading = !isInitialized;

  const handleAddToCart = (item: FoodItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1, restaurant: item.restaurant }];
    });
  };

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

  // Convert MenuItem to FoodItem format and filter available items only
  const availableFoodItems: FoodItem[] = menuItems
    .filter(item => item.available)
    .map(item => ({
      id: item.id,
      name: item.name,
      restaurant: item.restaurantName,
      rating: item.rating,
      price: item.price,
      image: item.image,
      category: item.category,
      isVeg: item.isVeg,
      offer: item.offer,
      description: item.description
    }));

  // Filter and sort food items
  const filteredItems = availableFoodItems.filter((item) => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.category.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.vegOnly && !item.isVeg) return false;
    if (filters.priceRange !== "all" && item.price > parseInt(filters.priceRange)) return false;
    if (filters.rating === "4+" && item.rating < 4) return false;
    if (filters.rating === "4.5+" && item.rating < 4.5) return false;
    if (filters.hasOffers && !item.offer) return false;
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (filters.sortBy === "priceLow") return a.price - b.price;
    if (filters.sortBy === "priceHigh") return b.price - a.price;
    return 0;
  });

  const categories = [
    { id: "chinese", name: "Chinese", items: sortedItems.filter(i => i.category === "Chinese") },
    { id: "indian", name: "Indian", items: sortedItems.filter(i => i.category === "Indian") },
    { id: "pizza", name: "Pizza & Fast Food", items: sortedItems.filter(i => i.category === "Pizza" || i.category === "Fast Food") },
    { id: "icecream", name: "Ice Creams", items: sortedItems.filter(i => i.category === "Ice Cream") },
    { id: "brands", name: "Popular Brands", items: sortedItems.filter(i => ["McDonald's", "KFC", "Domino's", "Subway", "Pizza Hut", "Baskin Robbins"].includes(i.restaurant)) },
    { id: "veg", name: "Only Veg", items: sortedItems.filter(i => i.isVeg) },
    { id: "premium", name: "Premium Dining", items: sortedItems.filter(i => i.category === "Premium") },
  ];

  const cartItemsForNav = cartItems.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));

  const handleClearCart = () => {
    setCartItems([]);
    setAppliedOffer(null);
  };

  if (loading) {
    return (
      <>
        <Navbar
          cartItems={[]}
          onRemoveFromCart={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onApplyOffer={setAppliedOffer}
          appliedOffer={appliedOffer}
          onClearCart={handleClearCart}
        />
        <FilterBar filters={filters} onFilterChange={setFilters} />
        <LoadingSkeleton />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        cartItems={cartItemsForNav}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onApplyOffer={setAppliedOffer}
        appliedOffer={appliedOffer}
        onClearCart={handleClearCart}
      />
      
      <FilterBar filters={filters} onFilterChange={setFilters} />

      <main>
        {categories.map((category) => (
          category.items.length > 0 && (
            <CategorySection
              key={category.id}
              title={category.name}
              items={category.items}
              onAddToCart={handleAddToCart}
              onItemClick={setSelectedFood}
            />
          )
        ))}

        {categories.every(cat => cat.items.length === 0) && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 text-center">
            <p className="text-xl text-muted-foreground">No items match your filters</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters to see more options</p>
          </div>
        )}
      </main>

      <FoodDetailModal
        item={selectedFood}
        isOpen={!!selectedFood}
        onClose={() => setSelectedFood(null)}
        onAddToCart={handleAddToCart}
      />

      <BackToTop />
    </div>
  );
}
