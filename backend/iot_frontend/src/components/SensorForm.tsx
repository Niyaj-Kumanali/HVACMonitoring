import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import '../styles/AddSensor.css'; // Import the CSS file
import { mongoAPI } from '../api/MongoAPIInstance';

// Define the types for the sensor options
interface SensorOption {
  value: string;
  label: string;
}

const sensorOptions: SensorOption[] = [
  { value: 'Temperature sensor', label: 'Temperature sensor' },
  { value: 'Humidity sensor', label: 'Humidity sensor' },
  { value: 'Moisture sensor', label: 'Moisture sensor' }
];

// Define the types for the form data
interface SensorData {
  sensor_name: string;
  indoor_location: string;
  Type: string[];
  date_of_installation: string;
  warehouse_or_vehicle: string;
  warehouse_id?: string;
  vehicle_id?: string;
}

// Define the types for the warehouse options
interface WarehouseOption {
  value: string;
  label: string;
}

const AddSensor: React.FC = () => {
  const [formData, setFormData] = useState<SensorData>({
    sensor_name: '',
    indoor_location: '',
    Type: [],
    date_of_installation: '',
    warehouse_or_vehicle: '',
    warehouse_id: '',
    vehicle_id: ''
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([]);
  const [vehicles, setVehicles] = useState<WarehouseOption[]>([]);

  // Fetch warehouses and vehicles on mount
  useEffect(() => {
    handleFetchAllWarehouses();
    handleFetchAllVehicles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (selectedOptions: any) => {
    setFormData({
      ...formData,
      Type: selectedOptions ? selectedOptions.map((option: { value: string }) => option.value) : []
    });
  };

  const handleSelectTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedType(value);
    setFormData({
      ...formData,
      warehouse_or_vehicle: value,
      warehouse_id: value === 'warehouse' ? formData.warehouse_id : '',
      vehicle_id: value === 'vehicle' ? formData.vehicle_id : ''
    });
  };

  const handleFetchAllWarehouses = async () => {
    try {
      const response = await mongoAPI.get("warehouse/getallwarehouse");
      const warehouseOptions: WarehouseOption[] = response.data.map((wh: any) => ({
        value: wh.warehouse_id,
        label: wh.warehouse_name
      }));
      setWarehouses(warehouseOptions);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const handleFetchAllVehicles = async () => {
    try {
      const response = await mongoAPI.get("vehicle/getallvehicle");
      const vehicleOptions: WarehouseOption[] = response.data.map((vehicle: any) => ({
        value: vehicle.vehicle_id,
        label: vehicle.vehicle_number
      }));
      setVehicles(vehicleOptions);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await mongoAPI.post("sensor/addsensor", JSON.stringify(formData))

    const result = response.data
      console.log(result); 
  };

  const handleReset = () => {
    setFormData({
      sensor_name: '',
      indoor_location: '',
      Type: [],
      date_of_installation: '',
      warehouse_or_vehicle: '',
      warehouse_id: '',
      vehicle_id: ''
    });
    setSelectedType('');
    setSubmitted(false);
  };

  return (
    <div className="form-container">
      <h1>Add Sensor</h1>
      {submitted ? (
        <div className="success-message">
          <p>Sensor added successfully!</p>
          <button className="reset-button" onClick={handleReset}>Add Another Sensor</button>
        </div>
      ) : (
        <form className="sensor-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="sensor_name">Sensor name:</label>
            <input
              type="text"
              id="sensor_name"
              name="sensor_name"
              value={formData.sensor_name}
              onChange={handleChange}
              disabled={submitted}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="indoor_location">Indoor Location:</label>
            <input
              type="text"
              id="indoor_location"
              name="indoor_location"
              value={formData.indoor_location}
              onChange={handleChange}
              disabled={submitted}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Type">Type:</label>
            <Select
              id="Type"
              name="Type"
              isMulti
              options={sensorOptions}
              value={sensorOptions.filter(option => formData.Type.includes(option.value))}
              onChange={handleSelectChange}
              isDisabled={submitted}
              required
            />
          </div>
          <div className="form-group">
            <label>Warehouse or Vehicle:</label>
            <select
              name="warehouse_or_vehicle"
              value={formData.warehouse_or_vehicle}
              onChange={handleSelectTypeChange}
              disabled={submitted}
              required
            >
              <option value="">Select warehouse or vehicle</option>
              <option value="warehouse">Warehouse</option>
              <option value="vehicle">Vehicle</option>
            </select>
          </div>
          {selectedType === 'warehouse' && (
            <div className="form-group">
              <label htmlFor="warehouse_id">Warehouse ID:</label>
              <Select
                id="warehouse_id"
                name="warehouse_id"
                options={warehouses}
                value={warehouses.find(option => option.value === formData.warehouse_id)}
                onChange={(selectedOption) => setFormData({
                  ...formData,
                  warehouse_id: selectedOption ? selectedOption.value : ''
                })}
                isDisabled={submitted}
                required
              />
            </div>
          )}
          {selectedType === 'vehicle' && (
            <div className="form-group">
              <label htmlFor="vehicle_id">Vehicle ID:</label>
              <Select
                id="vehicle_id"
                name="vehicle_id"
                options={vehicles}
                value={vehicles.find(option => option.value === formData.vehicle_id)}
                onChange={(selectedOption) => setFormData({
                  ...formData,
                  vehicle_id: selectedOption ? selectedOption.value : ''
                })}
                isDisabled={submitted}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="date_of_installation">Date of Installation:</label>
            <input
              type="date"
              id="date_of_installation"
              name="date_of_installation"
              value={formData.date_of_installation}
              onChange={handleChange}
              disabled={submitted}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={submitted} className="submit-button">
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddSensor;
