import { useState } from "react";
import { MapPin, Search, Tag, ShoppingCart, User, Menu, LogOut, UserCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationDropdown } from "./LocationDropdown";
import { SearchBar } from "./SearchBar";
import { OffersModal } from "./OffersModal";
import { AuthModal } from "./AuthModal";
import { CartDropdown } from "./CartDropdown";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  cartItems: Array<{ id: string; name: string; price: number; quantity: number }>;
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onApplyOffer: (offer: { id: string; title: string; description: string; discountValue: number }) => void;
  appliedOffer: { id: string; title: string; description: string; discountValue: number } | null;
  onClearCart?: () => void;
}

export function Navbar({ cartItems, onRemoveFromCart, onUpdateQuantity, searchQuery, onSearchChange, onApplyOffer, appliedOffer, onClearCart }: NavbarProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Select Location");

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleLogout = () => {
    logout();
    if (onClearCart) {
      onClearCart();
    }
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            <div className="flex items-center gap-4 md:gap-6">
              <h1 className="text-xl md:text-2xl font-bold text-primary" data-testid="logo">FoodHub</h1>
              
              <div className="hidden md:block relative">
                <Button
                  variant="outline"
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="gap-2 min-w-[200px] justify-start"
                  data-testid="button-location"
                >
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{selectedLocation}</span>
                </Button>
              </div>
            </div>

            <div className="hidden lg:block flex-1 max-w-xl">
              <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <ThemeToggle />
              
              <Button
                variant="ghost"
                onClick={() => setShowOffersModal(true)}
                className="gap-2 hidden sm:flex"
                data-testid="button-offers"
              >
                <Tag className="h-4 w-4" />
                <span className="hidden md:inline">Offers</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => setLocation("/track-order")}
                className="gap-2 hidden sm:flex"
                data-testid="button-track-order"
              >
                <Package className="h-4 w-4" />
                <span className="hidden md:inline">Track Order</span>
              </Button>

              {!isAuthenticated ? (
                <Button
                  variant="ghost"
                  onClick={() => setShowAuthModal(true)}
                  className="gap-2"
                  data-testid="button-auth"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Login</span>
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2" data-testid="button-profile">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-xs">
                          {user?.name ? getInitials(user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline">{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56" data-testid="dropdown-profile">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setLocation("/profile")}
                      className="gap-2"
                      data-testid="menuitem-profile"
                    >
                      <UserCircle className="h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="gap-2 text-destructive focus:text-destructive"
                      data-testid="menuitem-logout"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCartDropdown(!showCartDropdown)}
                  className="relative"
                  data-testid="button-cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center" data-testid="cart-count">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </div>

              <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="lg:hidden pb-3">
            <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
          </div>
        </div>
      </nav>

      <LocationDropdown
        isOpen={showLocationDropdown}
        onClose={() => setShowLocationDropdown(false)}
        onSelectLocation={setSelectedLocation}
      />

      <OffersModal isOpen={showOffersModal} onClose={() => setShowOffersModal(false)} onApplyOffer={onApplyOffer} />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <CartDropdown
        isOpen={showCartDropdown}
        onClose={() => setShowCartDropdown(false)}
        items={cartItems}
        total={cartTotal}
        onRemoveItem={onRemoveFromCart}
        onUpdateQuantity={onUpdateQuantity}
        appliedOffer={appliedOffer}
      />
    </>
  );
}
