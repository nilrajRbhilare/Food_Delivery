import { Navbar } from "../Navbar";

export default function NavbarExample() {
  const cartItems = [
    { id: "1", name: "Margherita Pizza", price: 299, quantity: 2 },
    { id: "2", name: "Butter Chicken", price: 320, quantity: 1 },
  ];

  return (
    <Navbar
      cartItems={cartItems}
      onRemoveFromCart={(id) => console.log("Remove:", id)}
      onUpdateQuantity={(id, qty) => console.log("Update:", id, qty)}
    />
  );
}
