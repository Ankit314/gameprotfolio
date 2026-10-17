import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { NeonFloor, Building, HoloSign } from './Primitives.jsx';
import Interactable from './Interactable.jsx';
import Portal from './Portal.jsx';
import NPC from '../npc/NPC.jsx';
import { NPCS } from '../data/gameData';
import { useGame } from '../store/gameStore';
import AmbientCrowd from '../game/AmbientCrowd.jsx';
import { Billboard, HoloRing } from '../game/Billboards.jsx';

// Boss arena. Three coding glyphs must be activated; each pulls life from the boss.
function BugBoss({ hp }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.6;
    ref.current.position.y = 2.4 + Math.sin(t * 1.5) * 0.4;
  });
  const dead = hp <= 0;
  return (
    <group ref={ref} position={[0, 2.4, -10]}>
      <mesh castShadow>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial
          color={dead ? '#222' : '#ff2bd6'}
          emissive={dead ? '#000' : '#ff2bd6'}
          emissiveIntensity={dead ? 0 : 1.6}
          metalness={0.5}
          roughness={0.2}
          wireframe={dead}
        />
      </mesh>
      {!dead && <pointLight color="#ff2bd6" intensity={2.5} distance={14} />}
    </group>
  );
}

export default function MERNLab() {
  const progressQuest = useGame((s) => s.progressQuest);
  const unlockSkill = useGame((s) => s.unlockSkill);
  const [hp, setHp] = useState(3);

  const glyphs = [
    { id: 'm', name: 'Mongo glyph', pos: [-6, 0, 0], color: '#39ff14', skill: 'mongo' },
    { id: 'e', name: 'Express glyph', pos: [0, 0, 4], color: '#ffe600', skill: 'express' },
    { id: 'r', name: 'React glyph', pos: [6, 0, 0], color: '#00f0ff', skill: 'react' },
  ];

  return (
    <group>
      <NeonFloor color="#00f0ff" />
      <Building position={[0, 0, -16]} size={[22, 6, 4]} color="#06121e" accent="#00f0ff" label="MERN LAB" />
      <Building position={[-14, 0, 8]} size={[6, 4, 6]} color="#06121e" accent="#00f0ff" />
      <Building position={[14, 0, 8]} size={[6, 4, 6]} color="#06121e" accent="#00f0ff" />

      <Billboard position={[0, 7, -19]} slogans={['BOSS: REACT BUG', 'SOLVE 3 GLYPHS', 'STACK SENSEI WATCHES']} color="#ff2bd6" width={9} height={2.6} />
      <HoloRing position={[-8, 3, 6]} color="#39ff14" radius={0.8} />
      <HoloRing position={[8, 3, 6]} color="#ffe600" radius={0.8} />
      <HoloSign position={[0, 4.4, -8]} text="MERN" color="#00f0ff" size={1.4} />

      <BugBoss hp={hp} />

      {glyphs.map((g) => (
        <Interactable
          key={g.id}
          position={g.pos}
          color={g.color}
          shape="octahedron"
          label={`Solve ${g.name}`}
          onActivate={() => {
            setHp((h) => Math.max(0, h - 1));
            unlockSkill(g.skill, 85);
            progressQuest('q-mern');
          }}
        />
      ))}

      {/* Node skill node (bonus) */}
      <Interactable
        position={[0, 0, -4]}
        color="#39ff14"
        shape="cylinder"
        label="Activate Node core"
        onActivate={() => unlockSkill('node', 88)}
      />

      {NPCS.mern.map((n) => <NPC key={n.id} npc={n} />)}
      <AmbientCrowd count={6} area={26} color="#a4f7ff" />

      <Portal position={[16, 0, 12]} toWorld="kbs" />
      <Portal position={[-16, 0, 12]} toWorld="mca" />
    </group>
  );
}
