import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Animated holographic billboard. Cycles through slogans with a glitchy flicker.
export function Billboard({ position = [0, 6, 0], rotation = [0, 0, 0], slogans = ['CODE', 'SHIP', 'REPEAT'], color = '#00f0ff', width = 6, height = 3 }) {
  const ref = useRef();
  const matRef = useRef();
  const textRef = useRef();
  const idx = useRef(0);
  const last = useRef(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (matRef.current) {
      matRef.current.opacity = 0.7 + Math.sin(t * 12) * 0.05 + (Math.random() < 0.02 ? -0.4 : 0);
    }
    if (t - last.current > 2.4) {
      last.current = t;
      idx.current = (idx.current + 1) % slogans.length;
      if (textRef.current) textRef.current.text = slogans[idx.current];
    }
    if (ref.current) ref.current.rotation.z = Math.sin(t * 0.5) * 0.02;
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial ref={matRef} color={color} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[width - 0.2, height - 0.2]} />
        <meshBasicMaterial color="#03060c" transparent opacity={0.7} />
      </mesh>
      <Text
        ref={textRef}
        position={[0, 0, 0.02]}
        fontSize={0.9}
        color={color}
        outlineWidth={0.04}
        outlineColor="#000"
        anchorX="center"
        anchorY="middle"
      >
        {slogans[0]}
      </Text>
      <pointLight color={color} intensity={1.8} distance={14} />
    </group>
  );
}

// Spinning holo data ring — for high-tech zones.
export function HoloRing({ position = [0, 2, 0], color = '#00f0ff', radius = 0.6 }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime;
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.4) * 0.3;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <torusGeometry args={[radius, 0.04, 8, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.7, 0.03, 8, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <pointLight color={color} intensity={1.2} distance={6} />
    </group>
  );
}
