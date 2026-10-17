import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../store/gameStore';

export default function SkillTree() {
  const skills = useGame((s) => s.skills);
  const toggleUI = useGame((s) => s.toggleUI);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={() => toggleUI('skillTree')}
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          className="glass rounded-2xl p-6 w-[min(720px,92vw)] max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-2xl neon-text">Skill Tree</h2>
            <button className="text-xs font-mono text-cyan-100/60" onClick={() => toggleUI('skillTree')}>
              [K] close
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {skills.map((s) => (
              <div
                key={s.id}
                className={`rounded-lg p-3 border ${s.unlocked ? 'border-neon-cyan/60 bg-neon-cyan/5' : 'border-cyan-100/15 bg-white/3 opacity-60'}`}
              >
                <div className="flex items-baseline justify-between">
                  <div className="font-display text-base" style={{ color: s.unlocked ? '#00f0ff' : '#7a92aa' }}>
                    {s.name}
                  </div>
                  <div className="text-xs font-mono text-cyan-100/60">Lv {s.level}</div>
                </div>
                <div className="mt-2 h-1.5 bg-cyan-100/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-neon-cyan to-neon-pink"
                    style={{ width: `${s.level}%` }}
                  />
                </div>
                <div className="text-[10px] mt-1 text-cyan-100/50 font-mono uppercase tracking-widest">
                  {s.unlocked ? 'Unlocked' : 'Locked'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
