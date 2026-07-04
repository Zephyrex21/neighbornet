# Deploy NeighborNet to Vercel

## Option A — CLI (fastest)
```
npm install -g vercel
cd neighbornet
vercel
```
Follow prompts (link to new project, defaults are fine for a Vite app).
Then:
```
vercel --prod
```
This gives you the live URL.

## Option B — GitHub import
1. Push the `neighbornet` folder to a new GitHub repo.
2. vercel.com → Add New Project → Import the repo.
3. Framework preset: Vite (auto-detected). Build command `npm run build`,
   output dir `dist` (auto-detected, no changes needed).
4. Deploy.

## No environment variables needed
Firebase config lives in `src/lib/firebase.ts` as plain client code — this
is normal for Firebase web apps. Security is enforced by Firestore rules
(already set up), not by hiding the config.

## Post-deploy checklist (do this before recording the demo video)
- [ ] Open the live Vercel URL, confirm pins load on first paint
- [ ] Click "Near me" — confirm browser asks for location permission and
      map recenters
- [ ] Toggle Map/List view
- [ ] Click a category filter chip, confirm pins/cards update
- [ ] Type in search, confirm results narrow
- [ ] Click "+ Add resource", pin a test location, submit, confirm it
      appears live without refresh
- [ ] Test on your phone (or Chrome mobile device toolbar) — check
      header doesn't overflow, modal is scrollable, map is usable with touch
- [ ] Delete your test resource from Firebase console afterward (rules
      don't allow delete from the app itself — console is the only way)
