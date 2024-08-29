import React, { useEffect, useState } from 'react';
import '../styles/AllWarehouse.css';

interface SensorMetadata {
    _id: string;
    sensor_id: string;
    indoor_location: string;
    Type: string[];
    date_of_installation: string;
}

interface Sensor {
    _id: string;
    sensor: SensorMetadata;
    rack_id: number;
    shelf_id: number;
}

interface Warehouse {
    _id: string;
    warehouse_id: string;
    warehouse_name: string;
    sensors: Sensor[];
    // Add other relevant fields here
}

const AllWarehouses: React.FC = () => {
    const [allWarehouses, setAllWarehouses] = useState<Warehouse[]>([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

    const fetchAllWarehouses = async () => {
        try {
            const response = await fetch('http://localhost:2000/warehouse/getallwarehouse');
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data: Warehouse[] = await response.json();
            setAllWarehouses(data);
        } catch (error) {
            console.error("Failed to fetch warehouses:", error);
        }
    };

    useEffect(() => {
        fetchAllWarehouses();
    }, []);

    const handleWarehouseClick = (warehouse: Warehouse) => {
        setSelectedWarehouse(warehouse);
    };

    const handleBackClick = () => {
        setSelectedWarehouse(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, sensorId: string) => {
        if (selectedWarehouse) {
            const updatedSensors = selectedWarehouse.sensors.map(sensor =>
                sensor._id === sensorId ? { ...sensor, [e.target.name]: e.target.value } : sensor
            );
            setSelectedWarehouse({ ...selectedWarehouse, sensors: updatedSensors });
        }
    };

    const handleDeleteWarehouse = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, warehouseId: string) => {
        e.stopPropagation(); // Prevent the click event from triggering handleWarehouseClick
    
        try {
            const response = await fetch(`http://localhost:2000/warehouse/deletewarehouse/${warehouseId}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                // Remove the deleted warehouse from the state
                setAllWarehouses(allWarehouses.filter(warehouse => warehouse.warehouse_id !== warehouseId));
            } else {
                const errorResponse = await response.json();
                console.error('Failed to delete warehouse:', errorResponse.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    

    const handleUpdateClick = async () => {
        if (selectedWarehouse) {
            try {
                const response = await fetch(`http://localhost:2000/warehouse/updatewarehouse/${selectedWarehouse.warehouse_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sensors: selectedWarehouse.sensors }),
                });

                const data = await response.json();
                console.log(data)

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const updatedWarehouse = await response.json();
                setSelectedWarehouse(updatedWarehouse);
            } catch (error) {
                console.error("Failed to update warehouse:", error);
            }
        }
    };

    return (
        <div className="container">
            {selectedWarehouse ? (
                <div className="warehouse-details">
                    <h1>Warehouse Details</h1>
                    <p><strong>ID:</strong> {selectedWarehouse.warehouse_id}</p>
                    <p><strong>Name:</strong> {selectedWarehouse.warehouse_name}</p>
                    <div>
                        <h2>Sensors</h2>
                        <ul>
                            {selectedWarehouse.sensors.map((sensor) => (
                                <li key={sensor._id}>
                                    <p><strong>Sensor ID:</strong> {sensor.sensor.sensor_id}</p>
                                    <p><strong>Sensor Type:</strong> {sensor.sensor.Type.join(',')}</p>
                                    <p>
                                        <strong>Indoor Location:</strong> 
                                        <input 
                                            type="text" 
                                            name="indoor_location" 
                                            value={sensor.sensor.indoor_location} 
                                            onChange={(e) => handleInputChange(e, sensor._id)} 
                                        />
                                    </p>
                                    <p>
                                        <strong>Date of Installation:</strong> 
                                        <input 
                                            type="date" 
                                            name="date_of_installation" 
                                            value={sensor.sensor.date_of_installation ? new Date(sensor.sensor.date_of_installation).toISOString().substr(0, 10) : ''}
                                            onChange={(e) => handleInputChange(e, sensor._id)} 
                                        />
                                    </p>
                                    <p><strong>Rack ID:</strong> {sensor.rack_id}</p>
                                    <p><strong>Shelf ID:</strong> {sensor.shelf_id}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button onClick={handleUpdateClick} className="update-button">Update Warehouse</button>
                    <button onClick={handleBackClick} className="back-button">Back to List</button>
                </div>
            ) : (
                <>
    <h1 className="title">Warehouses</h1>
    <ul className="warehouse-list">
        {allWarehouses.map((warehouse) => (
            <li key={warehouse._id} className="warehouse-item">
                <div onClick={() => handleWarehouseClick(warehouse)} className="warehouse-info">
                    <div className="warehouse-header">
                        <strong>Warehouse ID:</strong> {warehouse.warehouse_id}
                    </div>
                    <div className="warehouse-body">
                        <strong>Warehouse Name:</strong> {warehouse.warehouse_name}
                    </div>
                </div>
                <button 
                    className="delete-button" 
                    onClick={(e) => handleDeleteWarehouse(e, warehouse.warehouse_id)}
                >
                    Delete
                </button>
            </li>
        ))}
    </ul>
</>

            )}
        </div>
    );
};

export default AllWarehouses;
