import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../store/gameStore';

// Third-person camera with pointer-lock mouse orbit. Click the canvas to
// engage look. Esc / pause releases. Falls back to drag orbit on touch.
export default function CameraRig() {
  const { gl } = useThree();
  const camPos = useRef(new THREE.Vector3(0, 5, 9));
  const lookAt = useRef(new THREE.Vector3());

  // Spherical angles
  const yaw = useRef(0);
  const pitch = useRef(0.35);
  const distance = useRef(8.5);
  const locked = useRef(false);
  const dragging = useRef(false);
  const lastTouch = useRef(null);

  // Expose yaw to the global store so the player can move in camera space.
  useFrame((state, delta) => {
    const [px, py, pz] = useGame.getState().playerPos;

    // Apply pitch clamp
    pitch.current = THREE.MathUtils.clamp(pitch.current, -0.25, 1.05);

    // Compute camera position from spherical coords around player.
    const r = distance.current;
    const offsetX = Math.sin(yaw.current) * Math.cos(pitch.current) * r;
    const offsetZ = Math.cos(yaw.current) * Math.cos(pitch.current) * r;
    const offsetY = Math.sin(pitch.current) * r + 1.2;
    const desired = new THREE.Vector3(px + offsetX, py + offsetY, pz + offsetZ);

    const damp = 1 - Math.pow(0.0001, delta);
    camPos.current.lerp(desired, damp * 0.9);
    state.camera.position.copy(camPos.current);

    const lookTarget = new THREE.Vector3(px, py + 1.1, pz);
    lookAt.current.lerp(lookTarget, damp);
    state.camera.lookAt(lookAt.current);

    // Publish yaw so Player can derive forward direction.
    useGame.getState().setCameraYaw?.(yaw.current);
  });

  useEffect(() => {
    const dom = gl.domElement;

    const onClick = () => {
      if (!locked.current && document.pointerLockElement !== dom) {
        dom.requestPointerLock?.();
      }
    };
    const onLockChange = () => {
      locked.current = document.pointerLockElement === dom;
    };
    const onMouseMove = (e) => {
      if (locked.current) {
        yaw.current -= e.movementX * 0.0025;
        pitch.current -= e.movementY * 0.0025;
      }
    };
    const onWheel = (e) => {
      distance.current = THREE.MathUtils.clamp(distance.current + e.deltaY * 0.005, 4, 18);
    };
    // Touch / drag fallback
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        if (t.clientX > window.innerWidth / 2) {
          // Right-side drag = camera orbit
          dragging.current = true;
          lastTouch.current = { x: t.clientX, y: t.clientY };
        }
      }
    };
    const onTouchMove = (e) => {
      if (!dragging.current || e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - lastTouch.current.x;
      const dy = t.clientY - lastTouch.current.y;
      yaw.current -= dx * 0.005;
      pitch.current -= dy * 0.005;
      lastTouch.current = { x: t.clientX, y: t.clientY };
    };
    const onTouchEnd = () => {
      dragging.current = false;
      lastTouch.current = null;
    };

    dom.addEventListener('click', onClick);
    document.addEventListener('pointerlockchange', onLockChange);
    document.addEventListener('mousemove', onMouseMove);
    dom.addEventListener('wheel', onWheel, { passive: true });
    dom.addEventListener('touchstart', onTouchStart);
    dom.addEventListener('touchmove', onTouchMove);
    dom.addEventListener('touchend', onTouchEnd);
    return () => {
      dom.removeEventListener('click', onClick);
      document.removeEventListener('pointerlockchange', onLockChange);
      document.removeEventListener('mousemove', onMouseMove);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      dom.removeEventListener('touchend', onTouchEnd);
    };
  }, [gl]);

  return null;
}
