import thingsboardAPI from './thingsboardAPI';
import { Device, DeviceQueryParams } from '../types/thingsboardTypes';

// Get commands to publish device telemetry
export const getDevicePublishTelemetryCommands = async (
  deviceId: string
) => {
  const response = await thingsboardAPI.get(`/device-connectivity/${deviceId}`);
  return response;
};



// Assign device to customer
export const assignDeviceToCustomer = async (
  customerId: string,
  deviceId: string
) => {
  await thingsboardAPI.post(`/customer/${customerId}/device/${deviceId}`);
};

// Get Customer Device Infos
export const getCustomerDeviceInfos = async (
  customerId: string,
  params: {
    pageSize: number;
    page: number;
    type?: string;
    active?: boolean;
    textSearch?: string;
    sortProperty?: string;
    sortOrder?: string;
  }
) => {
  const response = await thingsboardAPI.get(`/customer/${customerId}/deviceInfos`, { params });
  return response;
};

// Get Customer Devices
export const getCustomerDevices = async (
  customerId: string,
  params: {
    pageSize: number;
    page: number;
    type?: string;
    textSearch?: string;
    sortProperty?: string;
    sortOrder?: string;
  }
) => {
  const response = await thingsboardAPI.get(`/customer/${customerId}/devices`, { params });
  return response;
};

// Unassign device from customer
export const unassignDeviceFromCustomer = async (deviceId: string) => {
  await thingsboardAPI.delete(`/customer/device/${deviceId}`);
};

// Claim device
export const claimDevice = async (deviceName: string) => {
  const response = await thingsboardAPI.post<Device>(`/customer/device/${deviceName}/claim`);
  return response;
};

// Reclaim device
export const reClaimDevice = async (deviceName: string) => {
  await thingsboardAPI.delete(`/customer/device/${deviceName}/claim`);
};

// Make device publicly available
export const assignDeviceToPublicCustomer = async (deviceId: string) => {
  await thingsboardAPI.post(`/customer/public/device/${deviceId}`);
};

// Create Device with Credentials
export const saveDeviceWithCredentials = async (device: Device) => {
  const response = await thingsboardAPI.post<Device>('/device-with-credentials', device);
  return response;
};

// Create or Update Device
export const saveDevice = async (
  device: Device,
  accessToken?: string
) => {
  const response = await thingsboardAPI.post<Device>('/device', device, {
    params: { accessToken },
  });
  return response;
};

// Get Device by ID
export const getDeviceById = async (deviceId: string = '') => {
  const response = await thingsboardAPI.get<Device>(`/device/${deviceId}`);
  return response;
};

// Delete Device
export const deleteDevice = async (deviceId: string) => {
  await thingsboardAPI.delete(`/device/${deviceId}`);
};

// Get Device Credentials by Device ID
export const getDeviceCredentialsByDeviceId = async (deviceId: string) => {
  const response = await thingsboardAPI.get(`/device/${deviceId}/credentials`);
  return response;
};

// Update Device Credentials
export const updateDeviceCredentials = async (
  deviceId: string,
  credentials: any
) => {
  await thingsboardAPI.post(`/device/${deviceId}/credentials`, credentials);
};

// Import the bulk of devices
export const processDevicesBulkImport = async (devices: any[]) => {
  await thingsboardAPI.post('/device/bulk_import', devices);
};

// Get Device Info by ID
export const getDeviceInfoById = async (deviceId: string = '') => {
  const response = await thingsboardAPI.get(`/device/info/${deviceId}`);
  return response;
};

// Find related devices
export const getAllDevices = async (query: any) => {
  const response = await thingsboardAPI.post('/devices', query);
  return response;
};

// Get Devices By Ids
export const getDevicesByIds = async (deviceIds: string[]) => {
  const response = await thingsboardAPI.get('/devices', { params: { deviceIds } });
  return response;
};

// Count devices by device profile
export const countByDeviceProfileAndEmptyOtaPackage = async (
  otaPackageType: string,
  deviceProfileId: string
) => {
  const response = await thingsboardAPI.get(`/devices/count/${otaPackageType}/${deviceProfileId}`);
  return response;
};

// Assign device to edge
export const assignDeviceToEdge = async (
  edgeId: string,
  deviceId: string
) => {
  await thingsboardAPI.post(`/edge/${edgeId}/device/${deviceId}`);
};

// Unassign device from edge
export const unassignDeviceFromEdge = async (
  edgeId: string,
  deviceId: string
) => {
  await thingsboardAPI.delete(`/edge/${edgeId}/device/${deviceId}`);
};

// Get devices assigned to edge
export const getEdgeDevices = async (
  edgeId: string,
  params: {
    pageSize: number;
    page: number;
    type?: string;
    active?: boolean;
    textSearch?: string;
    sortProperty?: string;
    sortOrder?: string;
    startTime?: number;
    endTime?: number;
  }
) => {
  const response = await thingsboardAPI.get(`/edge/${edgeId}/devices`, { params });
  return response;
};

// Assign device to tenant
export const assignDeviceToTenant = async (
  tenantId: string,
  deviceId: string
) => {
  await thingsboardAPI.post(`/tenant/${tenantId}/device/${deviceId}`);
};

// Get Tenant Device Infos
export const getTenantDeviceInfos = async (params: {
  pageSize: number;
  page: number;
  type?: string;
  active?: boolean;
  textSearch?: string;
  sortProperty?: string;
  sortOrder?: string;
}) => {
  const response = await thingsboardAPI.get(`/tenant/deviceInfos`, { params });
  return response;
};

// Get Tenant Device
export const getTenantDevice = async (deviceName: string) => {
  const response = await thingsboardAPI.get<Device>(`/tenant/devices`, {
    params: { deviceName },
  });
  return response;
};

// Get Tenant Devices
export const getTenantDevices = async (params: DeviceQueryParams) => {
  const response = await thingsboardAPI.get('/tenant/devices', { params });
  return response;
};

export const getFilteredDevices = async(id: string) => {
  const params = {
    pageSize: 1000000000,
    page: 0
  }
  const response = await getTenantDeviceInfos(params)

  const filteredDevices = response.data.data.filter((device: Device) => device.label == id)
  return filteredDevices
}
