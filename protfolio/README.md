# Ankit Universe — A Playable 3D Portfolio Game

A cinematic, story-driven 3D portfolio built as a real game. Walk through the
worlds of your life — Origin, School, BCA, MCA, MERN Lab, Company Tower,
Project City, and the Future. Talk to AI-powered NPCs, complete coding quests,
unlock skills, and collect achievements.

## Stack

- **Client**: React 18, Vite, Three.js, React Three Fiber, Drei, Rapier physics,
  Tailwind CSS, Zustand, GSAP, Framer Motion.
- **Server**: Node.js, Express, MongoDB (Mongoose), JWT auth, Socket.io,
  Google Gemini proxy.
- **AI**: Google Gemini for NPC dialog (server-side proxy keeps your key safe).
  Falls back to scripted dialog if no key is configured.

## Layout

```
ankit-universe/
├── client/        # Vite + React Three Fiber game client
└── server/        # Express + MongoDB API + AI proxy
```

## Quick start

```bash
# install
cd client && npm install
cd ../server && npm install

# run server (port 4000)
cd server && cp .env.example .env  # then edit
npm run dev

# run client (port 5173)
cd client && npm run dev
```

Open http://localhost:5173 and play.

## Controls

- **WASD / Arrows** — move
- **Shift** — sprint
- **Space** — jump
- **E** — interact with NPC / object
- **Tab** — open quest log / skill tree
- **Esc** — pause menu

## Worlds

1. **Origin** — village & home, where the story begins.
2. **School Quest** — 10th & 12th journey, classrooms, teacher NPCs.
3. **BCA Campus** — first coding labs (HTML, CSS, JS, PHP).
4. **MCA City** — advanced tech, futuristic university.
5. **MERN Lab** — boss arena where you fight coding bugs.
6. **Company Tower** — KBS-IT Solutions, real-world missions.
7. **Project City** — Driveree, Searchtalent, Explorepedia, Sapience zones.
8. **Future World** — flying cars, AI robots, the road ahead.

## Deployment

- **Client** → Vercel
- **Server** → Render
- **DB** → MongoDB Atlas

See `docs/DEPLOY.md` for the full guide (TODO).
