# Dr. Khaled Salah · Pediatric & Neonatal Surgery

Website and clinic dashboard for Dr. Khaled Salah's clinics in the Fifth Settlement (New Cairo) and Giza.
Arabic (RTL) by default, with an English toggle.

## What's inside

**Public website** (`/`)
- Home: WebGL silk hero, scroll-driven media expansion, scroll-revealed promise, animated stats, interactive procedures accordion, pinned horizontal "family journey", doctor video cards, branches with per-branch WhatsApp booking, parents' FAQ.
- Pages: The Doctor, Procedures, one page per procedure (circumcision, inguinal hernia, undescended testis, hypospadias), Branches, Parents' Questions, Book a Visit.

**Dashboard** (`/dashboard`, demo password `demo2026`)
- Overview: surgeries vs monthly goal, today's appointments, open inquiries and booking rate, Settlement Google reviews vs the 90-day goal, charts.
- Appointments, weekly Schedule (week starts Saturday), Patients with visit history, Inquiries pipeline (new → replied → 24h → 72h follow-up → booked/lost, drag and drop, convert to booking), Reviews tracker, Settings.
- Requests sent from the website's booking form land in the Inquiries pipeline.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis (driven by the GSAP ticker) · React Bits (Silk, BlurText, ScrollReveal, CountUp, SpotlightCard, Magnet, ShinyText, copied as source into `src/components/reactbits`) · motion · Recharts · React Router.

Section patterns (media expansion hero, interactive image accordion, container scroll, motion footer, dashboard sidebar) follow popular 21st.dev community component patterns, rebuilt from scratch for this brand and for RTL.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

A static demo build with hash URLs (no server rewrites needed): `npm run build:demo` → `dist-demo/`.

Deploy `dist/` to any static host. SPA rewrites are included for Vercel (`vercel.json`) and Netlify (`public/_redirects`).

## Content rules (from the strategy)

No prices or discounts · no promise of results · no "best surgeon" or "without errors" · never assume the child's condition · no identifiable child photos (illustrations only) · title "Consultant of Pediatric & Neonatal Surgery" until confirmed · no mention of other doctors.

All copy lives in `src/content/site.ts`.

## Before launch

- [ ] Doctor reviews and approves all medical copy
- [ ] Approved WhatsApp/phone number and exact address per branch (`src/content/site.ts`)
- [ ] Doctor portrait and clinic photos from the shoot (About page placeholder)
- [ ] Real YouTube video IDs per procedure (`Videos.tsx`, `ProcedureDetail.tsx`)
- [ ] Settlement Google review short link (`dashboard/pages/Reviews.tsx`)
- [ ] Replace the demo localStorage store (`src/lib/store.ts`) and demo login with a real backend and authentication (patient data is health data)
- [ ] Final domain (drkhaledsalah.com vs dr-khaledsalah.com) and redirect from the old site

## Website content (CMS)

Dashboard → **Website content** edits the public site: procedures (add, edit, delete, reorder, show/hide, cover image, YouTube video, FAQs), general FAQs, branches (photo, main branch), the doctor (name, title, bio, highlights, portrait, home banner image, numbers) and an image library.

- Store: `src/lib/content.ts` (`useSite()` for the site, `cms.*` for edits). Seed copy lives in `src/content/site.ts` and `src/content/surgeries-extra.ts`.
- Demo: content and uploaded images (compressed to WebP) are kept in this browser's localStorage, so edits are only visible in the same browser.
- Before launch: replace `load`/`commit` with a backend (for example Supabase tables plus Storage for images) so edits publish for every visitor.
- The 12 added procedures are draft copy for Dr. Khaled Salah to review.
