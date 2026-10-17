import mongoose from 'mongoose';

let connected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('[db] MONGODB_URI not set — persistence disabled. Game still runs from localStorage.');
    return;
  }
  try {
    await mongoose.connect(uri);
    connected = true;
    console.log('[db] connected to MongoDB');
  } catch (e) {
    console.error('[db] connection failed:', e.message);
  }
}

export const isDB = () => connected;
