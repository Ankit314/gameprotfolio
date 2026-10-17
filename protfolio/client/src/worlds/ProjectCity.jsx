import React from 'react';
import { NeonFloor, Building, HoloSign } from './Primitives.jsx';
import Interactable from './Interactable.jsx';
import Portal from './Portal.jsx';
import NPC from '../npc/NPC.jsx';
import { NPCS, PROJECTS } from '../data/gameData';
import { useGame } from '../store/gameStore';
import AmbientCrowd from '../game/AmbientCrowd.jsx';
import { Billboard, HoloRing } from '../game/Billboards.jsx';

// Project City: four district zones, each a shipped project. Step on a pad to
// open a dialog describing the project; visit all four to clear the quest.
export default function ProjectCity() {
  const progressQuest = useGame((s) => s.progressQuest);
  const openDialog = useGame((s) => s.openDialog);

  return (
    <group>
      <NeonFloor color="#ff2bd6" />
      {/* Central plaza */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.4, 3.7, 64]} />
        <meshBasicMaterial color="#ff2bd6" transparent opacity={0.6} />
      </mesh>

      {PROJECTS.map((p) => {
        // Entry pad sits between the building and the central plaza.
        const dist = Math.hypot(p.pos[0], p.pos[2]) || 1;
        const pad = [(-p.pos[0] / dist) * 4.4, 0, (-p.pos[2] / dist) * 4.4];
        return (
        <group key={p.id} position={p.pos}>
          <Building position={[0, 0, 0]} size={[6, 5, 6]} color="#0a0a1a" accent={p.color} label={p.name} />
          <HoloRing position={[0, 6.6, 0]} color={p.color} radius={0.9} />
          <Interactable
            position={pad}
            color={p.color}
            shape="cube"
            label={`Enter ${p.name}`}
            onActivate={() => {
              progressQuest('q-projects');
              openDialog(
                { id: p.id, name: p.name, color: p.color },
                [
                  `${p.name} — ${p.tagline}\n${p.role} · ${p.year} · ${p.status}`,
                  p.desc,
                  `⚙ Stack\n${p.stack.join(' · ')}`,
                  `★ Key features\n${p.features.map((f) => `• ${f}`).join('\n')}`,
                  `⚡ Hardest problem\n${p.challenge}`,
                  'Walk to the next district to continue your tour.',
                ]
              );
            }}
          />
        </group>
        );
      })}

      <Billboard position={[0, 9, -30]} slogans={['ANKIT // UNIVERSE', 'CODE · SHIP · REPEAT', '8 PROJECTS ONLINE']} color="#ff2bd6" width={10} height={3} />
      <Billboard position={[-30, 5, 0]} rotation={[0, Math.PI / 2, 0]} slogans={['DRIVEREE', 'EXPLOREPEDIA', 'ETA', 'DRIVE']} color="#00f0ff" width={7} height={2.4} />
      <Billboard position={[30, 5, 0]} rotation={[0, -Math.PI / 2, 0]} slogans={['SEARCHTALENT', 'SAPIENCE', 'BILLING', 'SHEET']} color="#ffe600" width={7} height={2.4} />

      <HoloSign position={[0, 2.6, 0]} text="PROJECT CITY" color="#ff2bd6" size={0.9} />

      {NPCS.projects.map((n) => <NPC key={n.id} npc={n} />)}
      <AmbientCrowd count={10} area={36} />


      <Portal position={[0, 0, -34]} toWorld="allheartweb" />
      <Portal position={[0, 0, 34]} toWorld="future" />
    </group>
  );
}
