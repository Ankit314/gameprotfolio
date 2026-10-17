import React from 'react';
import { NeonFloor, Building, HoloSign } from './Primitives.jsx';
import Interactable from './Interactable.jsx';
import Portal from './Portal.jsx';
import NPC from '../npc/NPC.jsx';
import { NPCS } from '../data/gameData';
import { useGame } from '../store/gameStore';
import AmbientCrowd from '../game/AmbientCrowd.jsx';
import { Billboard } from '../game/Billboards.jsx';

export default function MCAWorld() {
  const progressQuest = useGame((s) => s.progressQuest);

  const zones = [
    { id: 'ml', name: 'ML Zone', pos: [-10, 0, -6], color: '#8a2bff' },
    { id: 'db', name: 'DB Tower', pos: [10, 0, -6], color: '#3cb0ff' },
    { id: 'ai', name: 'AI Lab', pos: [0, 0, 8], color: '#00f0ff' },
  ];

  return (
    <group>
      <NeonFloor color="#8a2bff" />
      <Building position={[0, 0, -16]} size={[20, 8, 5]} color="#0e0e2c" accent="#8a2bff" label="CHANDIGARH UNIVERSITY" />
      <Billboard
        position={[0, 9, -18]}
        slogans={['MCA · 2022 – 2024', 'MOBILE · DBMS · ML · IoT', 'WEB APPS · DATA STRUCTURES']}
        color="#8a2bff"
        width={9}
        height={2.4}
      />
      <HoloSign position={[0, 3.2, 0]} text="MCA · CU" color="#8a2bff" size={1.1} />
      {zones.map((z) => (
        <group key={z.id} position={z.pos}>
          <Building position={[0, 0, 0]} size={[5, 6, 5]} color="#13133a" accent={z.color} />
          <Interactable
            position={[0, 0, 3.5]}
            color={z.color}
            shape="cube"
            label={`Enter ${z.name}`}
            onActivate={() => progressQuest('q-mca')}
          />
        </group>
      ))}

      {NPCS.mca.map((n) => <NPC key={n.id} npc={n} />)}
      <AmbientCrowd count={6} area={26} color="#bda0ff" />

      <Portal position={[16, 0, 12]} toWorld="mern" />
      <Portal position={[-16, 0, 12]} toWorld="bca" />
    </group>
  );
}
