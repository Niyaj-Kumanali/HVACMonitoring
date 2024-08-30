import React, { useEffect, useState } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import ChartWidget from './ChartWidget';
import DashboardHeader from './DashboardHeader';
import { getTenantDevices } from '../../api/deviceApi';
import {
  Device,
  DeviceQueryParams,
  PageData,
  TelemetryQueryParams,
} from '../../types/thingsboardTypes';
import { getTimeseries, getTimeseriesKeys } from '../../api/telemetryAPIs';
import './Dashboard.css';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [layout, setLayout] = useState<Layout[]>([]);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [devices, setDevices] = useState<{ id: string; name: string }[]>([]);
  const [sensors, setSensors] = useState<string[]>([]);
  const [telemetryData, setTelemetryData] = useState<{ [key: string]: any }>({});
  const [filteredTelemetryData, setFilteredTelemetryData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    // Fetch devices from ThingsBoard
    const fetchDevices = async () => {
      const params: DeviceQueryParams = {
        pageSize: 10,
        page: 0,
        type: 'default',
        textSearch: '',
        sortProperty: 'name',
        sortOrder: 'ASC',
      };
      const response: PageData<Device> = await getTenantDevices(params);
      const devices: Device[] = response.data || [];
      setDevices(
        devices.map((device: any) => ({
          id: device.id.id,
          name: device.name,
        }))
      );
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    // Fetch telemetry data whenever a new device is selected
    const fetchTelemetryData = async (deviceId: string) => {
      const keys: string[] = await getTimeseriesKeys('DEVICE', deviceId || '');
      setSensors(keys);
      setSelectedSensors(keys); // Initialize selectedSensors to all keys when a new device is selected
      const keysString = keys.join(',');

      const params: TelemetryQueryParams = {
        keys: keysString, // Pass the comma-separated string of keys
        startTs: 1672597800000,
        endTs: 1735583400000,
        limit: 50,
        orderBy: 'ASC'
      };

      const telemetryData = await getTimeseries(
        'DEVICE',
        deviceId || '',
        params
      );
      console.log(telemetryData);
      setTelemetryData(telemetryData);
    };

    if (selectedDevice) {
      fetchTelemetryData(selectedDevice);
    }
  }, [selectedDevice]);

  useEffect(() => {
    // Filter telemetry data based on selected sensors
    const handleFilteredData = () => {
      if (selectedSensors.length > 0) {
        const data: { [key: string]: any } = selectedSensors.reduce((acc, sensor) => {
          acc[sensor] = telemetryData[sensor] || [];
          return acc;
        }, {});
        setFilteredTelemetryData(data);
      } else {
        setFilteredTelemetryData(telemetryData); // If no sensors selected, show all data
      }
    };

    handleFilteredData();
  }, [selectedSensors, telemetryData]);

  const onEdit = () => {
    setIsEditable(!isEditable);
  };

  const onSave = () => {
    alert('Layout saved!');
    setIsEditable(false);
  };

  const onAddChart = () => {
    setLayout((prevLayout) => [
      ...prevLayout,
      { i: `chart-${prevLayout.length}`, x: 0, y: Infinity, w: 4, h: 4 },
    ]);
  };

  return (
    <div className="menu-data">
      <DashboardHeader
        devices={devices}
        sensors={sensors}
        selectedDevice={selectedDevice}
        selectedSensors={selectedSensors}
        onSelectDevice={setSelectedDevice}
        onSelectSensors={setSelectedSensors}
        onEdit={onEdit}
        onSave={onSave}
      />
      <button onClick={onAddChart}>Add Chart</button>
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        isDraggable={isEditable}
        isResizable={isEditable}
        onLayoutChange={(layout: any) => setLayout(layout)}
      >
        {layout.map((item) => (
          <div key={item.i} data-grid={item}>
            <ChartWidget data={filteredTelemetryData} />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default Dashboard;
