import React, { useState } from 'react';
import Select from 'react-select';
import '../styles/AddSensor.css'; // Import the CSS file

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
  sensor_id: string;
  indoor_location: string;
  Type: string[];
  date_of_installation: string;
}

const AddSensor: React.FC = () => {
  const [formData, setFormData] = useState<SensorData>({
    sensor_id: '',
    indoor_location: '',
    Type: [],
    date_of_installation: ''
  });

  const [submitted, setSubmitted] = useState<boolean>(false);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    fetch('http://localhost:2000/sensor/addsensor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then(response => response.json())
        .then(data => {
            console.log('Form data submitted:', data);
            setSubmitted(true);
          })
          .catch(error => {
            console.error('Error posting data:', error);
          });
      };

  const handleReset = () => {
    setFormData({
      sensor_id: '',
      indoor_location: '',
      Type: [],
      date_of_installation: ''
    });
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
            <label htmlFor="sensor_id">Sensor ID:</label>
            <input
              type="text"
              id="sensor_id"
              name="sensor_id"
              value={formData.sensor_id}
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
