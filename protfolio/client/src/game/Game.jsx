import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Stars,
  Sky,
  Environment,
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
  ContactShadows,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  SSAO,
  ToneMapping,
  DepthOfField,
  Noise,
} from '@react-three/postprocessing';
import * as THREE from 'three';
import { useGame } from '../store/gameStore';
import Player from './Player.jsx';
import CameraRig from './CameraRig.jsx';
import Lighting from './Lighting.jsx';
import WorldManager from '../worlds/WorldManager.jsx';
import { DustMotes, Rain, Snow, Embers } from './Particles.jsx';
import { startWorldMusic, unlockAudio } from './AudioEngine';

const WEATHER = {
  origin: { rain: false, snow: false, embers: true, fog: [30, 180], bg: '#1a0e08' },
  school: { rain: false, snow: false, embers: false, fog: [40, 180], bg: '#08141a' },
  bca: { rain: false, snow: false, embers: false, fog: [30, 160], bg: '#05140a' },
  mca: { rain: false, snow: false, embers: false, fog: [30, 160], bg: '#0c0820' },
  mern: { rain: true, snow: false, embers: false, fog: [25, 140], bg: '#020a14' },
  company: { rain: false, snow: false, embers: false, fog: [30, 160], bg: '#0a0a14' },
  projects: { rain: false, snow: false, embers: false, fog: [30, 160], bg: '#1a0820' },
  future: { rain: false, snow: true, embers: false, fog: [40, 220], bg: '#02070d' },
};

export default function Game() {
  const paused = useGame((s) => s.paused);
  const worldId = useGame((s) => s.currentWorld);
  const audioEnabled = useGame((s) => s.settings.audio);
  const quality = useGame((s) => s.settings.quality);
  const w = WEATHER[worldId] || WEATHER.origin;

  useEffect(() => {
    if (audioEnabled) {
      unlockAudio();
      startWorldMusic(worldId);
    }
  }, [worldId, audioEnabled]);

  const lowQ = quality === 'low';
  const highQ = quality === 'high' || quality === 'ultra';

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        dpr={lowQ ? [0.8, 1.2] : [1, 2]}
        camera={{ position: [0, 4, 8], fov: 60, near: 0.1, far: 800 }}
        gl={{
          antialias: !lowQ,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        <color attach="background" args={[w.bg]} />
        <fog attach="fog" args={[w.bg, w.fog[0], w.fog[1]]} />

        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <PerformanceMonitor />

        <Suspense fallback={null}>
          <Stars radius={150} depth={70} count={lowQ ? 800 : 2200} factor={3} fade speed={0.4} />
          {worldId !== 'origin' && (
            <Sky sunPosition={[100, worldId === 'future' ? 6 : 20, 100]} turbidity={6} rayleigh={1} mieCoefficient={0.005} />
          )}

          <Lighting />
          <Environment preset="night" />

          <WorldManager />
          <Player paused={paused} />
          <CameraRig />

          {/* Atmospheric particles */}
          <DustMotes count={lowQ ? 120 : 240} color="#9ec9ff" />
          {w.rain && <Rain count={lowQ ? 300 : 700} />}
          {w.snow && <Snow count={lowQ ? 200 : 400} />}
          {w.embers && <Embers count={lowQ ? 40 : 80} />}

          {/* Soft contact shadow under player area */}
          {highQ && (
            <ContactShadows
              position={[0, 0.01, 0]}
              opacity={0.6}
              scale={50}
              blur={2.5}
              far={6}
              resolution={lowQ ? 256 : 512}
              color="#000"
            />
          )}
        </Suspense>

        <EffectComposer multisampling={0} disableNormalPass={lowQ}>
          {highQ ? (
            <SSAO radius={0.1} intensity={20} luminanceInfluence={0.4} samples={11} rings={4} />
          ) : null}
          <Bloom intensity={1.1} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur />
          {highQ ? <DepthOfField focusDistance={0.01} focalLength={0.12} bokehScale={2.5} /> : null}
          <ChromaticAberration offset={[0.0008, 0.0008]} />
          <Noise opacity={0.04} />
          <Vignette eskil={false} offset={0.18} darkness={0.85} />
          <ToneMapping />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
