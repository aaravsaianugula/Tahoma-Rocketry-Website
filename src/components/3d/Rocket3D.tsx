"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, PerspectiveCamera, Float } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function RocketModel() {
  const groupRef = useRef<THREE.Group>(null);

  // Load the 3D rocket model
  const { scene } = useGLTF("/assets/3d/rocket.glb");

  // Auto-rotate the rocket
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      <group ref={groupRef}>
        <primitive object={scene} scale={2} position={[0, 0, 0]} />
      </group>
    </Float>
  );
}

export default function Rocket3D() {
  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <pointLight position={[0, 0, 5]} intensity={0.5} color="#00D9FF" />

        {/* 3D Model */}
        <Suspense fallback={null}>
          <RocketModel />
        </Suspense>

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload("/assets/3d/rocket.glb");
