// Widget.tsx
import React, { useEffect, useState } from 'react';
import WidgetHeader from './WidgetHeader';
import LineChartWidget from './LineChartWidget';
import BarChartWidget from './BarChartWidget';
import ScatterPlotWidget from './ScatterPlotWidget';
import PieChartWidget from './PieChartWidget';
import { Device, TelemetryData } from '../../types/thingsboardTypes';
import { getTimeseries, getTimeseriesKeys } from '../../api/telemetryAPIs';

interface WidgetProps {
  devices: Device[];
  type: 'line' | 'bar' | 'scatter' | 'pie';
}

const Widget: React.FC<WidgetProps> = ({ devices, type }) => {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [telemetryData, setTelemetryData] = useState<TelemetryData>({});
  const [filteredTelemetryData, setFilteredTelemetryData] =
    useState<TelemetryData>({});

  useEffect(() => {
    console.log('Selected Device:', selectedDevice);
    console.log('Selected Sensors:', selectedSensors);

    // Fetch telemetry data whenever selectedDevice or selectedSensors changes
    const fetchTelemetryData = async () => {
      try {
        const keyResponse = await getTimeseriesKeys('DEVICE', selectedDevice)
        const response = await getTimeseries('DEVICE', selectedDevice, {
          keys: selectedSensors ? selectedSensors.join(','): keyResponse.data.join(", "),
          startTs: Date.now() - 3600000, // last hour
          endTs: Date.now(),
          limit: 100,
        });
        console.log('Telemetry response:', response);
        setTelemetryData(response.data);
      } catch (error) {
        console.error('Failed to fetch telemetry data:', error);
      }
    };

    fetchTelemetryData();
  }, [selectedDevice, selectedSensors]);

  useEffect(() => {
    // Filter telemetry data based on selected sensors
    if (selectedSensors.length > 0) {
      const data: TelemetryData = selectedSensors.reduce(
        (acc: any, sensor: string) => {
          acc[sensor] = telemetryData[sensor] || [];
          return acc;
        },
        {}
      );
      setFilteredTelemetryData(data);
    } else {
      setFilteredTelemetryData(telemetryData); // If no sensors selected, show all data
    }
  }, [selectedSensors, telemetryData]);

  return (
    <div className="widget">
      <WidgetHeader
        devices={devices}
        selectedDevice={selectedDevice}
        selectedSensors={selectedSensors}
        onSelectDevice={setSelectedDevice}
        onSelectSensors={setSelectedSensors}
      />
      {type === 'line' && <LineChartWidget data={filteredTelemetryData} />}
      {type === 'bar' && <BarChartWidget data={filteredTelemetryData} />}
      {type === 'scatter' && <ScatterPlotWidget data={filteredTelemetryData} />}
      {type === 'pie' && <PieChartWidget data={filteredTelemetryData} />}
    </div>
  );
};

export default Widget;
