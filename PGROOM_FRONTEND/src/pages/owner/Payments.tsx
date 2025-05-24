/**
 * OwnerPayments - Payment management page for property owners
 *
 * Simplified version with just create payment functionality
 */

import React, { useState, useEffect } from 'react';
import { CreditCard, Plus } from 'lucide-react';

// Layout components
import OwnerNavbar from '@/components/owner/OwnerNavbar';
import OwnerSidebar from '@/components/owner/OwnerSidebar';
import DashboardLayout from '@/components/layouts/DashboardLayout';

// UI components
import { Button } from '@/components/ui/button';

// Payment components
import PaymentFormModal from '@/components/payments/PaymentFormModal';

// Context
import { PaymentProvider } from '@/contexts/PaymentContext';

// Simple payment management component
const PaymentManagement = () => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handlePaymentSuccess = (paymentId: string) => {
    setShowPaymentForm(false);
    // You can add additional success handling here if needed
    console.log('Payment created successfully:', paymentId);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Management</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage rent payments
          </p>
        </div>
        <Button onClick={() => setShowPaymentForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Payment
        </Button>
      </div>

      {/* Create Payment Modal */}
      <PaymentFormModal
        isOpen={showPaymentForm}
        onClose={() => setShowPaymentForm(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

const OwnerPayments: React.FC = () => {
  // Add Razorpay script to head if not already present
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    // Check if script is already loaded
    if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <PaymentProvider>
      <DashboardLayout
        navbar={<OwnerNavbar />}
        sidebar={<OwnerSidebar />}
      >
        <div className="w-full max-w-[98%] mx-auto">
          <PaymentManagement />
        </div>
      </DashboardLayout>
    </PaymentProvider>
  );
};

export default OwnerPayments;
