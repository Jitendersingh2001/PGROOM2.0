/**
 * Property related type definitions
 */

/**
 * Property interface
 * Represents a property in the system
 */
export interface Property {
  id: number;
  propertyName: string;
  propertyAddress: string;
  propertyImage: string;
  propertyStatus: string;
  propertyContact: string;
  state: string | number;
  city: string | number;
}

/**
 * Property creation data interface
 * Used when creating a new property
 */
export interface PropertyCreateData {
  propertyName: string;
  propertyAddress: string;
  propertyContact: string;
  state: number;
  city: number;
  images?: File | string; // Can be a File object for new uploads or a string path for existing images
}

/**
 * Property update data interface
 * Used when updating an existing property
 */
export interface PropertyUpdateData extends Partial<PropertyCreateData> {
  id: number;
}

/**
 * Property status update data interface
 * Used when updating a property's status
 */
export interface PropertyStatusUpdateData {
  id: number;
  status: string;
}

/**
 * Property filter options
 * Used for filtering properties in the list
 */
export interface PropertyFilterOptions {
  state?: number;
  city?: number;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
  search?: string;
}

/**
 * Property pagination parameters
 */
export interface PropertyPaginationParams {
  page: number;
  limit: number;
  filters?: PropertyFilterOptions;
}

/**
 * Property list response
 */
export interface PropertyListResponse {
  data: Property[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
