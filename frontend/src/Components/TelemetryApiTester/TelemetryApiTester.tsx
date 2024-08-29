import React, { useState } from 'react';
import {
  saveDeviceAttributes,
  deleteDeviceAttributes,
  saveEntityAttributesV1,
  deleteEntityAttributes,
  saveEntityAttributesV2,
  getAttributeKeys,
  getAttributeKeysByScope,
  getTimeseriesKeys,
  saveEntityTelemetry,
  saveEntityTelemetryWithTTL,
  deleteEntityTimeseries,
  getAttributes,
  getAttributesByScope,
  getTimeseries,
  getLatestTimeseries,
} from '../../api/telemetryAPIs';

const TelemetryApiTester: React.FC = () => {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Generic handler for API responses
  const handleApiCall = async (apiCall: () => Promise<any>) => {
    try {
      const result = await apiCall();
      setResponse(result);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setResponse(null);
    }
  };

  return (
    <div className='menu-data' style={{ padding: '20px' }}>
      <h1>Telemetry API Tester</h1>
      <div>
        <button onClick={() => handleApiCall(() => saveDeviceAttributes('deviceId', 'scope', { key: 'value' }))}>
          Save Device Attributes
        </button>
        <button onClick={() => handleApiCall(() => deleteDeviceAttributes('deviceId', 'scope', ['key1', 'key2']))}>
          Delete Device Attributes
        </button>
        <button onClick={() => handleApiCall(() => saveEntityAttributesV1('entityType', 'entityId', 'scope', { key: 'value' }))}>
          Save Entity Attributes (V1)
        </button>
        <button onClick={() => handleApiCall(() => deleteEntityAttributes('entityType', 'entityId', 'scope', ['key1', 'key2']))}>
          Delete Entity Attributes
        </button>
        <button onClick={() => handleApiCall(() => saveEntityAttributesV2('entityType', 'entityId', 'scope', { key: 'value' }))}>
          Save Entity Attributes (V2)
        </button>
        <button onClick={() => handleApiCall(() => getAttributeKeys('entityType', 'entityId'))}>
          Get Attribute Keys
        </button>
        <button onClick={() => handleApiCall(() => getAttributeKeysByScope('entityType', 'entityId', 'scope'))}>
          Get Attribute Keys by Scope
        </button>
        <button onClick={() => handleApiCall(() => getTimeseriesKeys('entityType', 'entityId'))}>
          Get Timeseries Keys
        </button>
        <button onClick={() => handleApiCall(() => saveEntityTelemetry('entityType', 'entityId', 'scope', { key: 'value' }))}>
          Save Entity Telemetry
        </button>
        <button onClick={() => handleApiCall(() => saveEntityTelemetryWithTTL('entityType', 'entityId', 'scope', 3600, { key: 'value' }))}>
          Save Entity Telemetry with TTL
        </button>
        <button onClick={() => handleApiCall(() => deleteEntityTimeseries('entityType', 'entityId', ['key1', 'key2']))}>
          Delete Entity Timeseries
        </button>
        <button onClick={() => handleApiCall(() => getAttributes('entityType', 'entityId', ['key1', 'key2']))}>
          Get Attributes
        </button>
        <button onClick={() => handleApiCall(() => getAttributesByScope('entityType', 'entityId', 'scope', ['key1', 'key2']))}>
          Get Attributes by Scope
        </button>
        <button onClick={() => handleApiCall(() => getTimeseries('entityType', 'entityId', {
          keys: ['key1', 'key2'],
          startTs: Date.now() - 100000,
          endTs: Date.now(),
          limit: 100,
        }))}>
          Get Timeseries Data
        </button>
        <button onClick={() => handleApiCall(() => getLatestTimeseries('entityType', 'entityId', ['key1', 'key2']))}>
          Get Latest Timeseries Value
        </button>
      </div>

      {response && (
        <div style={{ marginTop: '20px', color: 'green' }}>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default TelemetryApiTester;
