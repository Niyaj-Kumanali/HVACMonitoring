import React, { useState } from 'react'

interface CoolantData {
  coolant_id: string;  // Should be lowercase 'string' instead of 'String'
  location_in_warehouse: string;  // Should be lowercase 'string' instead of 'String'
}

const AddCoolant: React.FC = () => {
  const [formData, setFormData] = useState<CoolantData>({
    coolant_id: '',
    location_in_warehouse: ''
  });

  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleReset = () => {
    setFormData({
      coolant_id: '',
      location_in_warehouse: '',
    });
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    fetch('http://localhost:2000/coolant/addcoolant', {
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

  return (
    <div className='form-container'>
      <h1>Add Coolant</h1>
      {
        submitted ? (
          <div className='success-message'>
            <p>Coolant added successfully!</p>
            <button className="reset-button" onClick={handleReset}>Add Another Coolant</button>
          </div>
        ) : (
          <form className="sensor-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="coolant_id">Coolant ID</label>
              <input 
                type="text" 
                id="coolant_id"
                name="coolant_id"  // Add the name attribute
                value={formData.coolant_id}
                onChange={handleChange}
                disabled={submitted}
              />
            </div>
            <div className="form-group">
              <label htmlFor="location_in_warehouse">Location in Warehouse</label>
              <input 
                type="text" 
                id="location_in_warehouse"
                name="location_in_warehouse"  // Add the name attribute
                value={formData.location_in_warehouse}
                onChange={handleChange}
                disabled={submitted}
              />
            </div>
            <div className="form-actions">
              <button type="submit" disabled={submitted} className="submit-button">
                Submit
              </button>
            </div>
          </form>
        )
      }
    </div>
  );
};

export default AddCoolant;
