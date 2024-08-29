// src/components/DashboardHeader.tsx
import React from 'react';

interface HeaderProps {
  devices: { id: string; name: string }[];
  selectedDevice: string;
  onSelectDevice: (deviceId: string) => void;
  onEdit: () => void;
  onSave: () => void;
}

const DashboardHeader: React.FC<HeaderProps> = ({ devices, selectedDevice, onSelectDevice, onEdit, onSave }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f0f0f0' }}>
      <select value={selectedDevice} onChange={(e) => onSelectDevice(e.target.value)}>
        <option value="">Select Device</option>
        {devices.map((device) => (
          <option key={device.id} value={device.id}>
            {device.name}
          </option>
        ))}
      </select>
      <div>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onSave}>Save</button>
      </div>
    </div>
  );
};

export default DashboardHeader;
