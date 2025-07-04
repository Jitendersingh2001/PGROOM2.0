// filepath: /src/pages/admin/Tenants.tsx
import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Calendar, DollarSign, Users, Eye, Edit, Ban, MoreHorizontal, Phone, Mail, MapPin, CreditCard } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for tenants
const mockTenants = [
  {
    id: 1,
    name: 'Aarav Sharma',
    email: 'aarav.sharma@email.com',
    phone: '+91 9876543210',
    age: 24,
    occupation: 'Software Developer',
    company: 'Tech Solutions Pvt Ltd',
    joinDate: '2023-06-15',
    status: 'active',
    property: 'Krishna PG',
    propertyLocation: 'Andheri West, Mumbai',
    roomNumber: 'A-101',
    rentAmount: 15000,
    depositAmount: 30000,
    dueDate: '2024-01-05',
    paymentStatus: 'paid',
    avatar: null,
    emergencyContact: {
      name: 'Rajesh Sharma',
      relation: 'Father',
      phone: '+91 9876543200'
    },
    documents: {
      aadhar: true,
      pan: true,
      agreement: true
    },
    rating: 4.5,
    issuesReported: 2,
    lastPayment: '2023-12-05'
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    phone: '+91 9876543211',
    age: 22,
    occupation: 'Data Analyst',
    company: 'Analytics Corp',
    joinDate: '2023-07-20',
    status: 'active',
    property: 'Comfort PG',
    propertyLocation: 'Kothrud, Pune',
    roomNumber: 'B-205',
    rentAmount: 12000,
    depositAmount: 24000,
    dueDate: '2024-01-10',
    paymentStatus: 'pending',
    avatar: null,
    emergencyContact: {
      name: 'Meera Patel',
      relation: 'Mother',
      phone: '+91 9876543201'
    },
    documents: {
      aadhar: true,
      pan: false,
      agreement: true
    },
    rating: 4.8,
    issuesReported: 0,
    lastPayment: '2023-11-10'
  },
  {
    id: 3,
    name: 'Rohit Kumar',
    email: 'rohit.kumar@email.com',
    phone: '+91 9876543212',
    age: 26,
    occupation: 'Marketing Executive',
    company: 'Brand Solutions',
    joinDate: '2023-05-10',
    status: 'suspended',
    property: 'Elite PG',
    propertyLocation: 'Hinjewadi, Pune',
    roomNumber: 'C-102',
    rentAmount: 18000,
    depositAmount: 36000,
    dueDate: '2023-12-15',
    paymentStatus: 'overdue',
    avatar: null,
    emergencyContact: {
      name: 'Sunita Kumar',
      relation: 'Mother',
      phone: '+91 9876543202'
    },
    documents: {
      aadhar: true,
      pan: true,
      agreement: false
    },
    rating: 3.2,
    issuesReported: 5,
    lastPayment: '2023-11-15'
  },
  {
    id: 4,
    name: 'Anita Singh',
    email: 'anita.singh@email.com',
    phone: '+91 9876543213',
    age: 23,
    occupation: 'UX Designer',
    company: 'Design Studio',
    joinDate: '2023-08-01',
    status: 'active',
    property: 'Modern PG',
    propertyLocation: 'Powai, Mumbai',
    roomNumber: 'D-301',
    rentAmount: 20000,
    depositAmount: 40000,
    dueDate: '2024-01-01',
    paymentStatus: 'paid',
    avatar: null,
    emergencyContact: {
      name: 'Vikram Singh',
      relation: 'Father',
      phone: '+91 9876543203'
    },
    documents: {
      aadhar: true,
      pan: true,
      agreement: true
    },
    rating: 4.9,
    issuesReported: 1,
    lastPayment: '2023-12-01'
  }
];

/**
 * AdminTenants - Comprehensive tenants management page for administrators
 * Features: Tenant listing, filtering, status management, payment tracking
 */
