/**
 * PaymentStats Component
 *
 * Displays payment statistics and key metrics in a modern card layout
 * with proper formatting and visual indicators.
 */

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Stats data interface
interface PaymentStatsData {
  totalPayments: number;
  totalAmount: number;
  successfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedPayments: number;
  successRate: number;
  currency?: string;
}

// Props interface
interface PaymentStatsProps {
  stats: PaymentStatsData | null;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

// Individual stat card component
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

const StatCard = memo<StatCardProps>(({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  iconClassName
}) => (
  <Card className={cn('transition-all hover:shadow-md', className)}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className={cn('h-4 w-4 text-muted-foreground', iconClassName)} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">
          {subtitle}
        </p>
      )}
      {trend && (
        <div className="flex items-center mt-2">
          <Badge
            variant={trend.isPositive ? 'default' : 'destructive'}
            className="text-xs"
          >
            <TrendingUp className={cn(
              'h-3 w-3 mr-1',
              !trend.isPositive && 'rotate-180'
            )} />
            {Math.abs(trend.value)}%
          </Badge>
          <span className="text-xs text-muted-foreground ml-2">
            vs last month
          </span>
        </div>
      )}
    </CardContent>
  </Card>
));

StatCard.displayName = 'StatCard';

// Loading skeleton component
const StatCardSkeleton = memo(() => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
      <div className="h-4 w-4 bg-muted animate-pulse rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
      <div className="h-3 w-32 bg-muted animate-pulse rounded" />
    </CardContent>
  </Card>
));

StatCardSkeleton.displayName = 'StatCardSkeleton';

// Main PaymentStats Component
export const PaymentStats = memo<PaymentStatsProps>(({
  stats,
  isLoading = false,
  error = null,
  className
}) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: stats?.currency || 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Error state or no data
  if (error || !stats) {
    const isAuthError = error?.includes('Unauthorized') || error?.includes('401');
    const message = isAuthError
      ? 'Please log in to view payment statistics'
      : error || 'No payment data available';

    return (
      <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
        {/* Total Revenue */}
        <Card className="border-dashed">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--</div>
            <p className="text-xs text-muted-foreground mt-1">
              {message}
            </p>
          </CardContent>
        </Card>

        {/* Total Payments */}
        <Card className="border-dashed">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Payments
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--</div>
            <p className="text-xs text-muted-foreground mt-1">
              {message}
            </p>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card className="border-dashed">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success Rate
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {message}
            </p>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="border-dashed">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payments
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--</div>
            <p className="text-xs text-muted-foreground mt-1">
              {message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      {/* Total Revenue */}
      <StatCard
        title="Total Revenue"
        value={formatCurrency(stats.totalAmount)}
        subtitle="From all successful payments"
        icon={DollarSign}
        iconClassName="text-green-600"
        className="border-l-4 border-l-green-500"
      />

      {/* Total Payments */}
      <StatCard
        title="Total Payments"
        value={stats.totalPayments.toLocaleString()}
        subtitle="All payment transactions"
        icon={CreditCard}
        iconClassName="text-blue-600"
        className="border-l-4 border-l-blue-500"
      />

      {/* Success Rate */}
      <StatCard
        title="Success Rate"
        value={formatPercentage(stats.successRate)}
        subtitle={`${stats.successfulPayments} successful payments`}
        icon={CheckCircle}
        iconClassName="text-green-600"
        className="border-l-4 border-l-green-500"
      />

      {/* Pending Payments */}
      <StatCard
        title="Pending Payments"
        value={stats.pendingPayments.toLocaleString()}
        subtitle="Awaiting completion"
        icon={Clock}
        iconClassName="text-yellow-600"
        className="border-l-4 border-l-yellow-500"
      />
    </div>
  );
});

PaymentStats.displayName = 'PaymentStats';

// Additional detailed stats component
interface DetailedStatsProps {
  stats: PaymentStatsData;
  isLoading?: boolean;
  className?: string;
}

export const DetailedPaymentStats = memo<DetailedStatsProps>(({
  stats,
  isLoading = false,
  className
}) => {
  if (isLoading) {
    return (
      <div className={cn('grid gap-4 md:grid-cols-3', className)}>
        {Array.from({ length: 3 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4 md:grid-cols-3', className)}>
      {/* Successful Payments */}
      <StatCard
        title="Successful Payments"
        value={stats.successfulPayments.toLocaleString()}
        subtitle="Completed transactions"
        icon={CheckCircle}
        iconClassName="text-green-600"
      />

      {/* Failed Payments */}
      <StatCard
        title="Failed Payments"
        value={stats.failedPayments.toLocaleString()}
        subtitle="Unsuccessful transactions"
        icon={XCircle}
        iconClassName="text-red-600"
      />

      {/* Refunded Payments */}
      <StatCard
        title="Refunded Payments"
        value={stats.refundedPayments.toLocaleString()}
        subtitle="Refund transactions"
        icon={RefreshCw}
        iconClassName="text-gray-600"
      />
    </div>
  );
});

DetailedPaymentStats.displayName = 'DetailedPaymentStats';

export default PaymentStats;
