/**
 * API Endpoints
 *
 * This file contains all the API endpoints used in the application.
 * Centralizing endpoints makes it easier to manage and update them.
 */

// Auth endpoints
export const AUTH = {
  LOGIN: '/pgrooms/login',
  REGISTER: '/pgrooms/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
};

// User endpoints
export const USER = {
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  CHANGE_PASSWORD: '/user/change-password',
};

// Property endpoints
export const PROPERTY = {
  LIST: '/pgrooms/v1/properties',
  DETAILS: (id: string | number) => `/pgrooms/v1/properties/${id}`,
  CREATE: '/pgrooms/v1/property',
  UPDATE: '/pgrooms/v1/property', // PUT endpoint for property update
  DELETE: (id: string | number) => `/pgrooms/v1/property/${id}`,
  UPDATE_STATUS: '/pgrooms/v1/propertyStatus', // PUT endpoint for property status update
};

// Location endpoints
export const LOCATION = {
  STATES: '/pgrooms/states',
  CITIES: (stateId: number) => `/pgrooms/cities/${stateId}`,
};

// Room endpoints
export const ROOM = {
  LIST: '/pgrooms/v1/rooms',
  DETAILS: (id: string | number) => `/pgrooms/v1/room/${id}`,
  CREATE: '/pgrooms/v1/room',
  UPDATE: '/pgrooms/v1/room', // PUT endpoint for room update
  DELETE: (id: string | number) => `/pgrooms/v1/room/${id}`,
  UPDATE_STATUS: '/pgrooms/v1/roomStatus', // PUT endpoint for room status update
};

// Tenant endpoints
export const TENANT = {
  LIST: '/pgrooms/v1/getTenants',
  CREATE: '/pgrooms/v1/tenant',
  UPDATE: '/pgrooms/v1/tenant',
  GET: '/pgrooms/v1/tenant',
  ROOM_DETAILS: '/pgrooms/v1/tenant/room-details',
};

// Dashboard endpoints
export const DASHBOARD = {
  MONITORING_CARDS: '/pgrooms/v1/dashboard-monitoring-cards',
  RECENT_TENANTS: '/pgrooms/v1/dashboard-recent-tenants',
};

// Payment endpoints
export const PAYMENT = {
  CREATE_ORDER: '/pgrooms/v1/payment/create-order',
  VERIFY: '/pgrooms/v1/payment/verify',
  DETAILS: (id: string | number) => `/pgrooms/v1/payment/${id}`,
  LIST: '/pgrooms/v1/payment/list',
  TENANT_PAYMENTS: '/pgrooms/v1/payment/tenant',
  PROPERTY_PAYMENTS: '/pgrooms/v1/payment/property',
  REFUND: '/pgrooms/v1/payment/refund',
  CANCEL: '/pgrooms/v1/payment/cancel',
  STATS: '/pgrooms/v1/payment/stats',
  RECENT: '/pgrooms/v1/payment/recent',
  MONTHLY_ANALYTICS: '/pgrooms/v1/payment/analytics/monthly',
  WEBHOOK: '/pgrooms/payment/webhook',
};

// Other endpoints can be added here as needed
