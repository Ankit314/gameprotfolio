import React from 'react';
import { useGame } from '../store/gameStore';
import OriginWorld from './OriginWorld.jsx';
import SchoolWorld from './SchoolWorld.jsx';
import BCAWorld from './BCAWorld.jsx';
import MCAWorld from './MCAWorld.jsx';
import MERNLab from './MERNLab.jsx';
import KBSTower from './KBSTower.jsx';
import AllHeartWebTower from './AllHeartWebTower.jsx';
import ProjectCity from './ProjectCity.jsx';
import FutureWorld from './FutureWorld.jsx';

const MAP = {
  origin: OriginWorld,
  school: SchoolWorld,
  bca: BCAWorld,
  mca: MCAWorld,
  mern: MERNLab,
  kbs: KBSTower,
  allheartweb: AllHeartWebTower,
  projects: ProjectCity,
  future: FutureWorld,
};

export default function WorldManager() {
  const worldId = useGame((s) => s.currentWorld);
  const W = MAP[worldId] || OriginWorld;
  return <W />;
}
