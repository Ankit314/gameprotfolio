import React from 'react';

const RESUME_URL = '/Ankit_Kumar_Resume.pdf';
const RESUME_FILENAME = 'Ankit_Kumar_Resume.pdf';

// One-button resume download for recruiters. Reused in the main menu, the
// in-game HUD, and the Bio Panel's contact tab so it's reachable from
// anywhere without hunting through menus.
export default function ResumeButton({ className = '', children }) {
  return (
    <a
      href={RESUME_URL}
      download={RESUME_FILENAME}
      className={`btn inline-flex items-center gap-2 border-neon-green/60 text-neon-green hover:bg-neon-green/10 ${className}`}
    >
      {children || <>⬇ Download Resume</>}
    </a>
  );
}
