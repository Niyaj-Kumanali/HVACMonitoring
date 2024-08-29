import React, { useState } from 'react';
import { mongoAPI } from '../api/MongoAPIInstance';

interface WarehouseDimensions {
  length: number;
  width: number;
  height: number;
}

interface WarehouseData {
  warehouse_name: string;
  latitude: number;
  longitude: number;
  warehouse_dimensions: WarehouseDimensions;
  energy_resource: string;
  cooling_units: number;
  sensors: number;
}

const WarehouseForm: React.FC = () => {
  const [formData, setFormData] = useState<WarehouseData>({
    warehouse_name: '',
    latitude: 0,
    longitude: 0,
    warehouse_dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    energy_resource: '',
    cooling_units: 0,
    sensors: 0,
  });

  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleReset = () => {
    setFormData({
      warehouse_name: '',
      latitude: 0,
      longitude: 0,
      warehouse_dimensions: {
        length: 0,
        width: 0,
        height: 0,
      },
      energy_resource: '',
      cooling_units: 0,
      sensors: 0,
    });
    setSubmitted(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (name.startsWith('warehouse_dimensions.') || name === 'latitude' || name === 'longitude' || name === 'cooling_units' || name === 'sensors') {
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue)) {
        if (name.startsWith('warehouse_dimensions.')) {
          const dimensionKey = name.split('.')[1] as keyof WarehouseDimensions;
          setFormData({
            ...formData,
            warehouse_dimensions: {
              ...formData.warehouse_dimensions,
              [dimensionKey]: parsedValue,
            },
          });
        } else {
          setFormData({
            ...formData,
            [name]: parsedValue,
          });
        }
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await mongoAPI.post("warehouse/addwarehouse", JSON.stringify(formData));
      const result = response.data;
  
      console.log('Warehouse added:', result);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="form-container">
      <h1>Add Warehouse</h1>
      {submitted ? (
        <div className="success-message">
          <p>Warehouse added successfully!</p>
          <button className="reset-button" onClick={handleReset}>
            Add Another Warehouse
          </button>
        </div>
      ) : (
        <form className="warehouse-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="warehouse_name">Warehouse Name:</label>
            <input
              type="text"
              id="warehouse_name"
              name="warehouse_name"
              value={formData.warehouse_name}
              onChange={handleChange}
              disabled={submitted}
            />
          </div>

          <div className="form-group">
            <label htmlFor="latitude">Latitude:</label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              disabled={submitted}
            />
          </div>

          <div className="form-group">
            <label htmlFor="longitude">Longitude:</label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              disabled={submitted}
            />
          </div>

          <div className="form-group">
            <label htmlFor="warehouse_dimensions.length">Length:</label>
            <input
              type="number"
              id="warehouse_dimensions.length"
              name="warehouse_dimensions.length"
              value={formData.warehouse_dimensions.length}
              onChange={handleChange}
              disabled={submitted}
            />
          </div>

          <div className="form-group">
            <label htmlFor="warehouse_dimensions.width">Width:</label>
            <input
              type="number"
              id="warehouse_dimensions.width"
              name="warehouse_dimensions.width"
              value={formData.warehouse_dimensions.width}
              onChange={handleChange}
              disabled={submitted}
            />
          </div>

          <div className="form-group">
            <label htmlFor="warehouse_dimensions.height">Height:</label>
            <input
              type="number"
              id="warehouse_dimensions.height"
              name="warehouse_dimensions.height"
              value={formData.warehouse_dimensions.height}
              onChange={handleChange}
              disabled={submitted}
            />
          </div>

          <div className="form-group">
            <label htmlFor="energy_resource">Energy Resource:</label>
            <input
              type="text"
              id="energy_resource"
              name="energy_resource"
              value={formData.energy_resource}
              onChange={handleChange}
              disabled={submitted}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cooling_units">Cooling Units:</label>
            <input
              type="number"
              id="cooling_units"
              name="cooling_units"
              value={formData.cooling_units}
              onChange={handleChange}
              disabled={submitted}
            />
          </div>

          <div className="form-group">
            <label htmlFor="sensors">Sensors:</label>
            <input
              type="number"
              id="sensors"
              name="sensors"
              value={formData.sensors}
              onChange={handleChange}
              disabled={submitted}
            />
          </div>

          <button className="submit-button" type="submit" disabled={submitted}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default WarehouseForm;
