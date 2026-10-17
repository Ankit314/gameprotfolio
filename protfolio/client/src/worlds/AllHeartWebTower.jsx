import React from 'react';
import { NeonFloor, Building, HoloSign } from './Primitives.jsx';
import Interactable from './Interactable.jsx';
import Portal from './Portal.jsx';
import NPC from '../npc/NPC.jsx';
import { NPCS } from '../data/gameData';
import { useGame } from '../store/gameStore';
import AmbientCrowd from '../game/AmbientCrowd.jsx';
import { Billboard, HoloRing } from '../game/Billboards.jsx';

// AllHeartWeb — the current job (Dec 2025 → Present, MERN Stack Developer).
export default function AllHeartWebTower() {
  const progressQuest = useGame((s) => s.progressQuest);
  const unlockSkill = useGame((s) => s.unlockSkill);

  const missions = [
    { id: 'api', name: 'API mission', color: '#ffe600', pos: [-3, 0, -4], skill: 'node' },
    { id: 'ui', name: 'UI mission', color: '#ff2bd6', pos: [0, 0, -4], skill: 'react' },
    { id: 'perf', name: 'Perf mission', color: '#00f0ff', pos: [3, 0, -4], skill: 'rest' },
  ];

  return (
    <group>
      <NeonFloor color="#ffe600" />

      {/* AllHeartWeb headquarters — the tallest tower in the universe */}
      <Building position={[0, 0, -14]} size={[9, 16, 9]} color="#0a1626" accent="#ffe600" label="ALLHEARTWEB" />
      <HoloSign position={[0, 17.4, -10]} text="MERN · CURRENT" color="#ffe600" size={0.5} />
      <HoloRing position={[0, 9, -6]} color="#ffe600" radius={1.4} />

      {/* Side props */}
      <Building position={[-14, 0, -10]} size={[5, 8, 5]} color="#0a1626" accent="#ffe600" />
      <Building position={[14, 0, -10]} size={[5, 7, 5]} color="#0a1626" accent="#00f0ff" />

      <Billboard
        position={[0, 8, -4]}
        slogans={[
          'ALLHEARTWEB · IT PARK, CHANDIGARH',
          'MULTITENANT CRM/ERP · RBAC',
          'API RESPONSE TIMES -35%',
          'DEC 2025 → PRESENT',
        ]}
        color="#ffe600"
        width={8}
        height={2.4}
      />

      <HoloSign position={[0, 2.6, 0]} text="ALLHEARTWEB · CURRENT" color="#ffe600" size={0.9} />

      {missions.map((m) => (
        <Interactable
          key={m.id}
          position={m.pos}
          color={m.color}
          shape="cube"
          label={`Run ${m.name}`}
          onActivate={() => {
            progressQuest('q-allheartweb');
            unlockSkill(m.skill, 88);
          }}
        />
      ))}

      {/* Bonus skill activators — the AllHeartWeb-era toolkit */}
      <Interactable position={[-15, 0, 2]} color="#ff2bd6" shape="cylinder" label="Wire Redux patterns" onActivate={() => unlockSkill('redux', 85)} />
      <Interactable position={[-7.5, 0, 2]} color="#00f0ff" shape="cylinder" label="Tune aggregation pipeline" onActivate={() => unlockSkill('aggregation', 88)} />
      <Interactable position={[0, 0, 2]} color="#ffe600" shape="cylinder" label="Enforce tenant RBAC" onActivate={() => unlockSkill('rbac', 85)} />
      <Interactable position={[7.5, 0, 2]} color="#39ff14" shape="cylinder" label="Containerize with Docker" onActivate={() => unlockSkill('docker', 80)} />
      <Interactable position={[15, 0, 2]} color="#ff9e3c" shape="cylinder" label="Push to GitHub" onActivate={() => unlockSkill('git', 85)} />

      {NPCS.allheartweb.map((n) => <NPC key={n.id} npc={n} />)}
      <AmbientCrowd count={10} area={28} color="#ffe89e" />

      <Portal position={[-16, 0, 10]} toWorld="kbs" />
      <Portal position={[16, 0, 10]} toWorld="projects" />
    </group>
  );
}
