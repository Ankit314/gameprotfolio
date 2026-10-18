import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../store/gameStore';

// Left thumb joystick — drives the movement vector via the store. Right side
// of the screen is reserved for camera orbit (handled in CameraRig).
export default function MobileControls() {
  const setJoystick = useGame((s) => s.setJoystick);
  const padRef = useRef(null);
  const stickRef = useRef(null);
  const [active, setActive] = useState(false);
  const id = useRef(null);
  const origin = useRef(null);

  // Only show on touch-capable devices
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    const pad = padRef.current;
    if (!pad) return;
    const onStart = (e) => {
      const t = e.changedTouches[0];
      if (!t || t.clientX > window.innerWidth / 2) return;
      id.current = t.identifier;
      origin.current = { x: t.clientX, y: t.clientY };
      setActive(true);
    };
    const onMove = (e) => {
      const t = Array.from(e.changedTouches).find((tt) => tt.identifier === id.current);
      if (!t || !origin.current) return;
      const dx = t.clientX - origin.current.x;
      const dy = t.clientY - origin.current.y;
      const max = 60;
      const r = Math.min(max, Math.hypot(dx, dy));
      const ang = Math.atan2(dy, dx);
      const sx = (Math.cos(ang) * r) / max;
      const sy = (Math.sin(ang) * r) / max;
      setJoystick({ x: sx, y: sy });
      if (stickRef.current) {
        stickRef.current.style.transform = `translate(${Math.cos(ang) * r}px, ${Math.sin(ang) * r}px)`;
      }
    };
    const onEnd = (e) => {
      const t = Array.from(e.changedTouches).find((tt) => tt.identifier === id.current);
      if (!t) return;
      id.current = null;
      origin.current = null;
      setActive(false);
      setJoystick({ x: 0, y: 0 });
      if (stickRef.current) stickRef.current.style.transform = 'translate(0,0)';
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    window.addEventListener('touchcancel', onEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, [setJoystick]);

  if (!isTouch) return null;

  return (
    <>
      <div
        ref={padRef}
        className={`absolute bottom-6 left-6 w-32 h-32 rounded-full border-2 ${
          active ? 'border-neon-cyan' : 'border-cyan-100/30'
        } bg-black/30 backdrop-blur-md flex items-center justify-center select-none`}
      >
        <div
          ref={stickRef}
          className="w-14 h-14 rounded-full bg-neon-cyan/40 border border-neon-cyan transition-transform"
        />
      </div>

      {/* Action buttons on the right side */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-3">
        <ActionBtn label="E" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE' }))} />
        <ActionBtn label="↑" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }))} />
      </div>
    </>
  );
}

function ActionBtn({ label, onClick }) {
  return (
    <button
      onTouchStart={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="w-16 h-16 rounded-full border-2 border-neon-pink bg-black/40 backdrop-blur-md font-display text-2xl neon-text-pink active:scale-95"
    >
      {label}
    </button>
  );
}
