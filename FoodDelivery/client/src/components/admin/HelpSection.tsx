import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function HelpSection() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmitFeedback = () => {
    if (!name || !email || !message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! We'll get back to you soon.",
    });

    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6" data-testid="text-help-title">Help & Support</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card data-testid="card-guides">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Admin Guides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" data-testid="accordion-menu">
                <AccordionTrigger>How to Add Menu Items</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Navigate to the "Menu" section from the sidebar</li>
                    <li>Click the "Add Item" button in the top right</li>
                    <li>Fill in the item name, price, category, and subcategory</li>
                    <li>You can create custom categories by selecting "Custom"</li>
                    <li>Click "Add Item" to save the new menu item</li>
                    <li>You can edit or delete items anytime from the menu list</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" data-testid="accordion-orders">
                <AccordionTrigger>How to Manage Orders</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Go to the "Orders" section to see all incoming orders</li>
                    <li>New orders appear in the "New" tab - click "Accept" to start processing</li>
                    <li>Once accepted, the order moves to "Preparing" status</li>
                    <li>When food is ready, click "Mark Ready" to notify delivery</li>
                    <li>After delivery, click "Delivered" to complete the order</li>
                    <li>If an item is unavailable, mark it as "Out of Stock"</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" data-testid="accordion-metrics">
                <AccordionTrigger>How to Track Sales Metrics</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Visit the "Metrics" section for business analytics</li>
                    <li>Select a time range from the dropdown (Today, 7 days, 30 days, etc.)</li>
                    <li>For specific dates, choose "Custom Range" and select start/end dates</li>
                    <li>View total revenue, order count, and average order value</li>
                    <li>Analyze revenue and order trends with interactive charts</li>
                    <li>See top-selling items to optimize your menu</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" data-testid="accordion-offers">
                <AccordionTrigger>How to Create Offers</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Navigate to the "Offers" section</li>
                    <li>Click "Create Offer" to start a new promotional offer</li>
                    <li>Enter offer title, discount percentage, and date range</li>
                    <li>Choose to apply the offer to entire menu or specific items</li>
                    <li>For specific items, enter comma-separated item names</li>
                    <li>Activate/deactivate offers anytime without deleting them</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" data-testid="accordion-profile">
                <AccordionTrigger>How to Update Restaurant Profile</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Click the "Edit Info" button in the top navigation bar</li>
                    <li>Update restaurant name, branches, location, contact, or manager name</li>
                    <li>Click "Save Changes" to update your profile</li>
                    <li>Changes will be reflected immediately in the navbar</li>
                    <li>This information helps customers identify your restaurant</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card data-testid="card-feedback">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Contact & Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feedback-name">Your Name</Label>
                <Input
                  id="feedback-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  data-testid="input-feedback-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-email">Your Email</Label>
                <Input
                  id="feedback-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  data-testid="input-feedback-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-message">Message</Label>
                <Textarea
                  id="feedback-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  rows={5}
                  data-testid="input-feedback-message"
                />
              </div>
              <Button onClick={handleSubmitFeedback} className="w-full" data-testid="button-submit-feedback">
                <Send className="mr-2 h-4 w-4" />
                Submit Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
