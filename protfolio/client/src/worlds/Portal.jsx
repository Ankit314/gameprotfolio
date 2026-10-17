import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useGame, getWorld } from '../store/gameStore';
import { distXZ } from './Primitives.jsx';

export default function Portal({ position, toWorld, label }) {
  const ref = useRef();
  const [near, setNear] = useState(false);
  const setWorld = useGame((s) => s.setWorld);
  const w = getWorld(toWorld);
  const color = w?.color || '#00f0ff';

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.6;
    const p = useGame.getState().playerPos;
    setNear(distXZ(p, position) < 2.4);
  });

  useEffect(() => {
    if (!near) return;
    const onKey = (e) => {
      if (e.code === 'KeyE') setWorld(toWorld);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [near, setWorld, toWorld]);

  return (
    <group position={position}>
      <mesh ref={ref} position={[0, 1.4, 0]}>
        <torusGeometry args={[1.0, 0.12, 12, 48]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} metalness={0.6} roughness={0.15} />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <circleGeometry args={[0.95, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} />
      </mesh>
      <pointLight color={color} intensity={2.5} distance={9} position={[0, 1.4, 0]} />
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.4, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      {near && (
        <Html center distanceFactor={10} position={[0, 2.6, 0]} zIndexRange={[1, 0]}>
          <div className="glass px-3 py-1 rounded-full font-display text-xs uppercase tracking-widest neon-text">
            [E] {label || `Travel to ${w?.name}`}
          </div>
        </Html>
      )}
    </group>
  );
}
