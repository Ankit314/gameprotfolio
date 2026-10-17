# Deploying Ankit Universe

## Local

```bash
# server
cd server
cp .env.example .env
# (optional) add MONGODB_URI and GEMINI_API_KEY
npm install
npm run dev    # http://localhost:4000

# client
cd ../client
npm install
npm run dev    # http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:4000`, so the client
talks to the server seamlessly during development.

## Production

### Client → Vercel
1. Push the repo to GitHub.
2. Import the repo into Vercel and pick the `client/` directory.
3. Build command: `npm run build`. Output: `dist/`.
4. Set `VITE_API_BASE` to your server URL (e.g. `https://ankit-universe-api.onrender.com`) and update `aiClient.js` to prefix calls if you want to deploy without a proxy.

### Server → Render
1. New Web Service → connect repo.
2. Root: `server/`. Build: `npm install`. Start: `npm start`.
3. Env vars: `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `CLIENT_ORIGIN`.

### DB → MongoDB Atlas
1. Create a free cluster.
2. Whitelist `0.0.0.0/0` (or Render's egress IPs).
3. Copy the connection string into `MONGODB_URI`.

## Gemini API
1. Create a key at https://aistudio.google.com/app/apikey.
2. Add it to the server's `.env`. The client never sees the key — it goes
   through `/api/ai/chat`.

## Performance tips
- Compress GLTFs with `gltf-pipeline` if you add 3D assets.
- Use `<Suspense>` everywhere you load heavy meshes.
- Drop bloom intensity on mobile.
- Consider `react-three-rapier` for proper physics if you add platformer levels.
