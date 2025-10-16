import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, LogOut, Store } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export function AdminNavbar() {
  const { adminProfile, updateAdminProfile, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [restaurantName, setRestaurantName] = useState(adminProfile?.restaurantName || "");
  const [branches, setBranches] = useState(adminProfile?.branches || "");
  const [location, setLocationValue] = useState(adminProfile?.location || "");
  const [contact, setContact] = useState(adminProfile?.contact || "");
  const [managerName, setManagerName] = useState(adminProfile?.managerName || "");

  const handleSave = () => {
    updateAdminProfile({
      restaurantName,
      branches,
      location,
      contact,
      managerName
    });
    
    toast({
      title: "Profile Updated",
      description: "Restaurant details have been updated successfully.",
    });
    
    setIsEditOpen(false);
  };

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  return (
    <div className="border-b bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4" data-testid="admin-details">
          <Store className="h-6 w-6 text-primary" />
          <div>
            <h3 className="font-semibold" data-testid="text-restaurant-name">{adminProfile?.restaurantName || "My Restaurant"}</h3>
            <p className="text-sm text-muted-foreground" data-testid="text-restaurant-id">ID: {adminProfile?.restaurantId || "N/A"}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p data-testid="text-branches">Branches: {adminProfile?.branches || "1"}</p>
            <p data-testid="text-location">Location: {adminProfile?.location || "Not Set"}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p data-testid="text-contact">Contact: {adminProfile?.contact || "Not Set"}</p>
            <p data-testid="text-manager">Manager: {adminProfile?.managerName || "Not Set"}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" data-testid="button-edit-profile">
                <Edit className="mr-2 h-4 w-4" />
                Edit Info
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="dialog-edit-profile">
              <DialogHeader>
                <DialogTitle>Edit Restaurant Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="restaurant-name">Restaurant Name</Label>
                  <Input
                    id="restaurant-name"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    data-testid="input-restaurant-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branches">Number of Branches</Label>
                  <Input
                    id="branches"
                    value={branches}
                    onChange={(e) => setBranches(e.target.value)}
                    data-testid="input-branches"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocationValue(e.target.value)}
                    data-testid="input-location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact</Label>
                  <Input
                    id="contact"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    data-testid="input-contact"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Manager Name</Label>
                  <Input
                    id="manager"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    data-testid="input-manager-name"
                  />
                </div>
                <Button onClick={handleSave} className="w-full" data-testid="button-save-profile">
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm" onClick={handleLogout} data-testid="button-logout">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
