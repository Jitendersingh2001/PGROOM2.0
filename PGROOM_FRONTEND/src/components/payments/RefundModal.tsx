/**
 * RefundModal Component
 *
 * An enhanced modal component for initiating payment refunds with improved
 * UI/UX, form validation, confirmation dialog, and proper error handling
 * following senior-level React development practices.
 */

import React, { memo, useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertTriangle,
  RefreshCw,
  IndianRupee,
  CreditCard,
  User,
  Building,
  Home,
  Loader2,
  CheckCircle2,
  XCircle,
  Info,
  Calculator
} from 'lucide-react';
import { Payment } from '@/lib/types/payment';
import { useRefund } from '@/hooks/useRefund';
import RefundConfirmationDialog from './RefundConfirmationDialog';
import { cn } from '@/lib/utils';

// Enhanced refund form schema with better validation
const refundFormSchema = z.object({
  amount: z.number({
    required_error: 'Refund amount is required',
    invalid_type_error: 'Please enter a valid amount'
  })
    .min(0.01, 'Amount must be greater than ₹0.01')
    .max(999999.99, 'Amount cannot exceed ₹9,99,999.99'),
  reason: z.string()
    .min(3, 'Reason must be at least 3 characters')
    .max(500, 'Reason cannot exceed 500 characters')
    .optional(),
  isPartialRefund: z.boolean().default(false),
});

type RefundFormValues = z.infer<typeof refundFormSchema>;

