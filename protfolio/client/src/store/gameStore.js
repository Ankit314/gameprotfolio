import { create } from 'zustand';
import { WORLDS, SKILLS, ACHIEVEMENTS, QUESTS } from '../data/gameData';
import { sfx } from '../game/AudioEngine';

// No save/resume: every visitor starts the story fresh at Origin World each
// time they load the page or click "Enter Universe".

const initial = {
  // Meta
  started: false,
  paused: false,
  loading: true,
  playerName: 'Ankit',

  // World state
  currentWorld: 'origin',
  visitedWorlds: ['origin'],
  worldTransition: false,

  // Player
  playerPos: [0, 0.9, 0],
  health: 100,
  stamina: 100,
  cameraYaw: 0,
  joystick: { x: 0, y: 0 },

  // Quests / skills / achievements
  quests: QUESTS.map((q) => ({ ...q, progress: 0, completed: false, active: false })),
  skills: SKILLS.map((s) => ({ ...s })),
  achievements: ACHIEVEMENTS.map((a) => ({ ...a })),

  // UI
  ui: {
    questLog: false,
    skillTree: false,
    achievements: false,
    settings: false,
    dialog: null,
    toast: null,
    minimap: true,
  },

  // Settings
  settings: {
    audio: true,
    quality: 'high', // low | medium | high | ultra
    motionBlur: true,
    sensitivity: 1.0,
  },
};

export const useGame = create((set, get) => {
  return {
    ...initial,

    start() {
      set({ started: true, loading: false });
      const q = get().quests.find((q) => q.world === get().currentWorld);
      if (q && !q.active && !q.completed) get().activateQuest(q.id);
    },
    setLoading: (v) => set({ loading: v }),
    togglePause: () => set({ paused: !get().paused }),

    setWorld(id) {
      sfx.portal();
      const visited = get().visitedWorlds.includes(id)
        ? get().visitedWorlds
        : [...get().visitedWorlds, id];
      set({
        currentWorld: id,
        visitedWorlds: visited,
        worldTransition: true,
        playerPos: [0, 0.9, 0],
        ui: { ...get().ui, dialog: null },
      });
      // Activate the quest tied to this world
      const q = get().quests.find((q) => q.world === id);
      if (q && !q.completed) get().activateQuest(q.id);
      setTimeout(() => set({ worldTransition: false }), 1200);
    },

    setPlayerPos: (pos) => set({ playerPos: pos }),
    setStamina: (v) => set({ stamina: v }),
    setCameraYaw: (y) => set({ cameraYaw: y }),
    setJoystick: (v) => set({ joystick: v }),
    setSettings(next) {
      set({ settings: { ...get().settings, ...next } });
    },

    // Quests
    activateQuest(id) {
      const quests = get().quests.map((q) =>
        q.id === id ? { ...q, active: true } : q
      );
      set({ quests });
      get().toast({ kind: 'quest', text: `New quest: ${quests.find((q) => q.id === id)?.title}` });
    },
    progressQuest(id, by = 1) {
      const quests = get().quests.map((q) => {
        if (q.id !== id || q.completed) return q;
        const progress = Math.min(q.target, q.progress + by);
        const completed = progress >= q.target;
        if (completed) {
          setTimeout(() => {
            if (q.rewardSkill) get().unlockSkill(q.rewardSkill, 80);
            if (q.rewardAchievement) get().earnAchievement(q.rewardAchievement);
            get().toast({ kind: 'success', text: `Quest complete: ${q.title}` });
            sfx.unlock();
          }, 0);
        } else {
          sfx.pickup();
        }
        return { ...q, progress, completed, active: !completed };
      });
      set({ quests });
    },

    // Skills
    unlockSkill(id, level = 60) {
      const skills = get().skills.map((s) =>
        s.id === id ? { ...s, unlocked: true, level: Math.max(s.level, level) } : s
      );
      set({ skills });
      get().toast({ kind: 'skill', text: `Skill unlocked: ${skills.find((s) => s.id === id)?.name}` });
    },

    // Achievements
    earnAchievement(id) {
      const a = get().achievements.find((a) => a.id === id);
      if (!a || a.earned) return;
      const achievements = get().achievements.map((x) =>
        x.id === id ? { ...x, earned: true } : x
      );
      set({ achievements });
      get().toast({ kind: 'achievement', text: `Achievement: ${a.name}` });
      sfx.achievement();
    },

    // Dialog
    openDialog(npc, lines) {
      set({ ui: { ...get().ui, dialog: { npc, lines, index: 0 } } });
    },
    advanceDialog() {
      const d = get().ui.dialog;
      if (!d) return;
      if (d.index + 1 >= d.lines.length) {
        set({ ui: { ...get().ui, dialog: null } });
      } else {
        set({ ui: { ...get().ui, dialog: { ...d, index: d.index + 1 } } });
      }
    },
    pushDialogLine(line) {
      const d = get().ui.dialog;
      if (!d) return;
      set({
        ui: {
          ...get().ui,
          dialog: { ...d, lines: [...d.lines, line], index: d.lines.length },
        },
      });
    },
    closeDialog: () => set({ ui: { ...get().ui, dialog: null } }),

    // UI panels
    toggleUI(key) {
      set({ ui: { ...get().ui, [key]: !get().ui[key] } });
    },

    // Toast
    toast({ kind, text }) {
      set({ ui: { ...get().ui, toast: { kind, text, t: Date.now() } } });
      setTimeout(() => {
        const cur = get().ui.toast;
        if (cur && cur.text === text) set({ ui: { ...get().ui, toast: null } });
      }, 3500);
    },

    reset() {
      set(initial);
    },
  };
});

export const getWorld = (id) => WORLDS.find((w) => w.id === id);
