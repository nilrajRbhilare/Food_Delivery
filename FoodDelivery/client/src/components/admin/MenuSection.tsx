import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useData, MenuItem as DataMenuItem } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

interface AdminMenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory: string;
  available: boolean;
  imageUrl?: string;
}

export function MenuSection() {
  const { toast } = useToast();
  const { menuItems: allMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, getRestaurantMenuItems, restaurants } = useData();
  const { adminProfile } = useAuth();
  const [menuItems, setMenuItems] = useState<DataMenuItem[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DataMenuItem | null>(null);
  
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [customSubcategory, setCustomSubcategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const categories = ["Indian", "Chinese", "Italian", "Desserts", "Beverages", "Custom"];
  const subcategories: Record<string, string[]> = {
    "Indian": ["Veg", "Non-Veg"],
    "Chinese": ["Veg", "Non-Veg"],
    "Italian": ["Veg", "Non-Veg", "Pasta", "Pizza"],
    "Desserts": ["Ice Cream", "Cakes", "Traditional"],
    "Beverages": ["Coffee", "Tea", "Juice", "Soft Drinks"],
    "Custom": []
  };

  useEffect(() => {
    loadMenu();
  }, [adminProfile, allMenuItems]);

  const loadMenu = () => {
    if (adminProfile?.restaurantId) {
      const items = getRestaurantMenuItems(adminProfile.restaurantId);
      setMenuItems(items);
    }
  };

  const getDefaultImage = () => {
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
  };

  const handleAdd = () => {
    if (!name || !price || !category || !adminProfile?.restaurantId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const finalCategory = category === "Custom" ? customCategory : category;
    const finalSubcategory = category === "Custom" ? customSubcategory : subcategory;

    const newItem: DataMenuItem = {
      id: `ADMIN-${Date.now()}`,
      name,
      restaurantId: adminProfile.restaurantId,
      restaurantName: adminProfile.restaurantName,
      rating: 4.0,
      price: parseFloat(price),
      image: imageUrl || getDefaultImage(),
      category: finalCategory,
      isVeg: finalSubcategory === "Veg",
      description: `${name} from ${adminProfile.restaurantName}`,
      available: true,
      offer: undefined
    };

    addMenuItem(newItem);
    resetForm();
    setIsAddOpen(false);
    
    toast({
      title: "Item Added",
      description: `${name} has been added to the menu`,
    });
  };

  const handleEdit = () => {
    if (!editingItem || !name || !price || !category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const finalCategory = category === "Custom" ? customCategory : category;
    const finalSubcategory = category === "Custom" ? customSubcategory : subcategory;

    updateMenuItem(editingItem.id, {
      name,
      price: parseFloat(price),
      category: finalCategory,
      isVeg: finalSubcategory === "Veg",
      image: imageUrl || editingItem.image,
      description: `${name} from ${editingItem.restaurantName}`
    });

    resetForm();
    setEditingItem(null);
    
    toast({
      title: "Item Updated",
      description: `${name} has been updated`,
    });
  };

  const handleDelete = (id: string) => {
    deleteMenuItem(id);
    
    toast({
      title: "Item Deleted",
      description: "Menu item has been removed",
    });
  };

  const toggleAvailability = (id: string) => {
    const item = menuItems.find(i => i.id === id);
    if (item) {
      updateMenuItem(id, { available: !item.available });
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory("");
    setSubcategory("");
    setCustomCategory("");
    setCustomSubcategory("");
    setImageUrl("");
  };

  const openEdit = (item: DataMenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(item.price.toString());
    setCategory(categories.includes(item.category) ? item.category : "Custom");
    setSubcategory(item.isVeg ? "Veg" : "Non-Veg");
    setImageUrl(item.image || "");
    if (!categories.includes(item.category)) {
      setCustomCategory(item.category);
      setCustomSubcategory(item.isVeg ? "Veg" : "Non-Veg");
    }
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    const subcategory = item.isVeg ? "Veg" : "Non-Veg";
    const key = `${item.category}-${subcategory}`;
    if (!acc[key]) {
      acc[key] = { category: item.category, subcategory, items: [] };
    }
    acc[key].items.push(item);
    return acc;
  }, {} as Record<string, { category: string; subcategory: string; items: DataMenuItem[] }>);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" data-testid="text-menu-title">Menu Management</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} data-testid="button-add-menu-item">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent data-testid="dialog-add-item">
            <DialogHeader>
              <DialogTitle>Add Menu Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input
                  id="item-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="input-item-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-price">Price (₹)</Label>
                <Input
                  id="item-price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  data-testid="input-item-price"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {category === "Custom" && (
                <div className="space-y-2">
                  <Label htmlFor="custom-category">Custom Category Name</Label>
                  <Input
                    id="custom-category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    data-testid="input-custom-category"
                  />
                </div>
              )}
              {category && category !== "Custom" && (
                <div className="space-y-2">
                  <Label htmlFor="item-subcategory">Subcategory</Label>
                  <Select value={subcategory} onValueChange={setSubcategory}>
                    <SelectTrigger data-testid="select-subcategory">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories[category]?.map(sub => (
                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {category === "Custom" && (
                <div className="space-y-2">
                  <Label htmlFor="custom-subcategory">Custom Subcategory (Optional)</Label>
                  <Input
                    id="custom-subcategory"
                    value={customSubcategory}
                    onChange={(e) => setCustomSubcategory(e.target.value)}
                    data-testid="input-custom-subcategory"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="item-image">Image URL (Optional)</Label>
                <Input
                  id="item-image"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  data-testid="input-item-image"
                />
              </div>
              <Button onClick={handleAdd} className="w-full" data-testid="button-submit-add">
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editingItem !== null} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent data-testid="dialog-edit-item">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-item-name">Item Name</Label>
              <Input
                id="edit-item-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="input-edit-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-item-price">Price (₹)</Label>
              <Input
                id="edit-item-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                data-testid="input-edit-price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-item-category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-testid="select-edit-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-item-image">Image URL (Optional)</Label>
              <Input
                id="edit-item-image"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                data-testid="input-edit-image"
              />
            </div>
            <Button onClick={handleEdit} className="w-full" data-testid="button-submit-edit">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {Object.values(groupedItems).map((group, idx) => (
          <Card key={idx} data-testid={`card-category-${group.category}`}>
            <CardHeader>
              <CardTitle>
                {group.category} {group.subcategory && `- ${group.subcategory}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {group.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 border rounded-md" data-testid={`item-${item.id}`}>
                    <div className="flex-1">
                      <p className="font-medium" data-testid={`text-item-name-${item.id}`}>{item.name}</p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-item-price-${item.id}`}>₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.available ? "default" : "secondary"} data-testid={`badge-availability-${item.id}`}>
                        {item.available ? "Available" : "Out of Stock"}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => toggleAvailability(item.id)} data-testid={`button-toggle-${item.id}`}>
                        {item.available ? "Mark Unavailable" : "Mark Available"}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)} data-testid={`button-edit-${item.id}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} data-testid={`button-delete-${item.id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {menuItems.length === 0 && (
          <p className="text-center text-muted-foreground py-12" data-testid="text-no-items">
            No menu items yet. Click "Add Item" to get started.
          </p>
        )}
      </div>
    </div>
  );
}
