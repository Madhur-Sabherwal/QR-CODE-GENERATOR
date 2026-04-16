# QR Studio

Turn any URL into a high-quality QR code instantly. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- Real-time QR generation with debounce
- URL validation
- Size slider (128px → 512px)
- Foreground color picker + presets
- PNG & SVG download
- Dark glassmorphism UI
- Everything runs client-side — nothing is stored or tracked

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import the GitHub repo
4. Click **Deploy** — Vercel auto-detects Next.js

Your app will be live on a `.vercel.app` domain in ~60 seconds.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS
- **QR Library**: `qrcode`
- **Icons**: `lucide-react`
