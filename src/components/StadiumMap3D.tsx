import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Gate } from '../types';
import { useAppStore } from '../store/useStore';

// Individual Gate Marker
const GateMarker = ({
  gate,
  angle,
  radius
}: {
  gate: Gate;
  angle: number;
  radius: number
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const isCrowded = gate.capacityPercent >= 80;

  // Calculate position on the ring
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  useFrame((state) => {
    if (meshRef.current && isCrowded) {
      // Pulse animation for crowded gates
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={[x, 0.5, z]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color={isCrowded ? '#ef4444' : '#2FBF9F'}
          emissive={isCrowded ? '#ef4444' : '#2FBF9F'}
          emissiveIntensity={isCrowded ? 0.8 : 0.4}
        />
      </mesh>
      <Html position={[0, 1, 0]} center className="pointer-events-none">
        <div className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap backdrop-blur-md border ${isCrowded ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-brand-teal/20 text-brand-teal border-brand-teal/30'}`}>
          {gate.name} ({gate.waitTimeMinutes}m)
        </div>
      </Html>
    </group>
  );
};

const StadiumGeometry = () => {
  const { stadiumData, highContrast } = useAppStore();

  // Distribute gates evenly around the stadium
  const gates = stadiumData.gates;
  const radius = 6;

  return (
    <group>
      {/* The Pitch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color={highContrast ? '#333333' : '#1A4D2E'} roughness={0.8} />
      </mesh>

      {/* Pitch Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[7.6, 4.6]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>

      {/* The Stands (Bowl) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <torusGeometry args={[radius, 1.5, 16, 64]} />
        <meshStandardMaterial color={highContrast ? '#555555' : '#0f172a'} roughness={0.9} />
      </mesh>

      {/* Gates */}
      {gates.map((gate, index: number) => {
        const angle = (index / gates.length) * Math.PI * 2;
        return <GateMarker key={gate.name} gate={gate} angle={angle} radius={radius} />;
      })}
    </group>
  );
};

const StadiumMap3D: React.FC = () => {
  const { highContrast } = useAppStore();

  return (
    <div className="w-full aspect-[4/3] sm:aspect-video rounded-xl overflow-hidden relative bg-black/40 border border-white/5">
      <Canvas camera={{ position: [0, 8, 12], fov: 50 }}>
        <ambientLight intensity={highContrast ? 2 : 1} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} />
        <directionalLight position={[-10, 10, -10]} color="#2FBF9F" intensity={0.5} />
        <StadiumGeometry />
        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          minDistance={8}
          maxDistance={20}
        />
      </Canvas>
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-brand-text/60 pointer-events-none">
        Interactive 3D Map • Drag to rotate
      </div>
    </div>
  );
};

export default StadiumMap3D;
