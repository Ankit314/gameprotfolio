import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Anonymous patrolling NPCs that wander on circular paths. Cheap to render
// (instanced-friendly) and instantly make a world feel inhabited.
export default function AmbientCrowd({ count = 6, area = 28, color = '#5ec1ff' }) {
  const refs = useRef([]);
  const agents = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      r: 6 + Math.random() * area * 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.25 + Math.random() * 0.35,
      offsetY: 0.9,
      color: new THREE.Color().setHSL(Math.random() * 0.2 + 0.55, 0.7, 0.65).getStyle(),
    }));
  }, [count, area]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    agents.forEach((a, i) => {
      const m = refs.current[i];
      if (!m) return;
      const ang = t * a.speed + a.phase;
      m.position.x = Math.cos(ang) * a.r;
      m.position.z = Math.sin(ang) * a.r;
      m.position.y = a.offsetY;
      m.rotation.y = -ang + Math.PI / 2;
    });
  });

  return (
    <group>
      {agents.map((a, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)} position={[a.r, a.offsetY, 0]}>
          <mesh castShadow position={[0, 0.55, 0]}>
            <capsuleGeometry args={[0.26, 0.5, 4, 10]} />
            <meshStandardMaterial color={a.color} emissive={a.color} emissiveIntensity={0.25} metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0, 1.18, 0]}>
            <sphereGeometry args={[0.17, 12, 12]} />
            <meshStandardMaterial color="#1a2536" metalness={0.6} roughness={0.3} />
          </mesh>
          <pointLight color={a.color} intensity={0.4} distance={3} />
        </group>
      ))}
    </group>
  );
}
