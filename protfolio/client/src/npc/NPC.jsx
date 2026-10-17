import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useGame } from '../store/gameStore';
import { distXZ } from '../worlds/Primitives.jsx';

// A friendly humanoid NPC. Press E within range to open dialog.
export default function NPC({ npc }) {
  const ref = useRef();
  const [near, setNear] = useState(false);
  const openDialog = useGame((s) => s.openDialog);
  const dialogOpen = useGame((s) => !!s.ui.dialog);

  useFrame((state) => {
    if (!ref.current) return;
    // Idle bob
    ref.current.position.y = 0.9 + Math.sin(state.clock.elapsedTime * 1.5 + npc.pos[0]) * 0.05;
    // Distance check vs player
    const p = useGame.getState().playerPos;
    const d = distXZ(p, npc.pos);
    setNear(d < 2.4);
  });

  useEffect(() => {
    if (!near || dialogOpen) return;
    const onKey = (e) => {
      if (e.code === 'KeyE') openDialog(npc, [...npc.lines]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [near, dialogOpen, npc, openDialog]);

  return (
    <group ref={ref} position={[npc.pos[0], npc.pos[1] + 0.9, npc.pos[2]]}>
      <mesh castShadow position={[0, 0.6, 0]}>
        <capsuleGeometry args={[0.3, 0.55, 6, 12]} />
        <meshStandardMaterial color={npc.color} metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh castShadow position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.21, 16, 16]} />
        <meshStandardMaterial color={npc.color} metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Status ring */}
      <mesh position={[0, -0.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.78, 32]} />
        <meshBasicMaterial color={near ? '#39ff14' : '#00f0ff'} transparent opacity={0.6} />
      </mesh>
      <pointLight color={npc.color} intensity={near ? 2.2 : 1} distance={6} />
      {near && !dialogOpen && (
        <Html center distanceFactor={10} position={[0, 1.95, 0]} zIndexRange={[1, 0]}>
          <div className="glass px-3 py-1 rounded-full font-display text-xs uppercase tracking-widest neon-text">
            [E] Talk to {npc.name}
          </div>
        </Html>
      )}
    </group>
  );
}
