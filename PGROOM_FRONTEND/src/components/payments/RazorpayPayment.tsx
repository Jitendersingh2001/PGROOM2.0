import React, { useEffect } from 'react';
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
  autoTrigger?: boolean; // New prop to auto-trigger payment
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
  children,
  autoTrigger = false
}) => {
  console.log('RazorpayPayment component rendered with orderData:', orderData);
  
  const handlePayment = () => {
    console.log('RazorpayPayment handlePayment called');
    console.log('Razorpay SDK available:', !!window.Razorpay);
    
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
          // If user dismisses the modal, call onFailure to reset the state
          onFailure?.(new Error('Payment cancelled by user'));
        }
      }
    };

    try {
      console.log('Creating Razorpay instance with options:', options);
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', (response: { error: Error }) => {
        console.error('Payment failed:', response.error);
        onFailure?.(response.error);
      });

      console.log('Opening Razorpay modal');
      rzp.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      onFailure?.(error);
    }
  };

  // Auto-trigger payment when component mounts if autoTrigger is true
  useEffect(() => {
    if (autoTrigger && orderData && !isLoading && !disabled) {
      console.log('Auto-triggering payment on component mount');
      
      const triggerPayment = () => {
        console.log('Auto-triggered payment execution');
        console.log('Razorpay SDK available:', !!window.Razorpay);
        
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
              onFailure?.(new Error('Payment cancelled by user'));
            }
          }
        };

        try {
          console.log('Creating Razorpay instance with options:', options);
          const rzp = new window.Razorpay(options);
          
          rzp.on('payment.failed', (response: { error: Error }) => {
            console.error('Payment failed:', response.error);
            onFailure?.(response.error);
          });

          console.log('Opening Razorpay modal');
          rzp.open();
        } catch (error) {
          console.error('Error opening Razorpay:', error);
          onFailure?.(error);
        }
      };

      // Add a small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        triggerPayment();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [autoTrigger, orderData, isLoading, disabled, onSuccess, onFailure, userDetails]);

  // If autoTrigger is enabled, return a simple loading/status component
  if (autoTrigger) {
    return (
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Opening payment gateway...
        </div>
      </div>
    );
  }

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
