import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { mongoAPI } from '../api/MongoAPIInstance';

interface CoolantOption {
  value: string;
  label: string;
}

interface SensorsOption {
  value: string;
  label: string;
}

interface WarehouseDimensions {
  length: number;
  width: number;
  height: number;
}

interface CoolingUnit {
  coolant: string;
  coolant_used: string;
  data: string
}

interface Sensor {
  sensor: string;
  rack_id: number;
  shelf_id: number;
  data: string
}

interface WarehouseData {
  warehouse_id: string;
  warehouse_name: string;
  latitude: number;
  longitude: number;
  warehouse_dimensions: WarehouseDimensions;
  energy_resource: string;
  cooling_units: CoolingUnit[];
  sensors: Sensor[];
}

const AddWarehouse: React.FC = () => {
  const [formData, setFormData] = useState<WarehouseData>({
    warehouse_id: '',
    warehouse_name: '',
    latitude: 0,
    longitude: 0,
    warehouse_dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    energy_resource: '',
    cooling_units: [],
    sensors: [],
  });


  const [submitted, setSubmitted] = useState<boolean>(false);
  const [coolantOptions, setCoolantOptions] = useState<CoolantOption[]>([]);
  const [sensorOptions, setSensorOptions] = useState<SensorsOption[]>([]);

  const fetchAvailableCoolants = async () => {
    try {
      const response = await fetch('http://localhost:2000/coolant/getavaliablecoolants');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const availableCoolants = await response.json();

      const options = availableCoolants.map((coolant: any) => ({
        value: coolant._id,
        label: coolant.coolant_id,
      }));
      setCoolantOptions(options);
    } catch (error) {
      console.error('Error fetching available coolants:', error);
    }
  };

  const fetchAvailableSensors = async () => {
    try {
      const response = await fetch('http://localhost:2000/sensor/getavaliablesensors');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const availableSensors = await response.json();

      const options = availableSensors.map((sensor: any) => ({
        value: sensor._id,
        label: sensor.sensor_id,
      }));
      setSensorOptions(options);
    } catch (error) {
      console.error('Error fetching available sensors:', error);
    }
  };

  useEffect(() => {
    if (!submitted) {
      fetchAvailableCoolants();
      fetchAvailableSensors();
    }
  }, [submitted]);

  const handleReset = () => {
    setFormData({
      warehouse_id: '',
      warehouse_name: '',
      latitude: 0,
      longitude: 0,
      warehouse_dimensions: {
        length: 0,
        width: 0,
        height: 0,
      },
      energy_resource: '',
      cooling_units: [],
      sensors: [],
    });
    setSubmitted(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (name.startsWith('warehouse_dimensions.') || name === 'latitude' || name === 'longitude') {
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

  const handleCoolantChange = (index: number, field: keyof CoolingUnit, value: string) => {
    const updatedCoolingUnits = [...formData.cooling_units];
    updatedCoolingUnits[index] = {
      ...updatedCoolingUnits[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      cooling_units: updatedCoolingUnits,
    });
  };

  const handleSensorChange = (index: number, field: keyof Sensor, value: string) => {
    const updatedSensors = [...formData.sensors];
    updatedSensors[index] = {
      ...updatedSensors[index],
      [field]: field === 'rack_id' || field === 'shelf_id' ? parseInt(value, 10) : value,
    };
    setFormData({
      ...formData,
      sensors: updatedSensors,
    });
  };

  const handleSelectChange = (selectedOptions: any, actionMeta: any) => {
    const name = actionMeta.name as keyof WarehouseData;

    if (name === 'cooling_units') {
      const formattedData = selectedOptions ? selectedOptions.map((option: { value: string; label: string }) => ({
        coolant: option.value,
        coolant_used: '', // Default empty, can be filled in the input fields
        data: option.label
      })) : [];
      setFormData({
        ...formData,
        [name]: formattedData,
      });
    } else if (name === 'sensors') {
      const formattedData = selectedOptions ? selectedOptions.map((option: { value: string; label: string }) => ({
        sensor: option.value,
        rack_id: 0, // Default value
        shelf_id: 0, // Default value
        data: option.label
      })) : [];
      setFormData({
        ...formData,
        [name]: formattedData,
      });
    } else {
      setFormData({
        ...formData,
        [name]: selectedOptions ? selectedOptions.map((option: { value: string }) => option.value) : [],
      });
    }
  };

  // console.log(formData)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // const response = await fetch('http://localhost:2000/warehouse/addwarehouse', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      const response = await mongoAPI.post("warehouse/addwarehouse", JSON.stringify(formData))
  
      const result = response
      console.log(response); // Log the result to see any error details
  
      // if (!response.ok) {
      //   throw new Error(result.message || 'Failed to submit form');
      // }
  
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
            <label htmlFor="warehouse_id">Warehouse ID:</label>
            <input
              type="text"
              id="warehouse_id"
              name="warehouse_id"
              value={formData.warehouse_id}
              onChange={handleChange}
              disabled={submitted}
            />
          </div>

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
            <Select
              id="cooling_units"
              name="cooling_units"
              options={coolantOptions}
              isMulti
              onChange={handleSelectChange}
              isDisabled={submitted}
            />
            {formData.cooling_units.map((coolingUnit, index) => (
              <div key={index}>
                <label>Coolant Used: {coolingUnit.data}</label>
                <input
                  type="text"
                  value={coolingUnit.coolant_used}
                  onChange={(e) =>
                    handleCoolantChange(index, 'coolant_used', e.target.value)
                  }
                  disabled={submitted}
                />
              </div>
            ))}
          </div>

          <div className="form-group">
            <label htmlFor="sensors">Sensors:</label>
            <Select
              id="sensors"
              name="sensors"
              options={sensorOptions}
              isMulti
              onChange={handleSelectChange}
              isDisabled={submitted}
            />
            {formData.sensors.map((sensor, index) => (
              <div key={index}>
                <label>Enter Rack ID for Sensor {sensor.data}</label>
                <input
                  type="number"
                  value={sensor.rack_id}
                  onChange={(e) =>
                    handleSensorChange(index, 'rack_id', e.target.value)
                  }
                  disabled={submitted}
                />
                <label>Shelf ID:</label>
                <input
                  type="number"
                  value={sensor.shelf_id}
                  onChange={(e) =>
                    handleSensorChange(index, 'shelf_id', e.target.value)
                  }
                  disabled={submitted}
                />
              </div>
            ))}
          </div>

          <button className="submit-button" type="submit" disabled={submitted}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default AddWarehouse;
