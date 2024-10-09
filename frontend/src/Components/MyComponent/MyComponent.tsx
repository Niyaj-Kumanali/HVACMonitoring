import React, { useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Plane, Box } from '@react-three/drei'; // Import Box from drei
import { Vector3 } from 'three';

const Room: React.FC<{
    position: [number, number, number];
    width: number;
    height: number;
    depth: number;
}> = ({ position, width, height, depth }) => {

    return (
        <>
            {/* Floor */}
            <Plane
                position={[position[0], position[1] - height / 2, position[2]]}
                args={[width, depth]}
                rotation={[-Math.PI / 2, 0, 0]} // Rotate to be flat on the ground
            >
                <meshStandardMaterial color="lightgray" />
            </Plane>

            {/* Ceiling */}
            <Plane
                position={[position[0], position[1] + height / 2, position[2]]}
                args={[width, depth]}
                rotation={[Math.PI / 2, 0, 0]} // Rotate to be flat as the ceiling
            >
                <meshStandardMaterial color="lightgray" />
            </Plane>

            {/* Back Wall */}
            <Plane
                position={[position[0], position[1], position[2] - depth / 2]}
                args={[width, height]}
                rotation={[0, 0, 0]} // No rotation
            >
                <meshStandardMaterial color="lightblue" />
            </Plane>

            {/* Front Wall */}
            <Plane
                position={[position[0], position[1], position[2] + depth / 2]}
                args={[width, height]}
                rotation={[0, Math.PI, 0]} // Rotate to face inward
            >
                <meshStandardMaterial color="lightblue" />
            </Plane>

            {/* Left Wall */}
            <Plane
                position={[position[0] - width / 2, position[1], position[2]]}
                args={[depth, height]}
                rotation={[0, Math.PI / 2, 0]} // Rotate to be vertical as left wall
            >
                <meshStandardMaterial color="lightblue" />
            </Plane>

            {/* Right Wall */}
            <Plane
                position={[position[0] + width / 2, position[1], position[2]]}
                args={[depth, height]}
                rotation={[0, -Math.PI / 2, 0]} // Rotate to be vertical as right wall
            >
                <meshStandardMaterial color="lightblue" />
            </Plane>
        </>
    );
};

const Refrigerator: React.FC<{
    position: [number, number, number];
    width: number;
    height: number;
    depth: number;
}> = ({ position, width, height, depth }) => (
    <Box position={position} args={[width, height, depth]}>
        <meshStandardMaterial color="white" />
    </Box>
);
const DGSet: React.FC<{
    position: [number, number, number];
}> = ({ position }) => (
    <Box position={position} args={[2, 1.5, 1]}>
        <meshStandardMaterial color="black" />
    </Box>
);
const Grid: React.FC<{
    position: [number, number, number];
}> = ({ position }) => (
    <Box position={position} args={[2, 1.5, 1]}>
        <meshStandardMaterial color="blue" />
    </Box>
);

