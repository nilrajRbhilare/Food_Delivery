// TODO: remove mock functionality - This file contains static data for the prototype

import chineseNoodles1 from "@assets/stock_images/delicious_chinese_no_211115cc.jpg";
import chineseNoodles2 from "@assets/stock_images/delicious_chinese_no_a3677ed5.jpg";
import chineseNoodles3 from "@assets/stock_images/delicious_chinese_no_da77bf60.jpg";
import indianCurry1 from "@assets/stock_images/indian_curry_butter__568a69fb.jpg";
import indianCurry2 from "@assets/stock_images/indian_curry_butter__e4b04cd5.jpg";
import indianCurry3 from "@assets/stock_images/indian_curry_butter__30463c21.jpg";
import pizza1 from "@assets/stock_images/pizza_margherita_pep_0ae576a4.jpg";
import pizza2 from "@assets/stock_images/pizza_margherita_pep_a7aaee77.jpg";
import pizza3 from "@assets/stock_images/pizza_margherita_pep_a06c681f.jpg";
import iceCream1 from "@assets/stock_images/ice_cream_sundae_des_40597829.jpg";
import iceCream2 from "@assets/stock_images/ice_cream_sundae_des_4560c4ef.jpg";
import iceCream3 from "@assets/stock_images/ice_cream_sundae_des_28cf0bda.jpg";
import burger1 from "@assets/stock_images/burger_fries_fast_fo_a73a6c94.jpg";
import burger2 from "@assets/stock_images/burger_fries_fast_fo_675c48df.jpg";
import burger3 from "@assets/stock_images/burger_fries_fast_fo_8507c30e.jpg";
import salad1 from "@assets/stock_images/vegetarian_salad_hea_aa0ada6b.jpg";
import salad2 from "@assets/stock_images/vegetarian_salad_hea_e00145e2.jpg";
import gourmet1 from "@assets/stock_images/gourmet_fine_dining__b271a445.jpg";
import gourmet2 from "@assets/stock_images/gourmet_fine_dining__a87a57e6.jpg";

export interface FoodItem {
  id: string;
  name: string;
  restaurant: string;
  rating: number;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  offer?: string;
  description: string;
}

