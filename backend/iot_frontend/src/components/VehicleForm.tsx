import React, { useState } from 'react';
import { mongoAPI } from '../api/MongoAPIInstance';


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
  
  interface VehicleData {
    vehicle_number: string;
    vehicle_name: string;
    vehicle_dimensions: VehicleDimensions;
    Driver_details: DriverDetails;
    cooling_units: number;
    sensors: number;
  }
  

const VehicleForm: React.FC = () => {
  const [formData, setFormData] = useState<VehicleData>({
    vehicle_number: '',
    vehicle_name: '',
    vehicle_dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    Driver_details: {
      driver_name: '',
      driver_contact_no: 0,
      licence_id: '',
    },
    cooling_units: 0,
    sensors: 0,
  });

  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleReset = () => {
    setFormData({
      vehicle_number: '',
      vehicle_name: '',
      vehicle_dimensions: {
        length: 0,
        width: 0,
        height: 0,
      },
      Driver_details: {
        driver_name: '',
        driver_contact_no: 0,
        licence_id: '',
      },
      cooling_units: 0,
      sensors: 0,
    });
    setSubmitted(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('vehicle_dimensions.') || name.startsWith('driver_details.') || name === 'cooling_units' || name === 'sensors') {
      const parsedValue = name === 'cooling_units' || name === 'sensors' || name.includes('driver_contact_no') ? parseFloat(value) : value;
      if (name.startsWith('vehicle_dimensions.')) {
        const dimensionKey = name.split('.')[1] as keyof VehicleDimensions;
        setFormData({
          ...formData,
          vehicle_dimensions: {
            ...formData.vehicle_dimensions,
            [dimensionKey]: parsedValue,
          },
        });
      } else if (name.startsWith('driver_details.')) {
        const driverKey = name.split('.')[1] as keyof DriverDetails;
        setFormData({
          ...formData,
          Driver_details: {
            ...formData.Driver_details,
            [driverKey]: parsedValue,
          },
        });
      } else {
        setFormData({
          ...formData,
          [name]: parsedValue,
        });
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
      const response = await mongoAPI.post("vehicle/addvehicle", JSON.stringify(formData));
      const result = response.data;

      console.log('Vehicle added:', result);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="form-container">
      <h1>Add Vehicle</h1>
      {submitted ? (
        <div className="success-message">
          <p>Vehicle added successfully!</p>
          <button className="reset-button" onClick={handleReset}>
            Add Another Vehicle
          </button>
        </div>
      ) : (
        <form className="vehicle-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="vehicle_number">Vehicle Number:</label>
            <input
              type="text"
              id="vehicle_number"
              name="vehicle_number"
              value={formData.vehicle_number}
              onChange={handleChange}
              disabled={submitted}
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
              disabled={submitted}
            />
          </div>

          <div className="form-group">
            <label htmlFor="vehicle_dimensions.length">Length:</label>
            <input
              type="number"
              id="vehicle_dimensions.length"
              name="vehicle_dimensions.length"
              value={formData.vehicle_dimensions.length}
              onChange={handleChange}
              disabled={submitted}
            />
          </div>

          <div className="form-group">
            <label htmlFor="vehicle_dimensions.width">Width:</label>
            <input
              type="number"
              id="vehicle_dimensions.width"
              name="vehicle_dimensions.width"
              value={formData.vehicle_dimensions.width}
              onChange={handleChange}
              disabled={submitted}
            />
          </div>

          <div className="form-group">
            <label htmlFor="vehicle_dimensions.height">Height:</label>
            <input
              type="number"
              id="vehicle_dimensions.height"
              name="vehicle_dimensions.height"
              value={formData.vehicle_dimensions.height}
              onChange={handleChange}
              disabled={submitted}
            />
          </div>

          <div className="form-group">
            <label htmlFor="driver_details.driver_name">Driver Name:</label>
            <input
              type="text"
              id="driver_details.driver_name"
              name="driver_details.driver_name"
              value={formData.Driver_details.driver_name}
              onChange={handleChange}
              disabled={submitted}
            />
          </div>

          <div className="form-group">
            <label htmlFor="driver_details.driver_contact_no">Driver Contact No:</label>
            <input
              type="number"
              id="driver_details.driver_contact_no"
              name="driver_details.driver_contact_no"
              value={formData.Driver_details.driver_contact_no}
              onChange={handleChange}
              disabled={submitted}
            />
          </div>

          <div className="form-group">
            <label htmlFor="driver_details.licence_id">Licence ID:</label>
            <input
              type="text"
              id="driver_details.licence_id"
              name="driver_details.licence_id"
              value={formData.Driver_details.licence_id}
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

export default VehicleForm;
