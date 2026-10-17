import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TIPS = [
  'Click the screen to engage mouse-look.',
  'Hold Shift to sprint — stamina regenerates when you rest.',
  'Press E near glowing objects to interact.',
  'Each portal carries you to the next chapter of the story.',
  'Talk to Ankit AI in the Future World to ask anything.',
  'TAB toggles your quest log · K for skills · J for trophies.',
];

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);

  useEffect(() => {
    let t = 0;
    const id = setInterval(() => {
      t += 6 + Math.random() * 12;
      if (t >= 100) {
        t = 100;
        clearInterval(id);
        setTimeout(onDone, 350);
      }
      setProgress(t);
    }, 90);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-ink"
      >
        <div className="absolute inset-0 opacity-30 pointer-events-none">
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

        <div className="relative z-10 text-center px-6 max-w-xl">
          <div className="font-display text-[10px] tracking-[0.6em] neon-text-pink mb-2">
            INITIALIZING UNIVERSE
          </div>
          <div className="font-display text-4xl md:text-5xl neon-text">
            ANKIT<span className="neon-text-pink"> UNIVERSE</span>
          </div>
          <div className="mt-2 text-cyan-100/70 italic font-mono text-sm">{tip}</div>

          <div className="mt-8 mx-auto w-full max-w-md">
            <div className="h-1 bg-cyan-100/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-mono text-cyan-100/50 uppercase tracking-widest">
              <span>Loading shaders</span>
              <span>{Math.floor(progress)}%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
