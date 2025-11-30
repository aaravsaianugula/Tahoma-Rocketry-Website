"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Vector2, Color } from "three";

const WaveShaderMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(0.0, 0.0, 0.0) },
        uResolution: { value: new Vector2() },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec2 uResolution;
    varying vec2 vUv;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vec2 st = vUv;
      float wave = sin(st.x * 10.0 + uTime) * 0.5 + 0.5;
      float dither = random(st * uResolution); // Simple noise dither
      
      // Create a retro dither pattern
      float pattern = step(0.5, wave + (dither * 0.2 - 0.1));
      
      vec3 color = mix(vec3(1.0), uColor, pattern);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

function WaveMesh() {
    const meshRef = useRef<THREE.Mesh>(null);
    const { size } = useThree();

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uColor: { value: new Color("#fbbf24") }, // Amber-400
            uResolution: { value: new Vector2(size.width, size.height) },
        }),
        []
    );

    useFrame((state) => {
        if (meshRef.current) {
            (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.getElapsedTime();
            (meshRef.current.material as THREE.ShaderMaterial).uniforms.uResolution.value.set(size.width, size.height);
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[10, 10, 32, 32]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={WaveShaderMaterial.vertexShader}
                fragmentShader={WaveShaderMaterial.fragmentShader}
                wireframe={false}
            />
        </mesh>
    );
}

export function DitherWaves({ className }: { className?: string }) {
    return (
        <div className={className}>
            <Canvas camera={{ position: [0, 0, 2] }}>
                <WaveMesh />
            </Canvas>
        </div>
    );
}
