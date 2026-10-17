import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import rateLimit from 'express-rate-limit';

import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import saveRoutes from './routes/saves.js';
import aiRoutes from './routes/ai.js';
import skillRoutes from './routes/skills.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.use(
  '/api/',
  rateLimit({ windowMs: 60 * 1000, max: 240, standardHeaders: true, legacyHeaders: false })
);

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, service: 'ankit-universe', time: new Date().toISOString() })
);

app.use('/api/auth', authRoutes);
app.use('/api/saves', saveRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/ai', aiRoutes);

// Fallback error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal error' });
});

const server = createServer(app);
const io = new SocketServer(server, {
  cors: { origin: process.env.CLIENT_ORIGIN || '*' },
});

io.on('connection', (socket) => {
  socket.on('player:move', (data) => socket.broadcast.emit('player:move', { id: socket.id, ...data }));
  socket.on('disconnect', () => socket.broadcast.emit('player:leave', { id: socket.id }));
});

const PORT = process.env.PORT || 4000;
connectDB().finally(() => {
  server.listen(PORT, () => {
    console.log(`Ankit Universe server listening on http://localhost:${PORT}`);
  });
});
