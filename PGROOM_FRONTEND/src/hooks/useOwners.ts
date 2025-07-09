// filepath: /src/hooks/useOwners.ts

import { useState, useMemo } from 'react';
import { Owner, AdminStats, FilterOptions } from '@/types/admin';

// This would typically come from an API call
const mockOwners: Owner[] = [
  {
    id: 1,
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@email.com',
    mobileNo: '+91 9876543210',
    address: 'Andheri West, Mumbai',
    stateId: 1,
    cityId: 1,
    status: 'active',
    joinDate: '2023-01-15',
    verified: true,
    rating: 4.8,
    totalProperties: 3,
    totalRooms: 45,
    occupiedRooms: 38,
    monthlyRevenue: 125000,
    properties: [
      { id: 1, propertyName: 'Krishna PG', propertyAddress: 'Andheri West, Mumbai', totalRooms: 20, occupiedRooms: 18 },
      { id: 2, propertyName: 'Shree PG', propertyAddress: 'Bandra East, Mumbai', totalRooms: 15, occupiedRooms: 12 },
      { id: 3, propertyName: 'Modern PG', propertyAddress: 'Powai, Mumbai', totalRooms: 10, occupiedRooms: 8 }
    ],
    recentActivity: 'Updated property rates 2 days ago',
    documents: {
      aadhar: true,
      pan: true,
      agreement: true
    }
  },
  {
    id: 2,
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@email.com',
    mobileNo: '+91 9876543211',
    address: 'Kothrud, Pune',
    stateId: 1,
    cityId: 2,
    status: 'active',
    joinDate: '2023-02-20',
    verified: true,
    rating: 4.9,
    totalProperties: 2,
    totalRooms: 30,
    occupiedRooms: 28,
    monthlyRevenue: 95000,
    properties: [
      { id: 4, propertyName: 'Comfort PG', propertyAddress: 'Kothrud, Pune', totalRooms: 18, occupiedRooms: 17 },
      { id: 5, propertyName: 'Elite PG', propertyAddress: 'Hinjewadi, Pune', totalRooms: 12, occupiedRooms: 11 }
    ],
    recentActivity: 'Added new property 1 week ago',
    documents: {
      aadhar: true,
      pan: true,
      agreement: true
    }
  },
  {
    id: 3,
    firstName: 'Amit',
    lastName: 'Patel',
    email: 'amit.patel@email.com',
    mobileNo: '+91 9876543212',
    address: 'Satellite, Ahmedabad',
    stateId: 2,
    cityId: 3,
    status: 'pending',
    joinDate: '2023-03-10',
    verified: false,
    rating: 4.2,
    totalProperties: 1,
    totalRooms: 25,
    occupiedRooms: 15,
    monthlyRevenue: 42000,
    properties: [
      { id: 6, propertyName: 'Budget PG', propertyAddress: 'Satellite, Ahmedabad', totalRooms: 25, occupiedRooms: 15 }
    ],
    recentActivity: 'Pending document verification',
    documents: {
      aadhar: true,
      pan: false,
      agreement: false
    }
  },
  {
    id: 4,
    firstName: 'Sunita',
    lastName: 'Reddy',
    email: 'sunita.reddy@email.com',
    mobileNo: '+91 9876543213',
    address: 'Gachibowli, Hyderabad',
    stateId: 3,
    cityId: 4,
    status: 'suspended',
    joinDate: '2023-04-05',
    verified: true,
    rating: 3.8,
    totalProperties: 2,
    totalRooms: 35,
    occupiedRooms: 20,
    monthlyRevenue: 68000,
    properties: [
      { id: 7, propertyName: 'Tech PG', propertyAddress: 'Gachibowli, Hyderabad', totalRooms: 20, occupiedRooms: 12 },
      { id: 8, propertyName: 'Metro PG', propertyAddress: 'Kukatpally, Hyderabad', totalRooms: 15, occupiedRooms: 8 }
    ],
    recentActivity: 'Account suspended due to violations',
    documents: {
      aadhar: true,
      pan: true,
      agreement: true
    }
  },
  {
    id: 5,
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram.singh@email.com',
    mobileNo: '+91 9876543214',
    address: 'Sector 62, Noida',
    stateId: 4,
    cityId: 5,
    status: 'active',
    joinDate: '2023-05-12',
    verified: true,
    rating: 4.6,
    totalProperties: 4,
    totalRooms: 60,
    occupiedRooms: 52,
    monthlyRevenue: 180000,
    properties: [
      { id: 9, propertyName: 'Premium PG', propertyAddress: 'Sector 62, Noida', totalRooms: 25, occupiedRooms: 22 },
      { id: 10, propertyName: 'Corporate PG', propertyAddress: 'Sector 18, Noida', totalRooms: 20, occupiedRooms: 18 },
      { id: 11, propertyName: 'Deluxe PG', propertyAddress: 'Sector 15, Noida', totalRooms: 10, occupiedRooms: 8 },
      { id: 12, propertyName: 'Executive PG', propertyAddress: 'Sector 34, Noida', totalRooms: 5, occupiedRooms: 4 }
    ],
    recentActivity: 'Upgraded facilities 3 days ago',
    documents: {
      aadhar: true,
      pan: true,
      agreement: true
    }
  }
];

