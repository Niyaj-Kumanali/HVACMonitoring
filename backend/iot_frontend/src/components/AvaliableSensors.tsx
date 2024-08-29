import React, { useState, useEffect } from 'react'
import '../styles/AllSensors.css'; // Import a CSS file for styling

interface Sensor {
    _id: string;
    sensor_id: string;
    indoor_location: string;
    Type: string[];
    date_of_installation: string;
    __v: number;
}

const AvaliableSensors:React.FC = () => {
  const [avaliablesensors, setAvaliablesensors] = useState<Sensor[]>([]);

    const fetchAllSensors = async () => {
        try {
            const response = await fetch("http://localhost:2000/sensor/getavaliablesensors");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAvaliablesensors(data);
        } catch (error) {
            console.error("Error fetching sensors:", error);
            
        }
    }

    useEffect(() => {
        fetchAllSensors();
    }, []);

    return (
        <div className="container">
            <h1 className="title">Avaliable Sensors</h1>
                <ul className="sensor-list">
                    {avaliablesensors.map(sensor => (
                        <li key={sensor._id} className="sensor-item">
                            <div className="sensor-header">
                                <strong>Sensor ID:</strong> {sensor.sensor_id}
                            </div>
                            <div className="sensor-body">
                                <strong>Types:</strong> {sensor.Type.join(', ')}
                            </div>
                        </li>
                    ))}
                </ul>
        </div>
    );
}

export default AvaliableSensors