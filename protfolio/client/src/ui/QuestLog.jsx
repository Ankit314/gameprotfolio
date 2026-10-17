import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, getWorld } from '../store/gameStore';

export default function QuestLog() {
  const quests = useGame((s) => s.quests);
  const toggleUI = useGame((s) => s.toggleUI);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={() => toggleUI('questLog')}
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          className="glass rounded-2xl p-6 w-[min(640px,92vw)] max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-2xl neon-text">Quest Log</h2>
            <button className="text-xs font-mono text-cyan-100/60" onClick={() => toggleUI('questLog')}>
              [TAB] close
            </button>
          </div>
          <div className="space-y-3">
            {quests.map((q) => {
              const w = getWorld(q.world);
              const pct = (q.progress / q.target) * 100;
              return (
                <div
                  key={q.id}
                  className={`rounded-lg p-3 border ${q.completed ? 'border-neon-green/40 bg-neon-green/5' : 'border-cyan-100/15 bg-white/5'}`}
                >
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-cyan-100/50 font-display">
                        {w?.name} · Chapter {w?.chapter}
                      </div>
                      <div className="font-display text-lg" style={{ color: q.completed ? '#39ff14' : '#00f0ff' }}>
                        {q.title}
                      </div>
                      <div className="text-sm text-cyan-100/70">{q.objective}</div>
                    </div>
                    {q.completed && <div className="font-display text-xs text-neon-green">✓ DONE</div>}
                  </div>
                  <div className="mt-2 h-1.5 bg-cyan-100/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
