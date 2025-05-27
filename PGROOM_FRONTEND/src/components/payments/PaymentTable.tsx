/**
 * PaymentTable Component
 *
 * A comprehensive table component for displaying payment data with modern UI,
 * sorting, filtering, pagination capabilities, and smooth animations.
 * Enhanced with micro-interactions and visual feedback.
 */

import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  FileText,
  Loader2
} from 'lucide-react';
import { Payment, PaymentStatus } from '@/lib/types/payment';
import { useInvoiceDownload } from '@/hooks/useInvoiceDownload';
import { cn } from '@/lib/utils';

// Props interface
interface PaymentTableProps {
  payments: Payment[];
  isLoading?: boolean;
  onViewDetails?: (payment: Payment) => void;
  onRefund?: (payment: Payment) => void;
  onStatusChange?: (payment: Payment, newStatus: PaymentStatus) => void;
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

// Interactive Status Component
const InteractiveStatusBadge = memo<{
  status: PaymentStatus;
  payment: Payment;
  onStatusChange?: (payment: Payment, newStatus: PaymentStatus) => void;
}>(({ status, payment, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Status configuration matching other pages styling
  const statusConfigs = {
    Pending: {
      icon: Clock,
      label: 'Pending',
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
      hoverClassName: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
      dotColor: 'bg-yellow-500'
    },
    Authorized: {
      icon: AlertCircle,
      label: 'Authorized',
      className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      hoverClassName: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
      dotColor: 'bg-blue-500'
    },
    Captured: {
      icon: CheckCircle2,
      label: 'Completed',
      className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
      hoverClassName: 'hover:bg-green-100 dark:hover:bg-green-900/30',
      dotColor: 'bg-green-500'
    },
    Failed: {
      icon: XCircle,
      label: 'Failed',
      className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      hoverClassName: 'hover:bg-red-100 dark:hover:bg-red-900/30',
      dotColor: 'bg-red-500'
    },
    Refunded: {
      icon: RefreshCw,
      label: 'Refunded',
      className: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800',
      hoverClassName: 'hover:bg-gray-100 dark:hover:bg-gray-900/30',
      dotColor: 'bg-gray-500'
    }
  };

  const config = statusConfigs[status];
  const IconComponent = config.icon;

  // Available status transitions (business logic)
  const getAvailableStatuses = (currentStatus: PaymentStatus): PaymentStatus[] => {
    switch (currentStatus) {
      case 'Pending':
        return ['Authorized', 'Failed'];
      case 'Authorized':
        return ['Captured', 'Failed'];
      case 'Captured':
        return ['Refunded'];
      case 'Failed':
        return ['Pending']; // Allow retry
      case 'Refunded':
        return []; // Final state
      default:
        return [];
    }
  };

  const availableStatuses = getAvailableStatuses(status);
  const canChangeStatus = onStatusChange && availableStatuses.length > 0;

  const handleStatusChange = (newStatus: PaymentStatus) => {
    if (onStatusChange) {
      onStatusChange(payment, newStatus);
    }
    setIsOpen(false);
  };

  if (!canChangeStatus) {
    // Non-interactive badge for final states or when no handler provided
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Badge
          variant="outline"
          className={cn('text-xs font-medium px-2.5 py-0.5', config.className)}
        >
          <span className="flex items-center gap-1">
            <span className={cn('relative flex h-2 w-2 rounded-full', config.dotColor)}>
              {status === 'Pending' && (
                <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', config.dotColor)}></span>
              )}
            </span>
            {config.label}
          </span>
        </Badge>
      </motion.div>
    );
  }

  // Interactive status selector
  return (
    <Select value={status} onValueChange={handleStatusChange} open={isOpen} onOpenChange={setIsOpen}>
      <SelectTrigger
        className={cn(
          'h-auto p-0 border-0 bg-transparent hover:bg-transparent focus:ring-0 focus:ring-offset-0',
          'w-auto min-w-0'
        )}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Badge
            variant="outline"
            className={cn(
              'text-xs font-medium px-2.5 py-0.5 cursor-pointer transition-all duration-200',
              config.className,
              config.hoverClassName,
              'hover:shadow-sm'
            )}
          >
            <span className="flex items-center gap-1">
              <span className={cn('relative flex h-2 w-2 rounded-full', config.dotColor)}>
                {status === 'Pending' && (
                  <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', config.dotColor)}></span>
                )}
              </span>
              {config.label}
              <ChevronDown className="h-3 w-3 opacity-50 ml-1" />
            </span>
          </Badge>
        </motion.div>
      </SelectTrigger>
      <SelectContent align="center" className="min-w-[140px]">
        {availableStatuses.map((statusOption) => {
          const optionConfig = statusConfigs[statusOption];

          return (
            <SelectItem
              key={statusOption}
              value={statusOption}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className={cn('flex h-2 w-2 rounded-full', optionConfig.dotColor)}></span>
                {optionConfig.label}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
});

InteractiveStatusBadge.displayName = 'InteractiveStatusBadge';

// Payment Method Badge Component
const PaymentMethodBadge = memo<{ method?: string; methodDetails?: string }>(({ method, methodDetails }) => {
  if (!method) {
    return <span className="text-muted-foreground text-sm">-</span>;
  }

  // Display detailed method if available, otherwise fall back to general method
  const displayMethod = methodDetails || method;

  // Capitalize the method name for better display
  const formattedMethod = displayMethod.charAt(0).toUpperCase() + displayMethod.slice(1);

  return (
    <Badge variant="outline" className="text-xs">
      {formattedMethod}
    </Badge>
  );
});

PaymentMethodBadge.displayName = 'PaymentMethodBadge';

// Table Row Component
const PaymentTableRow = memo<{
  payment: Payment;
  onViewDetails?: (payment: Payment) => void;
  onRefund?: (payment: Payment) => void;
  onStatusChange?: (payment: Payment, newStatus: PaymentStatus) => void;
}>(({ payment, onViewDetails, onRefund, onStatusChange }) => {
  // Invoice download hook
  const { downloadInvoice, isGenerating } = useInvoiceDownload();

  // Format date
  const formatDate = useCallback((dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  }, []);

  // Format time
  const formatTime = useCallback((dateString: string) => {
    return format(new Date(dateString), 'hh:mm a');
  }, []);

  // Handle invoice download
  const handleDownloadInvoice = useCallback(async () => {
    await downloadInvoice(payment);
  }, [downloadInvoice, payment]);

  const canRefund = payment.status === 'Captured';
  const canDownloadInvoice = true; // Allow invoice download for all payments

  return (
    <TableRow className="hover:bg-muted/50 transition-colors group">
      {/* Payment ID */}
      <TableCell className="font-medium">
        <span className="font-mono text-sm">
          #{payment.id.toString().padStart(6, '0')}
        </span>
      </TableCell>

      {/* Tenant */}
      <TableCell>
        <div className="font-medium">
          {payment.tenant ? `${payment.tenant.firstName} ${payment.tenant.lastName}` : 'N/A'}
        </div>
      </TableCell>

      {/* Property */}
      <TableCell>
        <span className="font-medium">
          {payment.property?.propertyName || 'N/A'}
        </span>
      </TableCell>

      {/* Room */}
      <TableCell>
        <span className="font-medium">
          {payment.room?.roomNo || 'N/A'}
        </span>
      </TableCell>

      {/* Amount */}
      <TableCell>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">₹</span>
          <span className="font-semibold text-lg">{payment.amount.toLocaleString('en-IN')}</span>
        </div>
      </TableCell>

      {/* Payment Method */}
      <TableCell>
        <PaymentMethodBadge method={payment.paymentMethod} methodDetails={payment.paymentMethodDetails} />
      </TableCell>

      {/* Status */}
      <TableCell>
        <InteractiveStatusBadge
          status={payment.status}
          payment={payment}
          onStatusChange={onStatusChange}
        />
      </TableCell>

      {/* Date & Time */}
      <TableCell>
        <div className="text-sm font-medium">
          {formatDate(payment.createdAt)} {formatTime(payment.createdAt)}
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
            {canDownloadInvoice && (
              <DropdownMenuItem
                onClick={handleDownloadInvoice}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </motion.div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice
                  </>
                )}
              </DropdownMenuItem>
            )}
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
  onStatusChange,
  className
}) => {

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={className}>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <motion.div
                className="flex items-center gap-2"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="h-4 w-4" />
                </motion.div>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  Loading payments...
                </motion.span>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className={className}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <CreditCard className="h-8 w-8 text-muted-foreground mb-2" />
              </motion.div>
              <motion.h3
                className="font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                No payments found
              </motion.h3>
              <motion.p
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {!payments ? 'Failed to load payments.' : 'No payments match your current filters.'}
              </motion.p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={className}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Payment ID</TableHead>
                  <TableHead className="font-semibold">Tenant</TableHead>
                  <TableHead className="font-semibold">Property</TableHead>
                  <TableHead className="font-semibold">Room</TableHead>
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
                    onStatusChange={onStatusChange}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

PaymentTable.displayName = 'PaymentTable';

export default PaymentTable;
