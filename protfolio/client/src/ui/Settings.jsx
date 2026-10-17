import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../store/gameStore';
import { setMuted } from '../game/AudioEngine';

export default function Settings() {
  const settings = useGame((s) => s.settings);
  const toggleUI = useGame((s) => s.toggleUI);
  const setSettings = useGame((s) => s.setSettings);

  const updateAudio = (v) => {
    setSettings({ audio: v });
    setMuted(!v);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={() => toggleUI('settings')}
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          className="glass rounded-2xl p-6 w-[min(480px,92vw)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-display text-2xl neon-text">Settings</h2>
            <button className="text-xs font-mono text-cyan-100/60" onClick={() => toggleUI('settings')}>
              close
            </button>
          </div>

          <div className="space-y-5">
            <Row label="Audio">
              <Toggle value={settings.audio} onChange={updateAudio} />
            </Row>
            <Row label="Graphics quality">
              <select
                value={settings.quality}
                onChange={(e) => setSettings({ quality: e.target.value })}
                className="bg-black/50 border border-neon-cyan/40 rounded px-2 py-1 text-sm font-mono"
              >
                <option value="low">Low (mobile)</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="ultra">Ultra (SSAO + DoF)</option>
              </select>
            </Row>
            <Row label="Mouse sensitivity">
              <input
                type="range"
                min="0.3"
                max="2"
                step="0.1"
                value={settings.sensitivity}
                onChange={(e) => setSettings({ sensitivity: Number(e.target.value) })}
              />
              <span className="ml-2 text-xs font-mono text-cyan-100/60">×{settings.sensitivity.toFixed(1)}</span>
            </Row>
          </div>

          <div className="mt-6 text-[10px] text-cyan-100/50 font-mono">
            Tip: graphics changes apply instantly. Ultra enables SSAO + depth-of-field.
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between">
      <div className="font-display text-sm tracking-widest uppercase text-cyan-100/80">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-12 h-6 rounded-full relative transition ${value ? 'bg-neon-cyan' : 'bg-cyan-100/15'}`}
    >
      <span
        className={`absolute top-0.5 ${value ? 'left-6' : 'left-0.5'} w-5 h-5 rounded-full bg-ink transition-all`}
      />
    </button>
  );
}
