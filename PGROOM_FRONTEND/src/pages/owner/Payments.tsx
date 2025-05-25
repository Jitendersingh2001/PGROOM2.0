/**
 * OwnerPayments - Comprehensive payment management page for property owners
 *
 * Features:
 * 1. Create new payments
 * 2. View payment listings with advanced filtering
 * 3. Payment statistics and analytics
 * 4. Payment details and management
 */

import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, Plus } from 'lucide-react';
import { toast } from 'sonner';

// Layout components
import OwnerNavbar from '@/components/owner/OwnerNavbar';
import OwnerSidebar from '@/components/owner/OwnerSidebar';
import DashboardLayout from '@/components/layouts/DashboardLayout';

// UI components
import { Button } from '@/components/ui/button';

// Payment components
import {
  PaymentTable,
  PaymentStats,
  PaymentFormModal,
  PaymentDetailsModal,
  PaymentFilters,
  PaymentPagination,
  RefundModal
} from '@/components/payments';

// Context and hooks
import { PaymentProvider } from '@/contexts/PaymentContext';
import { usePaymentList } from '@/hooks/usePayments';

// Types
import { Payment, PaymentListParams, PaginationMeta } from '@/lib/types/payment';

// Comprehensive payment management component
const PaymentManagement = () => {
  // State management
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [filters, setFilters] = useState<PaymentListParams>({ page: 1, limit: 10 });

  // Use payment list hook
  const {
    payments,
    pagination,
    stats,
    statsError,
    isLoading,
    error,
    refetch
  } = usePaymentList(filters);

  // Handle payment creation success
  const handlePaymentSuccess = useCallback((paymentId: string) => {
    setShowPaymentForm(false);
    toast.success('Payment created successfully!');
    refetch(); // Refresh the payment list
  }, [refetch]);

  // Handle view payment details
  const handleViewDetails = useCallback((payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetails(true);
  }, []);

  // Handle refund initiation
  const handleRefund = useCallback((payment: Payment) => {
    setSelectedPayment(payment);
    setShowRefundModal(true);
  }, []);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: PaymentListParams) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // Handle page size changes
  const handlePageSizeChange = useCallback((limit: number) => {
    setFilters(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Management</h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and track all payment transactions
          </p>
        </div>
        <Button onClick={() => setShowPaymentForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Payment
        </Button>
      </div>

      {/* Payment Statistics */}
      <PaymentStats
        stats={stats}
        error={statsError}
        isLoading={isLoading}
      />

      {/* Payment Management Section */}
      <div className="space-y-6">
        {/* Filters */}
        <PaymentFilters
          onFiltersChange={handleFiltersChange}
          isLoading={isLoading}
        />

        {/* Payment Table */}
        <PaymentTable
          payments={payments}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          onRefund={handleRefund}
        />

        {/* Pagination */}
        {pagination && pagination.total > 0 && (
          <PaymentPagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Modals */}
      <PaymentFormModal
        isOpen={showPaymentForm}
        onClose={() => setShowPaymentForm(false)}
        onSuccess={handlePaymentSuccess}
      />

      {selectedPayment && (
        <>
          <PaymentDetailsModal
            payment={selectedPayment}
            isOpen={showPaymentDetails}
            onClose={() => {
              setShowPaymentDetails(false);
              setSelectedPayment(null);
            }}
          />

          <RefundModal
            payment={selectedPayment}
            isOpen={showRefundModal}
            onClose={() => {
              setShowRefundModal(false);
              setSelectedPayment(null);
            }}
            onSuccess={() => {
              setShowRefundModal(false);
              setSelectedPayment(null);
              refetch();
              toast.success('Refund initiated successfully');
            }}
          />
        </>
      )}
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
