import { Tenant } from '../types/thingsboardTypes';
import thingsboardAPI from './thingsboardAPI'; // Ensure the path is correct for your Axios instance

// Create or Update Tenant
export const saveTenant = async (tenant: Tenant): Promise<Tenant> => {
  const response = await thingsboardAPI.post<Tenant>('/tenant', tenant);
  return response.data;
};

// Get Tenant by ID
export const getTenantById = async (tenantId: string = ''): Promise<Tenant> => {
  const response = await thingsboardAPI.get<Tenant>(`/tenant/${tenantId}`);
  return response.data;
};

// Delete Tenant by ID
export const deleteTenant = async (tenantId: string): Promise<void> => {
  await thingsboardAPI.delete(`/tenant/${tenantId}`);
};

// Get Tenant Info by ID
export const getTenantInfoById = async (tenantId: string): Promise<any> => {
  const response = await thingsboardAPI.get(`/tenant/info/${tenantId}`);
  return response.data;
};

// Get Tenants Info with Pagination
export const getTenantsInfo = async (params: {
  pageSize: number;
  page: number;
  textSearch?: string;
  sortProperty?: string;
  sortOrder?: string;
}): Promise<any> => {
  const response = await thingsboardAPI.get('/tenantInfos', {
    params: params,
  });
  return response.data;
};

// Get Tenants with Pagination
export const getTenants = async (params: {
  pageSize: number;
  page: number;
  textSearch?: string;
  sortProperty?: string;
  sortOrder?: string;
}): Promise<any> => {
  const response = await thingsboardAPI.get('/tenants', {
    params: params,
  });
  return response.data;
};
