import { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';

interface Marker {
  id: string;
  position: THREE.Vector3;
  timestamp: Date;
  transport: string;
}

interface EarthProps {
  markers: Marker[];
  onMarkerAdd: (marker: Marker) => void;
}

function Earth({ markers, onMarkerAdd }: EarthProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const [earthTexture] = useLoader(TextureLoader, [
    '/earth_texture.jpg'
  ]);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  const createTrails = () => {
    if (markers.length < 2) return null;

    const trails = [];
    for (let i = 0; i < markers.length - 1; i++) {
      const points = [];
      points.push(markers[i].position);
      points.push(markers[i + 1].position);

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

      trails.push(
        <line key={`trail-${i}`} geometry={geometry} material={material} />
      );
    }
    return trails;
  };

  return (
    <group>
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial map={earthTexture} />
      </mesh>
      {markers.map((marker) => (
        <mesh key={marker.id} position={marker.position}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color={0xffff00} />
        </mesh>
      ))}
      {createTrails()}
    </group>
  );
}

export function EarthContainer() {
  const [markers, setMarkers] = useState<Marker[]>([]);

  const handleMarkerAdd = (marker: Marker) => {
    setMarkers([...markers, marker]);
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars />
        <Earth markers={markers} onMarkerAdd={handleMarkerAdd} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}