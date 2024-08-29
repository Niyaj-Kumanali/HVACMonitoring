import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

interface CoolantOption {
  value: string;
  label: string;
}

interface SensorsOption {
  value: string;
  label: string;
}

interface VehicleDimensions {
  length: number;
  width: number;
  height: number;
}

interface DriverDetails {
  driver_name: string;
  driver_contact_no: number;
  licence_id: string;
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

interface CoolingUnit {
  coolant: string;
  coolant_used: string;
}

interface Sensor {
  sensor: string;
}

interface VehicleFormData {
  vehicle_id: string;
  vehicle_number: string;
  vehicle_name: string;
  vehicle_dimensions: VehicleDimensions;
  driver_details: DriverDetails;
  cooling_units: CoolingUnit[];
  sensors: Sensor[];
}

const AddVehicle: React.FC = () => {
  const [formData, setFormData] = useState<VehicleFormData>({
    vehicle_id: '',
    vehicle_number: '',
    vehicle_name: '',
    vehicle_dimensions: { length: 0, width: 0, height: 0 },
    driver_details: { driver_name: '', driver_contact_no: 0, licence_id: '' },
    cooling_units: [],
    sensors: [],
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [coolantOptions, setCoolantOptions] = useState<CoolantOption[]>([]);
  const [sensorOptions, setSensorOptions] = useState<SensorsOption[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('vehicle_dimensions.')) {
      const dimensionKey = name.split('.')[1] as keyof VehicleDimensions;
      setFormData({
        ...formData,
        vehicle_dimensions: {
          ...formData.vehicle_dimensions,
          [dimensionKey]: parseFloat(value),
        },
      });
    } else if (name.startsWith('driver_details.')) {
      const detailKey = name.split('.')[1] as keyof DriverDetails;
      setFormData({
        ...formData,
        driver_details: {
          ...formData.driver_details,
          [detailKey]: detailKey === 'driver_contact_no' ? parseInt(value, 10) : value,
        },
      });
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
    const name = actionMeta.name as keyof VehicleFormData;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/vehicles', formData);
      alert('Vehicle data submitted successfully!');
      // Reset form or handle success
    } catch (error) {
      console.error('Error submitting form', error);
      alert('Failed to submit vehicle data.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="vehicle_id">Vehicle ID:</label>
        <input
          type="text"
          id="vehicle_id"
          name="vehicle_id"
          value={formData.vehicle_id}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="vehicle_number">Vehicle Number:</label>
        <input
          type="text"
          id="vehicle_number"
          name="vehicle_number"
          value={formData.vehicle_number}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="vehicle_name">Vehicle Name:</label>
        <input
          type="text"
          id="vehicle_name"
          name="vehicle_name"
          value={formData.vehicle_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="vehicle_dimensions.length">Vehicle Length:</label>
        <input
          type="number"
          id="vehicle_dimensions.length"
          name="vehicle_dimensions.length"
          value={formData.vehicle_dimensions.length}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="vehicle_dimensions.width">Vehicle Width:</label>
        <input
          type="number"
          id="vehicle_dimensions.width"
          name="vehicle_dimensions.width"
          value={formData.vehicle_dimensions.width}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="vehicle_dimensions.height">Vehicle Height:</label>
        <input
          type="number"
          id="vehicle_dimensions.height"
          name="vehicle_dimensions.height"
          value={formData.vehicle_dimensions.height}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="driver_details.driver_name">Driver Name:</label>
        <input
          type="text"
          id="driver_details.driver_name"
          name="driver_details.driver_name"
          value={formData.driver_details.driver_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="driver_details.driver_contact_no">Driver Contact No:</label>
        <input
          type="number"
          id="driver_details.driver_contact_no"
          name="driver_details.driver_contact_no"
          value={formData.driver_details.driver_contact_no}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="driver_details.licence_id">Licence ID:</label>
        <input
          type="text"
          id="driver_details.licence_id"
          name="driver_details.licence_id"
          value={formData.driver_details.licence_id}
          onChange={handleChange}
          required
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
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddVehicle;
