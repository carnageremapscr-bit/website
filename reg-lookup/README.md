# Reg Lookup

Simple Node.js/Express demo to look up a vehicle by registration and view stock plus Stage 1-3 tuning outputs (HP and Nm).

## Quick start

1) Install deps:
```
npm install
```

2) Run dev server (w/ reload):
```
npm run dev
```

Or start normally:
```
npm start
```

3) Open http://localhost:4000 and test with sample registrations:
- ABC123
- DEF456
- GHI789
- JKL321
- MNO654

## How it works
- `data/vehicles.json` holds mock vehicle entries with stock and stage outputs.
- `server.js` serves the API at `/api/lookup?reg=ABC123` and hosts the static frontend from `public/`.
- `public/` contains a small UI that fetches the API and renders a table of power gains.

## Customizing
- Add or edit entries in `data/vehicles.json` (keep `registration` unique; stages optional).
- Adjust the frontend copy or styling in `public/index.html` and `public/styles.css`.
- Update gains logic in `public/app.js` if you add more stages.
