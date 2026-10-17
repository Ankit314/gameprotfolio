import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { NeonFloor, Building, HoloSign } from './Primitives.jsx';
import Interactable from './Interactable.jsx';
import Portal from './Portal.jsx';
import NPC from '../npc/NPC.jsx';
import { NPCS } from '../data/gameData';
import { useGame } from '../store/gameStore';
import { Billboard, HoloRing } from '../game/Billboards.jsx';

function FlyingCar({ speed = 1, radius = 18, height = 8, offset = 0, color = '#00f0ff' }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    if (ref.current) {
      ref.current.position.set(Math.cos(t) * radius, height + Math.sin(t * 2) * 0.3, Math.sin(t) * radius);
      ref.current.rotation.y = -t + Math.PI / 2;
    }
  });
  return (
    <group ref={ref}>
      <mesh castShadow>
        <boxGeometry args={[1.6, 0.4, 0.8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.7} roughness={0.3} />
      </mesh>
      <pointLight color={color} intensity={1} distance={4} />
    </group>
  );
}

export default function FutureWorld() {
  const progressQuest = useGame((s) => s.progressQuest);
  const openDialog = useGame((s) => s.openDialog);
  const earnAchievement = useGame((s) => s.earnAchievement);

  const aiNpc = NPCS.future[0];

  return (
    <group>
      <NeonFloor color="#c0f0ff" size={160} />
      {/* Futuristic skyline */}
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const r = 30 + (i % 3) * 5;
        const h = 8 + (i % 5) * 3;
        return (
          <Building
            key={i}
            position={[Math.cos(a) * r, 0, Math.sin(a) * r]}
            size={[3, h, 3]}
            color="#06121e"
            accent={i % 2 ? '#00f0ff' : '#ff2bd6'}
          />
        );
      })}

      <FlyingCar speed={0.4} radius={16} height={6} offset={0} color="#00f0ff" />
      <FlyingCar speed={0.35} radius={20} height={9} offset={1.4} color="#ff2bd6" />
      <FlyingCar speed={0.5} radius={12} height={7} offset={2.8} color="#ffe600" />
      <FlyingCar speed={0.3} radius={24} height={11} offset={4.2} color="#39ff14" />
      <FlyingCar speed={0.45} radius={18} height={8.5} offset={5.5} color="#c0f0ff" />

      <Billboard position={[0, 11, -22]} slogans={['THE JOURNEY CONTINUES…', 'ANKIT AI ONLINE', 'CLASS-2049 NODE']} color="#00f0ff" width={11} height={3} />
      <HoloRing position={[0, 4, -10]} color="#00f0ff" radius={1.4} />
      <HoloSign position={[0, 6, -15]} text="FUTURE" color="#c0f0ff" size={1.8} />

      {/* AI core */}
      <NPC npc={aiNpc} />
      <Interactable
        position={[0, 0, -10]}
        color="#00f0ff"
        shape="octahedron"
        label="Touch the AI core"
        scale={1.6}
        onActivate={() => {
          progressQuest('q-future');
          earnAchievement('ai');
          import('../data/ankitProfile').then(({ BLOCKS }) => {
            openDialog(
              { id: 'core', name: 'Ankit AI', color: '#00f0ff', ai: true },
              [BLOCKS.greeting]
            );
          });
        }}
      />

      <Portal position={[0, 0, 14]} toWorld="projects" />
    </group>
  );
}
