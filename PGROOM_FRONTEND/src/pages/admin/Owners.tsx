// filepath: /src/pages/admin/Owners.tsx
import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Building2, DollarSign, Users, Eye, Edit, Trash2, MoreHorizontal, Phone, Mail, MapPin } from 'lucide-react';
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

// Mock data for owners
const mockOwners = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 9876543210',
    location: 'Mumbai, Maharashtra',
    joinDate: '2023-01-15',
    status: 'active',
    propertiesCount: 3,
    totalRooms: 45,
    occupiedRooms: 38,
    monthlyRevenue: 125000,
    avatar: null,
    verified: true,
    rating: 4.8,
    properties: [
      { name: 'Krishna PG', location: 'Andheri West', rooms: 20 },
      { name: 'Shree PG', location: 'Bandra East', rooms: 15 },
      { name: 'Modern PG', location: 'Powai', rooms: 10 }
    ]
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 9876543211',
    location: 'Pune, Maharashtra',
    joinDate: '2023-02-20',
    status: 'active',
    propertiesCount: 2,
    totalRooms: 30,
    occupiedRooms: 28,
    monthlyRevenue: 95000,
    avatar: null,
    verified: true,
    rating: 4.9,
    properties: [
      { name: 'Comfort PG', location: 'Kothrud', rooms: 18 },
      { name: 'Elite PG', location: 'Hinjewadi', rooms: 12 }
    ]
  },
  {
    id: 3,
    name: 'Amit Patel',
    email: 'amit.patel@email.com',
    phone: '+91 9876543212',
    location: 'Ahmedabad, Gujarat',
    joinDate: '2023-03-10',
    status: 'pending',
    propertiesCount: 1,
    totalRooms: 25,
    occupiedRooms: 15,
    monthlyRevenue: 42000,
    avatar: null,
    verified: false,
    rating: 4.2,
    properties: [
      { name: 'Budget PG', location: 'Satellite', rooms: 25 }
    ]
  },
  {
    id: 4,
    name: 'Sunita Reddy',
    email: 'sunita.reddy@email.com',
    phone: '+91 9876543213',
    location: 'Hyderabad, Telangana',
    joinDate: '2023-04-05',
    status: 'suspended',
    propertiesCount: 2,
    totalRooms: 35,
    occupiedRooms: 20,
    monthlyRevenue: 68000,
    avatar: null,
    verified: true,
    rating: 3.8,
    properties: [
      { name: 'Tech PG', location: 'Gachibowli', rooms: 20 },
      { name: 'Metro PG', location: 'Kukatpally', rooms: 15 }
    ]
  }
];

/**
 * AdminOwners - Comprehensive owners management page for administrators
 * Features: Owner listing, filtering, status management, detailed view
 */
const AdminOwners: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  // Filter owners based on search and filters
  const filteredOwners = useMemo(() => {
    return mockOwners.filter(owner => {
      const matchesSearch = owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           owner.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || owner.status === statusFilter;
      
      const matchesLocation = locationFilter === 'all' || 
                             owner.location.toLowerCase().includes(locationFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [searchTerm, statusFilter, locationFilter]);

  // Get unique locations for filter
  const uniqueLocations = Array.from(new Set(mockOwners.map(owner => 
    owner.location.split(',')[1]?.trim() || owner.location
  )));

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    return (
      <Badge className={styles[status as keyof typeof styles] || styles.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Calculate occupancy rate
  const getOccupancyRate = (occupied: number, total: number) => {
    return total > 0 ? Math.round((occupied / total) * 100) : 0;
  };

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Summary stats
  const totalOwners = mockOwners.length;
  const activeOwners = mockOwners.filter(o => o.status === 'active').length;
  const totalProperties = mockOwners.reduce((sum, owner) => sum + owner.propertiesCount, 0);
  const totalRevenue = mockOwners.reduce((sum, owner) => sum + owner.monthlyRevenue, 0);

  return (
    <DashboardLayout navbar={<AdminNavbar />} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Owners Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage property owners and their portfolios
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Owner
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Owners</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOwners}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{activeOwners}</span> active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProperties}</div>
              <p className="text-xs text-muted-foreground">
                Across all owners
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</div>
              <p className="text-xs text-muted-foreground">
                Total platform revenue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  mockOwners.reduce((sum, owner) => sum + getOccupancyRate(owner.occupiedRooms, owner.totalRooms), 0) / mockOwners.length
                )}%
              </div>
              <p className="text-xs text-muted-foreground">
                Platform average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search owners by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map(location => (
                    <SelectItem key={location} value={location.toLowerCase()}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Owners Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOwners.map((owner) => (
            <Card key={owner.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={owner.avatar || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(owner.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{owner.name}</h3>
                        {owner.verified && (
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {owner.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {owner.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusBadge(owner.status)}
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
                          Edit Owner
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Suspend Owner
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Location and Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {owner.location}
                  </div>
                  <div className="text-muted-foreground">
                    Joined {new Date(owner.joinDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Portfolio Stats */}
                <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{owner.propertiesCount}</div>
                    <div className="text-xs text-muted-foreground">Properties</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{owner.totalRooms}</div>
                    <div className="text-xs text-muted-foreground">Total Rooms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {getOccupancyRate(owner.occupiedRooms, owner.totalRooms)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Occupancy</div>
                  </div>
                </div>

                {/* Revenue and Rating */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                    <div className="text-lg font-semibold text-green-600">
                      ₹{(owner.monthlyRevenue / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Rating</div>
                    <div className="text-lg font-semibold">{owner.rating}/5.0</div>
                  </div>
                </div>

                {/* Properties List */}
                <div>
                  <div className="text-sm font-medium mb-2">Properties</div>
                  <div className="space-y-1">
                    {owner.properties.map((property, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 bg-background rounded border">
                        <div>
                          <span className="font-medium">{property.name}</span>
                          <span className="text-muted-foreground ml-2">{property.location}</span>
                        </div>
                        <span className="text-muted-foreground">{property.rooms} rooms</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredOwners.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No owners found</h3>
              <p className="text-muted-foreground mb-4">
                No owners match your current filters. Try adjusting your search criteria.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setLocationFilter('all');
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

export default AdminOwners;
