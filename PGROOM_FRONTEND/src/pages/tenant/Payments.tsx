import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, IndianRupee, Clock, CheckCircle, AlertCircle, Home, Users, Receipt, Building2, Star, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import TenantNavbar from '@/components/tenant/TenantNavbar';
import TenantSidebar from '@/components/tenant/TenantSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { RazorpayPayment } from '@/components/payments/RazorpayPayment';
import { useTenantPayments } from '@/hooks/useTenantPayments';
import { Payment, CreatePaymentOrderResponse } from '@/lib/types/payment';
import { toast } from 'sonner';

const TenantPayments = () => {
  const {
    tenantId,
    roomDetails,
    payments,
    stats,
    isLoading,
    isCreatingOrder,
    isVerifying,
    error,
    createPaymentOrder,
    verifyPayment,
    fetchPayments,
    refresh
  } = useTenantPayments();

  const [currentOrderData, setCurrentOrderData] = useState<CreatePaymentOrderResponse | null>(null);

  // Debug effect for currentOrderData changes
  useEffect(() => {
    console.log('currentOrderData changed:', currentOrderData);
    if (currentOrderData) {
      console.log('Razorpay payment should now be visible');
    }
  }, [currentOrderData]);

  // Load Razorpay script
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

  // Handle payment initiation
  const handlePayRent = async () => {
    try {
      console.log('handlePayRent called');
      const orderData = await createPaymentOrder();
      console.log('Order data received:', orderData);
      if (orderData) {
        setCurrentOrderData(orderData);
        console.log('Current order data set:', orderData);
        // Payment modal will auto-open due to autoTrigger prop
      }
    } catch (error) {
      console.error('Error creating payment order:', error);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    try {
      await verifyPayment(response);
      setCurrentOrderData(null);
      toast.success('Payment completed successfully!');
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  // Handle payment failure
  const handlePaymentFailure = (error: Error | unknown) => {
    console.error('Payment failed:', error);
    toast.error('Payment failed. Please try again.');
    setCurrentOrderData(null);
  };

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format date strings
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status badge based on payment status
  const getStatusBadge = (status: Payment['status']) => {
    const badges = {
      Captured: <Badge className="bg-green-100 text-green-800">Paid</Badge>,
      Pending: <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>,
      Authorized: <Badge className="bg-blue-100 text-blue-800">Authorized</Badge>,
      Failed: <Badge className="bg-red-100 text-red-800">Failed</Badge>,
      Refunded: <Badge className="bg-gray-100 text-gray-800">Refunded</Badge>,
    };
    return badges[status] || <Badge variant="outline">{status}</Badge>;
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-green-600 to-emerald-700 rounded-2xl shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-8 py-10">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-12 w-12 rounded-xl bg-white/20" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48 bg-white/20" />
              <Skeleton className="h-4 w-32 bg-white/10" />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Skeleton className="h-6 w-6 rounded-full bg-white/20 mx-auto mb-2" />
                <Skeleton className="h-3 w-16 bg-white/10 mx-auto mb-1" />
                <Skeleton className="h-5 w-12 bg-white/20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <DashboardLayout navbar={<TenantNavbar />} sidebar={<TenantSidebar />}>
        <div className="w-full space-y-6">
          <LoadingSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout navbar={<TenantNavbar />} sidebar={<TenantSidebar />}>
        <div className="w-full space-y-6">
          {/* Modern Header Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-primary via-green-600 to-emerald-700 dark:from-primary dark:via-green-500 dark:to-emerald-600 rounded-2xl shadow-2xl mx-6 lg:mx-8">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative px-8 py-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">
                    Rent Payments
                  </h1>
                  <p className="text-green-100 text-base font-medium mt-1">
                    Manage your rent payments and view payment history
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Error Card */}
          <Card className="border-destructive/20 bg-destructive/5 mx-6 lg:mx-8">
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center max-w-md">
                <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Unable to Load Payments</h3>
                <p className="text-muted-foreground mb-6">
                  {error} Please contact support if the issue persists.
                </p>
                <Button variant="outline" onClick={refresh}>
                  <Receipt className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navbar={<TenantNavbar />}
      sidebar={<TenantSidebar />}
    >
      <div className="w-full space-y-6">
        {/* Modern Header Section - Full Width */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary via-green-600 to-emerald-700 dark:from-primary dark:via-green-500 dark:to-emerald-600 rounded-2xl shadow-2xl mx-6 lg:mx-8">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-10">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-3">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-1">
                      Rent Payments
                    </h1>
                    <p className="text-green-100 text-base font-medium">
                      Manage your rent payments and view payment history
                    </p>
                  </div>
                  
                  {/* Room Information Integrated */}
                  {roomDetails && (
                    <div className="flex flex-wrap items-center gap-6 text-green-200">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="text-sm font-medium">{roomDetails.property.name}</span>
                      </div>
                      <div className="w-1 h-1 bg-green-200 rounded-full"></div>
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        <span className="text-sm">Room {roomDetails.roomNo}</span>
                      </div>
                      <div className="w-1 h-1 bg-green-200 rounded-full"></div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4" />
                        <span className="text-sm font-semibold">{formatCurrency(parseFloat(roomDetails.rent.toString()))}/month</span>
                      </div>
                      <div className="w-1 h-1 bg-green-200 rounded-full"></div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{roomDetails.tenants.length} {roomDetails.tenants.length === 1 ? 'Tenant' : 'Tenants'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right side - Status and Member info */}
              <div className="flex flex-col items-end gap-3">
                {roomDetails && stats && (
                  <div className="text-right">
                    <div className="text-xs text-green-200 mb-1 tracking-wider">STATUS</div>
                    <Badge variant="outline" className={`${stats.isOverdue ? 'bg-red-50/20 text-red-100 border-red-300/40' : 'bg-green-50/20 text-green-100 border-green-300/40'} px-4 py-2 text-sm font-medium`}>
                      {stats.isOverdue ? 'Payment Overdue' : 'Current'}
                    </Badge>
                  </div>
                )}
                {roomDetails?.tenants?.[0] && (
                  <div className="text-right">
                    <div className="text-xs text-green-200 mb-1 tracking-wider">TENANT</div>
                    <div className="flex items-center gap-2 text-white">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {roomDetails.tenants[0].name || 'Current Tenant'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quick Stats - Enhanced Grid */}
            {stats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200 ${stats.isOverdue ? 'border-red-300/40 bg-red-100/10' : ''}`}>
                  <div className="text-center">
                    <Calendar className={`h-6 w-6 mx-auto mb-2 ${stats.isOverdue ? 'text-red-200' : 'text-green-200'}`} />
                    <p className="text-green-100 text-xs mb-1">Next Payment</p>
                    <p className={`font-bold text-lg ${stats.isOverdue ? 'text-red-100' : 'text-white'}`}>
                      {formatCurrency(stats.nextDueAmount)}
                    </p>
                    <p className={`text-xs ${stats.isOverdue ? 'text-red-200' : 'text-green-200'}`}>
                      {stats.isOverdue ? 'Overdue!' : formatDate(stats.nextDueDate)}
                    </p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200">
                  <div className="text-center">
                    <CheckCircle className="h-6 w-6 text-emerald-200 mx-auto mb-2" />
                    <p className="text-green-100 text-xs mb-1">Total Paid</p>
                    <p className="text-white font-bold text-lg">{formatCurrency(stats.totalPaid)}</p>
                    <p className="text-xs text-green-200">This Year</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200">
                  <div className="text-center">
                    <Clock className="h-6 w-6 text-orange-200 mx-auto mb-2" />
                    <p className="text-green-100 text-xs mb-1">Pending Amount</p>
                    <p className="text-white font-bold text-lg">{formatCurrency(stats.pendingAmount)}</p>
                    <p className="text-xs text-green-200">Awaiting Payment</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200">
                  <div className="text-center">
                    <IndianRupee className="h-6 w-6 text-blue-200 mx-auto mb-2" />
                    <p className="text-green-100 text-xs mb-2">Quick Pay</p>
                    <Button 
                      onClick={handlePayRent}
                      disabled={isCreatingOrder || !roomDetails || stats?.currentMonthPaid}
                      className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm text-xs py-2 h-8"
                      variant="outline"
                      size="sm"
                    >
                      {isCreatingOrder ? (
                        <>
                          <Clock className="mr-1 h-3 w-3 animate-spin" />
                          Processing...
                        </>
                      ) : stats?.currentMonthPaid ? (
                        <>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Paid
                        </>
                      ) : (
                        <>
                          <IndianRupee className="mr-1 h-3 w-3" />
                          Pay Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hidden Razorpay Payment Component - Auto-triggers when currentOrderData is set */}
        {currentOrderData && (
          <div className="hidden">
            <RazorpayPayment
              orderData={currentOrderData}
              userDetails={{
                name: roomDetails?.tenants?.[0]?.name || 'Tenant',
                email: '',
                contact: ''
              }}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
              isLoading={isVerifying}
              autoTrigger={true}
            />
          </div>
        )}

        {/* Payment History - Full Screen Width */}
        <div className="mx-6 lg:mx-8">
          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Receipt className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="text-xl">Payment History</CardTitle>
                    <CardDescription className="text-sm">Your complete rent payment history</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs w-fit">
                  {payments.length} Payment{payments.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {payments.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <div className="bg-muted/50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Receipt className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">No payments yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Your payment history will appear here once you make your first payment.
                  </p>
                  {roomDetails && !stats?.currentMonthPaid && (
                    <Button onClick={handlePayRent} disabled={isCreatingOrder}>
                      <IndianRupee className="mr-2 h-4 w-4" />
                      Make Your First Payment
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {/* Mobile-first responsive design */}
                  <div className="block sm:hidden">
                    {/* Mobile card layout */}
                    <div className="space-y-4 p-6">
                      {payments.map((payment) => (
                        <div key={payment.id} className="bg-muted/30 rounded-lg p-4 space-y-3 border border-border/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatDate(payment.createdAt)}
                            </div>
                            {getStatusBadge(payment.status)}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 font-semibold text-lg">
                              <IndianRupee className="h-4 w-4" />
                              {formatCurrency(payment.amount)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CreditCard className="h-4 w-4" />
                              {payment.paymentMethod || payment.paymentMethodDetails || 'N/A'}
                            </div>
                          </div>
                          {payment.razorpayPaymentId && (
                            <div className="text-xs text-muted-foreground">
                              <span className="font-mono bg-muted px-2 py-1 rounded">
                                TXN: {payment.razorpayPaymentId.slice(-8)}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desktop table layout - Full Width */}
                  <div className="hidden sm:block w-full">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-border/50">
                          <TableHead className="font-semibold text-xs uppercase tracking-wider w-[150px]">Date</TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider w-[120px]">Amount</TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider w-[100px]">Status</TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider hidden md:table-cell w-[140px]">Method</TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">Transaction ID</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id} className="hover:bg-muted/30 transition-colors border-border/30">
                            <TableCell className="font-medium py-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="font-semibold">
                                    {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                                      day: '2-digit',
                                      month: 'short'
                                    })}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(payment.createdAt).getFullYear()}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center gap-1 font-semibold text-lg">
                                <IndianRupee className="h-4 w-4 text-green-600" />
                                <span className="font-bold">
                                  {new Intl.NumberFormat('en-IN', {
                                    style: 'decimal',
                                    maximumFractionDigits: 0
                                  }).format(payment.amount)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">{getStatusBadge(payment.status)}</TableCell>
                            <TableCell className="capitalize py-4 hidden md:table-cell">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {payment.paymentMethod || payment.paymentMethodDetails || '-'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm py-4 hidden lg:table-cell">
                              {payment.razorpayPaymentId ? (
                                <div className="flex items-center gap-2">
                                  <span className="bg-muted px-3 py-1.5 rounded-md text-xs font-medium border">
                                    {payment.razorpayPaymentId.slice(-8)}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Show more payments option if there are many */}
                  {payments.length > 5 && (
                    <div className="p-6 border-t border-border/50 bg-muted/20">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Showing {Math.min(payments.length, 10)} of {payments.length} payments
                        </p>
                        {payments.length > 10 && (
                          <Button variant="outline" size="sm">
                            View All Payments
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Summary Sidebar - Compact right side (25% on large screens) */}
          <div className="xl:col-span-1 space-y-6">
            {/* Payment Summary Card */}
            {stats && (
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-xl xl:text-2xl font-bold text-green-700 dark:text-green-300">
                        {formatCurrency(stats.totalPaid)}
                      </div>
                      <p className="text-xs xl:text-sm text-green-600 dark:text-green-400">Total Paid This Year</p>
                    </div>
                    
                    {stats.pendingAmount > 0 && (
                      <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="text-lg xl:text-xl font-bold text-orange-700 dark:text-orange-300">
                          {formatCurrency(stats.pendingAmount)}
                        </div>
                        <p className="text-xs xl:text-sm text-orange-600 dark:text-orange-400">Pending Payment</p>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="pt-4 border-t border-border/50">
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Quick Actions
                      </h4>
                      <div className="space-y-2">
                        {!stats.currentMonthPaid && roomDetails && (
                          <Button 
                            onClick={handlePayRent}
                            disabled={isCreatingOrder}
                            className="w-full"
                            size="sm"
                          >
                            {isCreatingOrder ? (
                              <>
                                <Clock className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <IndianRupee className="mr-2 h-4 w-4" />
                                Pay This Month
                              </>
                            )}
                          </Button>
                        )}
                        {stats.currentMonthPaid && (
                          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
                            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                              This month's rent is paid
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Stats Card for smaller screens */}
            <Card className="shadow-lg xl:hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Payment Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">{payments.length}</div>
                    <p className="text-xs text-muted-foreground">Total Payments</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">
                      {payments.filter(p => p.status === 'Captured').length}
                    </div>
                    <p className="text-xs text-muted-foreground">Successful</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TenantPayments;
