# Vertex Consult — Premium Architecture Website

> A world-class, production-ready architecture company website built with vanilla HTML5, CSS3, and ES6+ JavaScript. Dark/Light themes, AI chatbot, WhatsApp booking, and premium UI/UX.

**Developer:** [Jalixon](https://jalixon.vercel.app/)

---

## Project Structure

```text
vertex-consult/
│
├── index.html                  # Main HTML file
├── README.md                   # This file
│
├── css/
│   └── style.css               # All styles (themes, components, responsive)
│
├── js/
│   └── main.js                 # All JavaScript (ES6+, modular, commented)
│
└── assets/
    ├── favicon.svg             # Browser tab icon
    ├── logo.svg                # Company logo (used in nav & splash)
    └── images/
        ├── hero.jpg            # Hero section background  (≈ 2000×1200)
        ├── about.jpg           # About section image     (≈ 800×1000 portrait)
        ├── ceo.jpg             # CEO portrait            (≈ 900×1200 portrait)
        ├── project-1.jpg       # Portfolio image 1
        ├── project-2.jpg       # Portfolio image 2
        ├── project-3.jpg       # ...
        ├── project-4.jpg
        ├── project-5.jpg
        ├── project-6.jpg
        ├── project-7.jpg
        ├── project-8.jpg
        ├── project-9.jpg
        ├── project-10.jpg
        ├── project-11.jpg
        ├── project-12.jpg
        ├── project-13.jpg
        ├── project-14.jpg
        ├── project-15.jpg
        └── project-16.jpg
```

---

## Image Assets Required

Place the following files in `assets/images/`:

| File | Size (recommended) | Used in |
|------|--------------------|---------|
| `hero.jpg` | 2000 × 1200 px (landscape) | Hero background |
| `about.jpg` | 800 × 1000 px (portrait) | About section |
| `ceo.jpg` | 900 × 1200 px (portrait) | CEO profile |
| `project-1.jpg` → `project-16.jpg` | 1200 × 900 or 900 × 1200 | Portfolio gallery |

**Format:** `.jpg` (photos) — high quality, compressed for web (≤ 300 KB each for performance).

> The portfolio grid works best with a **mix of landscape and portrait orientations** to create the masonry effect. Odd-numbered projects tend to work well as portrait, even as landscape.

### Free image sources (replace with your own photos)
- [Pexels](https://www.pexels.com/search/architecture/)
- [Unsplash](https://unsplash.com/s/photos/architecture)

---

## Features

- **Premium Dark/Light theme** — gold accent system, persisted via localStorage
- **Splash screen** — 3D-animated SVG logo with rotating rings and loading bar
- **Custom gold cursor** (desktop), scroll progress bar, back-to-top button
- **Sticky glass nav** with active-section highlighting and mobile drawer
- **Hero** — parallax background, decorative grid, floating particles, meta info
- **Marquee ticker** of services
- **About** — animated stat counters, 4 value cards, experience badge
- **8 Services** in a bordered matrix grid
- **Portfolio** — 16 projects, 6 category filters, lightbox with keyboard navigation
- **CEO profile** — Fortune-500-style executive presentation
- **Testimonials carousel** — auto-rotating with arrows, dots, pause-on-hover
- **Booking form** — real-time validation, submits via WhatsApp
- **Contact** — 4 cards (clickable), stylized map placeholder
- **Floating AI chatbot** — 11-topic knowledge base, typing animation, quick replies
- **Floating WhatsApp** — pulse-animated with hover tooltip
- **Toast notifications** — replace alert() for non-blocking feedback
- **Full accessibility** — ARIA labels, keyboard nav (Esc/Arrows), `prefers-reduced-motion` friendly
- **XSS-safe** — all user/DOM content sanitized before insertion

---

## Quick Start

### Step 1 — Download images (one command)

**Option A: Mac / Linux / WSL (recommended)**
```bash
bash download-images.sh
```

**Option B: Any OS with Node.js 18+**
```bash
node download-images.mjs
```

**Option C: Manual**
Download the 19 images listed in the table above and place them in `assets/images/`.

The scripts automatically create `assets/images/`, skip already-downloaded files, and show progress.

### Step 2 — Open the site
```bash
# Python 3
python3 -m http.server 8000
# Then visit http://localhost:8000
```
Or simply open `index.html` directly in any modern browser. No build step, no server required.

### To deploy
- Upload the entire folder as-is to any static host (Netlify, Vercel, GitHub Pages, cPanel, etc.)
- No server or database required

---

## Customization Checklist

- [ ] Replace `assets/logo.svg` with your official logo
- [ ] Update the phone number in all `https://wa.me/2340000000000` URLs (6 occurrences in `index.html` + `js/main.js`)
- [ ] Update the email `info@vertexconsult.com`
- [ ] Replace CEO name/photo/bio in the CEO section
- [ ] Update booking WhatsApp number in `js/main.js`
- [ ] Customize color tokens in `css/style.css` (`:root` block)
