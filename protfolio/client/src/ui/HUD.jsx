import React from 'react';
import { useGame, getWorld } from '../store/gameStore';
import Minimap from './Minimap.jsx';
import ResumeButton from './ResumeButton.jsx';
import { setMuted } from '../game/AudioEngine';

export default function HUD() {
  const worldId = useGame((s) => s.currentWorld);
  const quests = useGame((s) => s.quests);
  const skills = useGame((s) => s.skills);
  const achievements = useGame((s) => s.achievements);
  const stamina = useGame((s) => s.stamina);
  const audio = useGame((s) => s.settings.audio);
  const setSettings = useGame((s) => s.setSettings);
  const toggleUI = useGame((s) => s.toggleUI);
  const world = getWorld(worldId);

  const activeQuest = quests.find((q) => q.world === worldId && !q.completed);
  const completedCount = quests.filter((q) => q.completed).length;
  const earnedAchievements = achievements.filter((a) => a.earned).length;
  const unlockedSkills = skills.filter((s) => s.unlocked).length;

  return (
    <>
      {/* Top-left: world banner */}
      <div className="absolute top-4 left-4 glass rounded-lg px-4 py-2.5 pointer-events-none max-w-xs">
        <div className="text-[10px] tracking-[0.4em] text-cyan-100/60 font-display uppercase">
          Chapter {world?.chapter}
        </div>
        <div className="font-display text-xl neon-text leading-tight">{world?.name}</div>
        <div className="text-xs text-cyan-100/70 italic">{world?.tagline}</div>
      </div>

      {/* Minimap (top-right, before chips) */}
      <Minimap />

      {/* Top-right: quick stats */}
      <div className="absolute top-4 right-4 flex gap-2 pointer-events-auto">
        <StatChip label="Quests" value={`${completedCount}/${quests.length}`} onClick={() => toggleUI('questLog')} hotkey="TAB" />
        <StatChip label="Skills" value={`${unlockedSkills}/${skills.length}`} onClick={() => toggleUI('skillTree')} hotkey="K" />
        <StatChip label="Trophies" value={`${earnedAchievements}/${achievements.length}`} onClick={() => toggleUI('achievements')} hotkey="J" />
      </div>

      {/* Icon row beneath chips */}
      <div className="absolute top-[5.4rem] right-4 flex gap-2 pointer-events-auto">
        <ResumeButton className="!px-3 !py-2 text-xs">⬇ Resume</ResumeButton>
        <IconBtn title="Profile (P)" onClick={() => toggleUI('bio')}>◎</IconBtn>
        <IconBtn
          title={audio ? 'Mute audio' : 'Enable audio'}
          onClick={() => { setSettings({ audio: !audio }); setMuted(audio); }}
        >
          {audio ? '♪' : '×'}
        </IconBtn>
        <IconBtn title="Settings" onClick={() => toggleUI('settings')}>⚙</IconBtn>
      </div>

      {/* Bottom-left: active quest + stamina */}
      {activeQuest && (
        <div className="absolute bottom-4 left-4 glass rounded-lg px-4 py-3 pointer-events-none w-80">
          <div className="text-[10px] tracking-[0.4em] text-cyan-100/60 font-display uppercase">
            Active Quest
          </div>
          <div className="font-display text-base neon-text leading-tight">{activeQuest.title}</div>
          <div className="text-xs text-cyan-100/70 mt-1">{activeQuest.objective}</div>
          <div className="mt-2 h-1.5 bg-cyan-100/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple"
              style={{ width: `${(activeQuest.progress / activeQuest.target) * 100}%` }}
            />
          </div>
          <div className="text-[10px] mt-1 text-cyan-100/60 font-mono">
            {activeQuest.progress} / {activeQuest.target}
          </div>
        </div>
      )}

      {/* Stamina bar (bottom-center) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-60 pointer-events-none">
        <div className="text-[9px] font-display uppercase tracking-widest text-cyan-100/60 mb-1 text-center">
          Stamina
        </div>
        <div className="h-1.5 bg-cyan-100/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${stamina < 25 ? 'bg-neon-pink' : 'bg-gradient-to-r from-neon-yellow to-neon-cyan'}`}
            style={{ width: `${stamina}%` }}
          />
        </div>
      </div>

      {/* Bottom-right: control hint */}
      <div className="absolute bottom-4 right-4 text-[10px] font-mono text-cyan-100/50 text-right pointer-events-none">
        Click to look · WASD move · E interact · TAB quests · K skills · J trophies · P profile · ESC pause
      </div>
    </>
  );
}

function StatChip({ label, value, onClick, hotkey }) {
  return (
    <button onClick={onClick} className="glass rounded-lg px-3 py-2 text-left hover:border-neon-cyan transition">
      <div className="text-[10px] tracking-[0.3em] text-cyan-100/60 font-display uppercase">{label}</div>
      <div className="font-display text-base neon-text leading-tight">{value}</div>
      <div className="text-[9px] text-cyan-100/40 font-mono">[{hotkey}]</div>
    </button>
  );
}

function IconBtn({ children, onClick, title }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="glass w-9 h-9 rounded-full grid place-items-center text-lg font-display neon-text hover:border-neon-cyan"
    >
      {children}
    </button>
  );
}
