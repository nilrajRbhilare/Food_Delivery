import { useLocation } from "wouter";
import { ArrowLeft, Package, Clock, Truck, CheckCircle2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

interface Order {
  id: string;
  items: string[];
  total: number;
  restaurant: string;
  status: "Preparing" | "On the Way" | "Delivered";
  deliveryDate: string;
  deliveryTime: string;
  paymentMethod?: string;
  orderDate?: string;
}

const statusConfig = {
  Preparing: { icon: Clock, color: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-950" },
  "On the Way": { icon: Truck, color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-950" },
  Delivered: { icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-100 dark:bg-green-950" },
};

export default function TrackOrder() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const orders = user?.orders || [];
  const currentOrder = orders.find(o => o.status !== "Delivered");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-6 gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>

          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2" data-testid="login-required-title">Please log in</h2>
            <p className="text-muted-foreground mb-6">Log in to track your orders</p>
            <Button onClick={() => setLocation("/")} data-testid="button-go-home">
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6 gap-2"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <h1 className="text-3xl font-bold mb-6" data-testid="page-title">Track Your Orders</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2" data-testid="no-orders-title">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Place your first order to track it here</p>
            <Button onClick={() => setLocation("/")} data-testid="button-browse-menu">
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            {currentOrder && (
              <Card className="mb-8" data-testid="current-order">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Current Order - {currentOrder.id}
                    </CardTitle>
                    <Badge variant="outline" className={statusConfig[currentOrder.status].bgColor}>
                      {currentOrder.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Restaurant</p>
                        <p className="font-medium" data-testid="current-restaurant">{currentOrder.restaurant}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Items</p>
                        <ul className="space-y-1">
                          {currentOrder.items.map((item, idx) => (
                            <li key={idx} className="text-sm" data-testid={`current-item-${idx}`}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Delivery Date & Time</p>
                        <p className="font-medium" data-testid="current-delivery">{currentOrder.deliveryDate} at {currentOrder.deliveryTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-xl font-bold" data-testid="current-total">₹{currentOrder.total}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <p className="font-medium">Order Status</p>
                    <div className="flex items-center justify-between gap-4">
                      {(["Preparing", "On the Way", "Delivered"] as const).map((status, idx) => {
                        const StatusIcon = statusConfig[status].icon;
                        const isActive = currentOrder.status === status;
                        const isPast = orders.indexOf(currentOrder) !== -1 && 
                          (status === "Preparing" || 
                           (status === "On the Way" && currentOrder.status === "Delivered"));
                        
                        return (
                          <div key={status} className="flex-1 flex items-center gap-2">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                              isActive || isPast ? statusConfig[status].bgColor : "bg-muted"
                            }`}>
                              <StatusIcon className={`h-5 w-5 ${
                                isActive || isPast ? statusConfig[status].color : "text-muted-foreground"
                              }`} />
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                isActive || isPast ? "" : "text-muted-foreground"
                              }`} data-testid={`status-${status.toLowerCase().replace(" ", "-")}`}>
                                {status}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <h2 className="text-2xl font-bold mb-4">Order History</h2>
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} data-testid={`order-${order.id}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <Badge variant="outline" className={statusConfig[order.status].bgColor}>
                          {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Restaurant</p>
                          <p className="font-medium" data-testid={`order-${order.id}-restaurant`}>{order.restaurant}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Items</p>
                          <p className="text-sm" data-testid={`order-${order.id}-items`}>{order.items.join(", ")}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Delivery</p>
                          <p className="text-sm" data-testid={`order-${order.id}-delivery`}>{order.deliveryDate}</p>
                          <p className="text-sm text-muted-foreground">{order.deliveryTime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-bold" data-testid={`order-${order.id}-total`}>₹{order.total}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
