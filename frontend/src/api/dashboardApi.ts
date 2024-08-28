import { DashboardType, PageData } from '../types/thingsboardTypes';
import thingsboardAPI from './thingsboardAPI';

// Create or Update Dashboard
export const saveDashboard = async (
  dashboard: DashboardType
): Promise<DashboardType> => {
  const response = await thingsboardAPI.post('/dashboard', dashboard);
  return response.data;
};

// Get Dashboard by ID
export const getDashboardById = async (
  dashboardId: string,
  inlineImages = false
): Promise<DashboardType> => {
  const response = await thingsboardAPI.get(`/dashboard/${dashboardId}`, {
    params: { inlineImages },
  });
  return response.data;
};

// Delete Dashboard
export const deleteDashboard = async (dashboardId: string): Promise<void> => {
  await thingsboardAPI.delete(`/dashboard/${dashboardId}`);
};

// Assign Dashboard to Customer
export const assignDashboardToCustomer = async (
  customerId: string,
  dashboardId: string
): Promise<DashboardType> => {
  const response = await thingsboardAPI.post(
    `/customer/${customerId}/dashboard/${dashboardId}`
  );
  return response.data;
};

// Unassign Dashboard from Customer
export const unassignDashboardFromCustomer = async (
  customerId: string,
  dashboardId: string
): Promise<void> => {
  await thingsboardAPI.delete(`/customer/${customerId}/dashboard/${dashboardId}`);
};

// Assign Dashboard to Public Customer
export const assignDashboardToPublicCustomer = async (
  dashboardId: string
): Promise<DashboardType> => {
  const response = await thingsboardAPI.post(
    `/customer/public/dashboard/${dashboardId}`
  );
  return response.data;
};

// Unassign Dashboard from Public Customer
export const unassignDashboardFromPublicCustomer = async (
  dashboardId: string
): Promise<void> => {
  await thingsboardAPI.delete(`/customer/public/dashboard/${dashboardId}`);
};

// Get Customer Dashboards with Pagination
export const getCustomerDashboards = async (
  customerId: string,
  params: {
    pageSize: number;
    page: number;
    mobile?: boolean;
    textSearch?: string;
    sortProperty?: string;
    sortOrder?: string;
  }
): Promise<PageData<DashboardType>> => {
  const response = await thingsboardAPI.get(
    `/customer/${customerId}/dashboards`,
    { params }
  );
  return response.data;
};

// Update Dashboard Customers
export const updateDashboardCustomers = async (
  dashboardId: string,
  customerIds: string[]
): Promise<void> => {
  await thingsboardAPI.post(`/dashboard/${dashboardId}/customers`, customerIds);
};

// Add Dashboard Customers
export const addDashboardCustomers = async (
  dashboardId: string,
  customerIds: string[]
): Promise<void> => {
  await thingsboardAPI.post(`/dashboard/${dashboardId}/customers/add`, customerIds);
};

// Remove Dashboard Customers
export const removeDashboardCustomers = async (
  dashboardId: string,
  customerIds: string[]
): Promise<void> => {
  await thingsboardAPI.post(`/dashboard/${dashboardId}/customers/remove`, customerIds);
};

// Get Home Dashboard
export const getHomeDashboard = async (): Promise<DashboardType> => {
  const response = await thingsboardAPI.get('/dashboard/home');
  return response.data;
};

// Get Home Dashboard Info
export const getHomeDashboardInfo = async (): Promise<DashboardType> => {
  const response = await thingsboardAPI.get('/dashboard/home/info');
  return response.data;
};

// Get Dashboard Info by ID
export const getDashboardInfoById = async (
  dashboardId: string
): Promise<DashboardType> => {
  const response = await thingsboardAPI.get(`/dashboard/info/${dashboardId}`);
  return response.data;
};

// Get Max Data Points Limit
export const getMaxDatapointsLimit = async (): Promise<number> => {
  const response = await thingsboardAPI.get('/dashboard/maxDatapointsLimit');
  return response.data;
};

// Get Server Time
export const getServerTime = async (): Promise<number> => {
  const response = await thingsboardAPI.get('/dashboard/serverTime');
  return response.data;
};

// Assign Dashboard to Edge
export const assignDashboardToEdge = async (
  edgeId: string,
  dashboardId: string
): Promise<DashboardType> => {
  const response = await thingsboardAPI.post(
    `/edge/${edgeId}/dashboard/${dashboardId}`
  );
  return response.data;
};

// Unassign Dashboard from Edge
export const unassignDashboardFromEdge = async (
  edgeId: string,
  dashboardId: string
): Promise<void> => {
  await thingsboardAPI.delete(`/edge/${edgeId}/dashboard/${dashboardId}`);
};

// Get Edge Dashboards with Pagination
export const getEdgeDashboards = async (
  edgeId: string,
  params: {
    pageSize: number;
    page: number;
    textSearch?: string;
    sortProperty?: string;
    sortOrder?: string;
  }
): Promise<PageData<DashboardType>> => {
  const response = await thingsboardAPI.get(`/edge/${edgeId}/dashboards`, {
    params,
  });
  return response.data;
};

// Get Tenant Dashboards with Pagination
export const getTenantDashboards = async (params: {
  pageSize: number;
  page: number;
  mobile?: boolean;
  textSearch?: string;
  sortProperty?: string;
  sortOrder?: string;
}): Promise<PageData<DashboardType>> => {
  const response = await thingsboardAPI.get('/tenant/dashboards', { params });
  return response.data;
};

// Get Tenant Home Dashboard Info
export const getTenantHomeDashboardInfo = async (): Promise<DashboardType> => {
  const response = await thingsboardAPI.get('/tenant/dashboard/home/info');
  return response.data;
};

// Update Tenant Home Dashboard Info
export const updateTenantHomeDashboardInfo = async (
  dashboard: DashboardType
): Promise<DashboardType> => {
  const response = await thingsboardAPI.post(
    '/tenant/dashboard/home/info',
    dashboard
  );
  return response.data;
};
