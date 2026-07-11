import React, { useRef, useMemo, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Elegant floating particles (data nodes / confetti)
const FloatingParticles = () => {
  const count = 1500;
  const pointsRef = useRef<THREE.Points>(null!);
  
  // Initialize particles with random positions
  const { positions, colors, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    
    const colorTeal = new THREE.Color('#2FBF9F');
    const colorGreen = new THREE.Color('#7ED957');
    const colorDark = new THREE.Color('#102A24'); // Darker teal for depth

    for (let i = 0; i < count; i++) {
      // Spread across a wide area
      pos[i * 3] = (Math.random() - 0.5) * 80;     // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 20; // Z

      // Colors
      const rand = Math.random();
      const mixedColor = rand > 0.8 
        ? colorGreen 
        : rand > 0.4 
          ? colorTeal 
          : colorDark;
          
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;

      // Speeds
      spd[i] = 0.01 + Math.random() * 0.03;
    }
    return { positions: pos, colors: col, speeds: spd };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      // Float upwards
      pos[i * 3 + 1] += speeds[i];
      
      // Gentle horizontal drift using sine waves
      pos[i * 3] += Math.sin(time * 0.5 + i) * 0.01;
      
      // Reset to bottom if it goes too high
      if (pos[i * 3 + 1] > 30) {
        pos[i * 3 + 1] = -30;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Slow overall rotation for depth
    pointsRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.2}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

// Abstract tech floor
const AbstractStadiumFloor = () => {
  const gridRef = useRef<THREE.GridHelper>(null!);
  
  useFrame((state) => {
    if (!gridRef.current) return;
    const time = state.clock.getElapsedTime();
    // Gentle floating effect for the floor, positioned much lower to stay under the UI
    gridRef.current.position.y = -18 + Math.sin(time * 0.5) * 0.3;
  });

  return (
    <group position={[0, -18, -10]}>
      {/* High-tech grid at the very bottom */}
      <gridHelper 
        ref={gridRef}
        args={[150, 40, '#2FBF9F', '#0B0F14']} 
        position={[0, 0, 0]} 
      />
      {/* Soft fade-out plane under the grid to ground it */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[150, 150]} />
        <meshBasicMaterial color="#050a08" transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

const Scene = () => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle mouse parallax
      const targetX = (state.mouse.y * Math.PI) / 30;
      const targetY = (state.mouse.x * Math.PI) / 30;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <AbstractStadiumFloor />
      <FloatingParticles />
    </group>
  );
};

export const Background3D: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-brand-dark" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 5, 20], fov: 60 }}
        style={{ pointerEvents: 'none' }}
      >
        <fog attach="fog" args={['#0B0F14', 10, 60]} />
        <Scene />
      </Canvas>
    </div>
  );
};

export default memo(Background3D);
