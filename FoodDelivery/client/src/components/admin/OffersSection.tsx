import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Offer {
  id: string;
  title: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  applicableTo: "all" | "specific";
  eligibleItems?: string[];
  active: boolean;
}

const OFFERS_KEY = 'foodhub_admin_offers';

export function OffersSection() {
  const { toast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  
  const [title, setTitle] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applicableTo, setApplicableTo] = useState<"all" | "specific">("all");
  const [eligibleItems, setEligibleItems] = useState("");

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = () => {
    const saved = localStorage.getItem(OFFERS_KEY);
    if (saved) {
      setOffers(JSON.parse(saved));
    }
  };

  const saveOffers = (items: Offer[]) => {
    localStorage.setItem(OFFERS_KEY, JSON.stringify(items));
    setOffers(items);
  };

  const handleAdd = () => {
    if (!title || !discountPercentage || !startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newOffer: Offer = {
      id: Date.now().toString(),
      title,
      discountPercentage: parseFloat(discountPercentage),
      startDate,
      endDate,
      applicableTo,
      eligibleItems: applicableTo === "specific" ? eligibleItems.split(",").map(i => i.trim()) : undefined,
      active: true,
    };

    saveOffers([...offers, newOffer]);
    resetForm();
    setIsAddOpen(false);
    
    toast({
      title: "Offer Created",
      description: `${title} has been created successfully`,
    });
  };

  const handleEdit = () => {
    if (!editingOffer || !title || !discountPercentage || !startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updated = offers.map(offer =>
      offer.id === editingOffer.id
        ? { 
            ...offer, 
            title, 
            discountPercentage: parseFloat(discountPercentage), 
            startDate, 
            endDate, 
            applicableTo,
            eligibleItems: applicableTo === "specific" ? eligibleItems.split(",").map(i => i.trim()) : undefined,
          }
        : offer
    );

    saveOffers(updated);
    resetForm();
    setEditingOffer(null);
    
    toast({
      title: "Offer Updated",
      description: `${title} has been updated`,
    });
  };

  const handleDelete = (id: string) => {
    const filtered = offers.filter(offer => offer.id !== id);
    saveOffers(filtered);
    
    toast({
      title: "Offer Deleted",
      description: "Offer has been removed",
    });
  };

  const toggleActive = (id: string) => {
    const updated = offers.map(offer =>
      offer.id === id ? { ...offer, active: !offer.active } : offer
    );
    saveOffers(updated);
    
    const offer = offers.find(o => o.id === id);
    toast({
      title: offer?.active ? "Offer Deactivated" : "Offer Activated",
      description: offer?.active ? "Offer has been deactivated" : "Offer is now active",
    });
  };

  const resetForm = () => {
    setTitle("");
    setDiscountPercentage("");
    setStartDate("");
    setEndDate("");
    setApplicableTo("all");
    setEligibleItems("");
  };

  const openEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setTitle(offer.title);
    setDiscountPercentage(offer.discountPercentage.toString());
    setStartDate(offer.startDate);
    setEndDate(offer.endDate);
    setApplicableTo(offer.applicableTo);
    setEligibleItems(offer.eligibleItems?.join(", ") || "");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" data-testid="text-offers-title">Offers Management</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} data-testid="button-add-offer">
              <Plus className="mr-2 h-4 w-4" />
              Create Offer
            </Button>
          </DialogTrigger>
          <DialogContent data-testid="dialog-add-offer">
            <DialogHeader>
              <DialogTitle>Create New Offer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="offer-title">Offer Title</Label>
                <Input
                  id="offer-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Summer Special"
                  data-testid="input-offer-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Percentage (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  placeholder="e.g., 20"
                  data-testid="input-discount"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    data-testid="input-start-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    data-testid="input-end-date"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicable-to">Apply To</Label>
                <Select value={applicableTo} onValueChange={(val) => setApplicableTo(val as "all" | "specific")}>
                  <SelectTrigger data-testid="select-applicable">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Entire Menu</SelectItem>
                    <SelectItem value="specific">Specific Items/Categories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {applicableTo === "specific" && (
                <div className="space-y-2">
                  <Label htmlFor="eligible-items">Eligible Items (comma-separated)</Label>
                  <Input
                    id="eligible-items"
                    value={eligibleItems}
                    onChange={(e) => setEligibleItems(e.target.value)}
                    placeholder="e.g., Pizza, Pasta, Desserts"
                    data-testid="input-eligible-items"
                  />
                </div>
              )}
              <Button onClick={handleAdd} className="w-full" data-testid="button-submit-offer">
                Create Offer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editingOffer !== null} onOpenChange={(open) => !open && setEditingOffer(null)}>
        <DialogContent data-testid="dialog-edit-offer">
          <DialogHeader>
            <DialogTitle>Edit Offer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-offer-title">Offer Title</Label>
              <Input
                id="edit-offer-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-testid="input-edit-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-discount">Discount Percentage (%)</Label>
              <Input
                id="edit-discount"
                type="number"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                data-testid="input-edit-discount"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start-date">Start Date</Label>
                <Input
                  id="edit-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  data-testid="input-edit-start-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end-date">End Date</Label>
                <Input
                  id="edit-end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  data-testid="input-edit-end-date"
                />
              </div>
            </div>
            <Button onClick={handleEdit} className="w-full" data-testid="button-submit-edit-offer">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {offers.map(offer => (
          <Card key={offer.id} data-testid={`card-offer-${offer.id}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                <span data-testid={`text-offer-title-${offer.id}`}>{offer.title}</span>
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant={offer.active ? "default" : "secondary"} data-testid={`badge-active-${offer.id}`}>
                  {offer.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Discount</p>
                  <p className="font-medium" data-testid={`text-discount-${offer.id}`}>{offer.discountPercentage}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Applicable To</p>
                  <p className="font-medium" data-testid={`text-applicable-${offer.id}`}>{offer.applicableTo === "all" ? "Entire Menu" : "Specific Items"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Start Date</p>
                  <p className="font-medium" data-testid={`text-start-${offer.id}`}>{offer.startDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">End Date</p>
                  <p className="font-medium" data-testid={`text-end-${offer.id}`}>{offer.endDate}</p>
                </div>
              </div>
              {offer.eligibleItems && offer.eligibleItems.length > 0 && (
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">Eligible Items:</p>
                  <p className="font-medium" data-testid={`text-eligible-${offer.id}`}>{offer.eligibleItems.join(", ")}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => toggleActive(offer.id)} data-testid={`button-toggle-active-${offer.id}`}>
                  {offer.active ? "Deactivate" : "Activate"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => openEdit(offer)} data-testid={`button-edit-offer-${offer.id}`}>
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(offer.id)} data-testid={`button-delete-offer-${offer.id}`}>
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {offers.length === 0 && (
          <p className="text-center text-muted-foreground py-12" data-testid="text-no-offers">
            No offers yet. Click "Create Offer" to get started.
          </p>
        )}
      </div>
    </div>
  );
}
