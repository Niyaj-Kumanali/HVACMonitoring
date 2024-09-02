import thingsboardAPI from './thingsboardAPI'; // Make sure to import your existing Axios instance
import { DeviceProfile, PageData } from '../types/thingsboardTypes';

// Create or Update Device Profile
export const saveDeviceProfile = async (
  deviceProfile: DeviceProfile
) => {
  const response = await thingsboardAPI.post<DeviceProfile>('/deviceProfile', deviceProfile);
  return response;
};

// Delete Device Profile
export const deleteDeviceProfile = async (
  deviceProfileId: string
) => {
  await thingsboardAPI.delete(`/deviceProfile/${deviceProfileId}`);
};

// Get Device Profile by ID
export const getDeviceProfileById = async (
  deviceProfileId: string,
  inlineImages?: boolean
) => {
  const response = await thingsboardAPI.get<DeviceProfile>(`/deviceProfile/${deviceProfileId}`, {
    params: { inlineImages },
  });
  return response;
};

// Make Device Profile Default
export const setDefaultDeviceProfile = async (
  deviceProfileId: string
) => {
  await thingsboardAPI.post(`/deviceProfile/${deviceProfileId}/default`);
};

// Get Attribute Keys
export const getAttributesKeys = async (
  deviceProfileId?: string
) => {
  const response = await thingsboardAPI.get<string[]>('/deviceProfile/devices/keys/attributes', {
    params: { deviceProfileId },
  });
  return response;
};

// Get Time-Series Keys
export const getTimeseriesKeys = async (
  deviceProfileId?: string
) => {
  const response = await thingsboardAPI.get<string[]>('/deviceProfile/devices/keys/timeseries', {
    params: { deviceProfileId },
  });
  return response;
};

// Get Device Profile Names
export const getDeviceProfileNames = async (
  activeOnly?: boolean
) => {
  const response = await thingsboardAPI.get<string[]>('/deviceProfile/names', {
    params: { activeOnly },
  });
  return response;
};

// Get Device Profile Info by ID
export const getDeviceProfileInfoById = async (
  deviceProfileId: string
) => {
  const response = await thingsboardAPI.get<DeviceProfile>(`/deviceProfileInfo/${deviceProfileId}`);
  return response;
};

// Get Default Device Profile Info
export const getDefaultDeviceProfileInfo = async () => {
  const response = await thingsboardAPI.get<DeviceProfile>('/deviceProfileInfo/default');
  return response;
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
) => {
  const response = await thingsboardAPI.get<PageData<DeviceProfile>>('/deviceProfileInfos', {
    params,
  });
  return response;
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
) => {
  const response = await thingsboardAPI.get<PageData<DeviceProfile>>('/deviceProfiles', {
    params: params,
  });
  return response;
};
