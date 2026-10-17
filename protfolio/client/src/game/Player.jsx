import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail } from '@react-three/drei';
import * as THREE from 'three';
import { useControls } from '../utils/keyboard';
import { useGame } from '../store/gameStore';
import { sfx } from './AudioEngine';

export default function Player({ paused }) {
  const group = useRef();
  const head = useRef();
  const leftLeg = useRef();
  const rightLeg = useRef();
  const leftArm = useRef();
  const rightArm = useRef();
  const trailAnchor = useRef();

  const controls = useControls();

  const setPlayerPos = useGame((s) => s.setPlayerPos);
  const setStamina = useGame((s) => s.setStamina);
  const dialogOpen = useGame((s) => !!s.ui.dialog);

  const velocity = useRef(new THREE.Vector3());
  const yVel = useRef(0);
  const onGround = useRef(true);
  const heading = useRef(0);
  const stamRef = useRef(100);
  const stepClock = useRef(0);

  const world = useGame((s) => s.currentWorld);
  useEffect(() => {
    if (group.current) {
      group.current.position.set(0, 0.9, 0);
      heading.current = 0;
    }
    yVel.current = 0;
  }, [world]);

  useFrame((state, delta) => {
    if (!group.current || paused || dialogOpen) return;
    const c = controls.current;

    // Build movement vector in camera-space (player faces camera direction).
    const cam = state.camera;
    const forward = new THREE.Vector3();
    cam.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    const dir = new THREE.Vector3();
    if (c.forward) dir.add(forward);
    if (c.back) dir.sub(forward);
    if (c.right) dir.add(right);
    if (c.left) dir.sub(right);

    // Touch joystick contribution from store (mobile)
    const j = useGame.getState().joystick;
    if (j && (j.x !== 0 || j.y !== 0)) {
      const v = new THREE.Vector3();
      v.add(forward.clone().multiplyScalar(-j.y));
      v.add(right.clone().multiplyScalar(j.x));
      dir.add(v);
    }
    const moving = dir.lengthSq() > 0.0001;
    if (moving) dir.normalize();

    // Stamina drains while sprinting, regenerates otherwise.
    const wantSprint = c.sprint && moving && stamRef.current > 2;
    if (wantSprint) stamRef.current = Math.max(0, stamRef.current - 22 * delta);
    else stamRef.current = Math.min(100, stamRef.current + 14 * delta);
    setStamina(stamRef.current);

    const speed = wantSprint ? 9 : 5;
    velocity.current.x = dir.x * speed;
    velocity.current.z = dir.z * speed;

    if (c.jump && onGround.current) {
      yVel.current = 7;
      onGround.current = false;
      sfx.jump();
    }
    yVel.current -= 22 * delta;
    group.current.position.x += velocity.current.x * delta;
    group.current.position.z += velocity.current.z * delta;
    group.current.position.y += yVel.current * delta;

    if (group.current.position.y <= 0.9) {
      group.current.position.y = 0.9;
      yVel.current = 0;
      onGround.current = true;
    }

    const R = 60;
    group.current.position.x = THREE.MathUtils.clamp(group.current.position.x, -R, R);
    group.current.position.z = THREE.MathUtils.clamp(group.current.position.z, -R, R);

    if (moving) {
      const targetYaw = Math.atan2(dir.x, dir.z);
      heading.current = THREE.MathUtils.lerp(heading.current, targetYaw, 0.18);
    }
    group.current.rotation.y = heading.current;

    // Limb swing + head bob
    const t = state.clock.elapsedTime;
    const stride = moving ? (wantSprint ? 12 : 8) : 0;
    const swing = moving ? Math.sin(t * stride) * 0.7 : 0;
    if (leftLeg.current) leftLeg.current.rotation.x = swing;
    if (rightLeg.current) rightLeg.current.rotation.x = -swing;
    if (leftArm.current) leftArm.current.rotation.x = -swing * 0.7;
    if (rightArm.current) rightArm.current.rotation.x = swing * 0.7;
    if (head.current) head.current.position.y = 1.45 + (moving ? Math.abs(Math.sin(t * stride * 2)) * 0.05 : 0);

    // Footstep SFX cadence
    if (moving && onGround.current) {
      stepClock.current += delta * (wantSprint ? 9 : 6);
      if (stepClock.current > 1) {
        stepClock.current = 0;
        sfx.footstep();
      }
    }

    setPlayerPos([group.current.position.x, group.current.position.y, group.current.position.z]);
  });

  return (
    <group ref={group} position={[0, 0.9, 0]} castShadow>
      {/* Energy trail behind player */}
      <Trail
        width={1.4}
        length={5}
        color={'#00f0ff'}
        attenuation={(t) => t * t}
        decay={2}
      >
        <mesh ref={trailAnchor} position={[0, 0.3, -0.35]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </Trail>

      {/* Body */}
      <mesh castShadow position={[0, 0.6, 0]}>
        <capsuleGeometry args={[0.32, 0.6, 6, 16]} />
        <meshStandardMaterial color="#0c1626" emissive="#0a1d33" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Chest reactor */}
      <mesh position={[0, 0.78, 0.3]}>
        <sphereGeometry args={[0.08, 14, 14]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={3.4} />
      </mesh>
      <pointLight position={[0, 0.78, 0.3]} color="#00f0ff" intensity={1.4} distance={5} />

      {/* Shoulder pads */}
      <mesh castShadow position={[-0.38, 1.0, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.18, 0.18, 0.32]} />
        <meshStandardMaterial color="#13243f" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh castShadow position={[0.38, 1.0, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.18, 0.18, 0.32]} />
        <meshStandardMaterial color="#13243f" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Head */}
      <group ref={head} position={[0, 1.45, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.22, 20, 20]} />
          <meshStandardMaterial color="#11233f" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Visor */}
        <mesh position={[0, 0.02, 0.18]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.32, 0.08, 0.04]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.6} />
        </mesh>
        {/* Antenna */}
        <mesh position={[0, 0.28, -0.05]}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 6]} />
          <meshStandardMaterial color="#1a2536" />
        </mesh>
        <mesh position={[0, 0.42, -0.05]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#ff2bd6" emissive="#ff2bd6" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Arms */}
      <group ref={leftArm} position={[-0.34, 1.05, 0]}>
        <mesh castShadow position={[0, -0.32, 0]}>
          <capsuleGeometry args={[0.09, 0.5, 4, 8]} />
          <meshStandardMaterial color="#0c1626" metalness={0.55} roughness={0.4} />
        </mesh>
        {/* Forearm light strip */}
        <mesh position={[0, -0.32, 0.1]}>
          <boxGeometry args={[0.04, 0.5, 0.02]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.34, 1.05, 0]}>
        <mesh castShadow position={[0, -0.32, 0]}>
          <capsuleGeometry args={[0.09, 0.5, 4, 8]} />
          <meshStandardMaterial color="#0c1626" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.32, 0.1]}>
          <boxGeometry args={[0.04, 0.5, 0.02]} />
          <meshBasicMaterial color="#ff2bd6" />
        </mesh>
      </group>

      {/* Legs */}
      <group ref={leftLeg} position={[-0.14, 0.25, 0]}>
        <mesh castShadow position={[0, -0.27, 0]}>
          <capsuleGeometry args={[0.11, 0.5, 4, 8]} />
          <meshStandardMaterial color="#0a1322" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh castShadow position={[0, -0.6, 0.05]}>
          <boxGeometry args={[0.22, 0.1, 0.32]} />
          <meshStandardMaterial color="#070d18" metalness={0.4} roughness={0.6} />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.14, 0.25, 0]}>
        <mesh castShadow position={[0, -0.27, 0]}>
          <capsuleGeometry args={[0.11, 0.5, 4, 8]} />
          <meshStandardMaterial color="#0a1322" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh castShadow position={[0, -0.6, 0.05]}>
          <boxGeometry args={[0.22, 0.1, 0.32]} />
          <meshStandardMaterial color="#070d18" metalness={0.4} roughness={0.6} />
        </mesh>
      </group>

      {/* Soft floor halo */}
      <mesh position={[0, -0.88, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.7, 32]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}
