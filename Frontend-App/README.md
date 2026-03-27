# Frontend App (Vite + React)

## Local development

1. Create a `.env` file in this folder.
2. Set the backend URL:

```env
VITE_API_BASE_URL=http://localhost:4000
```

3. Install dependencies and run:

```bash
npm install
npm run dev
```

## Production deployment (Netlify)

This project is prepared for Netlify hosting with client-side routing support.

Required settings:

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Environment variable:

```env
VITE_API_BASE_URL=https://your-render-backend.onrender.com
```

Files included for Netlify:

- `netlify.toml` for build + redirect settings
- `public/_redirects` for SPA fallback to `index.html`

## API configuration

All frontend API requests use a shared helper in `src/config/api.js`.

- Local fallback is `http://localhost:4000`
- Production should use `VITE_API_BASE_URL`
