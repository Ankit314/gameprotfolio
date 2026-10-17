import React from 'react';
import { NeonFloor, Building, HoloSign } from './Primitives.jsx';
import Interactable from './Interactable.jsx';
import Portal from './Portal.jsx';
import NPC from '../npc/NPC.jsx';
import { NPCS } from '../data/gameData';
import { useGame } from '../store/gameStore';

// TODO: replace with the real school name (shown on the building and sign).
const SCHOOL_NAME = 'MY SCHOOL NAME';

export default function SchoolWorld() {
  const progressQuest = useGame((s) => s.progressQuest);
  const earnAchievement = useGame((s) => s.earnAchievement);

  return (
    <group>
      <NeonFloor color="#7fffd4" />
      {/* School building */}
      <Building position={[0, 0, -10]} size={[14, 5, 5]} color="#0e2030" accent="#7fffd4" label={SCHOOL_NAME} />
      {/* School name floats high above the rooftop, class line right under it */}
      <HoloSign position={[0, 8.2, -10]} text={SCHOOL_NAME} color="#ffe600" size={0.9} />
      <HoloSign position={[0, 6.9, -10]} text="CLASS X & XII" color="#39ff14" size={0.5} />
      <Building position={[-10, 0, -2]} size={[4, 3, 4]} color="#0a1a26" accent="#7fffd4" />
      <Building position={[10, 0, -2]} size={[4, 3, 4]} color="#0a1a26" accent="#7fffd4" />

      {/* Class X badge */}
      <Interactable
        position={[-3, 0, -3]}
        color="#7fffd4"
        shape="cube"
        label="Pick up X badge"
        onActivate={() => {
          progressQuest('q-school');
          earnAchievement('tenth');
        }}
      />
      {/* Class XII badge */}
      <Interactable
        position={[3, 0, -3]}
        color="#39ff14"
        shape="cube"
        label="Pick up XII badge"
        onActivate={() => {
          progressQuest('q-school');
        }}
      />

      {NPCS.school.map((n) => <NPC key={n.id} npc={n} />)}

      <Portal position={[14, 0, 6]} toWorld="bca" />
      <Portal position={[-14, 0, 6]} toWorld="origin" />
    </group>
  );
}
