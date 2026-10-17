import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Player from '../models/Player.js';
import { isDB } from '../db.js';

const router = Router();

function signToken(player) {
  return jwt.sign(
    { sub: player._id.toString(), email: player.email, name: player.name },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '30d' }
  );
}

router.post('/register', async (req, res) => {
  if (!isDB()) return res.status(503).json({ error: 'Database not configured' });
  const { email, name, password } = req.body || {};
  if (!email || !password || !name)
    return res.status(400).json({ error: 'name, email and password are required' });
  const exists = await Player.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ error: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const player = await Player.create({ email: email.toLowerCase(), name, passwordHash });
  res.json({ token: signToken(player), player: { id: player._id, email: player.email, name: player.name } });
});

router.post('/login', async (req, res) => {
  if (!isDB()) return res.status(503).json({ error: 'Database not configured' });
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const player = await Player.findOne({ email: email.toLowerCase() });
  if (!player) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, player.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: signToken(player), player: { id: player._id, email: player.email, name: player.name } });
});

export default router;
