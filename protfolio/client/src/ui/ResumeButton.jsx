import React from 'react';

const RESUME_URL = '/Ankit_Kumar_Resume.pdf';
const RESUME_FILENAME = 'Ankit_Kumar_Resume.pdf';

const LIGHT_CLASSES =
  'inline-flex items-center gap-2 rounded-full bg-cyan-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-800 transition-colors';

// One-button resume download for recruiters. Reused in the main menu, the
// in-game HUD, and the Bio Panel's contact tab so it's reachable from
// anywhere without hunting through menus. `variant="light"` swaps the neon
// game styling for the Simple Portfolio page's professional theme; the
// default ("neon") is unchanged from the original cinematic-mode styling.
export default function ResumeButton({ className = '', children, variant = 'neon' }) {
  const base =
    variant === 'light'
      ? LIGHT_CLASSES
      : 'btn inline-flex items-center gap-2 border-neon-green/60 text-neon-green hover:bg-neon-green/10';
  return (
    <a
      href={RESUME_URL}
      download={RESUME_FILENAME}
      className={`${base} ${className}`}
    >
      {children || <>⬇ Download Resume</>}
    </a>
  );
}
