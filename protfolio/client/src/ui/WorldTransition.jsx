import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, getWorld } from '../store/gameStore';

export default function WorldTransition() {
  const active = useGame((s) => s.worldTransition);
  const worldId = useGame((s) => s.currentWorld);
  const world = getWorld(worldId);
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/85 backdrop-blur"
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            className="text-center"
          >
            <div
              className="font-display text-xs tracking-[0.5em] uppercase mb-3"
              style={{ color: world?.color }}
            >
              Chapter {world?.chapter}
            </div>
            <div className="font-display text-5xl neon-text">{world?.name}</div>
            <div className="mt-3 text-cyan-100/70 italic">{world?.tagline}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
