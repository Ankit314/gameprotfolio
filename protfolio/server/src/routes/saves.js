import { Router } from 'express';
import Save from '../models/Save.js';
import { requireAuth } from '../middleware/auth.js';
import { isDB } from '../db.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  if (!isDB()) return res.status(503).json({ error: 'Database not configured' });
  const slot = req.query.slot || 'default';
  const save = await Save.findOne({ playerId: req.user.sub, slot });
  res.json({ save });
});

router.put('/', requireAuth, async (req, res) => {
  if (!isDB()) return res.status(503).json({ error: 'Database not configured' });
  const slot = req.body.slot || 'default';
  const data = req.body.data || {};
  const save = await Save.findOneAndUpdate(
    { playerId: req.user.sub, slot },
    { $set: { ...data, playerId: req.user.sub, slot } },
    { upsert: true, new: true }
  );
  res.json({ save });
});

router.delete('/', requireAuth, async (req, res) => {
  if (!isDB()) return res.status(503).json({ error: 'Database not configured' });
  const slot = req.query.slot || 'default';
  await Save.deleteOne({ playerId: req.user.sub, slot });
  res.json({ ok: true });
});

export default router;
