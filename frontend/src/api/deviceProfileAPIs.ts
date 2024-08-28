import thingsboardAPI from './thingsboardAPI'; // Make sure to import your existing Axios instance
import { DeviceProfile, PageData } from '../types/thingsboardTypes';

// Create or Update Device Profile
export const saveDeviceProfile = async (
  deviceProfile: DeviceProfile
): Promise<DeviceProfile> => {
  const response = await thingsboardAPI.post<DeviceProfile>('/deviceProfile', deviceProfile);
  return response.data;
};

// Delete Device Profile
export const deleteDeviceProfile = async (
  deviceProfileId: string
): Promise<void> => {
  await thingsboardAPI.delete(`/deviceProfile/${deviceProfileId}`);
};

// Get Device Profile by ID
export const getDeviceProfileById = async (
  deviceProfileId: string,
  inlineImages?: boolean
): Promise<DeviceProfile> => {
  const response = await thingsboardAPI.get<DeviceProfile>(`/deviceProfile/${deviceProfileId}`, {
    params: { inlineImages },
  });
  return response.data;
};

// Make Device Profile Default
export const setDefaultDeviceProfile = async (
  deviceProfileId: string
): Promise<void> => {
  await thingsboardAPI.post(`/deviceProfile/${deviceProfileId}/default`);
};

// Get Attribute Keys
export const getAttributesKeys = async (
  deviceProfileId?: string
): Promise<string[]> => {
  const response = await thingsboardAPI.get<string[]>('/deviceProfile/devices/keys/attributes', {
    params: { deviceProfileId },
  });
  return response.data;
};

// Get Time-Series Keys
export const getTimeseriesKeys = async (
  deviceProfileId?: string
): Promise<string[]> => {
  const response = await thingsboardAPI.get<string[]>('/deviceProfile/devices/keys/timeseries', {
    params: { deviceProfileId },
  });
  return response.data;
};

// Get Device Profile Names
export const getDeviceProfileNames = async (
  activeOnly?: boolean
): Promise<string[]> => {
  const response = await thingsboardAPI.get<string[]>('/deviceProfile/names', {
    params: { activeOnly },
  });
  return response.data;
};

// Get Device Profile Info by ID
export const getDeviceProfileInfoById = async (
  deviceProfileId: string
): Promise<DeviceProfile> => {
  const response = await thingsboardAPI.get<DeviceProfile>(`/deviceProfileInfo/${deviceProfileId}`);
  return response.data;
};

// Get Default Device Profile Info
export const getDefaultDeviceProfileInfo = async (): Promise<DeviceProfile> => {
  const response = await thingsboardAPI.get<DeviceProfile>('/deviceProfileInfo/default');
  return response.data;
};

// Get Device Profiles for Transport Type
export const getDeviceProfileInfos = async (
  params: {
    pageSize: number;
    page: number;
    textSearch?: string;
    sortProperty?: string;
    sortOrder?: string;
    transportType?: string
  }
): Promise<PageData<DeviceProfile>> => {
  const response = await thingsboardAPI.get<PageData<DeviceProfile>>('/deviceProfileInfos', {
    params,
  });
  return response.data;
};

// Get Device Profiles
export const getDeviceProfiles = async (
  params: {
    pageSize: number;
    page: number;
    textSearch?: string;
    sortProperty?: string;
    sortOrder?: string;
  }
): Promise<PageData<DeviceProfile>> => {
  const response = await thingsboardAPI.get<PageData<DeviceProfile>>('/deviceProfiles', {
    params: params,
  });
  return response.data;
};
