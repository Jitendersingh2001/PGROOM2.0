import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, IndianRupee, Clock, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import TenantNavbar from '@/components/tenant/TenantNavbar';
import TenantSidebar from '@/components/tenant/TenantSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface PaymentHistory {
  id: number;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: 'paid' | 'pending' | 'overdue';
  month: string;
}

interface PaymentStats {
  totalPaid: number;
  pendingAmount: number;
  nextDueDate: string;
  nextDueAmount: number;
}

const TenantPayments = () => {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // TODO: Replace with actual API calls
    const fetchPaymentData = async () => {
      try {
        setIsLoading(true);

        // Simulate API calls
        const mockHistory: PaymentHistory[] = [
          {
            id: 1,
            amount: 12000,
            dueDate: '2024-01-05',
            paidDate: '2024-01-03',
            status: 'paid',
            month: 'January 2024',
          },
          {
            id: 2,
            amount: 12000,
            dueDate: '2024-02-05',
            paidDate: null,
            status: 'pending',
            month: 'February 2024',
          },
        ];

        const mockStats: PaymentStats = {
          totalPaid: 12000,
          pendingAmount: 12000,
          nextDueDate: '2024-02-05',
          nextDueAmount: 12000,
        };

        setPaymentHistory(mockHistory);
        setPaymentStats(mockStats);
      } catch (error) {
        console.error('Error fetching payment data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

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
  const getStatusBadge = (status: PaymentHistory['status']) => {
    const badges = {
      paid: <Badge className="bg-green-100 text-green-800">Paid</Badge>,
      pending: <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>,
      overdue: <Badge className="bg-red-100 text-red-800">Overdue</Badge>,
    };
    return badges[status];
  };

  return (
    <DashboardLayout
      navbar={<TenantNavbar />}
      sidebar={<TenantSidebar />}
    >
      <div className="w-full max-w-[98%] mx-auto space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Rent Payments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your rent payments and view payment history
          </p>
        </div>

        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(paymentStats?.nextDueAmount || 0)}</div>
              <p className="text-xs text-muted-foreground">Due on {formatDate(paymentStats?.nextDueDate || '')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(paymentStats?.totalPaid || 0)}</div>
              <p className="text-xs text-muted-foreground">Current Financial Year</p>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium">Quick Pay</CardTitle>
                <CardDescription>Make your rent payment quickly and securely</CardDescription>
              </div>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <IndianRupee className="mr-2 h-4 w-4" />
                Pay Rent
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your rent payment history for the past months</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.month}</TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{formatDate(payment.dueDate)}</TableCell>
                    <TableCell>{formatDate(payment.paidDate)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TenantPayments;
