import { Router } from 'express';

const router = Router();

// Public read-only skill manifest so the client can fetch the latest values if
// you ever want to update them without redeploying the client.
const SKILLS = [
  { id: 'react', name: 'React.js', level: 95 },
  { id: 'node', name: 'Node.js', level: 90 },
  { id: 'mongo', name: 'MongoDB', level: 88 },
  { id: 'express', name: 'Express', level: 86 },
  { id: 'three', name: 'Three.js', level: 80 },
  { id: 'tailwind', name: 'Tailwind', level: 92 },
  { id: 'js', name: 'JavaScript', level: 95 },
  { id: 'ts', name: 'TypeScript', level: 78 },
  { id: 'html', name: 'HTML', level: 98 },
  { id: 'css', name: 'CSS', level: 94 },
  { id: 'php', name: 'PHP', level: 72 },
  { id: 'ai', name: 'AI Engineering', level: 70 },
];

router.get('/', (_req, res) => res.json({ skills: SKILLS }));

export default router;
