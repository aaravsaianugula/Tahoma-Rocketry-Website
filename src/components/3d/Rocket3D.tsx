"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, PerspectiveCamera, Float, Stars, Sparkles } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function RocketModel() {
  const groupRef = useRef<THREE.Group>(null);

  // Load the 3D rocket model
  const { scene } = useGLTF("/assets/3d/rocket.glb");

  // Auto-rotate the rocket with smooth animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
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

// Particle system for exhaust/propulsion effect
function ExhaustParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Sparkles
      count={100}
      scale={8}
      size={3}
      speed={0.5}
      opacity={0.6}
      color="#00D9FF"
      position={[0, -2, 0]}
    />
  );
}

export default function Rocket3D() {
  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

        {/* Enhanced Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <pointLight position={[0, 0, 5]} intensity={0.8} color="#00D9FF" />
        <pointLight position={[5, 5, 0]} intensity={0.6} color="#7D33FF" />

        {/* Stars background */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        {/* Exhaust particles */}
        <Suspense fallback={null}>
          <ExhaustParticles />
        </Suspense>

        {/* 3D Model */}
        <Suspense fallback={null}>
          <RocketModel />
        </Suspense>

        {/* Enhanced Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          dampingFactor={0.05}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload("/assets/3d/rocket.glb");
