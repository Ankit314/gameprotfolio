import { useEffect, useRef } from 'react';

// Maps physical keys to logical actions.
const MAP = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'back',
  ArrowDown: 'back',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  Space: 'jump',
  ShiftLeft: 'sprint',
  ShiftRight: 'sprint',
  KeyE: 'interact',
};

export function useControls() {
  const ref = useRef({
    forward: false,
    back: false,
    left: false,
    right: false,
    jump: false,
    sprint: false,
    interact: false,
  });
  useEffect(() => {
    const down = (e) => {
      const a = MAP[e.code];
      if (a) ref.current[a] = true;
    };
    const up = (e) => {
      const a = MAP[e.code];
      if (a) ref.current[a] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);
  return ref;
}

export function useHotkey(code, fn, deps = []) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === code) {
        fn(e);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
