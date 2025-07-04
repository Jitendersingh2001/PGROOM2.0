import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, MoreVertical, Edit, Trash2, MapPin, Building2, Users, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Property {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  ownerName: string;
  ownerEmail: string;
  totalRooms: number;
  occupiedRooms: number;
  status: 'Active' | 'Inactive' | 'Maintenance';
  monthlyRevenue: number;
  createdDate: string;
  lastUpdated: string;
}

const AdminProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockProperties: Property[] = [
      {
        id: 1,
        name: 'Sunrise Apartments',
        address: '123 Main Street, Downtown',
        city: 'Mumbai',
        state: 'Maharashtra',
        ownerName: 'John Smith',
        ownerEmail: 'john.smith@email.com',
        totalRooms: 20,
        occupiedRooms: 18,
        status: 'Active',
        monthlyRevenue: 45000,
        createdDate: '2023-01-15',
        lastUpdated: '2024-07-01',
      },
      {
        id: 2,
        name: 'Green Valley PG',
        address: '456 Oak Avenue, Suburbs',
        city: 'Pune',
        state: 'Maharashtra',
        ownerName: 'Sarah Johnson',
        ownerEmail: 'sarah.johnson@email.com',
        totalRooms: 15,
        occupiedRooms: 12,
        status: 'Active',
        monthlyRevenue: 32000,
        createdDate: '2023-03-20',
        lastUpdated: '2024-06-28',
      },
      {
        id: 3,
        name: 'City Center Residency',
        address: '789 Business District',
        city: 'Bangalore',
        state: 'Karnataka',
        ownerName: 'Mike Wilson',
        ownerEmail: 'mike.wilson@email.com',
        totalRooms: 30,
        occupiedRooms: 25,
        status: 'Active',
        monthlyRevenue: 78000,
        createdDate: '2023-05-10',
        lastUpdated: '2024-07-03',
      },
      {
        id: 4,
        name: 'Budget Stay Inn',
        address: '321 College Road',
        city: 'Delhi',
        state: 'Delhi',
        ownerName: 'Emily Chen',
        ownerEmail: 'emily.chen@email.com',
        totalRooms: 10,
        occupiedRooms: 8,
        status: 'Maintenance',
        monthlyRevenue: 18000,
        createdDate: '2023-08-22',
        lastUpdated: '2024-07-02',
      },
      {
        id: 5,
        name: 'Premium Heights',
        address: '654 Premium Lane',
        city: 'Hyderabad',
        state: 'Telangana',
        ownerName: 'David Brown',
        ownerEmail: 'david.brown@email.com',
        totalRooms: 25,
        occupiedRooms: 20,
        status: 'Inactive',
        monthlyRevenue: 55000,
        createdDate: '2023-02-14',
        lastUpdated: '2024-06-25',
      },
    ];

    setTimeout(() => {
      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter properties based on search term, status, and city
  useEffect(() => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    if (cityFilter !== 'all') {
      filtered = filtered.filter(property => property.city === cityFilter);
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, statusFilter, cityFilter]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getOccupancyRate = (occupied: number, total: number) => {
    return total > 0 ? Math.round((occupied / total) * 100) : 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get unique cities for filter
  const uniqueCities = Array.from(new Set(properties.map(p => p.city)));

  // Calculate summary stats
  const totalProperties = properties.length;
  const activeProperties = properties.filter(p => p.status === 'Active').length;
  const totalRooms = properties.reduce((sum, p) => sum + p.totalRooms, 0);
  const totalOccupied = properties.reduce((sum, p) => sum + p.occupiedRooms, 0);
  const totalRevenue = properties.reduce((sum, p) => sum + p.monthlyRevenue, 0);

  return (
    <DashboardLayout
      navbar={<AdminNavbar />}
      sidebar={<AdminSidebar />}
    >
      <div className="w-full px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Properties Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage all properties across the platform
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Properties</p>
                  <p className="text-2xl font-bold">{totalProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Properties</p>
                  <p className="text-2xl font-bold">{activeProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Rooms</p>
                  <p className="text-2xl font-bold">{totalRooms}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Occupied Rooms</p>
                  <p className="text-2xl font-bold">{totalOccupied}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search properties by name, address, or owner..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {uniqueCities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="flex justify-between">
                      <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredProperties.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground">
                No properties match your current filters
              </p>
            </div>
          ) : (
            filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Property Image Placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className={cn("", getStatusBadgeColor(property.status))}>
                      {property.status}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Property
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Property
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Property Info */}
                    <div>
                      <h3 className="text-lg font-semibold truncate">{property.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{property.address}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{property.city}, {property.state}</p>
                    </div>

                    {/* Owner Info */}
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <p className="text-sm font-medium">{property.ownerName}</p>
                      <p className="text-xs text-muted-foreground truncate">{property.ownerEmail}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Occupancy</p>
                        <p className="text-sm font-semibold">
                          {property.occupiedRooms}/{property.totalRooms} 
                          <span className="text-xs text-muted-foreground ml-1">
                            ({getOccupancyRate(property.occupiedRooms, property.totalRooms)}%)
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="text-sm font-semibold">{formatCurrency(property.monthlyRevenue)}</p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="pt-3 border-t text-xs text-muted-foreground">
                      <p>Created: {formatDate(property.createdDate)}</p>
                      <p>Updated: {formatDate(property.lastUpdated)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminProperties;
