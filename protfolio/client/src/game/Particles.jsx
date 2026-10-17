import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Floating dust motes — adds depth and atmosphere. Cheap: single Points object.
export function DustMotes({ count = 220, area = 80, color = '#9ec9ff', size = 0.05 }) {
  const ref = useRef();
  const { positions, speeds, drifts } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const drifts = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * area;
      positions[i * 3 + 1] = Math.random() * 8 + 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * area;
      speeds[i] = 0.05 + Math.random() * 0.12;
      drifts[i] = Math.random() * Math.PI * 2;
    }
    return { positions, speeds, drifts };
  }, [count, area]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i] * delta;
      pos[i * 3 + 0] += Math.sin(state.clock.elapsedTime * 0.2 + drifts[i]) * delta * 0.15;
      if (pos[i * 3 + 1] > 9) pos[i * 3 + 1] = 0.1;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial color={color} size={size} sizeAttenuation transparent opacity={0.7} depthWrite={false} />
    </points>
  );
}

// Rain — angled streaks falling under gravity, recycled when they hit the ground.
export function Rain({ count = 600, area = 80, color = '#9fd9ff' }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * area;
      arr[i * 3 + 1] = Math.random() * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * area;
    }
    return arr;
  }, [count, area]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= delta * 22;
      pos[i * 3] += delta * 2;
      if (pos[i * 3 + 1] < 0) {
        pos[i * 3 + 1] = 18 + Math.random() * 3;
        pos[i * 3] = (Math.random() - 0.5) * area;
        pos[i * 3 + 2] = (Math.random() - 0.5) * area;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.08} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

// Snow — soft drifting flakes for the Future world's wide skies.
export function Snow({ count = 400, area = 80, color = '#ffffff' }) {
  const ref = useRef();
  const drifts = useMemo(() => Array.from({ length: count }, () => Math.random() * Math.PI * 2), [count]);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * area;
      arr[i * 3 + 1] = Math.random() * 22;
      arr[i * 3 + 2] = (Math.random() - 0.5) * area;
    }
    return arr;
  }, [count, area]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= delta * 1.4;
      pos[i * 3] += Math.sin(t + drifts[i]) * delta * 0.4;
      if (pos[i * 3 + 1] < 0) {
        pos[i * 3 + 1] = 22;
        pos[i * 3] = (Math.random() - 0.5) * area;
        pos[i * 3 + 2] = (Math.random() - 0.5) * area;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.12} sizeAttenuation transparent opacity={0.85} depthWrite={false} />
    </points>
  );
}

// Floating ember/spark particles that drift upward — adds heat to scenes.
export function Embers({ count = 80, area = 30, color = '#ff8855' }) {
  const ref = useRef();
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = [];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * area;
      positions[i * 3 + 1] = Math.random() * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * area;
      seeds.push({ phase: Math.random() * Math.PI * 2, speed: 0.4 + Math.random() * 0.6 });
    }
    return { positions, seeds };
  }, [count, area]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += data.seeds[i].speed * delta;
      pos[i * 3] += Math.sin(state.clock.elapsedTime + data.seeds[i].phase) * delta * 0.3;
      if (pos[i * 3 + 1] > 7) {
        pos[i * 3 + 1] = 0.1;
        pos[i * 3] = (Math.random() - 0.5) * area;
        pos[i * 3 + 2] = (Math.random() - 0.5) * area;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.18} sizeAttenuation transparent opacity={0.85} depthWrite={false} />
    </points>
  );
}
