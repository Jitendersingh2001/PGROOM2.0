import React, { useState, useEffect, useCallback } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, MapPin, Filter } from 'lucide-react';
import { useLocation, State, City } from '@/contexts/LocationContext';

// Layout components
import TenantNavbar from '@/components/tenant/TenantNavbar';
import TenantSidebar from '@/components/tenant/TenantSidebar';
import DashboardLayout from '@/components/layouts/DashboardLayout';

// UI components
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// Property components
import TenantPropertyCard from '@/components/property/TenantPropertyCard';
import PropertyCardSkeleton from '@/components/property/PropertyCardSkeleton';

// API and types
import { propertyService } from '@/lib/api/services';
import { Property } from '@/lib/types/property';
import { isApiSuccessResponse } from '@/lib/types/api';

/**
 * TenantProperties - Tenant's property browsing page
 *
 * This page allows tenants to browse available properties and rooms for potential rental.
 */
const TenantProperties: React.FC = () => {
  // State for pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // State for location filters
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [stateCities, setStateCities] = useState<City[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Get location data
  const { states, getCitiesByStateId, loadCities } = useLocation();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      // Reset to first page when search changes
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedStateId) {
      setIsLoadingCities(true);
      setSelectedCityId(null); // Reset city selection when state changes

      // First check if we already have the cities for this state
      const existingCities = getCitiesByStateId(selectedStateId);
      if (existingCities && existingCities.length > 0) {
        setStateCities(existingCities);
        setIsLoadingCities(false);
      } else {
        // Load cities from API
        loadCities(selectedStateId)
          .then((cities) => {
            setStateCities(cities);
          })
          .catch((error) => {
            console.error('Error loading cities:', error);
            setStateCities([]);
          })
          .finally(() => {
            setIsLoadingCities(false);
          });
      }
    } else {
      setStateCities([]);
      setSelectedCityId(null);
    }
  }, [selectedStateId, getCitiesByStateId, loadCities]);

  // Reset page when filters change
  const resetPageWhenFiltersChange = useCallback(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    resetPageWhenFiltersChange();
  }, [selectedStateId, selectedCityId, resetPageWhenFiltersChange]);

  // Build filters object
  const buildFilters = useCallback(() => {
    const filters: Record<string, string | number> = {};

    if (debouncedSearchQuery) {
      filters.search = debouncedSearchQuery;
    }

    if (selectedStateId) {
      filters.stateId = selectedStateId;
    }

    if (selectedCityId) {
      filters.cityId = selectedCityId;
    }

    // Only show active properties to tenants
    filters.status = 'Active';

    return filters;
  }, [debouncedSearchQuery, selectedStateId, selectedCityId]);

  // Fetch properties for tenants
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tenant-properties', page, limit, buildFilters()],
    queryFn: async () => {
      const filters = buildFilters();

      const response = await propertyService.getProperties({
        page,
        limit,
        filters: Object.keys(filters).length > 0 ? filters : undefined
      });

      if (isApiSuccessResponse(response)) {
        setTotalPages(response.data.meta.totalPages);
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch properties');
    }
  });

  // Handle filter changes
  const handleStateChange = (value: string) => {
    if (value === 'all') {
      setSelectedStateId(null);
    } else {
      setSelectedStateId(parseInt(value));
    }
  };

  const handleCityChange = (value: string) => {
    if (value === 'all') {
      setSelectedCityId(null);
    } else {
      setSelectedCityId(parseInt(value));
    }
  };

  const handleLimitChange = (value: string) => {
    setLimit(parseInt(value));
    setPage(1); // Reset to first page when changing limit
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStateId(null);
    setSelectedCityId(null);
    setPage(1);
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={page === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <ErrorBoundary>
      <DashboardLayout
        navbar={<TenantNavbar />}
        sidebar={<TenantSidebar />}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Browse Properties
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Discover available properties and rooms for rent
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search properties by name, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* State Filter */}
              <div className="min-w-[200px]">
                <Select value={selectedStateId?.toString() || 'all'} onValueChange={handleStateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states.map((state: State) => (
                      <SelectItem key={state.id} value={state.id.toString()}>
                        {state.stateName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City Filter */}
              <div className="min-w-[200px]">
                <Select 
                  value={selectedCityId?.toString() || 'all'} 
                  onValueChange={handleCityChange}
                  disabled={!selectedStateId || isLoadingCities}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !selectedStateId 
                        ? "Select State First" 
                        : isLoadingCities 
                          ? "Loading Cities..." 
                          : "Select City"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {stateCities.map((city: City) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.cityName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Results per page */}
              <div className="min-w-[120px]">
                <Select value={limit.toString()} onValueChange={handleLimitChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 per page</SelectItem>
                    <SelectItem value="12">12 per page</SelectItem>
                    <SelectItem value="24">24 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters and Clear Button */}
            {(searchQuery || selectedStateId || selectedCityId) && (
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Filter className="w-4 h-4" />
                  <span>Active filters:</span>
                  {searchQuery && <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Search: "{searchQuery}"</span>}
                  {selectedStateId && <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">State: {states.find(s => s.id === selectedStateId)?.stateName}</span>}
                  {selectedCityId && <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">City: {stateCities.find(c => c.id === selectedCityId)?.cityName}</span>}
                </div>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Results Info */}
            {data && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.meta.total)} of {data.meta.total} properties
                </p>
              </div>
            )}

            {/* Properties Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: limit }).map((_, index) => (
                  <PropertyCardSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-lg font-medium">Error loading properties</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {error instanceof Error ? error.message : 'An unexpected error occurred'}
                  </p>
                </div>
                <button
                  onClick={() => refetch()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : !data || data.data.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery || selectedStateId || selectedCityId
                    ? "Try adjusting your search criteria or filters."
                    : "There are no properties available at the moment."}
                </p>
                {(searchQuery || selectedStateId || selectedCityId) && (
                  <button
                    onClick={clearFilters}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.data.map((property: Property) => (
                  <TenantPropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {data && data.data.length > 0 && totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(page - 1)}
                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {generatePaginationItems()}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(page + 1)}
                        className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ErrorBoundary>
  );
};

export default TenantProperties;