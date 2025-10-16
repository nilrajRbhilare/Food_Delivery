import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Clock, Package as PackageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { Order } from "@/contexts/AuthContext";

interface OrderWithStatus extends Order {
  ticketId: string;
  customerName: string;
  customerEmail: string;
  orderStatus: "new" | "preparing" | "ready" | "delivered" | "denied";
  itemsOutOfStock?: string[];
}

const ADMIN_ORDERS_KEY = 'foodhub_admin_orders';

export function OrdersSection() {
  const { toast } = useToast();
  const { adminProfile } = useAuth();
  const [orders, setOrders] = useState<OrderWithStatus[]>([]);

  useEffect(() => {
    loadOrders();
  }, [adminProfile]);

  const loadOrders = () => {
    const allUsers = JSON.parse(localStorage.getItem('foodhub_users') || '[]');
    const adminOrders: OrderWithStatus[] = [];
    const currentRestaurantId = adminProfile?.restaurantId;
    
    allUsers.forEach((user: any) => {
      if (user.orders && Array.isArray(user.orders)) {
        user.orders.forEach((order: Order) => {
          // Only include orders for this admin's restaurant
          if (!currentRestaurantId || order.restaurantId === currentRestaurantId || !order.restaurantId) {
            const existingOrder = adminOrders.find(o => o.id === order.id);
            if (!existingOrder) {
              adminOrders.push({
                ...order,
                ticketId: `TKT-${order.id.slice(0, 8)}`,
                customerName: user.name,
                customerEmail: user.email,
                orderStatus: getOrderStatusFromStatus(order.status),
                itemsOutOfStock: []
              });
            }
          }
        });
      }
    });
    
    const savedOrders = JSON.parse(localStorage.getItem(ADMIN_ORDERS_KEY) || '{}');
    const mergedOrders = adminOrders.map(order => ({
      ...order,
      orderStatus: savedOrders[order.id]?.orderStatus || order.orderStatus,
      itemsOutOfStock: savedOrders[order.id]?.itemsOutOfStock || []
    }));
    
    setOrders(mergedOrders);
  };

  const getOrderStatusFromStatus = (status: string): "new" | "preparing" | "ready" | "delivered" | "denied" => {
    if (status === "New") return "new";
    if (status === "Preparing") return "preparing";
    if (status === "On the Way") return "ready";
    if (status === "Delivered") return "delivered";
    if (status === "Denied") return "denied";
    return "new";
  };

  const updateOrderStatus = (orderId: string, newStatus: "new" | "preparing" | "ready" | "delivered" | "denied") => {
    const savedOrders = JSON.parse(localStorage.getItem(ADMIN_ORDERS_KEY) || '{}');
    savedOrders[orderId] = { 
      ...(savedOrders[orderId] || {}), 
      orderStatus: newStatus 
    };
    localStorage.setItem(ADMIN_ORDERS_KEY, JSON.stringify(savedOrders));
    
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, orderStatus: newStatus } : order
    ));
    
    toast({
      title: "Order Updated",
      description: `Order status changed to ${newStatus}`,
      variant: newStatus === "denied" ? "destructive" : "default",
    });
  };

  const markItemOutOfStock = (orderId: string, item: string) => {
    const savedOrders = JSON.parse(localStorage.getItem(ADMIN_ORDERS_KEY) || '{}');
    const currentOrder = savedOrders[orderId] || {};
    const outOfStock = currentOrder.itemsOutOfStock || [];
    
    if (!outOfStock.includes(item)) {
      outOfStock.push(item);
      savedOrders[orderId] = { ...currentOrder, itemsOutOfStock: outOfStock };
      localStorage.setItem(ADMIN_ORDERS_KEY, JSON.stringify(savedOrders));
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, itemsOutOfStock: outOfStock } : order
      ));
      
      toast({
        title: "Item Marked",
        description: `${item} marked as out of stock`,
        variant: "destructive",
      });
    }
  };

  const filterOrders = (status: string) => {
    if (status === "new") return orders.filter(o => o.orderStatus === "new");
    if (status === "preparing") return orders.filter(o => o.orderStatus === "preparing");
    if (status === "ready") return orders.filter(o => o.orderStatus === "ready");
    if (status === "past") return orders.filter(o => o.orderStatus === "delivered" || o.orderStatus === "denied");
    return orders;
  };

  const OrderCard = ({ order }: { order: OrderWithStatus }) => (
    <Card key={order.id} data-testid={`card-order-${order.id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-lg" data-testid={`text-ticket-${order.ticketId}`}>{order.ticketId}</CardTitle>
        <Badge variant={order.orderStatus === "new" ? "default" : "secondary"} data-testid={`badge-status-${order.id}`}>
          {order.orderStatus}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium" data-testid={`text-customer-${order.id}`}>Customer: {order.customerName}</p>
          <p className="text-sm text-muted-foreground" data-testid={`text-email-${order.id}`}>{order.customerEmail}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">Items:</p>
          <div className="space-y-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className={order.itemsOutOfStock?.includes(item) ? "line-through text-muted-foreground" : ""} data-testid={`text-item-${order.id}-${idx}`}>
                  {item}
                </span>
                {!order.itemsOutOfStock?.includes(item) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markItemOutOfStock(order.id, item)}
                    data-testid={`button-out-of-stock-${order.id}-${idx}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span data-testid={`text-total-${order.id}`}>Total: ₹{order.total}</span>
          <span data-testid={`text-date-${order.id}`}>{order.deliveryDate}</span>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p data-testid={`text-payment-${order.id}`}>Payment: {order.paymentMethod || "COD"}</p>
        </div>
        
        <div className="flex gap-2 pt-2 flex-wrap">
          {order.orderStatus === "new" && (
            <>
              <Button size="sm" onClick={() => updateOrderStatus(order.id, "preparing")} data-testid={`button-accept-${order.id}`}>
                <Check className="mr-1 h-3 w-3" />
                Accept
              </Button>
              <Button size="sm" variant="destructive" onClick={() => updateOrderStatus(order.id, "denied")} data-testid={`button-deny-${order.id}`}>
                <X className="mr-1 h-3 w-3" />
                Deny
              </Button>
            </>
          )}
          {order.orderStatus === "preparing" && (
            <Button size="sm" onClick={() => updateOrderStatus(order.id, "ready")} data-testid={`button-ready-${order.id}`}>
              <PackageIcon className="mr-1 h-3 w-3" />
              Mark Ready
            </Button>
          )}
          {order.orderStatus === "ready" && (
            <Button size="sm" onClick={() => updateOrderStatus(order.id, "delivered")} data-testid={`button-delivered-${order.id}`}>
              <Check className="mr-1 h-3 w-3" />
              Delivered
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6" data-testid="text-orders-title">Orders Management</h1>
      
      <Tabs defaultValue="new" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="new" data-testid="tab-new-orders">
            <Clock className="mr-2 h-4 w-4" />
            New ({filterOrders("new").length})
          </TabsTrigger>
          <TabsTrigger value="preparing" data-testid="tab-preparing-orders">
            Preparing ({filterOrders("preparing").length})
          </TabsTrigger>
          <TabsTrigger value="ready" data-testid="tab-ready-orders">
            Ready ({filterOrders("ready").length})
          </TabsTrigger>
          <TabsTrigger value="past" data-testid="tab-past-orders">
            Past Orders ({filterOrders("past").length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="new" className="space-y-4">
          {filterOrders("new").length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="text-no-new-orders">No new orders</p>
          ) : (
            filterOrders("new").map(order => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>
        
        <TabsContent value="preparing" className="space-y-4">
          {filterOrders("preparing").length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="text-no-preparing-orders">No orders being prepared</p>
          ) : (
            filterOrders("preparing").map(order => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>
        
        <TabsContent value="ready" className="space-y-4">
          {filterOrders("ready").length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="text-no-ready-orders">No orders ready</p>
          ) : (
            filterOrders("ready").map(order => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {filterOrders("past").length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="text-no-past-orders">No past orders</p>
          ) : (
            filterOrders("past").map(order => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