const AdminTenants: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');

  // Filter tenants based on search and filters
  const filteredTenants = useMemo(() => {
    return mockTenants.filter(tenant => {
      const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tenant.phone.includes(searchTerm) ||
                           tenant.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || tenant.paymentStatus === paymentFilter;
      const matchesProperty = propertyFilter === 'all' || tenant.property === propertyFilter;

      return matchesSearch && matchesStatus && matchesPayment && matchesProperty;
    });
  }, [searchTerm, statusFilter, paymentFilter, propertyFilter]);

  // Get unique properties for filter
  const uniqueProperties = Array.from(new Set(mockTenants.map(tenant => tenant.property)));

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    
    return (
      <Badge className={styles[status as keyof typeof styles] || styles.inactive}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Payment status badge styling
  const getPaymentBadge = (status: string) => {
    const styles = {
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    return (
      <Badge className={styles[status as keyof typeof styles] || styles.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Calculate days until due/overdue
  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Summary stats
  const totalTenants = mockTenants.length;
  const activeTenants = mockTenants.filter(t => t.status === 'active').length;
  const overduePayments = mockTenants.filter(t => t.paymentStatus === 'overdue').length;
  const totalRentCollected = mockTenants
    .filter(t => t.paymentStatus === 'paid')
    .reduce((sum, tenant) => sum + tenant.rentAmount, 0);

  return (
    <DashboardLayout navbar={<AdminNavbar />} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Tenants Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage tenants, track payments, and monitor occupancy
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Tenant
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTenants}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{activeTenants}</span> active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rent Collected</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(totalRentCollected / 100000).toFixed(1)}L</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overduePayments}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((activeTenants / totalTenants) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Current occupancy
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
                  placeholder="Search tenants by name, email, phone, or room..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-full lg:w-[140px]">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                <SelectTrigger className="w-full lg:w-[160px]">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {uniqueProperties.map(property => (
                    <SelectItem key={property} value={property}>
                      {property}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tenants Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredTenants.map((tenant) => (
            <Card key={tenant.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={tenant.avatar || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(tenant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{tenant.name}</h3>
                        <span className="text-sm text-muted-foreground">({tenant.age}y)</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {tenant.occupation} at {tenant.company}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {tenant.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusBadge(tenant.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Tenant
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Ban className="w-4 h-4 mr-2" />
                          Suspend Tenant
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Property and Room Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{tenant.property}</div>
                    <div className="text-sm text-muted-foreground">{tenant.propertyLocation}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Room {tenant.roomNumber}</div>
                    <div className="text-sm text-muted-foreground">₹{tenant.rentAmount.toLocaleString()}/month</div>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Payment Status</div>
                    <div className="flex items-center gap-2 mt-1">
                      {getPaymentBadge(tenant.paymentStatus)}
                      {tenant.paymentStatus === 'overdue' && (
                        <span className="text-xs text-red-600">
                          {Math.abs(getDaysUntilDue(tenant.dueDate))} days overdue
                        </span>
                      )}
                      {tenant.paymentStatus === 'pending' && (
                        <span className="text-xs text-yellow-600">
                          Due in {getDaysUntilDue(tenant.dueDate)} days
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Next Due</div>
                    <div className="text-sm font-medium">
                      {new Date(tenant.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      Personal
                    </span>
                    <span>{tenant.phone}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      Emergency
                    </span>
                    <span>{tenant.emergencyContact.phone}</span>
                  </div>
                </div>

                {/* Documents and Rating */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Documents</div>
                    <div className="flex gap-1">
                      <Badge variant={tenant.documents.aadhar ? "default" : "secondary"} className="text-xs">
                        Aadhar
                      </Badge>
                      <Badge variant={tenant.documents.pan ? "default" : "secondary"} className="text-xs">
                        PAN
                      </Badge>
                      <Badge variant={tenant.documents.agreement ? "default" : "secondary"} className="text-xs">
                        Agreement
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Rating</div>
                    <div className="font-medium">{tenant.rating}/5.0</div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Joined: {new Date(tenant.joinDate).toLocaleDateString()}</span>
                  <span>Issues: {tenant.issuesReported}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTenants.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tenants found</h3>
              <p className="text-muted-foreground mb-4">
                No tenants match your current filters. Try adjusting your search criteria.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPaymentFilter('all');
                setPropertyFilter('all');
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminTenants;
