import React, { useRef, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../store/useStore';

const AICoreGeometry = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const { highContrast } = useAppStore();

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      // Complex multi-axis rotation for the "AI brain" feel
      groupRef.current.rotation.y = time * 0.4;
      groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;

      const outerWireframe = groupRef.current.children[0];
      const innerCore = groupRef.current.children[1];
      const orbitRing1 = groupRef.current.children[2];
      const orbitRing2 = groupRef.current.children[3];

      if (outerWireframe) outerWireframe.rotation.y = time * 0.2;
      if (innerCore) {
        innerCore.rotation.y = -time * 0.5;
        innerCore.rotation.x = time * 0.3;
      }
      if (orbitRing1) {
        orbitRing1.rotation.x = 1.5 + Math.sin(time * 0.5) * 0.2;
        orbitRing1.rotation.z = time * 0.8;
      }
      if (orbitRing2) {
        orbitRing2.rotation.x = 1.0 + Math.cos(time * 0.3) * 0.2;
        orbitRing2.rotation.z = -time * 0.6;
      }
    }
  });

  const colorPrimary = highContrast ? '#ffffff' : '#2FBF9F';
  const colorSecondary = highContrast ? '#cccccc' : '#7ED957';
  const emissiveColor = highContrast ? '#000000' : '#0B2922';

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <group ref={groupRef} scale={1.2}>
        {/* Outer glowing wireframe shield */}
        <mesh>
          <icosahedronGeometry args={[1.8, 1]} />
          <meshBasicMaterial
            color={colorPrimary}
            wireframe
            transparent
            opacity={highContrast ? 1 : 0.15}
          />
        </mesh>

        {/* Inner solid AI core */}
        <mesh>
          <icosahedronGeometry args={[1.0, 0]} />
          <meshStandardMaterial
            color={colorSecondary}
            emissive={emissiveColor}
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.9}
            wireframe={highContrast}
          />
        </mesh>

        {/* Orbiting data rings */}
        <mesh>
          <torusGeometry args={[2.4, 0.015, 16, 64]} />
          <meshBasicMaterial color={colorPrimary} transparent opacity={0.6} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0.5, 0]}>
          <torusGeometry args={[2.1, 0.015, 16, 64]} />
          <meshBasicMaterial color={colorSecondary} transparent opacity={0.4} />
        </mesh>
      </group>
    </Float>
  );
};

const Logo3D: React.FC = () => {
  return (
    <div className="w-40 h-40 mx-auto mb-4 relative" role="img" aria-label="PitchMind 3D Logo">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={2} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight position={[-5, -5, -5]} color="#2FBF9F" intensity={1} />
        <pointLight position={[0, 0, 0]} color="#7ED957" intensity={2} distance={5} />
        <AICoreGeometry />
      </Canvas>

      {/* 2D Text Overlay - styled as a sleek glass badge inside the core */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="bg-brand-dark/40 backdrop-blur-md px-4 py-2 rounded-xl border border-brand-teal/40 shadow-[0_0_20px_rgba(47,191,159,0.4)]">
          <span className="text-brand-text font-bold text-2xl tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">PM</span>
        </div>
      </div>
    </div>
  );
};

export default memo(Logo3D);
