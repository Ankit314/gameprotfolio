import React, { useEffect, useState } from 'react';
import { useGame } from './store/gameStore';
import { useHotkey } from './utils/keyboard';
import Game from './game/Game.jsx';
import MainMenu from './ui/MainMenu.jsx';
import HUD from './ui/HUD.jsx';
import QuestLog from './ui/QuestLog.jsx';
import SkillTree from './ui/SkillTree.jsx';
import Achievements from './ui/Achievements.jsx';
import DialogOverlay from './ui/DialogOverlay.jsx';
import PauseMenu from './ui/PauseMenu.jsx';
import Toast from './ui/Toast.jsx';
import WorldTransition from './ui/WorldTransition.jsx';
import LoadingScreen from './ui/LoadingScreen.jsx';
import Settings from './ui/Settings.jsx';
import MobileControls from './ui/MobileControls.jsx';
import BioPanel from './ui/BioPanel.jsx';
import { unlockAudio, setMuted } from './game/AudioEngine';

export default function App() {
  const started = useGame((s) => s.started);
  const paused = useGame((s) => s.paused);
  const ui = useGame((s) => s.ui);
  const audio = useGame((s) => s.settings.audio);
  const togglePause = useGame((s) => s.togglePause);
  const toggleUI = useGame((s) => s.toggleUI);
  const [loading, setLoading] = useState(false);

  useHotkey('Escape', () => started && togglePause(), [started]);
  useHotkey('Tab', (e) => { e.preventDefault(); if (started) toggleUI('questLog'); }, [started]);
  useHotkey('KeyK', () => started && toggleUI('skillTree'), [started]);
  useHotkey('KeyJ', () => started && toggleUI('achievements'), [started]);
  useHotkey('KeyP', () => started && toggleUI('bio'), [started]);

  // Lock context menu globally
  useEffect(() => {
    const off = (e) => e.preventDefault();
    window.addEventListener('contextmenu', off);
    return () => window.removeEventListener('contextmenu', off);
  }, []);

  // Initialize audio mute state from settings
  useEffect(() => { setMuted(!audio); }, [audio]);

  // Show loader once when transitioning from menu → game
  useEffect(() => {
    if (started && !loading) {
      // simulate "asset loading" handoff
      setLoading(false);
    }
  }, [started, loading]);

  const handleStart = () => {
    setLoading(true);
    unlockAudio();
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-ink">
      {!started ? (
        <MainMenu onStart={handleStart} />
      ) : (
        <>
          <Game />
          <HUD />
          {ui.questLog && <QuestLog />}
          {ui.skillTree && <SkillTree />}
          {ui.achievements && <Achievements />}
          {ui.settings && <Settings />}
          {ui.bio && <BioPanel />}
          {ui.dialog && <DialogOverlay />}
          {ui.toast && <Toast />}
          {paused && <PauseMenu />}
          <WorldTransition />
          <MobileControls />
          <div className="crosshair" />
          <div className="scanline-overlay" />
        </>
      )}
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
    </div>
  );
}
