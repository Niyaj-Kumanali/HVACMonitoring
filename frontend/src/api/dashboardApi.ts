import { DashboardLayoutOptions } from '../Redux/Reducer/layoutReducer';
import { DashboardType } from '../types/thingsboardTypes';
import { mongoAPI } from './MongoAPIInstance';
import thingsboardAPI from './thingsboardAPI';

// Create or Update Dashboard
export const saveDashboard = async (
  dashboard: DashboardType
) => {
  const response = await thingsboardAPI.post('/dashboard', dashboard);
  return response;
};

// Get Dashboard by ID
export const getDashboardById = async (
  dashboardId: string,
  inlineImages = false
) => {
  const response = await thingsboardAPI.get(`/dashboard/${dashboardId}`, {
    params: { inlineImages },
  });
  return response;
};

// Delete Dashboard
export const deleteDashboard = async (dashboardId: string) => {
  const response = await thingsboardAPI.delete(`/dashboard/${dashboardId}`);
  return response
};

// Assign Dashboard to Customer
export const assignDashboardToCustomer = async (
  customerId: string,
  dashboardId: string
) => {
  const response = await thingsboardAPI.post(
    `/customer/${customerId}/dashboard/${dashboardId}`
  );
  return response;
};

// Unassign Dashboard from Customer
export const unassignDashboardFromCustomer = async (
  customerId: string,
  dashboardId: string
) => {
  const response = await thingsboardAPI.delete(`/customer/${customerId}/dashboard/${dashboardId}`);
  return response
};

// Assign Dashboard to Public Customer
export const assignDashboardToPublicCustomer = async (
  dashboardId: string
) => {
  const response = await thingsboardAPI.post(
    `/customer/public/dashboard/${dashboardId}`
  );
  return response;
};

// Unassign Dashboard from Public Customer
export const unassignDashboardFromPublicCustomer = async (
  dashboardId: string
) => {
  const response = await thingsboardAPI.delete(`/customer/public/dashboard/${dashboardId}`);
  return response
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
) => {
  const response = await thingsboardAPI.get(
    `/customer/${customerId}/dashboards`,
    { params }
  );
  return response;
};

// Update Dashboard Customers
export const updateDashboardCustomers = async (
  dashboardId: string,
  customerIds: string[]
) => {
  const response = await thingsboardAPI.post(`/dashboard/${dashboardId}/customers`, customerIds);
  return response
};

// Add Dashboard Customers
export const addDashboardCustomers = async (
  dashboardId: string,
  customerIds: string[]
) => {
  const response = await thingsboardAPI.post(`/dashboard/${dashboardId}/customers/add`, customerIds);
  return response
};

// Remove Dashboard Customers
export const removeDashboardCustomers = async (
  dashboardId: string,
  customerIds: string[]
) => {
  const response = await thingsboardAPI.post(`/dashboard/${dashboardId}/customers/remove`, customerIds);
  return response
};

// Get Home Dashboard
export const getHomeDashboard = async () => {
  const response = await thingsboardAPI.get('/dashboard/home');
  return response;
};

// Get Home Dashboard Info
export const getHomeDashboardInfo = async () => {
  const response = await thingsboardAPI.get('/dashboard/home/info');
  return response;
};

// Get Dashboard Info by ID
export const getDashboardInfoById = async (
  dashboardId: string
) => {
  const response = await thingsboardAPI.get(`/dashboard/info/${dashboardId}`);
  return response;
};

// Get Max Data Points Limit
export const getMaxDatapointsLimit = async () => {
  const response = await thingsboardAPI.get('/dashboard/maxDatapointsLimit');
  return response;
};

// Get Server Time
export const getServerTime = async () => {
  const response = await thingsboardAPI.get('/dashboard/serverTime');
  return response;
};

// Assign Dashboard to Edge
export const assignDashboardToEdge = async (
  edgeId: string,
  dashboardId: string
) => {
  const response = await thingsboardAPI.post(
    `/edge/${edgeId}/dashboard/${dashboardId}`
  );
  return response;
};

// Unassign Dashboard from Edge
export const unassignDashboardFromEdge = async (
  edgeId: string,
  dashboardId: string
) => {
  const response = await thingsboardAPI.delete(`/edge/${edgeId}/dashboard/${dashboardId}`);
  return response
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
) => {
  const response = await thingsboardAPI.get(`/edge/${edgeId}/dashboards`, {
    params,
  });
  return response;
};

// Get Tenant Dashboards with Pagination
export const getTenantDashboards = async (params: {
  pageSize: number;
  page: number;
  mobile?: boolean;
  textSearch?: string;
  sortProperty?: string;
  sortOrder?: string;
}) => {
  const response = await thingsboardAPI.get('/tenant/dashboards', { params });
  return response;
};

// Get Tenant Home Dashboard Info
export const getTenantHomeDashboardInfo = async () => {
  const response = await thingsboardAPI.get('/tenant/dashboard/home/info');
  return response;
};

// Update Tenant Home Dashboard Info
export const updateTenantHomeDashboardInfo = async (
  dashboard: DashboardType
) => {
  const response = await thingsboardAPI.post(
    '/tenant/dashboard/home/info',
    dashboard
  );
  return response;
};


export const postLayout = async (dashboardId: string = "", layout: DashboardLayoutOptions) => {
  const response = await mongoAPI.post(`/dashboard/saveDashboardLayout/${dashboardId}`, layout);
  return response
}

export const getLayout = async (dashboardId: string = "") => {
  const response = await mongoAPI.get(`/dashboard/getDashboardLayout/${dashboardId}`)
  return response
}


export const deleteLayout = async (dashboardId: string = "") => {
  const response = await mongoAPI.delete(`/dashboard/deletedashboard/${dashboardId}`)
  return response
}
