import React, { useEffect, useState } from 'react';
import '../styles/AllSensors.css'; // Import a CSS file for styling

interface Sensor {
    _id: string;
    sensor_id: string;
    indoor_location: string;
    Type: string[];
    date_of_installation: string;
    __v: number;
}

const AllSensors: React.FC = () => {
    const [allsensors, setAllsensors] = useState<Sensor[]>([]);

    const fetchAllSensors = async () => {
        try {
            const response = await fetch("http://localhost:2000/sensor/getallsensors");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAllsensors(data);
        } catch (error) {
            console.error("Error fetching sensors:", error);
            
        }
    }

    useEffect(() => {
        fetchAllSensors();
    }, []);

    return (
        <div className="container">
            <h1 className="title">All Sensors</h1>
                <ul className="sensor-list">
                    {allsensors.map(sensor => (
                        <li key={sensor._id} className="sensor-item">
                            <div className="sensor-header">
                                <strong>Sensor ID:</strong> {sensor.sensor_id}
                            </div>
                            <div className="sensor-body">
                                <strong>Type:</strong> {sensor.Type.join(', ')}
                            </div>
                        </li>
                    ))}
                </ul>
        </div>
    );
}

export default AllSensors;
