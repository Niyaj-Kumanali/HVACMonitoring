import thingsboardAPI from './thingsboardAPI';
import { Device, DeviceQueryParams, PageData } from '../types/thingsboardTypes';

// Get commands to publish device telemetry
export const getDevicePublishTelemetryCommands = async (
  deviceId: string
): Promise<any> => {
  const response = await thingsboardAPI.get(`/device-connectivity/${deviceId}`);
  return response.data;
};

// Download server certificate
export const downloadServerCertificate = async (
  protocol: string
): Promise<Blob> => {
  const response = await thingsboardAPI.get(
    `/device-connectivity/${protocol}/certificate/download`,
    { responseType: 'blob' }
  );
  return response.data;
};

// Download generated docker-compose.yml file for gateway
export const downloadGatewayDockerCompose = async (
  deviceId: string
): Promise<Blob> => {
  const response = await thingsboardAPI.get(
    `/device-connectivity/gateway-launch/${deviceId}/docker-compose/download`,
    { responseType: 'blob' }
  );
  return response.data;
};

// Assign device to customer
export const assignDeviceToCustomer = async (
  customerId: string,
  deviceId: string
): Promise<void> => {
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
): Promise<any> => {
  const response = await thingsboardAPI.get(`/customer/${customerId}/deviceInfos`, { params });
  return response.data;
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
): Promise<Device[]> => {
  const response = await thingsboardAPI.get(`/customer/${customerId}/devices`, { params });
  return response.data;
};

// Unassign device from customer
export const unassignDeviceFromCustomer = async (deviceId: string): Promise<void> => {
  await thingsboardAPI.delete(`/customer/device/${deviceId}`);
};

// Claim device
export const claimDevice = async (deviceName: string): Promise<Device> => {
  const response = await thingsboardAPI.post<Device>(`/customer/device/${deviceName}/claim`);
  return response.data;
};

// Reclaim device
export const reClaimDevice = async (deviceName: string): Promise<void> => {
  await thingsboardAPI.delete(`/customer/device/${deviceName}/claim`);
};

// Make device publicly available
export const assignDeviceToPublicCustomer = async (deviceId: string): Promise<void> => {
  await thingsboardAPI.post(`/customer/public/device/${deviceId}`);
};

// Create Device with Credentials
export const saveDeviceWithCredentials = async (device: Device): Promise<Device> => {
  const response = await thingsboardAPI.post<Device>('/device-with-credentials', device);
  return response.data;
};

// Create or Update Device
export const saveDevice = async (
  device: Device,
  accessToken?: string
): Promise<Device> => {
  const response = await thingsboardAPI.post<Device>('/device', device, {
    params: { accessToken },
  });
  return response.data;
};

// Get Device by ID
export const getDeviceById = async (deviceId: string = ''): Promise<Device> => {
  const response = await thingsboardAPI.get<Device>(`/device/${deviceId}`);
  return response.data;
};

// Delete Device
export const deleteDevice = async (deviceId: string): Promise<void> => {
  await thingsboardAPI.delete(`/device/${deviceId}`);
};

// Get Device Credentials by Device ID
export const getDeviceCredentialsByDeviceId = async (deviceId: string): Promise<any> => {
  const response = await thingsboardAPI.get(`/device/${deviceId}/credentials`);
  return response.data;
};

// Update Device Credentials
export const updateDeviceCredentials = async (
  deviceId: string,
  credentials: any
): Promise<void> => {
  await thingsboardAPI.post(`/device/${deviceId}/credentials`, credentials);
};

// Import the bulk of devices
export const processDevicesBulkImport = async (devices: any[]): Promise<void> => {
  await thingsboardAPI.post('/device/bulk_import', devices);
};

// Get Device Info by ID
export const getDeviceInfoById = async (deviceId: string = ''): Promise<any> => {
  const response = await thingsboardAPI.get(`/device/info/${deviceId}`);
  return response.data;
};

// Find related devices
export const getAllDevices = async (query: any): Promise<any> => {
  const response = await thingsboardAPI.post('/devices', query);
  return response.data;
};

// Get Devices By Ids
export const getDevicesByIds = async (deviceIds: string[]): Promise<Device[]> => {
  const response = await thingsboardAPI.get('/devices', { params: { deviceIds } });
  return response.data;
};

// Count devices by device profile
export const countByDeviceProfileAndEmptyOtaPackage = async (
  otaPackageType: string,
  deviceProfileId: string
): Promise<number> => {
  const response = await thingsboardAPI.get(`/devices/count/${otaPackageType}/${deviceProfileId}`);
  return response.data;
};

// Assign device to edge
export const assignDeviceToEdge = async (
  edgeId: string,
  deviceId: string
): Promise<void> => {
  await thingsboardAPI.post(`/edge/${edgeId}/device/${deviceId}`);
};

// Unassign device from edge
export const unassignDeviceFromEdge = async (
  edgeId: string,
  deviceId: string
): Promise<void> => {
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
): Promise<any> => {
  const response = await thingsboardAPI.get(`/edge/${edgeId}/devices`, { params });
  return response.data;
};

// Assign device to tenant
export const assignDeviceToTenant = async (
  tenantId: string,
  deviceId: string
): Promise<void> => {
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
}): Promise<any> => {
  const response = await thingsboardAPI.get(`/tenant/deviceInfos`, { params });
  return response.data;
};

// Get Tenant Device
export const getTenantDevice = async (deviceName: string): Promise<Device> => {
  const response = await thingsboardAPI.get<Device>(`/tenant/devices`, {
    params: { deviceName },
  });
  return response.data;
};

// Get Tenant Devices
export const getTenantDevices = async (params: DeviceQueryParams): Promise<PageData<Device>> => {
  const response = await thingsboardAPI.get('/tenant/devices', { params });
  return response.data;
};
