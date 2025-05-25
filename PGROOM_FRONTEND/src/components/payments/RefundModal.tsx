/**
 * RefundModal Component
 * 
 * A modal component for initiating payment refunds with form validation
 * and proper error handling.
 */

import React, { memo, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertTriangle,
  RefreshCw,
  DollarSign,
  CreditCard,
  User,
  Building,
  Loader2
} from 'lucide-react';
import { Payment, RefundRequest } from '@/lib/types/payment';
import { paymentService } from '@/lib/api/services';
import { cn } from '@/lib/utils';

// Refund form schema
const refundFormSchema = z.object({
  amount: z.number()
    .min(0.01, 'Amount must be greater than 0')
    .optional(),
  reason: z.string()
    .min(3, 'Reason must be at least 3 characters')
    .max(255, 'Reason cannot exceed 255 characters')
    .optional(),
});

type RefundFormValues = z.infer<typeof refundFormSchema>;

// Props interface
interface RefundModalProps {
  payment: Payment;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Main RefundModal Component
export const RefundModal = memo<RefundModalProps>(({
  payment,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Form setup
  const form = useForm<RefundFormValues>({
    resolver: zodResolver(refundFormSchema),
    defaultValues: {
      amount: payment.amount,
      reason: '',
    }
  });

  // Format currency
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: payment.currency || 'INR'
    }).format(amount);
  }, [payment.currency]);

  // Handle form submission
  const onSubmit = useCallback(async (values: RefundFormValues) => {
    setIsLoading(true);

    try {
      const refundData: RefundRequest = {
        paymentId: payment.id,
        ...(values.amount && values.amount !== payment.amount && { amount: values.amount }),
        ...(values.reason && { reason: values.reason })
      };

      await paymentService.initiateRefund(refundData);
      
      toast.success('Refund initiated successfully');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to initiate refund');
    } finally {
      setIsLoading(false);
    }
  }, [payment.id, payment.amount, onSuccess, onClose]);

  // Handle close
  const handleClose = useCallback(() => {
    if (!isLoading) {
      form.reset();
      onClose();
    }
  }, [isLoading, form, onClose]);

  // Check if payment can be refunded
  const canRefund = payment.status === 'Captured';

  if (!canRefund) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Cannot Refund Payment
            </DialogTitle>
            <DialogDescription>
              This payment cannot be refunded because it is not in a captured state.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Current Status:</span>
              <Badge variant="outline">{payment.status}</Badge>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Initiate Refund
          </DialogTitle>
          <DialogDescription>
            Process a refund for payment #{payment.id.toString().padStart(6, '0')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="font-medium">Payment Information</h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Payment ID
                </div>
                <div className="font-mono">#{payment.id.toString().padStart(6, '0')}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Amount
                </div>
                <div className="font-semibold">{formatCurrency(payment.amount)}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  Tenant
                </div>
                <div>
                  {payment.tenant ? `${payment.tenant.firstName} ${payment.tenant.lastName}` : 'N/A'}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="h-4 w-4" />
                  Property
                </div>
                <div>{payment.property?.propertyName || 'N/A'}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Refund Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium">Refund Details</h3>
                
                {/* Refund Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refund Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            max={payment.amount}
                            placeholder="Enter refund amount"
                            className="pl-10"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                      <div className="text-xs text-muted-foreground">
                        Maximum refundable amount: {formatCurrency(payment.amount)}
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
                      <FormLabel>Reason for Refund (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter reason for refund..."
                          className="min-h-[80px]"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Initiate Refund
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
});

RefundModal.displayName = 'RefundModal';

export default RefundModal;
