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
  const togglePause = useGame((s) => s.togglePause);
  const world = getWorld(worldId);

  const activeQuest = quests.find((q) => q.world === worldId && !q.completed);
  const completedCount = quests.filter((q) => q.completed).length;
  const earnedAchievements = achievements.filter((a) => a.earned).length;
  const unlockedSkills = skills.filter((s) => s.unlocked).length;

  return (
    <>
      {/* Minimap — desktop only, see Minimap.jsx */}
      <Minimap />

      {/*
        Top cluster: world banner, stat chips, and icon row. On mobile they
        stack as three full-width rows (chips/icons right-aligned within the
        stack) instead of competing for the same horizontal strip; `sm:contents`
        drops the wrapper out of layout on desktop so each child reverts to its
        original independent absolute position.
      */}
      <div className="absolute top-4 left-4 right-4 flex flex-col gap-2 sm:contents">
        {/* World banner */}
        <div className="self-start glass rounded-lg px-3 py-2 sm:absolute sm:top-4 sm:left-4 sm:px-4 sm:py-2.5 pointer-events-none max-w-[70vw] sm:max-w-xs">
          <div className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] text-cyan-100/60 font-display uppercase">
            Chapter {world?.chapter}
          </div>
          <div className="font-display text-base sm:text-xl neon-text leading-tight truncate">{world?.name}</div>
          <div className="hidden sm:block text-xs text-cyan-100/70 italic">{world?.tagline}</div>
        </div>

        {/* Stat chips */}
        <div className="flex gap-1.5 self-end sm:absolute sm:top-4 sm:right-4 sm:gap-2 pointer-events-auto">
          <StatChip label="Quests" value={`${completedCount}/${quests.length}`} onClick={() => toggleUI('questLog')} hotkey="TAB" />
          <StatChip label="Skills" value={`${unlockedSkills}/${skills.length}`} onClick={() => toggleUI('skillTree')} hotkey="K" />
          <StatChip label="Trophies" value={`${earnedAchievements}/${achievements.length}`} onClick={() => toggleUI('achievements')} hotkey="J" />
        </div>

        {/* Icon row */}
        <div className="flex gap-1.5 self-end sm:absolute sm:top-[5.4rem] sm:right-4 sm:gap-2 pointer-events-auto">
          <ResumeButton className="!px-2.5 !py-1.5 sm:!px-3 sm:!py-2 text-xs">
            <span className="sm:hidden">⬇</span>
            <span className="hidden sm:inline">⬇ Resume</span>
          </ResumeButton>
          <IconBtn title="Profile (P)" onClick={() => toggleUI('bio')}>◎</IconBtn>
          <IconBtn
            title={audio ? 'Mute audio' : 'Enable audio'}
            onClick={() => { setSettings({ audio: !audio }); setMuted(audio); }}
          >
            {audio ? '♪' : '×'}
          </IconBtn>
          <IconBtn title="Settings" onClick={() => toggleUI('settings')}>⚙</IconBtn>
          <IconBtn title="Pause" onClick={togglePause}>⏸</IconBtn>
        </div>
      </div>

      {/*
        Bottom-left cluster (quest + stamina): on mobile these stack in a single
        flex column well above the joystick/action buttons (which occupy roughly
        the bottom 170px on each side); `sm:contents` drops the wrapper out of
        layout on desktop so each child reverts to its original fixed position.
      */}
      <div className="absolute bottom-44 left-4 right-4 flex flex-col gap-2 pointer-events-none sm:contents">
        <div className="w-full sm:absolute sm:bottom-4 sm:left-1/2 sm:w-60 sm:-translate-x-1/2">
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

        {activeQuest && (
          <div className="w-full glass rounded-lg px-4 py-3 sm:absolute sm:bottom-4 sm:left-4 sm:w-80">
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
      </div>

      {/* Bottom-right: control hint — desktop only, mobile has its own on-screen controls */}
      <div className="hidden sm:block absolute bottom-4 right-4 text-[10px] font-mono text-cyan-100/50 text-right pointer-events-none">
        Click to look · WASD move · E interact · TAB quests · K skills · J trophies · P profile · ESC pause
      </div>
    </>
  );
}

function StatChip({ label, value, onClick, hotkey }) {
  return (
    <button onClick={onClick} className="glass rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-left hover:border-neon-cyan transition">
      <div className="text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] text-cyan-100/60 font-display uppercase">{label}</div>
      <div className="font-display text-sm sm:text-base neon-text leading-tight">{value}</div>
      <div className="hidden sm:block text-[9px] text-cyan-100/40 font-mono">[{hotkey}]</div>
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
