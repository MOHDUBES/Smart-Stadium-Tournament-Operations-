import React, { useRef, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../store/useStore';

interface AIStatusOrbProps {
  isTyping: boolean;
}

const Orb = ({ isTyping }: { isTyping: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { highContrast } = useAppStore();

  useFrame((state) => {
    if (meshRef.current) {
      // Pulse faster when typing
      const speed = isTyping ? 8 : 2;
      const baseScale = isTyping ? 1.2 : 1.0;
      const pulse = Math.sin(state.clock.elapsedTime * speed) * 0.15;
      
      const scale = baseScale + pulse;
      meshRef.current.scale.set(scale, scale, scale);
      
      meshRef.current.rotation.y += isTyping ? 0.05 : 0.01;
      meshRef.current.rotation.x += isTyping ? 0.03 : 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial 
        color={highContrast ? '#ffffff' : '#2FBF9F'}
        emissive={highContrast ? '#ffffff' : '#2FBF9F'}
        emissiveIntensity={isTyping ? 2 : 0.8}
        wireframe
      />
    </mesh>
  );
};

const AIStatusOrb3D: React.FC<AIStatusOrbProps> = ({ isTyping }) => {
  return (
    <div className="w-6 h-6">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <Orb isTyping={isTyping} />
      </Canvas>
    </div>
  );
};

export default memo(AIStatusOrb3D);
