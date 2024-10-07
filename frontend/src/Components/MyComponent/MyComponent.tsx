import React, { useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Box, Plane } from '@react-three/drei';

// Define the props for the Warehouse component
interface WarehouseProps {
    width: number;
    height: number;
    depth: number;
    onEnterClick: () => void; // Function to handle enter marker click
    onExitClick: () => void; // Function to handle exit marker click
}

// Component to generate the warehouse model based on user input
const Warehouse: React.FC<WarehouseProps> = ({
    width,
    height,
    depth,
    onEnterClick,
    onExitClick,
}) => {
    const wallThickness = 0.1; // Thickness of the walls
    const doorWidth = 2; // Width of the door
    const doorHeight = 3; // Height of the door

    // Define room dimensions and positions
    const rooms = [
        { position: [10, height / 2, 10], width: 15, height: height, depth: 15 },
        { position: [-10, height / 2, -10], width: 15, height: height, depth: 15 },
        { position: [10, height / 2, -10], width: 15, height: height, depth: 15 },
        { position: [-10, height / 2, 10], width: 15, height: height, depth: 15 },
    ];

    // Define desk dimensions and positions
    const desks = [
        { position: [5, 0.75, 5], width: 4, height: 1.5, depth: 2 },
        { position: [-5, 0.75, -5], width: 4, height: 1.5, depth: 2 },
    ];

    // Define refrigerator dimensions and positions within rooms
    const refrigerators = [
        { position: [10, 1.5, 10], width: 1, height: 3, depth: 1 }, // In first room
        { position: [-10, 1.5, -10], width: 1, height: 3, depth: 1 }, // In second room
    ];

    // Define generator and grid locations
    const generatorPosition = [(width/2)-1, 1.5, (depth/2)-1]; // Position for the diesel generator
    const gridPosition = [(-width/2)+1, 1.5, (depth/2)-1]; // Position for the grid

    return (
        <>
            {/* Ground Plane */}
            <Plane args={[50, 50]} position={[0, -wallThickness / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="gray" />
            </Plane>

            {/* Walls */}
            <Box position={[0, height / 2, depth / 2]} args={[width, height, wallThickness]}>
                <meshStandardMaterial color="lightgray" />
            </Box>
            <Box position={[0, height / 2, -depth / 2]} args={[width, height, wallThickness]}>
                <meshStandardMaterial color="lightgray" />
            </Box>
            <Box position={[width / 2, height / 2, 0]} args={[depth, height, wallThickness]} rotation={[0, Math.PI / 2, 0]}>
                <meshStandardMaterial color="lightgray" />
            </Box>
            <Box position={[-width / 2, height / 2, 0]} args={[depth, height, wallThickness]} rotation={[0, Math.PI / 2, 0]}>
                <meshStandardMaterial color="lightgray" />
            </Box>

            {/* Roof */}
            {/* <Box position={[0, height, 0]} args={[width, wallThickness, depth]}>
                <meshStandardMaterial color="darkgray" />
            </Box> */}

            {/* Doors */}
            <Box position={[0, doorHeight / 2, depth / 2 + wallThickness / 2]} args={[doorWidth, doorHeight, wallThickness]} onClick={onEnterClick}>
                <meshStandardMaterial color="green" />
            </Box>
            <Box position={[0, doorHeight / 2, depth / 2 - wallThickness / 2]} args={[doorWidth, doorHeight, wallThickness]} onClick={onExitClick}>
                <meshStandardMaterial color="red" />
            </Box>

            {/* Rooms */}
            {rooms.map((room, index) => (
                <Box key={index} position={room.position} args={[room.width, room.height, room.depth]}>
                    <meshStandardMaterial color="lightblue" />
                </Box>
            ))}

            {/* Desks */}
            {desks.map((desk, index) => (
                <Box key={index} position={desk.position} args={[desk.width, desk.height, desk.depth]}>
                    <meshStandardMaterial color="saddlebrown" />
                </Box>
            ))}

            {/* Refrigerators */}
            {refrigerators.map((fridge, index) => (
                <Box key={index} position={fridge.position} args={[fridge.width, fridge.height, fridge.depth]}>
                    <meshStandardMaterial color="white" />
                </Box>
            ))}

            {/* Diesel Generator */}
            <Box position={generatorPosition} args={[2, 1.5, 1]}>
                <meshStandardMaterial color="black" />
            </Box>

            {/* Grid Representation */}
            <Box position={gridPosition} args={[2, 1.5, 1]}>
                <meshStandardMaterial color="blue" />
            </Box>
        </>
    );
};

// Custom hook to update camera position
const CameraUpdater: React.FC<{ position: [number, number, number] }> = ({ position }) => {
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(...position); // Update the camera position
        camera.lookAt(0, 0, 0); // Ensure the camera is looking at the center of the warehouse
    }, [position, camera]);

    return null;
};

// Component to handle camera movement
const CameraMovement: React.FC<{ movement: any }> = ({ movement }) => {
    const { camera } = useThree();
    
    useFrame(() => {
        const moveSpeed = 0.1; // Speed of movement

        if (movement.forward) {
            camera.position.z -= moveSpeed;
        }
        if (movement.backward) {
            camera.position.z += moveSpeed;
        }
        if (movement.left) {
            camera.position.x -= moveSpeed;
        }
        if (movement.right) {
            camera.position.x += moveSpeed;
        }
    });

    return null;
};

const MyComponent: React.FC = () => {
    // State to hold user input for warehouse dimensions
    const warehouseData = {
        width: 40,
        height: 10,
        depth: 40,
    };

    const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 5, 15]);
    const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'w':
                    setMovement(prev => ({ ...prev, forward: true }));
                    break;
                case 's':
                    setMovement(prev => ({ ...prev, backward: true }));
                    break;
                case 'a':
                    setMovement(prev => ({ ...prev, left: true }));
                    break;
                case 'd':
                    setMovement(prev => ({ ...prev, right: true }));
                    break;
                default:
                    break;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'w':
                    setMovement(prev => ({ ...prev, forward: false }));
                    break;
                case 's':
                    setMovement(prev => ({ ...prev, backward: false }));
                    break;
                case 'a':
                    setMovement(prev => ({ ...prev, left: false }));
                    break;
                case 'd':
                    setMovement(prev => ({ ...prev, right: false }));
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Function to handle enter marker click
    const handleEnterClick = () => {
        setCameraPosition([0, 5, 50]); // Move the camera inside the warehouse
    };

    // Function to handle exit marker click
    const handleExitClick = () => {
        setCameraPosition([0, 5, 15]); // Move the camera outside the warehouse
    };

    return (
        <div className="menu-data">
            <Canvas>
                <ambientLight intensity={0.5} />
                <directionalLight position={[0, 10, 5]} intensity={1} />
                <Warehouse
                    {...warehouseData}
                    onEnterClick={handleEnterClick}
                    onExitClick={handleExitClick}
                />
                <CameraUpdater position={cameraPosition} />
                <CameraMovement movement={movement} />
                <PointerLockControls />
            </Canvas>
        </div>
    );
};

export default MyComponent;
