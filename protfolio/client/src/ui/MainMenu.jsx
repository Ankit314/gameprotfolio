import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../store/gameStore';
import ResumeButton from './ResumeButton.jsx';

export default function MainMenu({ onStart }) {
  const start = useGame((s) => s.start);
  const launch = () => {
    onStart?.();
    setTimeout(start, 1100);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink via-[#070a18] to-[#0b0420]">
      {/* Decorative animated grid */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,240,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black 30%, transparent 75%)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <div className="font-display text-sm tracking-[0.4em] neon-text-pink mb-3">
          A PLAYABLE PORTFOLIO
        </div>
        <h1 className="font-display text-6xl md:text-8xl font-extrabold neon-text leading-none">
          ANKIT
          <span className="neon-text-pink"> UNIVERSE</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-cyan-100/80 max-w-xl mx-auto">
          A cinematic 3D journey through the worlds of a MERN developer.
          Walk, explore, code, conquer.
        </p>

        <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
          <button className="btn btn-primary animate-pulse-glow" onClick={launch}>
            ▶ Enter Universe
          </button>
          <a href="/portfolio" className="btn">
            📄 Simple Portfolio
          </a>
          <ResumeButton />
        </div>
        <div className="mt-3 text-[11px] font-mono text-cyan-100/50">
          Prefer the essentials? View my professional portfolio.
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono text-cyan-100/70">
          <div className="glass rounded-md p-3">WASD · Move</div>
          <div className="glass rounded-md p-3">Shift · Sprint</div>
          <div className="glass rounded-md p-3">Space · Jump</div>
          <div className="glass rounded-md p-3">E · Interact</div>
          <div className="glass rounded-md p-3">Tab · Quests</div>
          <div className="glass rounded-md p-3">K · Skills</div>
          <div className="glass rounded-md p-3">J · Achievements</div>
          <div className="glass rounded-md p-3">P · Profile</div>
          <div className="glass rounded-md p-3">Esc · Pause</div>
        </div>
      </motion.div>

      <div className="absolute bottom-4 left-0 right-0 text-center font-mono text-xs text-cyan-100/40">
        v0.1 · Built with React · Three.js · MongoDB · Gemini AI
      </div>
    </div>
  );
}
