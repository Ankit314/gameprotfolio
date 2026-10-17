import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame, getWorld } from '../store/gameStore';

// Per-world cinematic 3-point lighting + an animated rim light that orbits the
// scene like a slow moving sun. Day/night cycle is enabled in Future World.
export default function Lighting() {
  const worldId = useGame((s) => s.currentWorld);
  const world = getWorld(worldId);
  const tint = world?.color || '#00f0ff';

  const dayNight = worldId === 'future';
  const sunRef = useRef();
  const rimRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (sunRef.current && dayNight) {
      const a = t * 0.05;
      sunRef.current.position.set(Math.cos(a) * 40, Math.max(2, Math.sin(a) * 30 + 10), Math.sin(a) * 40);
      sunRef.current.intensity = 0.5 + Math.max(0, Math.sin(a)) * 1.5;
    }
    if (rimRef.current) {
      rimRef.current.position.set(Math.sin(t * 0.2) * 14, 6, Math.cos(t * 0.2) * 14);
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} color={tint} />
      <hemisphereLight intensity={0.4} color={tint} groundColor="#020409" />

      {/* Key light */}
      <directionalLight
        ref={sunRef}
        castShadow
        position={[15, 22, 10]}
        intensity={1.2}
        color="#fff6e6"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-bias={-0.0005}
      />

      {/* Magenta rim back-light (the iconic cyberpunk pop) */}
      <directionalLight position={[-18, 8, -12]} intensity={0.7} color="#ff2bd6" />
      {/* Cool fill */}
      <directionalLight position={[12, 6, -16]} intensity={0.4} color="#00f0ff" />

      {/* Animated orbiting rim light */}
      <pointLight ref={rimRef} color={tint} intensity={2.5} distance={28} />

      {/* Distant city glow */}
      <pointLight position={[-22, 3, -22]} intensity={1.4} color="#ff2bd6" distance={50} />
      <pointLight position={[22, 3, 22]} intensity={1.2} color="#00f0ff" distance={50} />
    </>
  );
}
