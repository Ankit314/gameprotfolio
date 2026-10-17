import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../store/gameStore';

const COLORS = {
  quest: '#00f0ff',
  skill: '#ff2bd6',
  achievement: '#ffe600',
  success: '#39ff14',
  info: '#c0f0ff',
};

export default function Toast() {
  const toast = useGame((s) => s.ui.toast);
  if (!toast) return null;
  const color = COLORS[toast.kind] || COLORS.info;
  return (
    <AnimatePresence>
      <motion.div
        key={toast.t}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -30, opacity: 0 }}
        className="absolute top-24 left-1/2 -translate-x-1/2 glass rounded-full px-5 py-2 font-display uppercase tracking-widest text-sm pointer-events-none"
        style={{ color, boxShadow: `0 0 24px ${color}55` }}
      >
        {toast.text}
      </motion.div>
    </AnimatePresence>
  );
}
