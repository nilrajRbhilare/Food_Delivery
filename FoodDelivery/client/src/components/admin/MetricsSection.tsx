import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { DollarSign, ShoppingCart, TrendingUp, Calendar } from "lucide-react";

interface OrderData {
  date: string;
  revenue: number;
  orders: number;
}

export function MetricsSection() {
  const [timeRange, setTimeRange] = useState<"today" | "7days" | "30days" | "3months" | "6months" | "1year" | "custom">("7days");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [metrics, setMetrics] = useState<OrderData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [topItems, setTopItems] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    calculateMetrics();
  }, [timeRange, customStartDate, customEndDate]);

  const calculateMetrics = () => {
    const allUsers = JSON.parse(localStorage.getItem('foodhub_users') || '[]');
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "7days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "3months":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6months":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "custom":
        if (customStartDate) {
          startDate = new Date(customStartDate);
        }
        break;
    }

    const endDate = timeRange === "custom" && customEndDate ? new Date(customEndDate) : now;

    const ordersInRange: any[] = [];
    const itemCounts: Record<string, number> = {};

    allUsers.forEach((user: any) => {
      if (user.orders && Array.isArray(user.orders)) {
        user.orders.forEach((order: any) => {
          const orderDate = order.orderDate ? new Date(order.orderDate) : new Date();
          
          if (orderDate >= startDate && orderDate <= endDate) {
            ordersInRange.push({ ...order, date: orderDate });
            
            if (order.items && Array.isArray(order.items)) {
              order.items.forEach((item: string) => {
                itemCounts[item] = (itemCounts[item] || 0) + 1;
              });
            }
          }
        });
      }
    });

    const dailyData: Record<string, OrderData> = {};
    ordersInRange.forEach(order => {
      const dateKey = order.date.toISOString().split('T')[0];
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { date: dateKey, revenue: 0, orders: 0 };
      }
      dailyData[dateKey].revenue += order.total || 0;
      dailyData[dateKey].orders += 1;
    });

    const chartData = Object.values(dailyData).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const revenue = ordersInRange.reduce((sum, order) => sum + (order.total || 0), 0);
    const topItemsData = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setMetrics(chartData);
    setTotalRevenue(revenue);
    setTotalOrders(ordersInRange.length);
    setTopItems(topItemsData);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" data-testid="text-metrics-title">Business Metrics</h1>
        <div className="flex gap-2 items-end">
          <div className="space-y-2">
            <Label htmlFor="time-range">Time Range</Label>
            <Select value={timeRange} onValueChange={(val: any) => setTimeRange(val)}>
              <SelectTrigger className="w-[180px]" data-testid="select-time-range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {timeRange === "custom" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  data-testid="input-custom-start"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  data-testid="input-custom-end"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card data-testid="card-total-revenue">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-revenue">₹{totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card data-testid="card-total-orders">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-orders">{totalOrders}</div>
          </CardContent>
        </Card>
        
        <Card data-testid="card-avg-order">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-avg-order">
              ₹{totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00"}
            </div>
          </CardContent>
        </Card>
        
        <Card data-testid="card-date-range">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Date Range</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold" data-testid="text-date-range">
              {timeRange === "custom" 
                ? `${customStartDate || "Start"} to ${customEndDate || "End"}` 
                : timeRange.replace(/([0-9]+)/, " $1 ").replace("days", "Days").replace("months", "Months").replace("year", "Year")}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card data-testid="card-revenue-chart">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card data-testid="card-orders-chart">
          <CardHeader>
            <CardTitle>Orders Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-top-items">
        <CardHeader>
          <CardTitle>Top Selling Items</CardTitle>
        </CardHeader>
        <CardContent>
          {topItems.length > 0 ? (
            <div className="space-y-3">
              {topItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between" data-testid={`item-top-${idx}`}>
                  <span className="font-medium" data-testid={`text-item-name-${idx}`}>{item.name}</span>
                  <span className="text-muted-foreground" data-testid={`text-item-count-${idx}`}>{item.count} orders</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8" data-testid="text-no-data">No data available for selected range</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
