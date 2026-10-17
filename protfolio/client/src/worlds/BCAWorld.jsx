import React from 'react';
import { NeonFloor, Building, HoloSign } from './Primitives.jsx';
import Interactable from './Interactable.jsx';
import Portal from './Portal.jsx';
import NPC from '../npc/NPC.jsx';
import { NPCS } from '../data/gameData';
import { useGame } from '../store/gameStore';
import { Billboard } from '../game/Billboards.jsx';

export default function BCAWorld() {
  const progressQuest = useGame((s) => s.progressQuest);
  const unlockSkill = useGame((s) => s.unlockSkill);

  const terminals = [
    { id: 'html', color: '#ff7a3c', pos: [-6, 0, -4] },
    { id: 'css', color: '#3cb0ff', pos: [-2, 0, -4] },
    { id: 'js', color: '#ffe600', pos: [2, 0, -4] },
    { id: 'tailwind', color: '#38bdf8', pos: [6, 0, -4] },
  ];

  return (
    <group>
      <NeonFloor color="#39ff14" />
      <Building position={[0, 0, -12]} size={[18, 5, 4]} color="#0a1a26" accent="#39ff14" label="MAGADH UNIVERSITY" />
      <Billboard
        position={[0, 7, -14]}
        slogans={['BCA · 2018 – 2022', 'HTML · CSS · JS · TAILWIND', 'ARCHITECTURE · THEORY · ALGORITHMS']}
        color="#39ff14"
        width={9}
        height={2.4}
      />
      <HoloSign position={[0, 3.4, 0]} text="BCA" color="#39ff14" size={1.4} />
      <Building position={[-12, 0, 4]} size={[5, 4, 5]} color="#0a1a26" accent="#39ff14" />
      <Building position={[12, 0, 4]} size={[5, 4, 5]} color="#0a1a26" accent="#39ff14" />

      {terminals.map((t) => (
        <Interactable
          key={t.id}
          position={t.pos}
          color={t.color}
          shape="cylinder"
          label={`Boot ${t.id.toUpperCase()} terminal`}
          onActivate={() => {
            progressQuest('q-bca');
            unlockSkill(t.id, 70);
          }}
        />
      ))}

      {NPCS.bca.map((n) => <NPC key={n.id} npc={n} />)}

      <Portal position={[16, 0, 8]} toWorld="mca" />
      <Portal position={[-16, 0, 8]} toWorld="school" />
    </group>
  );
}
