import React, { useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

// Define the props for the Warehouse component
interface WarehouseProps {
    width: number;
    height: number;
    depth: number;
    onMarkerClick: () => void; // Function to handle marker click
}

// Component to generate the warehouse model based on user input
const Warehouse: React.FC<WarehouseProps> = ({
    width,
    height,
    depth,
    onMarkerClick,
}) => {
    const wallThickness = 0.1; // Thickness of the walls
    const doorWidth = 2; // Width of the door
    const doorHeight = 3; // Height of the door

    return (
        <group>
            {/* Bottom (Ground Plane) - Change to a solid box */}
            <mesh position={[0, -wallThickness / 2, 0]}>
                <boxGeometry args={[50, wallThickness, 50]} /> {/* Solid box instead of plane */}
                <meshStandardMaterial color="gray" /> {/* Solid color for the ground */}
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
            <mesh
                position={[width / 2, height / 2, 0]}
                rotation={[0, Math.PI / 2, 0]}
            >
                <boxGeometry args={[depth, height, wallThickness]} />
                <meshStandardMaterial color="lightgray" />
            </mesh>
            <mesh
                position={[-width / 2, height / 2, 0]}
                rotation={[0, Math.PI / 2, 0]}
            >
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
                position={[0, doorHeight / 2, depth / 2]} // Adjust door position to align with wall
                onClick={onMarkerClick} // Add click event handler
            >
                <boxGeometry
                    args={[doorWidth, doorHeight, wallThickness * 1.1]}
                />
                {/* Render door visible from both sides */}
                <meshStandardMaterial
                    color="saddlebrown"
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
};

// Custom hook to update camera position
const CameraUpdater: React.FC<{ position: [number, number, number] }> = ({
    position,
}) => {
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(...position); // Update the camera position
    }, [position, camera]);

    return null;
};

const MyComponent: React.FC = () => {
    // State to hold user input for warehouse dimensions
    const warehouseData = {
        width: 40,
        height: 10,
        depth: 40,
    };

    const [cameraPosition, setCameraPosition] = useState<
        [number, number, number]
    >([0, 10, 40]); // Set initial camera position outside the warehouse

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
            {/* 3D Canvas for warehouse rendering */}
            <Canvas style={{ position: 'relative' }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[0, 10, 5]} intensity={1} />
                    <Warehouse
                        {...warehouseData}
                        onMarkerClick={handleMarkerClick}
                    />
                    <gridHelper args={[50, 50]} />
                    <CameraUpdater position={cameraPosition} />
                </Suspense>
                <OrbitControls />
            </Canvas>
        </div>
    );
};

export default MyComponent;
