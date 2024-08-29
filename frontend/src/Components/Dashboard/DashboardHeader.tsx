import React from 'react'
import { Device } from '../../types/thingsboardTypes'

const DashboardHeader: React.FC = ({ devices, selectedDevice, onSelectDevice, onEdit, onSave }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f0f0f0' }}>
      <select value={selectedDevice} onChange={(e) => onSelectDevice(e.target.value)}>
        <option value="">Select Device</option>
        {devices.map((device:Device) => (
          <option key={device.id?.id} value={device.name}>
            {device.name}
          </option>
        ))}
      </select>
      <div>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onSave}>Save</button>
      </div>
    </div>
  )
}

export default DashboardHeader