const Door: React.FC<{
    height: number;
    width: number;
    depth: number;
    wallThickness: number;
    onEnterClick: () => void;
    onExitClick: () => void;
}> = ({ height, width, depth, wallThickness, onEnterClick, onExitClick }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <>
            <Box
                position={[0, height / 2, depth / 2 + wallThickness / 2]}
                args={[width, height, wallThickness]}
                onClick={onEnterClick}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <meshStandardMaterial
                    color={hovered ? 'lightgreen' : 'green'}
                />
            </Box>
            <Box
                position={[0, height / 2, depth / 2 - wallThickness / 2]}
                args={[width, height, wallThickness]}
                onClick={onExitClick}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <meshStandardMaterial color={hovered ? 'orange' : 'red'} />
            </Box>
        </>
    );
};

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
        {
            position: [10, height / 2, 10] as [number, number, number],
            width: 10,
            height: height,
            depth: 15,
        },
        {
            position: [-10, height / 2, -10] as [number, number, number],
            width: 10,
            height: height,
            depth: 15,
        },
        {
            position: [10, height / 2, -10] as [number, number, number],
            width: 10,
            height: height,
            depth: 15,
        },
        {
            position: [-10, height / 2, 10] as [number, number, number],
            width: 10,
            height: height,
            depth: 15,
        },
    ];

    // Define refrigerator dimensions and positions within rooms
    const refrigerators = [
        {
            position: [10, 1.5, 10] as [number, number, number],
            width: 1,
            height: 3,
            depth: 1,
        }, // In first room
        {
            position: [-10, 1.5, -10] as [number, number, number],
            width: 1,
            height: 3,
            depth: 1,
        }, // In second room
    ];

    // Define generator and grid locations
    const generatorPosition = [width / 2 - 1, 1.5, depth / 2 - 1] as [
        number,
        number,
        number
    ]; // Position for the diesel generator
    const gridPosition = [-width / 2 + 1, 1.5, depth / 2 - 1] as [
        number,
        number,
        number
    ]; // Position for the grid

    return (
        <>
            {/* Ground Plane */}
            <Plane
                args={[50, 50]}
                position={[0, -wallThickness / 2, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <meshStandardMaterial color="gray" />
            </Plane>

            {/* Walls */}
            <Box
                position={[0, height / 2, depth / 2]}
                args={[width, height, wallThickness]}
            >
                <meshStandardMaterial color="lightgray" />
            </Box>
            <Box
                position={[0, height / 2, -depth / 2]}
                args={[width, height, wallThickness]}
            >
                <meshStandardMaterial color="lightgray" />
            </Box>
            <Box
                position={[width / 2, height / 2, 0]}
                args={[depth, height, wallThickness]}
                rotation={[0, Math.PI / 2, 0]}
            >
                <meshStandardMaterial color="lightgray" />
            </Box>
            <Box
                position={[-width / 2, height / 2, 0]}
                args={[depth, height, wallThickness]}
                rotation={[0, Math.PI / 2, 0]}
            >
                <meshStandardMaterial color="lightgray" />
            </Box>

            {/* Roof */}
            {/* <Box position={[0, height, 0]} args={[width, wallThickness, depth]}>
                <meshStandardMaterial color="darkgray" />
            </Box> */}

            {/* Doors */}
            <Door
                height={doorHeight}
                width={doorWidth}
                depth={depth}
                wallThickness={wallThickness}
                onEnterClick={onEnterClick}
                onExitClick={onExitClick}
            />

            {/* Rooms */}
            {rooms.map((room, index) => (
                <Room key={index} {...room} />
            ))}

            {/* Refrigerators */}
            {refrigerators.map((fridge, index) => (
                <Refrigerator key={index} {...fridge} />
            ))}

            {/* Diesel Generator */}
            <DGSet position={generatorPosition} />

            {/* Grid Representation */}
            <Grid position={gridPosition} />
        </>
    );
};

// Custom hook to update camera position
interface CameraUpdaterProps {
    position: [number, number, number];
}

const CameraUpdater: React.FC<CameraUpdaterProps> = ({ position }) => {
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(...position); // Update the camera position
        camera.lookAt(0, 0, 0); // Ensure the camera is looking at the center of the warehouse
    }, [position, camera]);

    return null;
};

// Component to handle camera movement
interface CameraMovementProps {
    movement: {
        forward: boolean;
        backward: boolean;
        left: boolean;
        right: boolean;
    };
}

const CameraMovement: React.FC<CameraMovementProps> = ({ movement }) => {
    const { camera } = useThree();

    useFrame(() => {
        const moveSpeed = 0.1; // Speed of movement
        const direction = new Vector3();

        if (movement.forward) {
            camera.getWorldDirection(direction);
            camera.position.addScaledVector(direction, moveSpeed);
        }
        if (movement.backward) {
            camera.getWorldDirection(direction);
            camera.position.addScaledVector(direction, -moveSpeed);
        }
        if (movement.left) {
            camera.getWorldDirection(direction);
            direction.crossVectors(camera.up, direction).normalize();
            camera.position.addScaledVector(direction, -moveSpeed);
        }
        if (movement.right) {
            camera.getWorldDirection(direction);
            direction.crossVectors(camera.up, direction).normalize();
            camera.position.addScaledVector(direction, moveSpeed);
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

    const [cameraPosition, setCameraPosition] = useState<
        [number, number, number]
    >([0, 0, 50]);
    const [movement, setMovement] = useState<{
        forward: boolean;
        backward: boolean;
        left: boolean;
        right: boolean;
    }>({
        forward: false,
        backward: false,
        left: false,
        right: false,
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'w':
                    setMovement((prev) => ({ ...prev, forward: true }));
                    break;
                case 's':
                    setMovement((prev) => ({ ...prev, backward: true }));
                    break;
                case 'a':
                    setMovement((prev) => ({ ...prev, right: true }));
                    break;
                case 'd':
                    setMovement((prev) => ({ ...prev, left: true }));
                    break;
                default:
                    break;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'w':
                    setMovement((prev) => ({ ...prev, forward: false }));
                    break;
                case 's':
                    setMovement((prev) => ({ ...prev, backward: false }));
                    break;
                case 'a':
                    setMovement((prev) => ({ ...prev, right: false }));
                    break;
                case 'd':
                    setMovement((prev) => ({ ...prev, left: false }));
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
