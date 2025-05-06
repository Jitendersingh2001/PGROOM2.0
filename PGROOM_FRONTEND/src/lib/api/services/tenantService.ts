import { apiService } from '../apiService';
import { endpoints } from '../index';
import { ApiResponse } from '@/lib/types/api';

/**
 * Tenant user interface
 */
export interface TenantUser {
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    mobileNo: string;
    address?: string;
    stateId?: number;
    cityId?: number;
    state?: {
      id: number;
      stateName: string;
    };
    city?: {
      id: number;
      cityName: string;
    };
    profileImage?: string;
    occupation?: string;
    moveInDate?: string;
    status?: 'Active' | 'Inactive' | 'Invited';
  };
}

/**
 * Tenant list response interface
 */
export interface TenantListResponse {
  data: TenantUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Tenant pagination parameters
 */
export interface TenantPaginationParams {
  page: number;
  limit: number;
  filters?: {
    search?: string;
    state?: number;
    city?: number;
  };
}

/**
 * Tenant service for handling tenant-related API calls
 */
export const tenantService = {
  /**
   * Get a paginated list of potential tenants (users with tenant role)
   * @param params - Pagination and filter parameters
   */
  getTenants: async (params: TenantPaginationParams): Promise<ApiResponse<TenantListResponse>> => {
    const { page, limit, filters } = params;

    // Create query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));

    if (filters?.search) {
      queryParams.append('search', filters.search);
    }

    if (filters?.state) {
      queryParams.append('state', String(filters.state));
    }

    if (filters?.city) {
      queryParams.append('city', String(filters.city));
    }

    return apiService.get(`${endpoints.TENANT.LIST}?${queryParams.toString()}`);
  },

  /**
   * Assign tenant to a property and room
   * @param data - Tenant assignment data
   */
  assignTenant: async (data: {
    userIds: number[];
    propertyId: number;
    roomId: number;
  }): Promise<ApiResponse<any>> => {
    return apiService.post(endpoints.TENANT.CREATE, data);
  },

  /**
   * Update tenant assignment
   * @param data - Tenant update data
   */
  updateTenant: async (data: {
    ids?: number[];
    userIds: number[];
    propertyId: number;
    roomId: number;
  }): Promise<ApiResponse<any>> => {
    return apiService.put(endpoints.TENANT.UPDATE, data);
  },

  /**
   * Get tenants for a specific property and room
   * @param propertyId - Property ID
   * @param roomId - Room ID
   */
  getTenantsByRoom: async (propertyId: number, roomId: number): Promise<ApiResponse<any>> => {
    const queryParams = new URLSearchParams();
    queryParams.append('propertyId', String(propertyId));
    queryParams.append('roomId', String(roomId));

    return apiService.get(`${endpoints.TENANT.GET}?${queryParams.toString()}`);
  }
};
