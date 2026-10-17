import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../store/gameStore';

export default function Achievements() {
  const achievements = useGame((s) => s.achievements);
  const toggleUI = useGame((s) => s.toggleUI);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={() => toggleUI('achievements')}
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          className="glass rounded-2xl p-6 w-[min(640px,92vw)] max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-2xl neon-text">Achievements</h2>
            <button className="text-xs font-mono text-cyan-100/60" onClick={() => toggleUI('achievements')}>
              [J] close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={`rounded-lg p-3 border flex gap-3 items-start ${a.earned ? 'border-neon-yellow/60 bg-neon-yellow/5' : 'border-cyan-100/15 bg-white/3 opacity-60'}`}
              >
                <div
                  className={`shrink-0 w-10 h-10 rounded-full grid place-items-center font-display ${a.earned ? 'bg-neon-yellow text-ink' : 'bg-cyan-100/10 text-cyan-100/40'}`}
                >
                  {a.earned ? '★' : '☆'}
                </div>
                <div>
                  <div className="font-display text-base" style={{ color: a.earned ? '#ffe600' : '#7a92aa' }}>
                    {a.name}
                  </div>
                  <div className="text-xs text-cyan-100/70">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
