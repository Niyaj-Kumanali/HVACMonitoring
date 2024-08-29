import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import '../styles/SensorForm.css'; // Import the CSS file
import { mongoAPI } from '../api/MongoAPIInstance';

// Define the types for the coolant options
interface CoolantOption {
  value: string;
  label: string;
}

// Define the types for the form data
interface CoolantData {
  coolant_name: string;
  location_in_warehouse: string;
  warehouse_or_vehicle: string;
  warehouse_id?: string;
  vehicle_id?: string;
}

const CoolantForm: React.FC = () => {
  const [formData, setFormData] = useState<CoolantData>({
    coolant_name: '',
    location_in_warehouse: '',
    warehouse_or_vehicle: '',
    warehouse_id: '',
    vehicle_id: ''
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [warehouses, setWarehouses] = useState<CoolantOption[]>([]);
  const [vehicles, setVehicles] = useState<CoolantOption[]>([]);

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
      const warehouseOptions: CoolantOption[] = response.data.map((wh: any) => ({
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
      const vehicleOptions: CoolantOption[] = response.data.map((vehicle: any) => ({
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

    try {
      const response = await mongoAPI.post("coolant/addcoolant", formData);
      console.log('Coolant data submitted:', response);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting coolant data:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      coolant_name: '',
      location_in_warehouse: '',
      warehouse_or_vehicle: '',
      warehouse_id: '',
      vehicle_id: ''
    });
    setSelectedType('');
    setSubmitted(false);
  };

  return (
    <div className="form-container">
      <h1>Add Coolant</h1>
      {submitted ? (
        <div className="success-message">
          <p>Coolant added successfully!</p>
          <button className="reset-button" onClick={handleReset}>Add Another Coolant</button>
        </div>
      ) : (
        <form className="coolant-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="coolant_name">Coolant Name:</label>
            <input
              type="text"
              id="coolant_name"
              name="coolant_name"
              value={formData.coolant_name}
              onChange={handleChange}
              disabled={submitted}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location_in_warehouse">Location in Warehouse:</label>
            <input
              type="text"
              id="location_in_warehouse"
              name="location_in_warehouse"
              value={formData.location_in_warehouse}
              onChange={handleChange}
              disabled={submitted}
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

export default CoolantForm;
