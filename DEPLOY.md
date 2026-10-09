# 🚀 CityPulse Deployment Guide

This guide provides step-by-step instructions for deploying CityPulse on free cloud hosting platforms (**Vercel** and **Netlify**), configuring environment variables, and configuring CARTO key domain referrers.

---

## 1. Deploying to Vercel (Recommended)

### Method A: Via Vercel Dashboard & GitHub
1. Push your code to GitHub (`git push origin main`).
2. Go to [Vercel Dashboard](https://vercel.com/new) and click **Import Repository**.
3. Select your `CityPulse-PromptWars` repository.
4. Configure Build Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add optional keys:
   - `VITE_CARTO_KEY`: `cb1_4f0r_1_0b93d5b8f1e4b20459859d1c`
   - `VITE_CONTACT_EMAIL`: `sahilsangle81@gmail.com`
   - `VITE_GEMINI_API_KEY`: *(Optional)*
   - `VITE_SUPABASE_URL`: *(Optional)*
   - `VITE_SUPABASE_ANON_KEY`: *(Optional)*
6. Click **Deploy**. Vercel will process SPA rewrites using `vercel.json`.

### Method B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy directly from terminal
vercel
```

---

## 2. Deploying to Netlify

### Method A: Via Netlify Drop (Instant Drag & Drop)
1. Build the production bundle locally:
   ```bash
   npm run build
   ```
2. Navigate to [Netlify Drop](https://app.netlify.com/drop).
3. Drag and drop the `dist/` folder.
4. Netlify will serve the site instantly with SPA routing handled by `public/_redirects`.

### Method B: Via GitHub & Netlify Dashboard
1. Connect your repository on Netlify.
2. Build command: `npm run build`, Publish directory: `dist`.
3. Add Environment Variables in Site Settings.

---

## 3. Configuring CARTO Key Referrer Restrictions

To restrict your CARTO Basemaps key to authorized domains:
1. Log in to your [CARTO Basemaps Dashboard](https://dashboard.basemaps.carto.com/).
2. Select your key `cb1_4f0r_1_0b93d5b8f1e4b20459859d1c`.
3. Under **Allowed Domains / Referrers**, add:
   - `localhost:3000`
   - `*.vercel.app`
   - `*.netlify.app`
   - `your-custom-domain.com`

---

## 4. Local Production Preview

To test the exact production bundle on your machine before deploying:

```bash
npm run build
npm run preview
```
Open `http://localhost:4173` to test the build.
