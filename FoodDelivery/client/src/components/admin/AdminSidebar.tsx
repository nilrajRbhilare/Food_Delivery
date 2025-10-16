import { Package, Menu, Tag, BarChart3, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AdminSidebarProps {
  activeSection: "orders" | "menu" | "offers" | "metrics" | "help";
  onSectionChange: (section: "orders" | "menu" | "offers" | "metrics" | "help") => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const menuItems = [
    { id: "orders" as const, label: "Orders", icon: Package },
    { id: "menu" as const, label: "Menu", icon: Menu },
    { id: "offers" as const, label: "Offers", icon: Tag },
    { id: "metrics" as const, label: "Metrics", icon: BarChart3 },
    { id: "help" as const, label: "Help", icon: HelpCircle },
  ];

  return (
    <div className="w-64 border-r bg-card flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary" data-testid="text-admin-title">Admin Panel</h2>
      </div>
      
      <Separator />
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSectionChange(item.id)}
              data-testid={`button-nav-${item.id}`}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
