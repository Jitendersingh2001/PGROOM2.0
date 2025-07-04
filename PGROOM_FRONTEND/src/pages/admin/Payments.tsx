// filepath: /src/pages/admin/Payments.tsx
import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, TrendingUp, DollarSign, CreditCard, AlertCircle, Calendar, Eye, CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for payments
const mockPayments = [
  {
    id: 'PAY-001',
    tenantName: 'Aarav Sharma',
    propertyName: 'Krishna PG',
    roomNumber: 'A-101',
    amount: 15000,
    paymentDate: '2023-12-05',
    dueDate: '2023-12-01',
    status: 'completed',
    paymentMethod: 'UPI',
    transactionId: 'TXN123456789',
    lateFee: 0,
    type: 'rent'
  },
  {
    id: 'PAY-002',
    tenantName: 'Priya Patel',
    propertyName: 'Comfort PG',
    roomNumber: 'B-205',
    amount: 12000,
    paymentDate: null,
    dueDate: '2023-12-10',
    status: 'pending',
    paymentMethod: null,
    transactionId: null,
    lateFee: 0,
    type: 'rent'
  },
  {
    id: 'PAY-003',
    tenantName: 'Rohit Kumar',
    propertyName: 'Elite PG',
    roomNumber: 'C-102',
    amount: 18500,
    paymentDate: null,
    dueDate: '2023-11-15',
    status: 'overdue',
    paymentMethod: null,
    transactionId: null,
    lateFee: 500,
    type: 'rent'
  },
  {
    id: 'PAY-004',
    tenantName: 'Anita Singh',
    propertyName: 'Modern PG',
    roomNumber: 'D-301',
    amount: 20000,
    paymentDate: '2023-12-01',
    dueDate: '2023-12-01',
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN987654321',
    lateFee: 0,
    type: 'rent'
  },
  {
    id: 'PAY-005',
    tenantName: 'Aarav Sharma',
    propertyName: 'Krishna PG',
    roomNumber: 'A-101',
    amount: 30000,
    paymentDate: '2023-06-15',
    dueDate: '2023-06-15',
    status: 'completed',
    paymentMethod: 'Cash',
    transactionId: null,
    lateFee: 0,
    type: 'deposit'
  },
  {
    id: 'PAY-006',
    tenantName: 'Rahul Verma',
    propertyName: 'Budget PG',
    roomNumber: 'E-202',
    amount: 8000,
    paymentDate: '2023-12-03',
    dueDate: '2023-12-01',
    status: 'completed',
    paymentMethod: 'UPI',
    transactionId: 'TXN456789123',
    lateFee: 100,
    type: 'rent'
  }
];

/**
 * AdminPayments - Comprehensive payments management page for administrators
 * Features: Payment tracking, status management, financial analytics
 */
const AdminPayments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  // Filter payments based on search and filters
  const filteredPayments = useMemo(() => {
    return mockPayments.filter(payment => {
      const matchesSearch = payment.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      const matchesType = typeFilter === 'all' || payment.type === typeFilter;
      const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;

      return matchesSearch && matchesStatus && matchesType && matchesMethod;
    });
  }, [searchTerm, statusFilter, typeFilter, methodFilter]);

  // Get unique payment methods for filter
  const uniqueMethods = Array.from(new Set(
    mockPayments
      .filter(p => p.paymentMethod)
      .map(payment => payment.paymentMethod!)
  ));

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    return (
      <Badge className={styles[status as keyof typeof styles] || styles.pending}>
        {status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
        {status === 'overdue' && <AlertCircle className="w-3 h-3 mr-1" />}
        {status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Type badge styling
  const getTypeBadge = (type: string) => {
    const styles = {
      rent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      deposit: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      maintenance: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    
    return (
      <Badge variant="outline" className={styles[type as keyof typeof styles] || styles.rent}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  // Calculate days overdue
  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Summary stats
  const totalAmount = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = mockPayments.filter(p => p.status === 'completed');
  const completedAmount = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingPayments = mockPayments.filter(p => p.status === 'pending');
  const overduePayments = mockPayments.filter(p => p.status === 'overdue');
  const overdueAmount = overduePayments.reduce((sum, payment) => sum + payment.amount + payment.lateFee, 0);

  return (
    <DashboardLayout navbar={<AdminNavbar />} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Payments Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Track payments, manage transactions, and monitor financial performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(totalAmount / 100000).toFixed(1)}L</div>
              <p className="text-xs text-muted-foreground">
                All transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collected</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{(completedAmount / 100000).toFixed(1)}L</div>
              <p className="text-xs text-muted-foreground">
                {completedPayments.length} completed payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <CreditCard className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingPayments.length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting payment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₹{(overdueAmount / 1000).toFixed(0)}K</div>
              <p className="text-xs text-muted-foreground">
                {overduePayments.length} overdue payments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by tenant, property, room, or payment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-[140px]">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-full lg:w-[160px]">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  {uniqueMethods.map(method => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.tenantName}</TableCell>
                      <TableCell>{payment.propertyName}</TableCell>
                      <TableCell>{payment.roomNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">₹{payment.amount.toLocaleString()}</div>
                          {payment.lateFee > 0 && (
                            <div className="text-xs text-red-600">
                              +₹{payment.lateFee} late fee
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(payment.type)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getStatusBadge(payment.status)}
                          {payment.status === 'overdue' && (
                            <div className="text-xs text-red-600">
                              {getDaysOverdue(payment.dueDate)} days overdue
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`text-sm ${
                          payment.status === 'overdue' ? 'text-red-600 font-medium' : ''
                        }`}>
                          {new Date(payment.dueDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {payment.paymentDate ? (
                          <div className="text-sm">
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {payment.paymentMethod ? (
                          <div>
                            <div className="text-sm">{payment.paymentMethod}</div>
                            {payment.transactionId && (
                              <div className="text-xs text-muted-foreground">
                                {payment.transactionId}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Empty State */}
            {filteredPayments.length === 0 && (
              <div className="py-16 text-center">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No payments found</h3>
                <p className="text-muted-foreground mb-4">
                  No payments match your current filters. Try adjusting your search criteria.
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                  setMethodFilter('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Send Overdue Reminders</h3>
                  <p className="text-sm text-muted-foreground">
                    Send payment reminders to {overduePayments.length} tenants
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Download className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Generate Report</h3>
                  <p className="text-sm text-muted-foreground">
                    Download monthly payment report
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Payment Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    View detailed payment insights
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPayments;
