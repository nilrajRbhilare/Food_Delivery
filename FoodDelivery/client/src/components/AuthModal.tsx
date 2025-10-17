import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const { addRestaurant } = useData();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpAddress, setSignUpAddress] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [userType, setUserType] = useState<"customer" | "admin">("customer");
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantLocation, setRestaurantLocation] = useState("");

  const handleSignIn = async () => {
    if (!signInEmail || !signInPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    const success = await login(signInEmail, signInPassword);
    
    if (success) {
      const storedUser = localStorage.getItem('foodhub_user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      setSignInEmail("");
      setSignInPassword("");
      onClose();
      
      if (user?.userType === 'admin') {
        setLocation('/admin');
      }
    } else {
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  const handleSignUp = async () => {
    if (!signUpUsername || !signUpName || !signUpEmail || !signUpPassword) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (userType === 'admin' && !restaurantName) {
      toast({
        title: "Error",
        description: "Please enter restaurant name for admin account",
        variant: "destructive",
      });
      return;
    }
    
    const success = await register({
      username: signUpUsername,
      name: signUpName,
      email: signUpEmail,
      phone: signUpPhone || "",
      address: signUpAddress || "",
      password: signUpPassword,
      userType: userType,
      restaurantName: userType === 'admin' ? restaurantName : undefined,
      restaurantLocation: userType === 'admin' ? (restaurantLocation || "Not Set") : undefined,
    }, userType === 'admin' ? addRestaurant : undefined);
    
    if (success) {
      const isAdmin = userType === 'admin';
      
      toast({
        title: "Account Created!",
        description: isAdmin ? "Welcome to FoodHub Admin Panel!" : "Welcome to FoodHub!",
      });
      setSignUpUsername("");
      setSignUpName("");
      setSignUpEmail("");
      setSignUpPhone("");
      setSignUpAddress("");
      setSignUpPassword("");
      setUserType("customer");
      setRestaurantName("");
      setRestaurantLocation("");
      onClose();
      
      if (isAdmin) {
        setLocation('/admin');
      }
    } else {
      toast({
        title: "Error",
        description: "Email or username already exists",
        variant: "destructive",
      });
    }
  };

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
          data-testid="auth-backdrop"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-background rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col"
          data-testid="auth-modal"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 z-10"
            data-testid="button-close-auth"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="p-6 pt-12 overflow-y-auto">
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin" data-testid="tab-signin">Login</TabsTrigger>
                <TabsTrigger value="signup" data-testid="tab-signup">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    data-testid="input-signin-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    data-testid="input-signin-password"
                  />
                </div>
                <Button className="w-full" onClick={handleSignIn} data-testid="button-signin-submit">
                  Login
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input
                    id="signup-username"
                    placeholder="Choose a username"
                    value={signUpUsername}
                    onChange={(e) => setSignUpUsername(e.target.value)}
                    data-testid="input-signup-username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="Enter your name"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    data-testid="input-signup-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    data-testid="input-signup-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone (Optional)</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    data-testid="input-signup-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-address">Address (Optional)</Label>
                  <Input
                    id="signup-address"
                    placeholder="Enter your address"
                    value={signUpAddress}
                    onChange={(e) => setSignUpAddress(e.target.value)}
                    data-testid="input-signup-address"
                  />
                </div>
                <div className="space-y-3">
                  <Label>User Type</Label>
                  <RadioGroup value={userType} onValueChange={(val) => setUserType(val as "customer" | "admin")} data-testid="radio-user-type">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="customer" id="customer" data-testid="radio-customer" />
                      <Label htmlFor="customer" className="font-normal cursor-pointer">Customer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="admin" id="admin" data-testid="radio-admin" />
                      <Label htmlFor="admin" className="font-normal cursor-pointer">Admin (Delivery Partner)</Label>
                    </div>
                  </RadioGroup>
                </div>
                {userType === 'admin' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="restaurant-name">Restaurant Name *</Label>
                      <Input
                        id="restaurant-name"
                        placeholder="Enter restaurant name"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        data-testid="input-restaurant-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restaurant-location">Restaurant Location (Optional)</Label>
                      <Input
                        id="restaurant-location"
                        placeholder="Enter restaurant location"
                        value={restaurantLocation}
                        onChange={(e) => setRestaurantLocation(e.target.value)}
                        data-testid="input-restaurant-location"
                      />
                      <p className="text-xs text-muted-foreground">You can update this with a map selector later in your admin panel</p>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    data-testid="input-signup-password"
                  />
                </div>
                <Button className="w-full" onClick={handleSignUp} data-testid="button-signup-submit">
                  Register
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
