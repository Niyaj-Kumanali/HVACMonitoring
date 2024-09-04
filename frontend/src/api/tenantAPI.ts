import { Tenant } from '../types/thingsboardTypes';
import thingsboardAPI from './thingsboardAPI'; // Ensure the path is correct for your Axios instance

// Create or Update Tenant
export const saveTenant = async (tenant: Tenant) => {
  const response = await thingsboardAPI.post<Tenant>('/tenant', tenant);
  return response;
};

// Get Tenant by ID
export const getTenantById = async (tenantId: string = '') => {
  const response = await thingsboardAPI.get<Tenant>(`/tenant/${tenantId}`);
  return response;
};

// Delete Tenant by ID
export const deleteTenant = async (tenantId: string = '') => {
  await thingsboardAPI.delete(`/tenant/${tenantId}`);
};

// Get Tenant Info by ID
export const getTenantInfoById = async (tenantId: string) => {
  const response = await thingsboardAPI.get(`/tenant/info/${tenantId}`);
  return response;
};

// Get Tenants Info with Pagination
export const getTenantsInfo = async (params: {
  pageSize: number;
  page: number;
  textSearch?: string;
  sortProperty?: string;
  sortOrder?: string;
}) => {
  const response = await thingsboardAPI.get('/tenantInfos', {
    params: params,
  });
  return response;
};

// Get Tenants with Pagination
export const getTenants = async (params: {
  pageSize: number;
  page: number;
  textSearch?: string;
  sortProperty?: string;
  sortOrder?: string;
}) => {
  const response = await thingsboardAPI.get('/tenants', {
    params: params,
  });
  return response;
};
