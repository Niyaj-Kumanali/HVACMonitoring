import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

// Define the props for the Warehouse component
interface WarehouseProps {
    width: number;
    height: number;
    depth: number;
    onMarkerClick: () => void; // Function to handle marker click
}

// Component to generate the warehouse model based on user input
const Warehouse: React.FC<WarehouseProps> = ({ width, height, depth, onMarkerClick }) => {
    const wallThickness = 0.1; // Thickness of the walls
    const doorWidth = 2; // Width of the door
    const doorHeight = 3; // Height of the door

    return (
        <group>
            {/* Bottom (Ground Plane) */}
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color="gray" />
            </mesh>

            {/* Walls */}
            <mesh position={[0, height / 2, depth / 2]}>
                <boxGeometry args={[width, height, wallThickness]} />
                <meshStandardMaterial color="lightgray" />
            </mesh>
            <mesh position={[0, height / 2, -depth / 2]}>
                <boxGeometry args={[width, height, wallThickness]} />
                <meshStandardMaterial color="lightgray" />
            </mesh>
            <mesh position={[width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[depth, height, wallThickness]} />
                <meshStandardMaterial color="lightgray" />
            </mesh>
            <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[depth, height, wallThickness]} />
                <meshStandardMaterial color="lightgray" />
            </mesh>

            {/* Roof */}
            <mesh position={[0, height, 0]}>
                <boxGeometry args={[width, wallThickness, depth]} />
                <meshStandardMaterial color="darkgray" />
            </mesh>

            {/* Door */}
            <mesh 
                position={[0, doorHeight / 2, depth / 2 + wallThickness / 2]} 
                onClick={onMarkerClick} // Add click event handler
            >
                <boxGeometry args={[doorWidth, doorHeight, wallThickness + 0.01]} />
                <meshStandardMaterial color="saddlebrown" />
            </mesh>

            {/* Marker (Location Indicator) */}
            <mesh 
                position={[0, doorHeight + 0.5, depth / 2 + wallThickness / 2]} 
                onClick={onMarkerClick} // Add click event handler to the marker
            >
                <coneGeometry args={[0.5, 1, 32]} />
                <meshStandardMaterial color="red" />
            </mesh>
        </group>
    );
};

// Define the state type for the WarehousePlatform component
interface WarehouseData {
    width: number;
    height: number;
    depth: number;
}

const WarehousePlatform: React.FC = () => {
    // State to hold user input for warehouse dimensions
    const [warehouseData, setWarehouseData] = useState<WarehouseData>({
        width: 40,
        height: 10,
        depth: 40,
    });

    const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 50, 50]); // Set initial camera position outside the warehouse

    // Handle user input for changing warehouse parameters
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setWarehouseData((prev) => ({
            ...prev,
            [name]: Math.max(0.1, parseFloat(value)), // Prevent negative or zero values
        }));
    };

    // Function to handle marker click
    const handleMarkerClick = () => {
        setCameraPosition([0, 5, 15]); // Move the camera closer to the door
    };

    return (
        <div
            className="menu-data"
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '20px',
            }}
        >
            {/* Form for user input */}
            <div style={{ width: '300px', paddingRight: '20px' }}>
                <h3>Warehouse Configuration</h3>
                <form>
                    <label>
                        Width (m):
                        <input
                            type="number"
                            name="width"
                            value={warehouseData.width}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Height (m):
                        <input
                            type="number"
                            name="height"
                            value={warehouseData.height}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Depth (m):
                        <input
                            type="number"
                            name="depth"
                            value={warehouseData.depth}
                            onChange={handleInputChange}
                        />
                    </label>
                </form>
            </div>

            {/* 3D Canvas for warehouse rendering */}
            <Canvas style={{ position: 'relative' }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[0, 10, 5]} intensity={1} />
                    <Warehouse {...warehouseData} onMarkerClick={handleMarkerClick} />
                    <gridHelper args={[50, 50]} />
                </Suspense>
                <OrbitControls />
                <perspectiveCamera position={cameraPosition} />
            </Canvas>
        </div>
    );
};

export default WarehousePlatform;
