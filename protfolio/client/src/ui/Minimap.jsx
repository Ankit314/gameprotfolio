import React, { useRef, useEffect } from 'react';
import { useGame, getWorld } from '../store/gameStore';
import { NPCS } from '../data/gameData';

// Top-down radar. Renders to a small canvas every frame.
export default function Minimap() {
  const canvasRef = useRef();
  const worldId = useGame((s) => s.currentWorld);
  const world = getWorld(worldId);
  const color = world?.color || '#00f0ff';

  useEffect(() => {
    let raf;
    const SIZE = 160;
    const RANGE = 60; // world units mapped to map radius

    const draw = () => {
      const cv = canvasRef.current;
      if (!cv) return;
      const ctx = cv.getContext('2d');
      const cx = SIZE / 2;
      const cy = SIZE / 2;
      ctx.clearRect(0, 0, SIZE, SIZE);

      const { playerPos, cameraYaw } = useGame.getState();
      const [px, _py, pz] = playerPos;

      // Map background
      ctx.fillStyle = 'rgba(5, 12, 22, 0.7)';
      ctx.beginPath();
      ctx.arc(cx, cy, cx - 2, 0, Math.PI * 2);
      ctx.fill();

      // Grid (rotates with camera so "up" is camera-forward)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-cameraYaw);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
      for (let i = -RANGE; i <= RANGE; i += 10) {
        const k = (i / RANGE) * (cx - 6);
        ctx.beginPath();
        ctx.moveTo(-cx, k);
        ctx.lineTo(cx, k);
        ctx.moveTo(k, -cx);
        ctx.lineTo(k, cx);
        ctx.stroke();
      }

      // NPCs as colored dots (relative to player)
      const npcs = NPCS[worldId] || [];
      npcs.forEach((n) => {
        const dx = n.pos[0] - px;
        const dz = n.pos[2] - pz;
        const mx = (dx / RANGE) * (cx - 6);
        const my = (dz / RANGE) * (cy - 6);
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(mx, my, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Portals — approximate by drawing a marker at world edges (origin orientation only)
      ctx.restore();

      // Player (always centered + a heading arrow)
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 8);
      ctx.lineTo(cx - 5, cy + 5);
      ctx.lineTo(cx + 5, cy + 5);
      ctx.closePath();
      ctx.fill();

      // Outer ring
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, cx - 1, 0, Math.PI * 2);
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [worldId, color]);

  return (
    <div className="hidden pointer-fine:block absolute bottom-16 right-4 glass rounded-full p-1">
      <canvas ref={canvasRef} width={160} height={160} className="rounded-full" />
    </div>
  );
}
