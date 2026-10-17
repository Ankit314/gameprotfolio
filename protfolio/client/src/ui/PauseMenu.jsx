import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, getWorld } from '../store/gameStore';

export default function PauseMenu() {
  const togglePause = useGame((s) => s.togglePause);
  const setWorld = useGame((s) => s.setWorld);
  const reset = useGame((s) => s.reset);
  const visited = useGame((s) => s.visitedWorlds);
  const worldId = useGame((s) => s.currentWorld);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="glass rounded-2xl p-7 w-[min(520px,92vw)] text-center"
        >
          <h2 className="font-display text-3xl neon-text mb-2">Paused</h2>
          <p className="text-cyan-100/70 text-sm">Take a breath. The universe waits.</p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <button className="btn btn-primary col-span-2" onClick={togglePause}>
              ▶ Resume
            </button>
            <button className="btn" onClick={() => { togglePause(); reset(); window.location.reload(); }}>
              ↻ Restart
            </button>
            <button className="btn" onClick={() => window.location.reload()}>
              ⌂ Main Menu
            </button>
          </div>

          <div className="mt-6">
            <div className="text-[10px] tracking-[0.4em] text-cyan-100/60 font-display uppercase mb-2">
              Fast Travel
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {visited.map((id) => {
                const w = getWorld(id);
                const active = id === worldId;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setWorld(id);
                      togglePause();
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-display uppercase tracking-widest border ${active ? 'border-neon-cyan text-neon-cyan' : 'border-cyan-100/20 text-cyan-100/70 hover:border-neon-cyan/60'}`}
                  >
                    {w?.name}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
