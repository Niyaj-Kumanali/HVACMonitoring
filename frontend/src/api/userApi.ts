import {
  User,
  MobileSessionData,
  UserSettings,
} from '../types/thingsboardTypes';
import thingsboardAPI from './thingsboardAPI';

// Get Customer Users
export const getCustomerUsers = async (
  customerId: string,
  params: {
    pageSize: number;
    page: number;
    textSearch?: string;
    sortProperty?: string;
    sortOrder?: string;
  }
) => {
  const response = await thingsboardAPI.get(`/customer/${customerId}/users`, {
    params: params,
  });
  return response;
};

// Get Tenant Users
export const getTenantAdmins = async (
  tenantId: string,
  params: {
    pageSize: number;
    page: number;
    textSearch?: string;
    sortProperty?: string;
    sortOrder?: string;
  }
) => {
  const response = await thingsboardAPI.get(`/tenant/${tenantId}/users`, {
    params: params,
  });
  return response;
};

// Save or Update User
export const saveUser = async (
  user: User,
  sendActivationMail: boolean = false
) => {
  const response = await thingsboardAPI.post<User>('/user', user, {
    params: { sendActivationMail: sendActivationMail },
  });
  return response;
};

// Get User by ID
export const getUserById = async (userId: string) => {
  const response = await thingsboardAPI.get(`/user/${userId}`);
  return response;
};

// Delete User
export const deleteUser = async (userId: string) => {
  const response = await thingsboardAPI.delete(`/user/${userId}`);
  return response;
};

// Get Activation Link for User
export const getActivationLink = async (userId: string = '') => {
  const response = await thingsboardAPI.get(`/user/${userId}/activationLink`);
  return response;
};

// Get User Token
export const getUserToken = async (userId: string) => {
  const response = await thingsboardAPI.get(`/user/${userId}/token`);
  return response;
};

// Enable/Disable User Credentials
export const setUserCredentialsEnabled = async (
  userId: string,
  userCredentialsEnabled: boolean
) => {
  const response = await thingsboardAPI.post(
    `/user/${userId}/userCredentialsEnabled?userCredentialsEnabled=${userCredentialsEnabled}`
  );
  return response;
};

// Get Last Visited Dashboards
export const getLastVisitedDashboards = async () => {
  const response = await thingsboardAPI.get(`/user/dashboards`);
  return response;
};

// Report User Dashboard Action
export const reportUserDashboardAction = async (
  dashboardId: string,
  action: string
) => {
  const response = await thingsboardAPI.get(
    `/user/dashboards/${dashboardId}/${action}`
  );
  return response;
};

// Get Mobile Session
export const getMobileSession = async () => {
  const response = await thingsboardAPI.get(`/user/mobile/session`);
  return response;
};

// Save Mobile Session
export const saveMobileSession = async (sessionData: MobileSessionData) => {
  const response = await thingsboardAPI.post(`/user/mobile/session`, sessionData);
  return response;
};

// Remove Mobile Session
export const removeMobileSession = async () => {
  const response = await thingsboardAPI.delete(`/user/mobile/session`);
  return response;
};

// Send Activation Email
export const sendActivationMail = async (email: string) => {
  const response = await thingsboardAPI.post(
    `/user/sendActivationMail?email=${email}`
  );
  return response;
};

// Get User Settings
export const getUserSettings = async () => {
  const response = await thingsboardAPI.get(`/user/settings`);
  return response;
};

// Save User Settings
export const saveUserSettings = async (settings: UserSettings) => {
  const response = await thingsboardAPI.post(`/user/settings`, settings);
  return response;
};

// Delete User Settings
export const deleteUserSettings = async (paths: string) => {
  const response = await thingsboardAPI.delete(`/user/settings/${paths}`);
  return response;
};

// Check Token Access Enabled
export const isUserTokenAccessEnabled = async () => {
  const response = await thingsboardAPI.get(`/user/tokenAccessEnabled`);
  return response;
};

// Get Users
export const getUsers = async (params: {
  pageSize: number;
  page: number;
  textSearch?: string;
  sortProperty?: string;
  sortOrder?: string;
}) => {
  const response = await thingsboardAPI.get(`/users`, {
    params: params,
  });
  return response;
};

// Get Users for Assign
export const getUsersForAssign = async (
  alarmId: string,
  params: {
    pageSize: number;
    page: number;
    textSearch?: string;
    sortProperty?: string;
    sortOrder?: string;
  }
) => {
  const response = await thingsboardAPI.get(`/users/assign/${alarmId}`, {
    params: params,
  });
  return response;
};

// Find Users by Query
export const findUsersByQuery = async (params: {
  pageSize: number;
  page: number;
  textSearch?: string;
  sortProperty?: string;
  sortOrder?: string;
}) => {
  const response = await thingsboardAPI.get(`/users/query`, {
    params: params,
  });
  return response;
};
