# Aabir Sharma Portfolio - Deployment

## Status
- Local dev: `cd site && npm run dev` (port 3000)
- Local build: `cd site && npm run build` (passes, 0 TS errors, all 8 sections WCAG AA)
- Local audit: `node audit.js` (8 content checks pass, 0 em-dashes, 9 sections)
- Local a11y: `node axe-check.js` (8/8 sections, 0 violations)

## Deploy to Vercel (one-time interactive login)
```
cd site
npx vercel login          # interactive: pick your Vercel account
npx vercel --prod --yes   # deploy from /site
```

## Continuous deploy
Once the first deploy succeeds, link the GitHub repo to Vercel for push-to-main auto-deploy.

## Stack
- Next.js 16.3.3 (App Router, RSC, static export)
- Tailwind v4 (custom @theme tokens)
- Motion (animation)
- React Three Fiber + Drei (3D scenes, lazy-loaded)
- Lenis (smooth scroll)

## Structure
- `site/app/` - layout, page, globals.css, opengraph-image, sitemap, robots
- `site/components/` - all section + shared + motion + 3D components
- `site/lib/site.ts` - single source of truth for content
- `site/.next/` - production build output
- `audit.js`, `axe-check.js` - root-level audit scripts
- `audit-screens/` - Playwright screenshot output

## Content editing
- All text content lives in `site/lib/site.ts` - edit there.
- No MDX loading required (MDX is installed but not currently used).
