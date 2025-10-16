import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { offers } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";

interface OffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyOffer: (offer: { id: string; title: string; description: string; discountValue: number }) => void;
}

export function OffersModal({ isOpen, onClose, onApplyOffer }: OffersModalProps) {
  const handleApplyOffer = (offer: typeof offers[0]) => {
    const discountValue = offer.title.includes("50%") ? 50 : 
                         offer.title.includes("30%") ? 30 :
                         offer.title.includes("Free Delivery") ? 0 : 0;
    onApplyOffer({ 
      id: offer.id, 
      title: offer.title, 
      description: offer.description,
      discountValue 
    });
    onClose();
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
          data-testid="offers-backdrop"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-background rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          data-testid="offers-modal"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 z-10"
            data-testid="button-close-offers"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="sticky top-0 bg-background border-b p-6">
            <h2 className="text-2xl font-bold">Available Offers</h2>
          </div>

          <div className="p-6 grid gap-4 md:grid-cols-2">
            {offers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden hover-elevate" data-testid={`offer-${offer.id}`}>
                <div className="flex gap-4 p-4">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <Badge className="mb-2 bg-accent text-accent-foreground">Offer</Badge>
                    <h3 className="font-semibold mb-1">{offer.title}</h3>
                    <p className="text-sm text-muted-foreground">{offer.description}</p>
                    <Button 
                      size="sm" 
                      className="mt-3" 
                      onClick={() => handleApplyOffer(offer)}
                      data-testid={`button-apply-${offer.id}`}
                    >
                      Apply Offer
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