// Props interface
interface RefundModalProps {
  payment: Payment;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Info row component for payment details
const InfoRow = memo<{
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  className?: string;
}>(({ icon: Icon, label, value, className }) => (
  <div className={cn('flex items-center justify-between py-2', className)}>
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <div className="font-medium">{value}</div>
  </div>
));

InfoRow.displayName = 'InfoRow';

// Main RefundModal Component
export const RefundModal = memo<RefundModalProps>(({
  payment,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingRefundData, setPendingRefundData] = useState<RefundFormValues | null>(null);

  // Use refund hook
  const {
    validateRefund,
    initiateRefund,
    isLoading,
    error,
    clearError
  } = useRefund();

  // Form setup with dynamic validation
  const form = useForm<RefundFormValues>({
    resolver: zodResolver(refundFormSchema.refine((data) => {
      const validation = validateRefund(payment, data.amount);
      return validation.canRefund;
    }, {
      message: 'Invalid refund amount',
      path: ['amount']
    })),
    defaultValues: {
      amount: payment.amount,
      reason: '',
      isPartialRefund: false,
    },
    mode: 'onChange'
  });

  // Watch form values for real-time validation
  const watchedAmount = form.watch('amount');
  const watchedIsPartial = form.watch('isPartialRefund');

  // Format currency
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: payment.currency || 'INR'
    }).format(amount);
  }, [payment.currency]);

  // Validate current form state
  const validation = validateRefund(payment, watchedAmount);

  // Handle form submission (show confirmation)
  const onSubmit = useCallback((values: RefundFormValues) => {
    if (!validation.canRefund) {
      return;
    }
    setPendingRefundData(values);
    setShowConfirmation(true);
  }, [validation.canRefund]);

  // Handle confirmed refund
  const handleConfirmedRefund = useCallback(async () => {
    if (!pendingRefundData) return;

    try {
      await initiateRefund(payment, {
        amount: pendingRefundData.amount,
        reason: pendingRefundData.reason
      });

      // Close modals and reset
      setShowConfirmation(false);
      setPendingRefundData(null);
      form.reset();
      onSuccess?.();
      onClose();
    } catch (error) {
      // Error is handled by the hook
      setShowConfirmation(false);
    }
  }, [pendingRefundData, initiateRefund, payment, form, onSuccess, onClose]);

  // Handle close
  const handleClose = useCallback(() => {
    if (!isLoading) {
      form.reset();
      clearError();
      onClose();
    }
  }, [isLoading, form, clearError, onClose]);

  // Handle partial refund toggle
  const handlePartialToggle = useCallback((isPartial: boolean) => {
    if (isPartial) {
      form.setValue('amount', Math.round(payment.amount * 0.5 * 100) / 100);
    } else {
      form.setValue('amount', payment.amount);
    }
    form.setValue('isPartialRefund', isPartial);
  }, [form, payment.amount]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        amount: payment.amount,
        reason: '',
        isPartialRefund: false,
      });
      clearError();
    }
  }, [isOpen, form, payment.amount, clearError]);

  // Check if payment can be refunded
  const baseValidation = validateRefund(payment);

  if (!baseValidation.canRefund) {
    return (
      <>
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                Cannot Refund Payment
              </DialogTitle>
              <DialogDescription>
                This payment cannot be refunded due to the following reason:
              </DialogDescription>
            </DialogHeader>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {baseValidation.reason}
                </AlertDescription>
              </Alert>

              <div className="mt-4 space-y-2">
                <InfoRow
                  icon={CreditCard}
                  label="Payment ID"
                  value={<span className="font-mono">#{payment.id.toString().padStart(6, '0')}</span>}
                />
                <InfoRow
                  icon={Badge}
                  label="Current Status"
                  value={<Badge variant="outline">{payment.status}</Badge>}
                />
                <InfoRow
                  icon={IndianRupee}
                  label="Amount"
                  value={formatCurrency(payment.amount)}
                />
              </div>
            </motion.div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[95vh] w-[95vw] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <motion.div
                animate={{ rotate: isLoading ? 360 : 0 }}
                transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }}
              >
                <RefreshCw className="h-5 w-5 text-blue-600" />
              </motion.div>
              Initiate Refund
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Process a refund for payment #{payment.id.toString().padStart(6, '0')}.
              Please review the details carefully before proceeding.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200 text-sm">
                      {error.message}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Payment Information */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    <InfoRow
                      icon={CreditCard}
                      label="Payment ID"
                      value={<span className="font-mono text-xs sm:text-sm">#{payment.id.toString().padStart(6, '0')}</span>}
                    />
                    <InfoRow
                      icon={IndianRupee}
                      label="Original Amount"
                      value={<span className="font-semibold text-sm sm:text-lg">{formatCurrency(payment.amount)}</span>}
                    />
                    <InfoRow
                      icon={User}
                      label="Tenant"
                      value={<span className="text-xs sm:text-sm truncate">{payment.tenant ? `${payment.tenant.firstName} ${payment.tenant.lastName}` : 'N/A'}</span>}
                    />
                    <InfoRow
                      icon={Building}
                      label="Property"
                      value={<span className="text-xs sm:text-sm truncate">{payment.property?.propertyName || 'N/A'}</span>}
                    />
                    <InfoRow
                      icon={Home}
                      label="Room"
                      value={<span className="text-xs sm:text-sm">{payment.room?.roomNo || 'N/A'}</span>}
                    />
                    <InfoRow
                      icon={CheckCircle2}
                      label="Status"
                      value={<Badge variant="default" className="bg-green-600 text-xs">{payment.status}</Badge>}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <Separator />

            {/* Refund Form */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
                    Refund Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                      {/* Refund Type Selection */}
                      <FormField
                        control={form.control}
                        name="isPartialRefund"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">Refund Type</FormLabel>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                              <Button
                                type="button"
                                variant={!field.value ? "default" : "outline"}
                                onClick={() => handlePartialToggle(false)}
                                disabled={isLoading}
                                className="flex-1 text-xs sm:text-sm h-auto py-2 sm:py-3"
                              >
                                <span className="text-center">
                                  Full Refund<br />
                                  <span className="text-xs opacity-80">({formatCurrency(payment.amount)})</span>
                                </span>
                              </Button>
                              <Button
                                type="button"
                                variant={field.value ? "default" : "outline"}
                                onClick={() => handlePartialToggle(true)}
                                disabled={isLoading}
                                className="flex-1 text-xs sm:text-sm h-auto py-2 sm:py-3"
                              >
                                Partial Refund
                              </Button>
                            </div>
                            <FormDescription className="text-xs sm:text-sm">
                              Choose whether to refund the full amount or a partial amount.
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      {/* Refund Amount */}
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Refund Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0.01"
                                  max={payment.amount}
                                  placeholder="Enter refund amount"
                                  className={cn(
                                    "pl-10",
                                    !validation.canRefund && "border-red-300 focus:border-red-500"
                                  )}
                                  value={field.value || ''}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;

                                    // Handle empty input
                                    if (inputValue === '') {
                                      field.onChange(0);
                                      form.setValue('isPartialRefund', true);
                                      return;
                                    }

                                    // Handle decimal point only
                                    if (inputValue === '.') {
                                      return; // Don't update, let user continue typing
                                    }

                                    // Parse the numeric value
                                    const numericValue = parseFloat(inputValue);
                                    if (!isNaN(numericValue) && numericValue >= 0) {
                                      field.onChange(numericValue);
                                      form.setValue('isPartialRefund', numericValue !== payment.amount);
                                    }
                                  }}
                                  disabled={isLoading}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Range: ₹0.01 - {formatCurrency(payment.amount)}</span>
                              {watchedAmount && (
                                <span className={validation.canRefund ? "text-green-600" : "text-red-600"}>
                                  {validation.canRefund ? "✓ Valid amount" : validation.reason}
                                </span>
                              )}
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* Refund Reason */}
                      <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reason for Refund</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please provide a reason for this refund (optional but recommended)..."
                                className="min-h-[100px] resize-none"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                            <FormDescription>
                              This reason will be recorded for audit purposes and may be visible to the tenant.
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      {/* Real-time Validation Feedback */}
                      <AnimatePresence>
                        {!validation.canRefund && watchedAmount > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <AlertDescription className="text-red-800 dark:text-red-200">
                                {validation.reason}
                              </AlertDescription>
                            </Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <DialogFooter className="gap-2 pt-4 flex-col sm:flex-row">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleClose}
                          disabled={isLoading}
                          className="w-full sm:w-auto order-2 sm:order-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading || !validation.canRefund}
                          className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-600 w-full sm:w-auto order-1 sm:order-2"
                        >
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Review Refund
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      {pendingRefundData && (
        <RefundConfirmationDialog
          payment={payment}
          refundAmount={pendingRefundData.amount}
          reason={pendingRefundData.reason}
          isOpen={showConfirmation}
          isLoading={isLoading}
          onConfirm={handleConfirmedRefund}
          onCancel={() => {
            setShowConfirmation(false);
            setPendingRefundData(null);
          }}
        />
      )}
    </>
  );
});

RefundModal.displayName = 'RefundModal';

export default RefundModal;
