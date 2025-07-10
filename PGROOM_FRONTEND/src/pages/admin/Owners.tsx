// filepath: /src/pages/admin/Owners.tsx
import React from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Building2, 
  DollarSign, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  MapPin,
  TrendingUp,
  Calendar,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity
} from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useOwners } from '@/hooks/useOwners';
import { Owner } from '@/types/admin';

/**
 * AdminOwners - Enhanced owners management page for administrators
 * Features: Owner listing, advanced filtering, status management
 */
const AdminOwners: React.FC = () => {
  
  const {
    owners,
    stats,
    uniqueLocations,
    filters,
    loading,
    error,
    updateFilters,
    clearFilters,
    suspendOwner,
    activateOwner,
    deleteOwner
  } = useOwners();

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
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  // Get verification status
  const getVerificationStatus = (documents: { aadhar: boolean; pan: boolean; agreement: boolean }) => {
    const total = Object.keys(documents).length;
    const verified = Object.values(documents).filter(Boolean).length;
    return { verified, total, percentage: Math.round((verified / total) * 100) };
  };

  const handleSort = (column: string) => {
    const newSortOrder = filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    updateFilters({ sortBy: column, sortOrder: newSortOrder });
  };

  const handleOwnerAction = async (action: 'suspend' | 'activate' | 'delete', ownerId: number) => {
    try {
      switch (action) {
        case 'suspend':
          await suspendOwner(ownerId);
          break;
        case 'activate':
          await activateOwner(ownerId);
          break;
        case 'delete':
          await deleteOwner(ownerId);
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} owner:`, error);
    }
  };

  return (
    <DashboardLayout navbar={<AdminNavbar />} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Owner Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage property owners, track performance, and monitor portfolios
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Owner
            </Button>
          </div>
        </div>

        {/* Enhanced Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Owners</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOwners}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stats.activeOwners}</span> active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProperties}</div>
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
              <div className="text-2xl font-bold">₹{(stats.totalRevenue / 100000).toFixed(1)}L</div>
              <p className="text-xs text-muted-foreground">
                Total platform revenue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageOccupancy}%</div>
              <p className="text-xs text-muted-foreground">
                Platform average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search owners by name, email, or phone..."
                  value={filters.searchTerm}
                  onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                  className="pl-10"
                />
              </div>
              
              <Select value={filters.statusFilter} onValueChange={(value) => updateFilters({ statusFilter: value })}>
                <SelectTrigger className="w-full lg:w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.locationFilter} onValueChange={(value) => updateFilters({ locationFilter: value })}>
                <SelectTrigger className="w-full lg:w-[140px]">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Location" />
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

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading owners...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="py-8 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Owner Directory Table */}
        {!loading && !error && (
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                      Owner
                      {filters.sortBy === 'name' && (
                        <span className="ml-1">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Properties</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('revenue')}>
                      Revenue
                      {filters.sortBy === 'revenue' && (
                        <span className="ml-1">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </TableHead>
                    <TableHead>Occupancy</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('rating')}>
                      Rating
                      {filters.sortBy === 'rating' && (
                        <span className="ml-1">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {owners.map((owner) => (
                    <TableRow key={owner.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={undefined} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials(owner.firstName, owner.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{owner.firstName} {owner.lastName}</div>
                            <div className="text-sm text-muted-foreground">
                              {owner.verified && (
                                <CheckCircle className="inline w-3 h-3 mr-1 text-green-500" />
                              )}
                              Joined {new Date(owner.joinDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {owner.email}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            {owner.mobileNo}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{owner.totalProperties} Properties</div>
                          <div className="text-muted-foreground">{owner.totalRooms} total rooms</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-green-600">₹{(owner.monthlyRevenue / 1000).toFixed(0)}K</div>
                          <div className="text-muted-foreground">per month</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{getOccupancyRate(owner.occupiedRooms, owner.totalRooms)}%</div>
                          <div className="text-muted-foreground">
                            {owner.occupiedRooms}/{owner.totalRooms} occupied
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{owner.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(owner.status)}
                      </TableCell>
                      <TableCell>
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
                            {owner.status === 'active' ? (
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleOwnerAction('suspend', owner.id)}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Suspend Owner
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                className="text-green-600"
                                onClick={() => handleOwnerAction('activate', owner.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Activate Owner
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && owners.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No owners found</h3>
              <p className="text-muted-foreground mb-4">
                No owners match your current filters. Try adjusting your search criteria.
              </p>
              <Button variant="outline" onClick={clearFilters}>
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
