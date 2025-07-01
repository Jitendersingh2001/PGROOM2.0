import React, { useEffect, useState } from 'react';
import { Home, Calendar, CreditCard, Users, Star } from 'lucide-react';
import StatsCard from './StatsCard';
import { cn } from '@/lib/utils';
import { useTenantPayments } from '@/hooks/useTenantPayments';

interface TenantStatsDashboardProps {
  className?: string;
}

/**
 * TenantStatsDashboard - A dashboard component displaying key statistics for tenants
 *
 * This component is designed to be used in the tenant dashboard page.
 * It displays key metrics relevant to tenants like rent payments, room details, etc.
 */
const TenantStatsDashboard: React.FC<TenantStatsDashboardProps> = ({
  className,
}) => {
  // Use the existing tenant payments hook which provides all the real data we need
  const {
    roomDetails,
    stats,
    payments,
    isLoading,
    error,
  } = useTenantPayments();

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format date strings
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get last payment information
  const getLastPaymentInfo = () => {
    if (!payments || payments.length === 0) return null;
    
    // Find the most recent successful payment
    const successfulPayments = payments.filter(payment => payment.status === 'Captured');
    return successfulPayments.length > 0 ? successfulPayments[0] : null;
  };

  const lastPayment = getLastPaymentInfo();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Stats Cards for Tenants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="My Room"
          value={roomDetails?.roomNo || '-'}
          icon={<Home className="w-5 h-5" />}
          description={roomDetails?.property?.name || 'Not assigned'}
          isLoading={isLoading}
        />

        <StatsCard
          title="Monthly Rent"
          value={roomDetails ? formatCurrency(parseFloat(roomDetails.rent.toString())) : '-'}
          icon={<CreditCard className="w-5 h-5" />}
          description="Current rent amount"
          isLoading={isLoading}
        />

        <StatsCard
          title="Last Payment"
          value={lastPayment ? formatCurrency(lastPayment.amount) : '-'}
          icon={<CreditCard className="w-5 h-5" />}
          description={lastPayment ? `Paid on ${formatDate(lastPayment.createdAt)}` : 'No payments yet'}
          isLoading={isLoading}
        />

        <StatsCard
          title="Next Due Date"
          value={stats?.nextDueDate ? formatDate(stats.nextDueDate) : '-'}
          icon={<Calendar className="w-5 h-5" />}
          description="Upcoming payment"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default TenantStatsDashboard;
