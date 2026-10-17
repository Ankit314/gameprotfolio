import React from 'react';
import { NeonFloor, Building, HoloSign } from './Primitives.jsx';
import Interactable from './Interactable.jsx';
import Portal from './Portal.jsx';
import NPC from '../npc/NPC.jsx';
import { NPCS } from '../data/gameData';
import { useGame } from '../store/gameStore';
import AmbientCrowd from '../game/AmbientCrowd.jsx';
import { Billboard, HoloRing } from '../game/Billboards.jsx';

// KBS-IT Solutions — the first job (Jun 2024 → Dec 2025, MERN Stack Developer).
export default function KBSTower() {
  const progressQuest = useGame((s) => s.progressQuest);
  const unlockSkill = useGame((s) => s.unlockSkill);

  const missions = [
    { id: 'ui', name: 'UI mission', color: '#ff2bd6', pos: [-3, 0, -4], skill: 'react' },
    { id: 'api', name: 'API integration', color: '#a4d6ff', pos: [0, 0, -4], skill: 'rest' },
    { id: 'compat', name: 'Compatibility mission', color: '#39ff14', pos: [3, 0, -4], skill: 'css' },
  ];

  return (
    <group>
      <NeonFloor color="#a4d6ff" />

      {/* KBS-IT headquarters */}
      <Building position={[0, 0, -14]} size={[8, 12, 8]} color="#0a1626" accent="#a4d6ff" label="KBS-IT SOLUTIONS" />
      <HoloSign position={[0, 13.4, -10]} text="MERN · 1.5 YRS" color="#a4d6ff" size={0.5} />
      <HoloRing position={[0, 7, -6]} color="#a4d6ff" radius={1.4} />

      {/* Side props */}
      <Building position={[-14, 0, -10]} size={[5, 7, 5]} color="#0a1626" accent="#a4d6ff" />
      <Building position={[14, 0, -10]} size={[5, 6, 5]} color="#0a1626" accent="#39ff14" />

      <Billboard
        position={[0, 8, -4]}
        slogans={[
          'KBS-IT SOLUTIONS · MOHALI',
          'REST APIs · REACT FRONTENDS',
          'MONGODB & MONGOOSE · FULL-STACK',
          'JUN 2024 → DEC 2025',
        ]}
        color="#a4d6ff"
        width={8}
        height={2.4}
      />

      <HoloSign position={[0, 2.6, 0]} text="KBS-IT · FIRST JOB" color="#a4d6ff" size={0.9} />

      {missions.map((m) => (
        <Interactable
          key={m.id}
          position={m.pos}
          color={m.color}
          shape="cube"
          label={`Run ${m.name}`}
          onActivate={() => {
            progressQuest('q-kbs');
            unlockSkill(m.skill, 85);
          }}
        />
      ))}

      {/* Bonus skill activators — the KBS-era toolkit */}
      <Interactable position={[-12, 0, 2]} color="#fb7185" shape="cylinder" label="Sync Mongoose models" onActivate={() => unlockSkill('mongoose', 82)} />
      <Interactable position={[-9, 0, 2]} color="#a4d6ff" shape="cylinder" label="Secure JWT auth" onActivate={() => unlockSkill('jwt', 80)} />
      <Interactable position={[9, 0, 2]} color="#39ff14" shape="cylinder" label="Debug production issue" onActivate={() => unlockSkill('debugging', 85)} />
      <Interactable position={[12, 0, 2]} color="#00f0ff" shape="cylinder" label="Test APIs in Postman" onActivate={() => unlockSkill('postman', 78)} />

      {NPCS.kbs.map((n) => <NPC key={n.id} npc={n} />)}
      <AmbientCrowd count={8} area={26} color="#bcd8ff" />

      <Portal position={[-16, 0, 10]} toWorld="mern" />
      <Portal position={[16, 0, 10]} toWorld="allheartweb" />
    </group>
  );
}
