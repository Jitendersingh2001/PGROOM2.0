import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  Plus,
  Trash2
} from 'lucide-react';

// Layout components
import OwnerNavbar from '@/components/owner/OwnerNavbar';
import OwnerSidebar from '@/components/owner/OwnerSidebar';
import DashboardLayout from '@/components/layouts/DashboardLayout';

// UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

/**
 * PaymentMethod - Component for displaying a payment method card
 */
const PaymentMethod: React.FC<{
  type: string;
  last4: string;
  expiry: string;
  isDefault?: boolean;
  onSetDefault: () => void;
  onRemove: () => void;
}> = ({ type, last4, expiry, isDefault, onSetDefault, onRemove }) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <CreditCard className="h-10 w-10 text-primary mr-4" />
            <div>
              <p className="font-medium">{type} •••• {last4}</p>
              <p className="text-sm text-muted-foreground">Expires {expiry}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDefault ? (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Default
              </Badge>
            ) : (
              <Button variant="outline" size="sm" onClick={onSetDefault}>
                Set as default
              </Button>
            )}
            <Button variant="ghost" size="icon" className="text-destructive" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * BillingHistory - Component for displaying billing history
 */
const BillingHistory: React.FC = () => {
  const billingItems = [
    { id: 1, date: 'May 1, 2023', amount: '$500.00', status: 'Paid', invoice: '#INV-001' },
    { id: 2, date: 'Apr 1, 2023', amount: '$500.00', status: 'Paid', invoice: '#INV-002' },
    { id: 3, date: 'Mar 1, 2023', amount: '$500.00', status: 'Paid', invoice: '#INV-003' },
  ];

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-5 p-4 font-medium text-sm bg-muted/50">
        <div>Invoice</div>
        <div>Date</div>
        <div>Amount</div>
        <div>Status</div>
        <div className="text-right">Actions</div>
      </div>
      <Separator />
      {billingItems.map((item) => (
        <React.Fragment key={item.id}>
          <div className="grid grid-cols-5 p-4 text-sm items-center">
            <div>{item.invoice}</div>
            <div>{item.date}</div>
            <div>{item.amount}</div>
            <div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {item.status}
              </Badge>
            </div>
            <div className="text-right">
              <Button variant="ghost" size="sm">
                Download
              </Button>
            </div>
          </div>
          {item.id !== billingItems.length && <Separator />}
        </React.Fragment>
      ))}
    </div>
  );
};

/**
 * OwnerPayments - Payment settings page for property owners
 */
const OwnerPayments: React.FC = () => {
  const [activeTab, setActiveTab] = useState('payment-methods');
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);

  // Mock payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Visa', last4: '4242', expiry: '04/25', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '5555', expiry: '07/24', isDefault: false },
  ]);

  // Handle setting a payment method as default
  const handleSetDefault = (id: number) => {
    setPaymentMethods(
      paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    toast.success('Default payment method updated');
  };

  // Handle removing a payment method
  const handleRemovePaymentMethod = (id: number) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    toast.success('Payment method removed');
  };

  // Handle adding a new payment method (mock)
  const handleAddPaymentMethod = () => {
    setIsAddCardDialogOpen(false);
    toast.success('New payment method added');
  };

  return (
    <DashboardLayout
      navbar={<OwnerNavbar />}
      sidebar={<OwnerSidebar />}
    >
      <div className="w-full max-w-[98%] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Payment Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your payment methods and billing preferences
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Payment Methods & Billing */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
                <TabsTrigger value="billing-history">Billing History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="payment-methods" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Your Payment Methods</h3>
                  <Button onClick={() => setIsAddCardDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
                
                {paymentMethods.map(method => (
                  <PaymentMethod
                    key={method.id}
                    type={method.type}
                    last4={method.last4}
                    expiry={method.expiry}
                    isDefault={method.isDefault}
                    onSetDefault={() => handleSetDefault(method.id)}
                    onRemove={() => handleRemovePaymentMethod(method.id)}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="billing-history" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Billing History</h3>
                  <Button variant="outline">
                    Export All
                  </Button>
                </div>
                
                <BillingHistory />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Billing Preferences */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Billing Preferences</CardTitle>
                <CardDescription>
                  Configure how you want to be billed and notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-renew" className="flex-1">
                      <div className="font-medium">Auto-renew subscription</div>
                      <div className="text-sm text-muted-foreground">
                        Automatically renew your subscription when it expires
                      </div>
                    </Label>
                    <Switch
                      id="auto-renew"
                      checked={autoRenew}
                      onCheckedChange={setAutoRenew}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-receipts" className="flex-1">
                      <div className="font-medium">Email receipts</div>
                      <div className="text-sm text-muted-foreground">
                        Receive email receipts for all payments
                      </div>
                    </Label>
                    <Switch
                      id="email-receipts"
                      checked={emailReceipts}
                      onCheckedChange={setEmailReceipts}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="billing-cycle">Billing Cycle</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger id="billing-cycle">
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose how often you want to be billed
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Preferences</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Payment Method Dialog */}
      <Dialog open={isAddCardDialogOpen} onOpenChange={setIsAddCardDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter your card details to add a new payment method.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="card-name">Cardholder Name</Label>
              <Input id="card-name" placeholder="John Doe" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input id="card-number" placeholder="•••• •••• •••• ••••" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="•••" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCardDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPaymentMethod}>
              Add Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default OwnerPayments;
