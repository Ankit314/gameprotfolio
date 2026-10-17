import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useGame } from '../store/gameStore';
import { distXZ } from './Primitives.jsx';

// A glowing pickup or terminal. Once activated, it can fire a callback (e.g.,
// progressing a quest, unlocking a skill, switching worlds).
export default function Interactable({
  position,
  color = '#ffe600',
  label = 'Activate',
  shape = 'octahedron',
  onceKey, // unique key so it can be marked consumed for a session
  onActivate,
  scale = 1,
}) {
  const ref = useRef();
  const [near, setNear] = useState(false);
  const [consumed, setConsumed] = useState(false);
  const dialogOpen = useGame((s) => !!s.ui.dialog);

  useFrame((state) => {
    if (!ref.current) return;
    if (consumed) {
      ref.current.scale.setScalar(Math.max(0.0001, ref.current.scale.x - 0.05));
      return;
    }
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 1.4;
    ref.current.position.y = position[1] + 0.6 + Math.sin(t * 2) * 0.15;

    const p = useGame.getState().playerPos;
    const d = distXZ(p, position);
    setNear(d < 2.3);
  });

  useEffect(() => {
    if (!near || consumed || dialogOpen) return;
    const onKey = (e) => {
      if (e.code === 'KeyE') {
        setConsumed(true);
        onActivate?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [near, consumed, dialogOpen, onActivate]);

  if (consumed && ref.current && ref.current.scale.x < 0.01) return null;

  return (
    <group position={[position[0], 0, position[2]]}>
      <group ref={ref} position={[0, position[1] + 0.6, 0]} scale={scale}>
        {shape === 'octahedron' && (
          <mesh castShadow>
            <octahedronGeometry args={[0.36, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} metalness={0.5} roughness={0.2} />
          </mesh>
        )}
        {shape === 'cube' && (
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} metalness={0.5} roughness={0.25} />
          </mesh>
        )}
        {shape === 'cylinder' && (
          <mesh castShadow>
            <cylinderGeometry args={[0.28, 0.28, 0.7, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} metalness={0.6} roughness={0.2} />
          </mesh>
        )}
        <pointLight color={color} intensity={1.6} distance={7} />
      </group>
      {near && !consumed && (
        <Html center distanceFactor={10} position={[0, position[1] + 1.6, 0]} zIndexRange={[1, 0]}>
          <div className="glass px-3 py-1 rounded-full font-display text-xs uppercase tracking-widest neon-text">
            [E] {label}
          </div>
        </Html>
      )}
    </group>
  );
}
