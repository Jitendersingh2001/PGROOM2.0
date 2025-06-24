import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { RazorpayPaymentResponse, RazorpayCheckoutOptions, RazorpayInstance } from '@/lib/types/payment';

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

interface RazorpayPaymentProps {
  orderData: {
    orderId: string;
    amount: number;
    currency: string;
    razorpayKeyId: string;
  };
  userDetails?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (response: RazorpayPaymentResponse) => void;
  onFailure?: (error: Error | unknown) => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Razorpay Payment Button Component
 * Handles the Razorpay payment flow for tenant rent payments
 */
export const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  orderData,
  userDetails,
  onSuccess,
  onFailure,
  isLoading = false,
  disabled = false,
  className = "",
  children
}) => {
  const handlePayment = () => {
    if (!window.Razorpay) {
      console.error('Razorpay SDK not loaded');
      onFailure?.({ error: 'Payment gateway not available' });
      return;
    }

    const options: RazorpayCheckoutOptions = {
      key: orderData.razorpayKeyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'PGROOM',
      description: 'Monthly Rent Payment',
      order_id: orderData.orderId,
      handler: (response: RazorpayPaymentResponse) => {
        onSuccess({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        });
      },
      prefill: {
        name: userDetails?.name || '',
        email: userDetails?.email || '',
        contact: userDetails?.contact || ''
      },
      theme: {
        color: '#3399cc'
      },
      modal: {
        ondismiss: () => {
          console.log('Payment modal dismissed');
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', (response: { error: Error }) => {
        console.error('Payment failed:', response.error);
        onFailure?.(response.error);
      });

      rzp.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      onFailure?.(error);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      className={`w-full ${className}`}
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : children ? (
        children
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pay Rent
        </>
      )}
    </Button>
  );
};
