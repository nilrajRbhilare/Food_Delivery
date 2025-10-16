import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { OrdersSection } from "@/components/admin/OrdersSection";
import { MenuSection } from "@/components/admin/MenuSection";
import { OffersSection } from "@/components/admin/OffersSection";
import { MetricsSection } from "@/components/admin/MetricsSection";
import { HelpSection } from "@/components/admin/HelpSection";

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState<"orders" | "menu" | "offers" | "metrics" | "help">("orders");

  useEffect(() => {
    if (!isAuthenticated || user?.userType !== 'admin') {
      setLocation('/');
    }
  }, [isAuthenticated, user, setLocation]);

  if (!isAuthenticated || user?.userType !== 'admin') {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminNavbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          {activeSection === "orders" && <OrdersSection />}
          {activeSection === "menu" && <MenuSection />}
          {activeSection === "offers" && <OffersSection />}
          {activeSection === "metrics" && <MetricsSection />}
          {activeSection === "help" && <HelpSection />}
        </main>
      </div>
    </div>
  );
}
