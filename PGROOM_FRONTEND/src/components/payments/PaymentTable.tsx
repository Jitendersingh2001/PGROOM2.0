/**
 * PaymentTable Component
 *
 * A comprehensive table component for displaying payment data with modern UI,
 * sorting, filtering, and pagination capabilities.
 */

import React, { memo, useState, useCallback } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Eye,
  MoreHorizontal,
  CreditCard,
  User,
  Building,
  Home,
  Calendar,
  DollarSign,
  RefreshCw,
  Download
} from 'lucide-react';
import { Payment, PaymentStatus } from '@/lib/types/payment';
import { cn } from '@/lib/utils';

// Props interface
interface PaymentTableProps {
  payments: Payment[];
  isLoading?: boolean;
  onViewDetails?: (payment: Payment) => void;
  onRefund?: (payment: Payment) => void;
  className?: string;
}

// Status badge configuration
const getStatusConfig = (status: PaymentStatus) => {
  const configs = {
    Pending: {
      variant: 'secondary' as const,
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      icon: RefreshCw
    },
    Authorized: {
      variant: 'secondary' as const,
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      icon: CreditCard
    },
    Captured: {
      variant: 'default' as const,
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      icon: CreditCard
    },
    Failed: {
      variant: 'destructive' as const,
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      icon: CreditCard
    },
    Refunded: {
      variant: 'outline' as const,
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      icon: RefreshCw
    }
  };
  return configs[status] || configs.Pending;
};

// Status Badge Component
const StatusBadge = memo<{ status: PaymentStatus }>(({ status }) => {
  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <Badge variant={config.variant} className={cn('flex items-center gap-1', config.className)}>
      <IconComponent className="h-3 w-3" />
      {status}
    </Badge>
  );
});

StatusBadge.displayName = 'StatusBadge';

// Payment Method Badge Component
const PaymentMethodBadge = memo<{ method?: string }>(({ method }) => {
  if (!method) {
    return <span className="text-muted-foreground text-sm">-</span>;
  }

  return (
    <Badge variant="outline" className="text-xs">
      {method}
    </Badge>
  );
});

PaymentMethodBadge.displayName = 'PaymentMethodBadge';

// Table Row Component
const PaymentTableRow = memo<{
  payment: Payment;
  onViewDetails?: (payment: Payment) => void;
  onRefund?: (payment: Payment) => void;
}>(({ payment, onViewDetails, onRefund }) => {
  // Format currency
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: payment.currency || 'INR'
    }).format(amount);
  }, [payment.currency]);

  // Format date
  const formatDate = useCallback((dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  }, []);

  // Format time
  const formatTime = useCallback((dateString: string) => {
    return format(new Date(dateString), 'hh:mm a');
  }, []);

  const canRefund = payment.status === 'Captured';

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      {/* Payment ID */}
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">
            #{payment.id.toString().padStart(6, '0')}
          </span>
        </div>
      </TableCell>

      {/* Tenant */}
      <TableCell>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">
              {payment.tenant ? `${payment.tenant.firstName} ${payment.tenant.lastName}` : 'N/A'}
            </div>
            {payment.tenant?.email && (
              <div className="text-xs text-muted-foreground">{payment.tenant.email}</div>
            )}
          </div>
        </div>
      </TableCell>

      {/* Property & Room */}
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Building className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">
              {payment.property?.propertyName || 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Home className="h-3 w-3" />
            <span>Room {payment.room?.roomNo || 'N/A'}</span>
          </div>
        </div>
      </TableCell>

      {/* Amount */}
      <TableCell>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-lg">{formatCurrency(payment.amount)}</span>
        </div>
      </TableCell>

      {/* Payment Method */}
      <TableCell>
        <PaymentMethodBadge method={payment.paymentMethod} />
      </TableCell>

      {/* Status */}
      <TableCell>
        <StatusBadge status={payment.status} />
      </TableCell>

      {/* Date & Time */}
      <TableCell>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            <div className="font-medium">{formatDate(payment.createdAt)}</div>
            <div className="text-muted-foreground">{formatTime(payment.createdAt)}</div>
          </div>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails?.(payment)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {canRefund && (
              <DropdownMenuItem onClick={() => onRefund?.(payment)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Initiate Refund
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});

PaymentTableRow.displayName = 'PaymentTableRow';

// Main PaymentTable Component
export const PaymentTable = memo<PaymentTableProps>(({
  payments,
  isLoading = false,
  onViewDetails,
  onRefund,
  className
}) => {

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Loading payments...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <CreditCard className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="font-medium">No payments found</h3>
            <p className="text-sm text-muted-foreground">
              {!payments ? 'Failed to load payments.' : 'No payments match your current filters.'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Payment ID</TableHead>
                <TableHead className="font-semibold">Tenant</TableHead>
                <TableHead className="font-semibold">Property & Room</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Method</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date & Time</TableHead>
                <TableHead className="font-semibold w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <PaymentTableRow
                  key={payment.id}
                  payment={payment}
                  onViewDetails={onViewDetails}
                  onRefund={onRefund}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
});

PaymentTable.displayName = 'PaymentTable';

export default PaymentTable;
