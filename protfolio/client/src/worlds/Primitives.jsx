import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';

// Cinematic reflective floor + neon grid. The reflection gives the world the
// classic cyberpunk wet-asphalt look — single biggest visual win.
export function NeonFloor({ color = '#00f0ff', size = 140, reflective = true }) {
  const half = size / 2;
  const lines = useMemo(() => {
    const arr = [];
    const step = 4;
    for (let x = -half; x <= half; x += step) arr.push({ x, z: 0, len: size, axis: 'z' });
    for (let z = -half; z <= half; z += step) arr.push({ x: 0, z, len: size, axis: 'x' });
    return arr;
  }, [half, size]);

  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[size, size]} />
        {reflective ? (
          <MeshReflectorMaterial
            mirror={0.55}
            blur={[400, 100]}
            mixBlur={1.2}
            mixStrength={0.9}
            resolution={1024}
            roughness={0.85}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#06090f"
            metalness={0.55}
          />
        ) : (
          <meshStandardMaterial color="#04060c" metalness={0.55} roughness={0.7} />
        )}
      </mesh>
      {lines.map((l, i) => (
        <mesh
          key={i}
          position={[l.x, 0.001, l.z]}
          rotation={l.axis === 'x' ? [Math.PI / -2, 0, 0] : [Math.PI / -2, 0, Math.PI / 2]}
        >
          <planeGeometry args={[l.len, 0.025]} />
          <meshBasicMaterial color={color} transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  );
}

// Detailed building with windows that glow on a subtle pulse.
export function Building({
  position = [0, 0, 0],
  size = [4, 6, 4],
  color = '#0c1626',
  accent = '#00f0ff',
  windowChance = 0.7,
  label,
}) {
  const [w, h, d] = size;
  const matRef = useRef();
  useFrame((s) => {
    if (!matRef.current) return;
    matRef.current.emissiveIntensity = 0.55 + Math.sin(s.clock.elapsedTime * 0.6 + position[0]) * 0.18;
  });

  const windows = useMemo(() => {
    const arr = [];
    const rows = Math.max(1, Math.floor(h / 1.1));
    const cols = Math.max(1, Math.floor(w / 0.9));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() < windowChance) {
          arr.push({
            x: -w / 2 + 0.45 + c * 0.9,
            y: 0.5 + r * 1.1,
          });
        }
      }
    }
    return arr;
  }, [w, h, windowChance]);

  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} metalness={0.65} roughness={0.32} />
      </mesh>

      {/* Top / bottom neon trim */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[w + 0.2, 0.04, d + 0.2]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <mesh position={[0, h, 0]}>
        <boxGeometry args={[w + 0.2, 0.04, d + 0.2]} />
        <meshBasicMaterial color={accent} />
      </mesh>

      {/* Window grid on front face */}
      <group position={[0, 0, d / 2 + 0.005]}>
        {windows.map((win, i) => (
          <mesh key={i} position={[win.x, win.y, 0]}>
            <planeGeometry args={[0.5, 0.55]} />
            <meshStandardMaterial
              ref={i === 0 ? matRef : undefined}
              color={accent}
              emissive={accent}
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Vertical antenna */}
      <mesh position={[w / 2 - 0.5, h + 1.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2.4, 6]} />
        <meshStandardMaterial color="#202833" />
      </mesh>
      <mesh position={[w / 2 - 0.5, h + 2.45, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ff2bd6" emissive="#ff2bd6" emissiveIntensity={2} />
      </mesh>

      {/* Optional rooftop label */}
      {label && (
        <Text
          position={[0, h + 0.5, d / 2 + 0.03]}
          fontSize={0.45}
          color={accent}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          {label}
        </Text>
      )}
    </group>
  );
}

export function Tree({ position = [0, 0, 0], color = '#1f6f3a' }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 1.2, 8]} />
        <meshStandardMaterial color="#3b2a1c" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 1.6, 0]}>
        <coneGeometry args={[0.9, 1.8, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

// A floating holographic sign — uses 3D Text for crisp signage.
export function HoloSign({ position, text, color = '#00f0ff', size = 0.6, rotation = [0, 0, 0] }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(s.clock.elapsedTime * 1.4 + position[0]) * 0.06;
  });
  return (
    <group ref={ref} position={position} rotation={rotation}>
      <Text
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000"
        outlineOpacity={0.7}
      >
        {text}
      </Text>
      {/* Soft backlight */}
      <mesh>
        <planeGeometry args={[text.length * size * 0.7, size * 1.5]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

export function distXZ(a, b) {
  const dx = a[0] - b[0];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dz * dz);
}
