import mongoose from 'mongoose';

const SaveSchema = new mongoose.Schema(
  {
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', index: true },
    slot: { type: String, default: 'default' },
    currentWorld: String,
    visitedWorlds: [String],
    skills: [{ id: String, name: String, level: Number, unlocked: Boolean }],
    achievements: [{ id: String, name: String, earned: Boolean }],
    quests: [
      {
        id: String,
        title: String,
        progress: Number,
        target: Number,
        completed: Boolean,
        active: Boolean,
      },
    ],
    playerName: String,
  },
  { timestamps: true }
);

SaveSchema.index({ playerId: 1, slot: 1 }, { unique: true });

export default mongoose.models.Save || mongoose.model('Save', SaveSchema);
