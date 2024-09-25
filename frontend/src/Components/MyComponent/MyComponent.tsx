import React, { useEffect, useRef } from 'react';
import './myComponent.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const MyComponent: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const handleGetAll = () => {
    // Define a new layout for the warehouse, spreading rooms in a grid
    const roomWidth = 2; // Width of the room
    const roomHeight = 5; // Height of the room
    const roomDepth = 4; // Depth of the room

    const layout = [
      { x: -roomWidth * 2, y: roomHeight, z: 0 }, // Adjusted x-coordinate
      { x: roomWidth * 1.5 - 1, y: roomHeight, z: 0 }, // Move slightly left
      { x: -roomWidth * 2, y: 0, z: 0 },
      { x: roomWidth * 1.5 - 1, y: 0, z: 0 },
      { x: -roomWidth * 2, y: -roomHeight, z: 0 },
      { x: roomWidth * 1.5 - 1, y: -roomHeight, z: 0 },
    ];

    layout.forEach(({ x, y, z }) => addRoom(x, y, z));
  };

  const addRoom = (x: number, y: number, z: number) => {
    if (!sceneRef.current) return;

    const roomWidth = 4; // Width of the room
    const roomHeight = 4; // Height of the room
    const roomDepth = 2; // Depth of the room

    const roomGeometry = new THREE.BoxGeometry(roomWidth, roomHeight, roomDepth);
    const roomMaterial = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
    const room = new THREE.Mesh(roomGeometry, roomMaterial);

    room.position.set(x, y, z); // Position based on layout
    sceneRef.current.add(room);
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    let renderer;

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Enable transparency
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
      }
    } catch (error) {
      console.error("Error creating WebGL context:", error);
      alert("WebGL context could not be created. Please ensure your browser supports WebGL and that your graphics drivers are up-to-date.");
      return;
    }

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Set camera position slightly to the left and back for better visibility
    camera.position.set(-6, 3, 15); // Adjusted x, y, z coordinates

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = true; // Enable panning
    controls.minPolarAngle = 0; // Restrict vertical movement if needed
    controls.maxPolarAngle = Math.PI; // Allow full vertical rotation
    controls.maxDistance = 50; // Set max distance from the target
    controls.minDistance = 5; // Set min distance from the target
    controls.target.set(0, 0, 0); // Set the target to the center of the rooms
    controls.update();
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100); // A point light
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        const width = mountRef.current?.clientWidth || window.innerWidth;
        const height = mountRef.current?.clientHeight || window.innerHeight;

        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      controls.dispose();
    };
  }, []);

  return (
    <div className="menu-data mycomponent">
      <h1>3D Warehouse Visualization</h1>
      <button onClick={handleGetAll}>Fetch and Add Data</button>
      <div ref={mountRef} className="canvas-container" />
    </div>
  );
};

export default MyComponent;