export const foodItems: FoodItem[] = [
  // Chinese
  { id: "1", name: "Hakka Noodles", restaurant: "Wok Express", rating: 4.5, price: 180, image: chineseNoodles1, category: "Chinese", isVeg: true, offer: "20% OFF", description: "Delicious stir-fried noodles with fresh vegetables and authentic Chinese spices" },
  { id: "2", name: "Chilli Chicken", restaurant: "Dragon Wok", rating: 4.3, price: 250, image: chineseNoodles2, category: "Chinese", isVeg: false, description: "Spicy chicken tossed in Indo-Chinese sauce with bell peppers" },
  { id: "3", name: "Veg Manchurian", restaurant: "China Town", rating: 4.2, price: 160, image: chineseNoodles3, category: "Chinese", isVeg: true, offer: "15% OFF", description: "Crispy vegetable balls in tangy Manchurian gravy" },
  
  // Indian
  { id: "4", name: "Butter Chicken", restaurant: "Tandoor House", rating: 4.7, price: 320, image: indianCurry1, category: "Indian", isVeg: false, description: "Creamy tomato-based curry with tender chicken pieces" },
  { id: "5", name: "Paneer Tikka Masala", restaurant: "Spice Garden", rating: 4.6, price: 280, image: indianCurry2, category: "Indian", isVeg: true, offer: "25% OFF", description: "Grilled cottage cheese in rich tomato gravy" },
  { id: "6", name: "Dal Makhani", restaurant: "Punjab Grill", rating: 4.5, price: 240, image: indianCurry3, category: "Indian", isVeg: true, description: "Slow-cooked black lentils with butter and cream" },
  
  // Pizza
  { id: "7", name: "Margherita Pizza", restaurant: "Pizza Hut", rating: 4.4, price: 299, image: pizza1, category: "Pizza", isVeg: true, offer: "Buy 1 Get 1", description: "Classic pizza with fresh mozzarella and basil" },
  { id: "8", name: "Pepperoni Pizza", restaurant: "Domino's", rating: 4.6, price: 399, image: pizza2, category: "Pizza", isVeg: false, description: "Loaded with pepperoni and cheese" },
  { id: "9", name: "Veggie Supreme", restaurant: "Pizza Corner", rating: 4.3, price: 349, image: pizza3, category: "Pizza", isVeg: true, description: "Loaded with fresh vegetables and herbs" },
  
  // Ice Cream
  { id: "10", name: "Chocolate Sundae", restaurant: "Baskin Robbins", rating: 4.8, price: 180, image: iceCream1, category: "Ice Cream", isVeg: true, description: "Rich chocolate ice cream with hot fudge and nuts" },
  { id: "11", name: "Strawberry Delight", restaurant: "Gelato Cafe", rating: 4.7, price: 150, image: iceCream2, category: "Ice Cream", isVeg: true, offer: "30% OFF", description: "Fresh strawberry ice cream with berry toppings" },
  { id: "12", name: "Cookie Crumble", restaurant: "Sweet Treats", rating: 4.5, price: 200, image: iceCream3, category: "Ice Cream", isVeg: true, description: "Vanilla ice cream with cookie chunks" },
  
  // Fast Food
  { id: "13", name: "Classic Burger", restaurant: "McDonald's", rating: 4.4, price: 120, image: burger1, category: "Fast Food", isVeg: false, description: "Juicy beef patty with fresh lettuce and cheese" },
  { id: "14", name: "Chicken Burger", restaurant: "KFC", rating: 4.5, price: 150, image: burger2, category: "Fast Food", isVeg: false, offer: "20% OFF", description: "Crispy fried chicken with special sauce" },
  { id: "15", name: "Veggie Burger", restaurant: "Subway", rating: 4.2, price: 110, image: burger3, category: "Fast Food", isVeg: true, description: "Fresh vegetables with cheese and mayo" },
  
  // Veg Restaurants
  { id: "16", name: "Greek Salad", restaurant: "Green Bowl", rating: 4.6, price: 220, image: salad1, category: "Veg", isVeg: true, description: "Fresh greens with feta cheese and olives" },
  { id: "17", name: "Caesar Salad", restaurant: "Veggie Delight", rating: 4.4, price: 200, image: salad2, category: "Veg", isVeg: true, offer: "15% OFF", description: "Crisp romaine with parmesan and croutons" },
  
  // Premium
  { id: "18", name: "Gourmet Steak", restaurant: "The Taj", rating: 4.9, price: 1200, image: gourmet1, category: "Premium", isVeg: false, description: "Premium cut steak with truffle sauce" },
  { id: "19", name: "Fine Dining Platter", restaurant: "Oberoi Grand", rating: 4.8, price: 1500, image: gourmet2, category: "Premium", isVeg: false, offer: "10% OFF", description: "Exquisite multi-course fine dining experience" },
];

export const categories = [
  { id: "chinese", name: "Chinese", icon: "🍜" },
  { id: "indian", name: "Indian", icon: "🍛" },
  { id: "pizza", name: "Pizza & Fast Food", icon: "🍕" },
  { id: "icecream", name: "Ice Creams", icon: "🍦" },
  { id: "brands", name: "Popular Brands", icon: "🍔" },
  { id: "veg", name: "Only Veg", icon: "🌱" },
  { id: "premium", name: "Premium Dining", icon: "⭐" },
];

export const offers = [
  { id: "1", title: "50% OFF up to ₹100", description: "Use code FOOD50", image: pizza1 },
  { id: "2", title: "Free Delivery", description: "On orders above ₹200", image: burger1 },
  { id: "3", title: "Buy 1 Get 1 Free", description: "On selected items", image: iceCream1 },
  { id: "4", title: "30% OFF", description: "First order discount", image: indianCurry1 },
];

export const searchSuggestions = [
  "Pizza", "Burger", "Biryani", "Chinese", "Ice Cream", 
  "McDonald's", "KFC", "Domino's", "Butter Chicken", "Noodles"
];

export const savedAddresses = [
  { id: "1", label: "Home", address: "123 Main Street, Downtown" },
  { id: "2", label: "Work", address: "456 Business Park, Tech Hub" },
];
