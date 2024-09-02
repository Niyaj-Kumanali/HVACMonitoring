import { TelemetryQueryParams } from '../types/thingsboardTypes';
import thingsboardAPI from './thingsboardAPI'; // Adjust the path as necessary

// Save device attributes
export const saveDeviceAttributes = async (
  deviceId: string,
  scope: 'SERVER_SCOPE' | 'SHARED_SCOPE',
  attributes: Record<string, any>
) => {
  await thingsboardAPI.post(`/plugins/telemetry/${deviceId}/${scope}`, attributes);
};

// Delete device attributes
export const deleteDeviceAttributes = async (
  deviceId: string,
  scope: string,
  keys?: string[]
) => {
  await thingsboardAPI.delete(`/plugins/telemetry/${deviceId}/${scope}`, {
    params: { keys: keys?.join(',') },
  });
};

// Save entity attributes (V1)
export const saveEntityAttributesV1 = async (
  entityType: string,
  entityId: string,
  scope: string,
  attributes: Record<string, any>
) => {
  await thingsboardAPI.post(`/plugins/telemetry/${entityType}/${entityId}/${scope}`, attributes);
};

// Delete entity attributes
export const deleteEntityAttributes = async (
  entityType: string,
  entityId: string,
  scope: string,
  keys?: string[]
) => {
  await thingsboardAPI.delete(`/plugins/telemetry/${entityType}/${entityId}/${scope}`, {
    params: { keys: keys?.join(',') },
  });
};

// Save entity attributes (V2)
export const saveEntityAttributesV2 = async (
  entityType: string,
  entityId: string,
  scope: string,
  attributes: Record<string, any>
) => {
  await thingsboardAPI.post(`/plugins/telemetry/${entityType}/${entityId}/attributes/${scope}`, attributes);
};

// Get all attribute keys
export const getAttributeKeys = async (
  entityType: string,
  entityId: string
) => {
  const response = await thingsboardAPI.get<string[]>(`/plugins/telemetry/${entityType}/${entityId}/keys/attributes`);
  return response;
};

// Get all attribute keys by scope
export const getAttributeKeysByScope = async (
  entityType: string,
  entityId: string,
  scope: string
) => {
  const response = await thingsboardAPI.get<string[]>(`/plugins/telemetry/${entityType}/${entityId}/keys/attributes/${scope}`);
  return response;
};

// Get time-series keys
export const getTimeseriesKeys = async (
  entityType: string,
  entityId: string
) => {
  const response = await thingsboardAPI.get<string[]>(`/plugins/telemetry/${entityType}/${entityId}/keys/timeseries`);
  return response;
};

// Save or update time-series data
export const saveEntityTelemetry = async (
  entityType: string,
  entityId: string,
  scope: string,
  telemetryData: Record<string, any>
) => {
  await thingsboardAPI.post(`/plugins/telemetry/${entityType}/${entityId}/timeseries/${scope}`, telemetryData);
};

// Save or update time-series data with TTL
export const saveEntityTelemetryWithTTL = async (
  entityType: string,
  entityId: string,
  scope: string,
  ttl: number,
  telemetryData: Record<string, any>
) => {
  await thingsboardAPI.post(`/plugins/telemetry/${entityType}/${entityId}/timeseries/${scope}/${ttl}`, telemetryData);
};

// Delete entity time-series data
export const deleteEntityTimeseries = async (
  entityType: string,
  entityId: string,
  keys?: string[],
  deleteAllDataForKeys?: boolean,
  startTs?: number,
  endTs?: number,
  deleteLatest?: boolean,
  rewriteLatestIfDeleted?: boolean
) => {
  await thingsboardAPI.delete(`/plugins/telemetry/${entityType}/${entityId}/timeseries/delete`, {
    params: {
      keys: keys?.join(','),
      deleteAllDataForKeys,
      startTs,
      endTs,
      deleteLatest,
      rewriteLatestIfDeleted,
    },
  });
};

// Get attributes
export const getAttributes = async (
  entityType: string,
  entityId: string,
  keys?: string[]
) => {
  const response = await thingsboardAPI.get<Record<string, any>>(
    `/plugins/telemetry/${entityType}/${entityId}/values/attributes`,
    { params: { keys: keys?.join(',') } }
  );
  return response;
};

// Get attributes by scope
export const getAttributesByScope = async (
  entityType: string,
  entityId: string,
  scope: string,
  keys?: string[]
) => {
  const response = await thingsboardAPI.get<Record<string, any>>(
    `/plugins/telemetry/${entityType}/${entityId}/values/attributes/${scope}`,
    { params: { keys: keys?.join(',') } }
  );
  return response;
};

// Get time-series data
export const getTimeseries = async (
  entityType: string,
  entityId: string,
  params: TelemetryQueryParams
) => {
  const response = await thingsboardAPI.get<Record<string, any>>(
    `/plugins/telemetry/${entityType}/${entityId}/values/timeseries`,
    { params }
  );
  return response;
};

// Get latest time-series value
export const getLatestTimeseries = async (
  entityType: string,
  entityId: string,
  keys?: string[],
  useStrictDataTypes?: boolean
) => {
  const response = await thingsboardAPI.get<Record<string, any>>(
    `/plugins/telemetry/${entityType}/${entityId}/values/timeseries`,
    { params: { keys: keys?.join(','), useStrictDataTypes } }
  );
  return response;
};