export const useOwners = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    statusFilter: 'all',
    locationFilter: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter and sort owners
  const filteredOwners = useMemo(() => {
    const filtered = mockOwners.filter(owner => {
      const fullName = `${owner.firstName} ${owner.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(filters.searchTerm.toLowerCase()) ||
                           owner.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           owner.mobileNo.includes(filters.searchTerm);
      
      const matchesStatus = filters.statusFilter === 'all' || owner.status === filters.statusFilter;
      
      const matchesLocation = filters.locationFilter === 'all' || 
                             owner.address.toLowerCase().includes(filters.locationFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesLocation;
    });

    // Sort functionality
    filtered.sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case 'joinDate':
          aValue = new Date(a.joinDate);
          bValue = new Date(b.joinDate);
          break;
        case 'revenue':
          aValue = a.monthlyRevenue;
          bValue = b.monthlyRevenue;
          break;
        case 'properties':
          aValue = a.totalProperties;
          bValue = b.totalProperties;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [filters]);

  // Calculate statistics
  const stats = useMemo((): AdminStats => {
    const totalOwners = mockOwners.length;
    const activeOwners = mockOwners.filter(o => o.status === 'active').length;
    const totalProperties = mockOwners.reduce((sum, owner) => sum + owner.totalProperties, 0);
    const totalRevenue = mockOwners.reduce((sum, owner) => sum + owner.monthlyRevenue, 0);
    const averageOccupancy = Math.round(
      mockOwners.reduce((sum, owner) => {
        const rate = owner.totalRooms > 0 ? (owner.occupiedRooms / owner.totalRooms) * 100 : 0;
        return sum + rate;
      }, 0) / mockOwners.length
    );
    const verificationRate = Math.round((mockOwners.filter(o => o.verified).length / totalOwners) * 100);

    return {
      totalOwners,
      activeOwners,
      totalProperties,
      totalRevenue,
      averageOccupancy,
      verificationRate
    };
  }, []);

  // Get unique locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(mockOwners.map(owner => 
      owner.address.split(',')[1]?.trim() || owner.address.split(',')[0]?.trim()
    )));
  }, []);

  // Update filters
  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      statusFilter: 'all',
      locationFilter: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  // Actions (these would call API endpoints)
  const suspendOwner = async (ownerId: number) => {
    setLoading(true);
    try {
      // API call to suspend owner
      console.log('Suspending owner:', ownerId);
      // Update local state or refetch data
    } catch (err) {
      setError('Failed to suspend owner');
    } finally {
      setLoading(false);
    }
  };

  const activateOwner = async (ownerId: number) => {
    setLoading(true);
    try {
      // API call to activate owner
      console.log('Activating owner:', ownerId);
      // Update local state or refetch data
    } catch (err) {
      setError('Failed to activate owner');
    } finally {
      setLoading(false);
    }
  };

  const deleteOwner = async (ownerId: number) => {
    setLoading(true);
    try {
      // API call to delete owner
      console.log('Deleting owner:', ownerId);
      // Update local state or refetch data
    } catch (err) {
      setError('Failed to delete owner');
    } finally {
      setLoading(false);
    }
  };

  return {
    owners: filteredOwners,
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
  };
};
