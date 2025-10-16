import { useState } from "react";
import { MapPin, Home, Briefcase, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { savedAddresses } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: string) => void;
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export function LocationDropdown({ isOpen, onClose, onSelectLocation }: LocationDropdownProps) {
  const [manualAddress, setManualAddress] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([28.6139, 77.2090]);
  const [mapKey, setMapKey] = useState(0);

  const handleSelectLocation = (address: string) => {
    onSelectLocation(address);
    onClose();
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedPosition([lat, lng]);
    const address = `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    setManualAddress(address);
  };

  const handleAddressChange = (value: string) => {
    setManualAddress(value);
    
    const locationMap: Record<string, [number, number]> = {
      "new york": [40.7128, -74.0060],
      "delhi": [28.6139, 77.2090],
      "mumbai": [19.0760, 72.8777],
      "london": [51.5074, -0.1278],
      "tokyo": [35.6762, 139.6503],
      "paris": [48.8566, 2.3522],
      "bangalore": [12.9716, 77.5946],
    };

    const lowerValue = value.toLowerCase();
    for (const [city, coords] of Object.entries(locationMap)) {
      if (lowerValue.includes(city)) {
        setSelectedPosition(coords);
        setMapKey(prev => prev + 1);
        break;
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} data-testid="location-backdrop" />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-20 left-4 md:left-auto md:ml-32 bg-popover border border-popover-border rounded-xl shadow-xl z-50 w-[calc(100%-2rem)] md:w-[500px] p-4"
          data-testid="location-dropdown"
        >
          <h3 className="font-semibold mb-4">Select Location</h3>

          <Tabs defaultValue="map" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="map" data-testid="tab-map">Map</TabsTrigger>
              <TabsTrigger value="manual" data-testid="tab-manual">Manual</TabsTrigger>
            </TabsList>
            
            <TabsContent value="map" className="space-y-4">
              <div className="space-y-2">
                <Input
                  value={manualAddress}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  placeholder="Type a location (e.g., New York, Delhi, London)"
                  data-testid="input-map-search"
                />
              </div>
              <div className="h-64 rounded-lg overflow-hidden border" data-testid="map-container">
                <MapContainer
                  key={mapKey}
                  center={selectedPosition}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker onLocationSelect={handleMapClick} />
                </MapContainer>
              </div>
              <p className="text-sm text-muted-foreground">Type a location or click on the map to select your location</p>
              {manualAddress && (
                <Button
                  onClick={() => handleSelectLocation(manualAddress)}
                  className="w-full"
                  data-testid="button-confirm-map-address"
                >
                  Confirm Location
                </Button>
              )}
            </TabsContent>
            
            <TabsContent value="manual" className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={() => handleSelectLocation("Current Location")}
                data-testid="button-current-location"
              >
                <Navigation className="h-4 w-4 text-primary" />
                Use Current Location
              </Button>

              <div>
                <Input
                  placeholder="Enter delivery address (e.g., New York, Delhi, London)"
                  value={manualAddress}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  className="mb-2"
                  data-testid="input-manual-address"
                />
                <Button
                  onClick={() => manualAddress && handleSelectLocation(manualAddress)}
                  disabled={!manualAddress}
                  className="w-full"
                  data-testid="button-confirm-address"
                >
                  Confirm Address
                </Button>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-3">Saved Addresses</p>
                <div className="space-y-2">
                  {savedAddresses.map((addr) => (
                    <Button
                      key={addr.id}
                      variant="ghost"
                      className="w-full justify-start gap-3"
                      onClick={() => handleSelectLocation(addr.address)}
                      data-testid={`button-saved-${addr.label.toLowerCase()}`}
                    >
                      {addr.label === "Home" ? (
                        <Home className="h-4 w-4" />
                      ) : (
                        <Briefcase className="h-4 w-4" />
                      )}
                      <div className="text-left">
                        <p className="font-medium text-sm">{addr.label}</p>
                        <p className="text-xs text-muted-foreground">{addr.address}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
