import React from 'react';
import { NeonFloor, Tree, Building, HoloSign } from './Primitives.jsx';
import Interactable from './Interactable.jsx';
import Portal from './Portal.jsx';
import NPC from '../npc/NPC.jsx';
import { NPCS } from '../data/gameData';
import { useGame } from '../store/gameStore';

export default function OriginWorld() {
  const progressQuest = useGame((s) => s.progressQuest);

  return (
    <group>
      <NeonFloor color="#ffb347" />
      {/* Cozy home */}
      <Building position={[0, 0, -10]} size={[6, 4, 5]} color="#3a2a1a" accent="#ffb347" />
      <mesh position={[0, 4.2, -10 + 2.6]} rotation={[0, 0, 0]}>
        <coneGeometry args={[4.2, 1.6, 4]} />
        <meshStandardMaterial color="#5a2a1a" roughness={0.8} />
      </mesh>

      {/* Trees scattered */}
      <Tree position={[-8, 0, -2]} />
      <Tree position={[8, 0, -3]} />
      <Tree position={[-10, 0, 6]} color="#2d8a4a" />
      <Tree position={[9, 0, 7]} color="#2d8a4a" />
      <Tree position={[-4, 0, 12]} />
      <Tree position={[5, 0, 14]} />

      {/* Glowing memories — 3 collectibles */}
      <Interactable
        position={[-3, 0, -3]}
        color="#ffe600"
        label="Touch memory"
        onActivate={() => progressQuest('q-origin')}
      />
      <Interactable
        position={[3, 0, -3]}
        color="#ffb347"
        label="Touch memory"
        onActivate={() => progressQuest('q-origin')}
      />
      <Interactable
        position={[0, 0, 4]}
        color="#ff8855"
        label="Touch memory"
        onActivate={() => progressQuest('q-origin')}
      />

      {/* NPCs */}
      {NPCS.origin.map((n) => <NPC key={n.id} npc={n} />)}

      <HoloSign position={[0, 3.6, 8]} text="ORIGIN" color="#ffb347" size={1.2} />

      {/* Portal to next world */}
      <Portal position={[14, 0, 0]} toWorld="school" />
    </group>
  );
}
