/* ============================================================
   ELITE ENTERTAINMENT — PREMIUM MUSIC & EVENT ENTERTAINMENT JAVASCRIPT
   Developer: Jalixon | https://jalixon.vercel.app/
   ============================================================ */

(() => {
  'use strict';

  /* ========== UTILITIES ========== */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /**
   * Sanitize string to prevent XSS when inserting into DOM.
   * Uses textContent then reads innerHTML — all HTML becomes inert text.
   */
  const sanitize = (str) => { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; };

  /**
   * Debounce for scroll/resize handlers to reduce repaints.
   */
  const debounce = (fn, d = 100) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), d); }; };

  // Secure all external links automatically
  $$('a[target="_blank"]').forEach(a => {
    if (!a.rel.includes('noopener')) a.setAttribute('rel', 'noopener noreferrer');
  });

  /* ========== TOAST SYSTEM (non-blocking, accessible) ========== */
  const toastContainer = $('#toastContainer');
  const toast = (msg, type = 'default', duration = 4000) => {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', default: 'fa-circle-info' };
    el.innerHTML = `<i class="fa-solid ${icons[type] || icons.default}"></i><div class="toast-text">${sanitize(msg)}</div>`;
    toastContainer.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 400);
    }, duration);
  };

  /* ========== SPLASH SCREEN ========== */
  const splashBar = $('#splashBar');
  const splashPct = $('#splashPercent');
  let pct = 0;
  const pctTimer = setInterval(() => {
    pct = Math.min(pct + Math.random() * 1.8, 100);
    splashBar.style.width = pct + '%';
    splashPct.textContent = Math.floor(pct) + '%';
    if (pct >= 100) clearInterval(pctTimer);
  }, 200);

  window.addEventListener('load', () => {
    setTimeout(() => {
      pct = 100; splashBar.style.width = '100%'; splashPct.textContent = '100%';
      setTimeout(() => {
        $('#splash').classList.add('hidden');
        setTimeout(() => initCounters(), 400);
      }, 400);
    }, 11500);
  });

  /* ========== THEME (persisted) ========== */
  const themeToggle = $('#themeToggle');
  const themeIcon = $('#themeIcon');
  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    themeIcon.className = t === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    try { localStorage.setItem('vc-theme', t); } catch (e) { /* ignore storage errors */ }
  };
  try { applyTheme(localStorage.getItem('vc-theme') || 'dark'); } catch (e) { applyTheme('dark'); }
  themeToggle.addEventListener('click', () =>
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark')
  );

  /* ========== NAVIGATION ========== */
  const navbar = $('#navbar'), navMenu = $('#navMenu'), menuToggle = $('#menuToggle'), backdrop = $('#navBackdrop');
  const closeMenu = () => {
    navMenu.classList.remove('open');
    backdrop.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };
  menuToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    backdrop.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', open);
  });
  backdrop.addEventListener('click', closeMenu);
  $('#navClose').addEventListener('click', closeMenu);
  $$('.nav-menu a').forEach(a => a.addEventListener('click', closeMenu));

  const onScroll = debounce(() => {
    // Sticky style
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    // Active section highlight
    let current = '';
    $$('section[id]').forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    $$('.nav-menu a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
    // Back to top
    $('#backTop').classList.toggle('show', window.scrollY > 600);
    // Progress bar
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    $('#progressBar').style.width = (docH > 0 ? (window.scrollY / docH * 100) : 0) + '%';
  }, 20);
  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onScroll);

  $('#backTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Hero parallax
  const heroBg = $('#heroBg');
  window.addEventListener('scroll', debounce(() => {
    if (window.scrollY < window.innerHeight) heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }, 10));

  /* ========== CUSTOM CURSOR (desktop) ========== */
  const cDot = $('.cursor-dot'), cRing = $('.cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cDot.style.left = mx + 'px'; cDot.style.top = my + 'px';
  });
  const animCursor = () => {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    cRing.style.left = rx + 'px'; cRing.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
  };
  animCursor();
  // Use event delegation on body for cursor hover — catches dynamically rendered elements too
  document.body.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, input, select, textarea, .portfolio-item, .service-card, .value-card, .contact-card, .testimonial-nav, .filter-btn, .team-card, .team-socials a')) {
      cRing.classList.add('hover');
    }
  });
  document.body.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, input, select, textarea, .portfolio-item, .service-card, .value-card, .contact-card, .testimonial-nav, .filter-btn, .team-card, .team-socials a')) {
      cRing.classList.remove('hover');
    }
  });

  /* ========== ANIMATED COUNTERS ========== */
  const counters = $$('.stat-num');
  let countersStarted = false;
  function initCounters() {
    if (countersStarted) return; countersStarted = true;
    counters.forEach(el => {
      const tgt = parseInt(el.dataset.target, 10);
      let cur = 0; const step = Math.max(1, Math.ceil(tgt / 60));
      const tick = () => {
        cur += step;
        if (cur >= tgt) { el.textContent = tgt + '+'; return; }
        el.textContent = cur;
        requestAnimationFrame(tick);
      };
      tick();
    });
  }

  /* ========== SCROLL REVEAL ========== */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  $$('.reveal').forEach(el => revealObs.observe(el));

  const aboutSec = $('#about');
  if (aboutSec) {
    const ao = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { initCounters(); ao.disconnect(); } });
    }, { threshold: 0.3 });
    ao.observe(aboutSec);
  }

  /* ========== EVENT GALLERY DATA + RENDERING ==========
     Images served from Pexels CDN — entertainment-themed.
     To use your own images, replace any URL with 'assets/images/yourfile.jpg'
  ========================================================= */
  const PEX = 'https://images.pexels.com/photos/';
  const portfolioData = [
    { cat: 'concerts',   title: 'Stadium Concert Night',       img: PEX + '761543/pexels-photo-761543.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200' },
    { cat: 'concerts',   title: 'Band Live on Stage',          img: PEX + '2658312/pexels-photo-2658312.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200' },
    { cat: 'concerts',   title: 'Indoor Concert Experience',   img: PEX + '30215324/pexels-photo-30215324.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900' },
    { cat: 'corporate',  title: 'DJ Night Club Set',           img: PEX + '3696394/pexels-photo-3696394.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200' },
    { cat: 'concerts',   title: 'Festival Main Stage',         img: PEX + '14870726/pexels-photo-14870726.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900' },
    { cat: 'concerts',   title: 'Solo Artist Spotlight',       img: PEX + '14017606/pexels-photo-14017606.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200' },
    { cat: 'weddings',   title: 'Keyboard & Mic Setup',        img: PEX + '19452359/pexels-photo-19452359.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900' },
    { cat: 'corporate',  title: 'Sound Engineering Live',      img: PEX + '33565506/pexels-photo-33565506.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200' },
    { cat: 'corporate',  title: 'Mixing Console Operations',   img: PEX + '2952834/pexels-photo-2952834.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900' },
    { cat: 'church',     title: 'Jazz Ensemble Performance',   img: PEX + '8040838/pexels-photo-8040838.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200' },
    { cat: 'weddings',   title: 'Outdoor DJ Setup',            img: PEX + '12473542/pexels-photo-12473542.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200' },
    { cat: 'weddings',   title: 'Crowd Energy at Night',       img: PEX + '1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900' },
    { cat: 'studio',     title: 'Studio Microphone Close-Up',  img: PEX + '12564395/pexels-photo-12564395.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200' },
    { cat: 'studio',     title: 'Professional Recording',      img: PEX + '4001269/pexels-photo-4001269.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900' },
    { cat: 'studio',     title: 'B&W Studio Session',          img: PEX + '16497546/pexels-photo-16497546.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200' },
    { cat: 'church',     title: 'Vocal Recording Session',     img: PEX + '7086289/pexels-photo-7086289.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200' }
  ];

  const grid = $('#portfolioGrid');
  let currentSet = portfolioData;
  const renderPortfolio = (filter = 'all') => {
    currentSet = filter === 'all' ? portfolioData : portfolioData.filter(p => p.cat === filter);
    grid.innerHTML = currentSet.map((p, i) => `
      <a class="portfolio-item" href="${sanitize(p.img)}" data-idx="${i}" data-cat="${sanitize(p.cat)}" data-title="${sanitize(p.title)}">
        <img src="${sanitize(p.img)}" alt="${sanitize(p.title)} - Elite Entertainment event" loading="lazy" />
        <div class="portfolio-overlay">
          <div><span class="portfolio-cat">${sanitize(p.cat)}</span><div class="portfolio-title">${sanitize(p.title)}</div></div>
          <span class="portfolio-view-icon"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>
        </div>
      </a>`).join('');
    $$('.portfolio-item', grid).forEach(el => el.addEventListener('click', (ev) => {
      ev.preventDefault(); openLightbox(parseInt(el.dataset.idx));
    }));
  };
  renderPortfolio();

  $$('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderPortfolio(btn.dataset.filter);
  }));

  /* ========== LIGHTBOX ========== */
  const lb = $('#lightbox'), lbImg = $('#lbImage'), lbCap = $('#lbCaption'), lbCnt = $('#lbCounter');
  let lbIdx = 0;
  function openLightbox(i) {
    lbIdx = ((i % currentSet.length) + currentSet.length) % currentSet.length;
    lbImg.src = currentSet[lbIdx].img;
    lbImg.alt = currentSet[lbIdx].title;
    lbCap.textContent = currentSet[lbIdx].title;
    lbCnt.textContent = `${lbIdx + 1} / ${currentSet.length}`;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  $('#lbClose').addEventListener('click', closeLightbox);
  $('#lbPrev').addEventListener('click', (e) => { e.stopPropagation(); openLightbox(lbIdx - 1); });
  $('#lbNext').addEventListener('click', (e) => { e.stopPropagation(); openLightbox(lbIdx + 1); });
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(lbIdx - 1);
    if (e.key === 'ArrowRight') openLightbox(lbIdx + 1);
  });

 /* ========== LEADERSHIP TEAM ========== */

// Team Photos
const directorPhoto = './assets/images/director.jpeg';
const managerPhoto = './assets/images/manager.png';
const ambassadorPhoto = './assets/images/ambassador.jpeg';

const teamData = [
  {
    name: 'Raphael Edem',
    position: 'Director of Operations',
    badge: 'Director',
    photo: directorPhoto,
    bio: 'Oversees event logistics, vendor coordination, and operational strategy to ensure every show runs flawlessly.',
    email: 'director@eliteentertainment.com',
    social: { facebook: '#', twitter: '#', instagram: '#' }
  },
  {
    name: 'Patience Etim',
    position: 'Manager',
    badge: 'Manager',
    photo: managerPhoto,
    bio: 'Leads musical arrangements, rehearsals, and live performance quality across all band engagements and studio sessions.',
    email: 'manager@eliteentertainment.com',
    social: { facebook: '#', twitter: '#', instagram: '#' }
  },
  {
    name: 'Jacinta Akpan',
    position: 'Ambassador & Partnerships',
    badge: 'Ambassador',
    photo: ambassadorPhoto,
    bio: 'Drives financial planning, contract negotiations, and revenue strategy to sustain long-term organizational growth.',
    email: 'ambassador@eliteentertainment.com',
    social: { facebook: '#', twitter: '#', instagram: '#' }
  }
];


const teamGrid = $('#teamGrid');
teamGrid.innerHTML = teamData.map((m, i) => {
  const delay = i % 3;

  const socialHtml = (platform, icon, label) =>
    m.social[platform]
      ? `<a href="${sanitize(m.social[platform])}" target="_blank" rel="noopener noreferrer" aria-label="${label}" data-tooltip="${label}"><i class="fa-brands fa-${icon}"></i></a>`
      : '';

  return `
    <article class="team-card reveal${delay ? ' reveal-delay-' + delay : ''}" aria-label="${sanitize(m.name)}, ${sanitize(m.position)}">
      <div class="team-photo">
        <img src="${sanitize(m.photo)}" alt="${sanitize(m.name)} — ${sanitize(m.position)}, Elite Entertainment" loading="lazy" />
        <span class="team-role-badge">${sanitize(m.badge)}</span>
      </div>

      <div class="team-body">
        <h3 class="team-name">${sanitize(m.name)}</h3>
        <div class="team-position">${sanitize(m.position)}</div>

        <p class="team-bio">${sanitize(m.bio)}</p>

        <div class="team-footer">
          <div class="team-socials">
            <a href="mailto:${sanitize(m.email)}" aria-label="Email ${sanitize(m.name)}" data-tooltip="Email">
              <i class="fa-solid fa-envelope"></i>
            </a>

            ${socialHtml('facebook', 'facebook-f', 'Facebook')}
            ${socialHtml('twitter', 'x-twitter', 'X / Twitter')}
            ${socialHtml('instagram', 'instagram', 'Instagram')}
          </div>

          <span class="team-contact-label">Connect</span>
        </div>
      </div>
    </article>
  `;
}).join('');

  // Register team cards for scroll reveal
  $$('.team-card.reveal').forEach(el => revealObs.observe(el));

  /* ========== TESTIMONIALS CAROUSEL ========== */
  const testimonials = [
    { name: 'Chief Okon E.', company: 'Event Host', text: 'Elite Entertainment transformed our annual gala into something extraordinary. The live band had everyone on their feet, and the sound quality was absolutely flawless. Unmatched professionalism!', initials: 'OE' },
    { name: 'Dr. Mrs. Amara O.', company: 'Wedding Client', text: 'Our wedding was a dream come true thanks to Elite Entertainment. From the ceremony music to the reception party — every moment was perfect. Our guests still talk about it!', initials: 'AO' },
    { name: 'Pastor Musa Ibrahim', company: 'Christ Embassy', text: 'The musical ministration at our annual convention was heavenly. Elite Entertainment brought anointing, excellence, and technical precision that truly elevated our worship experience.', initials: 'MI' },
    { name: 'Mrs. Funmilayo A.', company: 'Private Client', text: 'We hired Elite Entertainment for my husband\'s 50th birthday and they delivered a show-stopping experience. The DJ, MC, and live band coordination was seamless. Simply world-class!', initials: 'FA' },
    { name: 'Hon. Commissioner', company: 'State Government', text: 'Elite Entertainment produced our state cultural festival with the professionalism of an international firm. They are a credit to Nigeria\'s entertainment industry and a benchmark for excellence.', initials: 'HC' }
  ];
  const track = $('#testimonialsTrack'), dotsC = $('#testimonialDots');
  let tIndex = 0;
  track.innerHTML = testimonials.map(t => `
    <div class="testimonial-card">
      <div class="testimonial-quote">"</div>
      <div class="testimonial-stars">${'★'.repeat(5)}</div>
      <p class="testimonial-text">${sanitize(t.text)}</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${sanitize(t.initials)}</div>
        <div><div class="testimonial-name">${sanitize(t.name)}</div><div class="testimonial-company">${sanitize(t.company)}</div></div>
      </div>
    </div>`).join('');
  dotsC.innerHTML = testimonials.map((_, i) => `<button data-i="${i}" aria-label="Go to testimonial ${i + 1}"></button>`).join('');
  const dots = $$('button', dotsC);
  const goT = (i) => {
    tIndex = ((i % testimonials.length) + testimonials.length) % testimonials.length;
    track.style.transform = `translateX(-${tIndex * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === tIndex));
  };
  dots.forEach(d => d.addEventListener('click', () => goT(parseInt(d.dataset.i))));
  $('#tPrev').addEventListener('click', () => goT(tIndex - 1));
  $('#tNext').addEventListener('click', () => goT(tIndex + 1));
  goT(0);
  let autoT = setInterval(() => goT(tIndex + 1), 7000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoT));
  track.parentElement.addEventListener('mouseleave', () => { autoT = setInterval(() => goT(tIndex + 1), 7000); });

  /* ========== BOOKING FORM (WhatsApp redirect) ========== */
  const bookingForm = $('#bookingForm');
  const setFieldState = (field, isValid) => {
    field.classList.toggle('valid', isValid);
    field.classList.toggle('error', !isValid);
  };
  ['bName', 'bPhone', 'bEmail', 'bType'].forEach(id => {
    const f = $('#' + id);
    f.addEventListener('blur', () => {
      if (!f.value.trim()) { f.classList.remove('valid', 'error'); return; }
      if (id === 'bEmail') setFieldState(f, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
      else setFieldState(f, f.value.trim().length >= 2);
    });
  });

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#bName').value.trim();
    const phone = $('#bPhone').value.trim();
    const email = $('#bEmail').value.trim();
    const type = $('#bType').value;
    const budget = $('#bBudget').value;
    const date = $('#bDate').value;
    const msg = $('#bMsg').value.trim();

    if (!name || !phone || !email || !type) { toast('Please fill in all required fields marked with *', 'error'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast('Please enter a valid email address', 'error'); return; }
    if (phone.length < 7) { toast('Please enter a valid phone number', 'error'); return; }

    const text =
`*NEW EVENT BOOKING — ELITE ENTERTAINMENT*

*Name:* ${name}
*Phone:* ${phone}
*Email:* ${email}
*Event Type:* ${type}
*Budget Range:* ${budget || 'Not specified'}
*Event Date:* ${date || 'Not specified'}

*Details:*
${msg || 'No additional details provided.'}

— Submitted via eliteentertainment.com`;

    window.open(`https://wa.me/2340000000000?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    toast('Redirecting you to WhatsApp...', 'success');
    bookingForm.reset();
    $$('.valid, .error', bookingForm).forEach(el => el.classList.remove('valid', 'error'));
  });

  /* ========== AI CHATBOT ========== */
  const chatPanel = $('#chatbotPanel'), chatToggle = $('#chatbotToggle'), chatClose = $('#chatbotClose');
  const chatMessages = $('#chatMessages'), chatForm = $('#chatForm'), chatInput = $('#chatInput');

  let openedOnce = false;

  /* ==========================================================================
     ELITE ENTERTAINMENT — AI KNOWLEDGE BASE & CONVERSATIONAL ENGINE
     A modular, intent-based NLU system with context awareness, fuzzy matching,
     and natural conversational flow for a premium brand assistant.
     ========================================================================== */

  // --- Company Knowledge ---
  const COMPANY = {
    name: 'Elite Entertainment',
    tagline: 'Crafting unforgettable moments through world-class live entertainment.',
    founded: '2009',
    hq: 'Nung Ikono Ufok, Uruan L.G.A., Akwa Ibom State, Uyo, Nigeria',
    email: 'info@eliteentertainment.com',
    hours: 'Mon–Fri 8:00 AM – 6:00 PM, Sat 9:00 AM – 2:00 PM (WAT)',
    whatsapp: 'Available 24/7 via the green button on screen',
    services: [
      'Live Band Performance', 'Concert Production', 'Wedding Entertainment',
      'Corporate Events', 'Church Programs', 'DJ & MC Services',
      'Instrument Rentals', 'Sound Engineering'
    ],
    values: ['Passion', 'Integrity', 'Excellence', 'Innovation'],
    mission: 'To deliver unforgettable entertainment experiences through artistic mastery, technical precision, and unwavering client partnership.',
    vision: 'To be Africa\'s most sought-after entertainment brand, setting global standards in live performance, event production, and musical excellence.',
    team: [
      { name: 'Adaeze Okonkwo', role: 'Director of Operations' },
      { name: 'Emeka Nwachukwu', role: 'Music Director' },
      { name: 'Uduak Essien', role: 'Director of Finance' },
      { name: 'Ngozi Ibe', role: 'Marketing Manager' },
      { name: 'Ifeanyi Chukwuemeka', role: 'Talent & HR Manager' },
      { name: 'Aniekan Udoh', role: 'Business Development Manager' }
    ],
    portfolio: '500+ events delivered across concerts, weddings, corporate galas, church programs, and private celebrations.',
    pricing: 'Negotiable — tailored to each event\'s scope, venue, and entertainment requirements. Book a free consultation for a personalized quote.'
  };

  // --- Intent Definitions (priority-ordered) ---
  // Each intent: { id, patterns (regex-friendly), respond (function or string) }
  const INTENTS = [
    // --- Greetings ---
    {
      id: 'greeting',
      patterns: [/^(hi|hey|hello|howdy|sup|yo)$/i, /good\s*(morning|afternoon|evening|day)/i, /how\s*(are|r)\s*(you|u)/i, /what'?s\s*up/i, /nice\s*to\s*meet/i, /greetings/i, /welcome/i],
      responses: [
        `Hello! 👋 Welcome to ${COMPANY.name}. I'm your AI assistant — here to help with anything you need. What can I do for you today?`,
        `Hi there! Great to have you here. I can help with our services, pricing, booking, or answer any questions about ${COMPANY.name}. How can I assist?`,
        `Hey! 😊 Welcome to ${COMPANY.name}. Feel free to ask me anything — services, projects, pricing, or booking. I'm here for you!`
      ]
    },
    // --- Identity ---
    {
      id: 'identity',
      patterns: [/who\s*(are|r)\s*(you|u)/i, /what\s*(are|r)\s*(you|u)/i, /your\s*name/i, /introduce\s*yourself/i, /tell\s*me\s*about\s*you/i],
      responses: [
        `I'm Elite AI — the official digital assistant for ${COMPANY.name}. I'm here 24/7 to answer your questions about our services, team, pricing, and projects. Think of me as your first point of contact! 🤖`,
        `I'm the ${COMPANY.name} AI assistant. I have deep knowledge of our company, services, and team. Ask me anything, and if I can't help, I'll connect you with a human consultant.`
      ]
    },
    // --- About Company ---
    {
      id: 'about',
      patterns: [/about\s*(the\s*)?(company|elite|you guys|your\s*company)/i, /tell\s*me\s*about/i, /what\s*(is|does)\s*elite/i, /company\s*(info|profile|overview)/i, /who\s*is\s*elite/i],
      responses: [
        `${COMPANY.name} is a premier music and event entertainment company based in ${COMPANY.hq}. Founded in ${COMPANY.founded}, we specialize in delivering world-class live performances, full-scale event production, and premium entertainment services. We serve clients across Nigeria and West Africa.`
      ]
    },
    // --- Mission & Vision ---
    {
      id: 'mission_vision',
      patterns: [/mission/i, /vision/i, /core\s*value/i, /what\s*do\s*you\s*stand\s*for/i, /values/i, /believe\s*in/i, /purpose/i],
      responses: [
        `Our Mission: ${COMPANY.mission}\n\nOur Vision: ${COMPANY.vision}\n\nCore Values: ${COMPANY.values.join(', ')}.`
      ]
    },
    // --- Services ---
    {
      id: 'services',
      patterns: [/service/i, /what\s*do\s*you\s*(do|offer)/i, /offer/i, /expertise/i, /specializ/i, /can\s*you\s*help\s*with/i, /what\s*kind/i, /capabilities/i],
      responses: [
        `${COMPANY.name} offers 8 premium services:\n\n• ${COMPANY.services.join('\n• ')}\n\nEach service is delivered by seasoned professionals. Would you like details on any specific one?`,
        `We specialize in: ${COMPANY.services.join(', ')}. All services are tailored to your unique vision. Scroll to our Services section for full details, or ask me about any specific service!`
      ]
    },
    // --- Individual Services ---
    {
      id: 'service_liveband',
      patterns: [/live\s*band/i, /band\s*perform/i, /live\s*music/i, /musician/i, /play\s*at/i],
      responses: [`Our Live Band delivers electrifying performances across jazz, highlife, gospel, afrobeats, and more. Whether it's an intimate gathering or a massive stage — we bring the energy. Ready to book?`]
    },
    {
      id: 'service_concert',
      patterns: [/concert/i, /show\s*produc/i, /stage\s*design/i, /festival/i, /live\s*show/i],
      responses: [`Our Concert Production covers everything — stage design, sound engineering, lighting, artist coordination, and full audience experience management. From 100 to 10,000 guests, we deliver world-class shows.`]
    },
    {
      id: 'service_wedding',
      patterns: [/wedding/i, /bride/i, /groom/i, /reception/i, /ceremony\s*music/i, /nuptial/i],
      responses: [`Our Wedding Entertainment packages include ceremony hymns, cocktail jazz, reception party sets, and after-party DJ. We make your special day unforgettable with music tailored to your love story! 💒🎶`]
    },
    {
      id: 'service_corporate',
      patterns: [/corporate/i, /conference/i, /gala/i, /product\s*launch/i, /company\s*event/i, /annual\s*dinner/i],
      responses: [`We provide professional entertainment for corporate events — conferences, product launches, gala dinners, award ceremonies, and team celebrations. Polished, engaging, and always on brand.`]
    },
    {
      id: 'service_church',
      patterns: [/church/i, /worship/i, /gospel/i, /crusade/i, /convention/i, /minister/i, /praise/i],
      responses: [`We provide anointed musical ministration and full instrument support for church programs — crusades, conventions, worship nights, and special services. Our team brings excellence to every altar call.`]
    },
    {
      id: 'service_dj',
      patterns: [/dj/i, /mc/i, /disc\s*jockey/i, /emcee/i, /master\s*of\s*ceremon/i],
      responses: [`Our professional DJs and MCs read the room, control the energy, and deliver seamless event flow. From playlist curation to live mixing and audience engagement — we keep the party going!`]
    },
    {
      id: 'service_rental',
      patterns: [/rent/i, /hire\s*(instrument|equipment)/i, /instrument/i, /keyboard/i, /drum/i, /guitar/i, /pa\s*system/i, /sound\s*equipment/i, /speaker/i, /amplifier/i],
      responses: [`We rent premium instruments and sound equipment — keyboards, drum kits, guitars, PA systems, speakers, amplifiers, and full stage setups. Delivery, setup, and technical support included! 🎸🥁`]
    },
    {
      id: 'service_sound',
      patterns: [/sound\s*engineer/i, /audio/i, /mixing/i, /sound\s*design/i, /acoust/i, /recording/i],
      responses: [`Our Sound Engineering team delivers crystal-clear audio at every venue. We handle live mixing, sound design, recording, and full PA management. Your audience hears perfection.`]
    },
    // --- Pricing ---
    {
      id: 'pricing',
      patterns: [/pric/i, /cost/i, /budget/i, /how\s*much/i, /rate/i, /fee/i, /negotiab/i, /afford/i, /expensive/i, /cheap/i, /charge/i, /pay/i, /invest/i, /quote/i, /estimate/i],
      responses: [
        `${COMPANY.pricing}\n\nScroll to the Booking section to submit your project details — our team will respond within 24 hours with a tailored proposal.`,
        `Our pricing is flexible and negotiable. Every project is unique, so we provide custom quotes based on scope, size, and timeline. Book a free consultation to get started — no commitment required!`
      ]
    },
    // --- Booking ---
    {
      id: 'booking',
      patterns: [/book/i, /consult(ation)?/i, /appointment/i, /schedule/i, /how\s*(do|can)\s*(i|we)\s*(book|start|begin)/i, /get\s*started/i, /begin\s*a\s*project/i, /hire/i, /engage/i],
      responses: [
        `Booking is easy! Scroll to the Booking section on our website, fill in your project details (name, phone, email, project type, budget range), and tap Submit. Your message goes directly to our WhatsApp for instant confirmation. We respond within 24 hours!`,
        `Ready to start? Head to the Booking section below, fill in the form, and we'll connect you with a dedicated event coordinator within 24 hours. It's free, confidential, and no-obligation.`
      ]
    },
    // --- Location ---
    {
      id: 'location',
      patterns: [/locat/i, /address/i, /where\s*(are|is|r)/i, /office/i, /direction/i, /find\s*you/i, /visit/i, /hq/i, /headquarter/i, /based/i, /situated/i],
      responses: [
        `We're headquartered at ${COMPANY.hq}. We serve clients across Nigeria and West Africa. You can visit us during business hours or connect via WhatsApp anytime!`,
        `Our office is at ${COMPANY.hq}. Feel free to visit, or reach out via WhatsApp or email for remote consultations — we work with clients worldwide!`
      ]
    },
    // --- Contact ---
    {
      id: 'contact',
      patterns: [/contact/i, /reach/i, /phone/i, /call/i, /whatsapp/i, /email/i, /get\s*in\s*touch/i, /speak\s*to/i, /talk\s*to/i, /connect/i, /message/i, /dm/i, /chat\s*with/i, /support/i],
      responses: [
        `You can reach ${COMPANY.name} through:\n\n📱 WhatsApp — tap the green button on screen (24/7)\n📧 Email — ${COMPANY.email}\n📍 Visit — ${COMPANY.hq}\n\nBusiness hours: ${COMPANY.hours}`,
        `The fastest way is WhatsApp — just tap the green floating button! You can also email us at ${COMPANY.email} or visit our office during business hours.`
      ]
    },
    // --- Business Hours ---
    {
      id: 'hours',
      patterns: [/hour/i, /open/i, /close/i, /when\s*(are|do|is)/i, /working\s*(hour|day|time)/i, /business\s*(hour|day|time)/i, /available/i, /schedule/i, /timing/i],
      responses: [
        `Our business hours are: ${COMPANY.hours}. WhatsApp is monitored 24/7 for urgent inquiries, so feel free to reach out anytime!`
      ]
    },
    // --- CEO / Leadership ---
    {
      id: 'ceo',
      patterns: [/ceo/i, /founder/i, /principal/i, /who\s*(runs|leads|owns|started|founded)/i, /chief\s*exec/i],
      responses: [
        `Our CEO and Founder is an accomplished musician, band leader, and event strategist with 20+ years in the entertainment industry. They founded ${COMPANY.name} to redefine Africa's entertainment landscape. Scroll to the CEO section for their full profile and leadership message.`
      ]
    },
    // --- Team ---
    {
      id: 'team',
      patterns: [/team/i, /director/i, /manager/i, /staff/i, /people/i, /member/i, /employee/i, /who\s*works/i, /leadership/i, /executive/i],
      responses: [
        `Our leadership team includes:\n\n${COMPANY.team.map(t => `• ${t.name} — ${t.role}`).join('\n')}\n\nVisit the Team section to see their full profiles, bios, and social links. Would you like to know more about a specific team member?`
      ]
    },
    // --- Gallery / Portfolio ---
    {
      id: 'portfolio',
      patterns: [/portfolio/i, /project/i, /work/i, /gallery/i, /previous/i, /past\s*work/i, /showcase/i, /example/i, /case\s*stud/i, /completed/i, /sample/i, /show\s*me/i, /photo/i, /picture/i, /video/i],
      responses: [
        `Explore our Gallery section for highlights from ${COMPANY.portfolio} Use the filter buttons to browse by category — Concerts, Weddings, Corporate, Church, or Studio. Click any image for a full-screen preview!`,
        `We've delivered ${COMPANY.portfolio} Scroll to the Gallery section to see highlights. Filter by event type and click for a lightbox preview!`
      ]
    },
    // --- Website Navigation Help ---
    {
      id: 'navigate',
      patterns: [/where\s*(can|do)\s*i\s*find/i, /how\s*(do|can)\s*i\s*(navigate|find|get\s*to)/i, /take\s*me\s*to/i, /show\s*me\s*(the|where)/i, /looking\s*for/i, /need\s*help\s*(finding|with\s*the)/i],
      responses: [
        `I can help you find anything! Our website sections:\n\n🏠 Home — overview\n📖 About — our story & values\n🎵 Services — all 8 entertainment services\n🖼️ Gallery — event highlights\n👔 CEO — executive profile\n👥 Team — leadership profiles\n💬 Testimonials — client reviews\n📋 Booking — event booking form\n📍 Contact — all contact info\n\nJust scroll or click any nav link!`
      ]
    },
    // --- How are you ---
    {
      id: 'how_are_you',
      patterns: [/how\s*(are|r)\s*(you|u)/i, /how\s*(you|u)\s*doing/i, /how\s*is\s*it\s*going/i, /what'?s\s*up/i, /how\s*do\s*you\s*do/i],
      responses: [
        `I'm doing great, thank you for asking! 😊 I'm here and ready to help with anything you need. What can I assist you with?`,
        `All good here! I'm ready to help you explore ${COMPANY.name}'s services. What's on your mind?`
      ]
    },
    // --- Thanks ---
    {
      id: 'thanks',
      patterns: [/thank/i, /thanks/i, /thx/i, /cheers/i, /appreciate/i, /grateful/i, /much\s*obliged/i],
      responses: [
        `You're very welcome! 😊 Happy to help. Is there anything else you'd like to know about ${COMPANY.name}?`,
        `My pleasure! Don't hesitate to ask if you need anything else. I'm here for you!`,
        `Glad I could help! Feel free to reach out anytime — whether here or via WhatsApp. 💙`
      ]
    },
    // --- Goodbye ---
    {
      id: 'goodbye',
      patterns: [/bye/i, /goodbye/i, /see\s*(you|ya)/i, /take\s*care/i, /have\s*a\s*(nice|good|great)/i, /good\s*night/i, /later/i, /gtg/i, /gotta\s*go/i, /talk\s*later/i],
      responses: [
        `Goodbye! 👋 It was great chatting. Remember, you can reach us anytime via WhatsApp or come back here. Have a wonderful day!`,
        `Take care! Thanks for visiting ${COMPANY.name}. We're here whenever you need us. See you soon! 😊`,
        `Bye for now! Don't hesitate to return if you have more questions. Wishing you a great day ahead! 🏗️`
      ]
    },
    // --- Compliments ---
    {
      id: 'compliment',
      patterns: [/nice\s*(website|site|page|design)/i, /beautiful/i, /impressive/i, /love\s*(it|this|the)/i, /amazing/i, /great\s*(job|work|site|website)/i, /looks?\s*(great|good|amazing|awesome|nice|beautiful)/i, /well\s*done/i, /cool/i, /awesome/i],
      responses: [
        `Thank you so much! 💙 We're glad you like it. Our team pours passion into everything we do — from our projects to this website. Is there anything specific you'd like to explore?`,
        `That means a lot — thank you! The same attention to detail we put into this site goes into every architectural project. Would you like to see our portfolio?`
      ]
    },
    // --- Sorry / Excuse me ---
    {
      id: 'apology',
      patterns: [/sorry/i, /excuse\s*me/i, /pardon/i, /my\s*bad/i, /apologize/i, /oops/i],
      responses: [
        `No need to apologize at all! 😊 How can I help you today?`,
        `No worries! I'm here to help. What would you like to know about ${COMPANY.name}?`
      ]
    },
    // --- Joke / Fun ---
    {
      id: 'fun',
      patterns: [/joke/i, /funny/i, /make\s*me\s*laugh/i, /tell\s*me\s*something/i, /bored/i, /entertain/i],
      responses: [
        `Here's one: Why do architects make great friends? Because they always have the best foundations for relationships! 😄🏗️ Now, can I help you with something?`,
        `I'm better at architecture than comedy, but here goes: What did the wall say to the other wall? "I'll meet you at the corner!" 😄 How can I actually help you today?`
      ]
    },
    // --- Human Agent / Escalation ---
    {
      id: 'human',
      patterns: [/human/i, /real\s*person/i, /speak\s*to\s*(someone|a\s*person|agent|rep)/i, /live\s*chat/i, /customer\s*service/i, /representative/i, /not\s*a\s*(bot|robot)/i, /escalate/i, /complain/i, /complaint/i, /issue/i, /problem/i],
      responses: [
        `I understand you'd like to speak with a human team member. You can reach our team instantly via:\n\n📱 WhatsApp — tap the green button (24/7)\n📧 Email — ${COMPANY.email}\n\nA consultant will respond within 24 hours during business hours. Is there anything else I can help with in the meantime?`
      ]
    },
    // --- Privacy / Policy ---
    {
      id: 'policy',
      patterns: [/privac/i, /policy/i, /terms/i, /data\s*protect/i, /gdpr/i, /confiden/i, /secure/i, /safe/i],
      responses: [
        `${COMPANY.name} takes privacy seriously. All project details shared through our booking form and consultations are treated with absolute discretion. NDA coverage is available on request. Check the Privacy Policy and Terms of Service links in our footer for full details.`
      ]
    },
    // --- Careers ---
    {
      id: 'careers',
      patterns: [/career/i, /job/i, /hiring/i, /vacanc/i, /recruit/i, /work\s*(for|with|at)\s*(you|elite)/i, /employ/i, /intern/i, /position/i, /opening/i, /audition/i, /join\s*(the|your)/i],
      responses: [
        `Interested in joining ${COMPANY.name}? We're always looking for talented musicians, sound engineers, DJs, MCs, and event professionals. Send your CV and demo reel to ${COMPANY.email} with "Career Inquiry" in the subject line!`
      ]
    },
    // --- Music / Genre ---
    {
      id: 'music_genre',
      patterns: [/genre/i, /type\s*of\s*music/i, /what\s*music/i, /play\s*what/i, /style/i, /jazz/i, /afrobeat/i, /highlife/i, /hip\s*hop/i, /r&b/i, /reggae/i, /pop/i, /classical/i],
      responses: [
        `Our musicians are versatile! We perform across genres: Jazz, Highlife, Afrobeats, Gospel, R&B, Pop, Classical, Hip-Hop, Reggae, and contemporary fusions. We'll match the perfect vibe to your event. 🎵`
      ]
    }
  ];

  // --- Conversation Context ---
  let lastIntent = null;
  let turnCount = 0;

  /**
   * NLU Engine — matches user input against intent patterns using regex.
   * Supports fuzzy-like matching via broad regex patterns.
   * Returns a random response from the matched intent for variety.
   */
  const getReply = (userText) => {
    const input = userText.trim().toLowerCase();
    turnCount++;

    // Empty input guard
    if (!input) return "I didn't catch that. Could you rephrase your question?";

    // Try intent matching
    for (const intent of INTENTS) {
      for (const pattern of intent.patterns) {
        if (pattern.test(input)) {
          lastIntent = intent.id;
          const responses = intent.responses;
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }

    // --- Contextual follow-up (if no direct match) ---
    if (lastIntent === 'services' && /yes|sure|ok|tell|more|detail/i.test(input)) {
      return `Which service interests you most? We offer: ${COMPANY.services.join(', ')}. Just name one and I'll give you the details!`;
    }
    if (lastIntent === 'pricing' && /yes|ok|sure|let'?s|start/i.test(input)) {
      return `Wonderful! Scroll to the Booking section below and fill in your project details. Our team will respond within 24 hours with a custom quote. 📋`;
    }
    if (lastIntent === 'portfolio' && /yes|sure|show|see/i.test(input)) {
      return `Scroll down to the Portfolio section — you can filter projects by category (Residential, Commercial, Interior, Exterior, Landscape, Urban) and click any image for a full-screen preview! 🖼️`;
    }

    // --- Fallback with personality ---
    const fallbacks = [
      `That's a great question! I want to make sure I give you accurate information. For detailed help, tap the WhatsApp button to chat with our team directly, or submit a booking form for a personal consultation.`,
      `I appreciate your question! While I may not have the specific answer right now, our team can definitely help. Reach out via WhatsApp (green button) or email ${COMPANY.email} — they respond within 24 hours.`,
      `Hmm, I'm not 100% sure about that one. I'd rather connect you with the right person than give you incorrect info. Try our WhatsApp for instant help, or I can assist with services, pricing, booking, or company info!`
    ];
    lastIntent = null;
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  /* --- Message rendering --- */
  const addMsg = (text, sender = 'bot') => {
    const d = document.createElement('div');
    d.className = 'msg msg-' + sender;
    d.textContent = text;
    chatMessages.appendChild(d);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };
  const showTyping = () => {
    const d = document.createElement('div');
    d.className = 'msg msg-bot'; d.id = 'typing';
    d.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
    chatMessages.appendChild(d); chatMessages.scrollTop = chatMessages.scrollHeight;
  };
  const removeTyping = () => { const t = $('#typing'); if (t) t.remove(); };

  const handleMsg = (text) => {
    if (!text.trim()) return;
    addMsg(text, 'user');
    showTyping();
    // Variable delay based on response length for natural feel
    const reply = getReply(text);
    const delay = Math.min(600 + reply.length * 4, 2000);
    setTimeout(() => { removeTyping(); addMsg(reply, 'bot'); }, delay);
  };

  // Welcome sequence
  setTimeout(() => {
    addMsg(`Hello! 👋 I'm Elite AI — your personal assistant for ${COMPANY.name}.`, 'bot');
    setTimeout(() => addMsg("I can help with services, pricing, booking, portfolio, team info, and more. Try the quick options below or just type your question!", 'bot'), 800);
  }, 600);

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = chatInput.value.trim(); chatInput.value = '';
    handleMsg(v);
  });
  $('#chatQuick').addEventListener('click', (e) => { if (e.target.matches('button')) handleMsg(e.target.dataset.q); });
  /* --- Chatbot open/close with full interface lock --- */
  const chatOverlay = $('#chatbotOverlay');
  let chatTriggerEl = null; // stores the element that opened the chatbot for focus restoration

  const openChat = () => {
    chatPanel.classList.add('open');
    chatOverlay.classList.add('active');
    document.body.classList.add('chatbot-locked');
    chatTriggerEl = document.activeElement;
    // Focus the input after transition
    setTimeout(() => chatInput.focus(), 380);
    if (!openedOnce) { $('.notif-dot', chatToggle).style.display = 'none'; openedOnce = true; }
  };

  const closeChat = () => {
    chatPanel.classList.remove('open');
    chatOverlay.classList.remove('active');
    document.body.classList.remove('chatbot-locked');
    // Restore focus to the element that opened the chatbot
    if (chatTriggerEl && chatTriggerEl.focus) {
      setTimeout(() => chatTriggerEl.focus(), 50);
      chatTriggerEl = null;
    }
  };

  const toggleChat = () => {
    chatPanel.classList.contains('open') ? closeChat() : openChat();
  };

  chatToggle.addEventListener('click', toggleChat);
  chatClose.addEventListener('click', closeChat);
  chatOverlay.addEventListener('click', closeChat);

  // Keyboard focus trap inside chatbot panel when open
  chatPanel.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = $$('button, input, a, [tabindex]:not([tabindex="-1"])', chatPanel);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ========== MISC ========== */
  $('#yr').textContent = new Date().getFullYear();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      if (chatPanel.classList.contains('open')) closeChat();
      closeLightbox();
    }
  });

  console.log('%c ELITE ENTERTAINMENT ', 'background:#3b82f6;color:#fff;font-size:14px;font-weight:bold;padding:6px 10px;border-radius:3px;');
  console.log('%c Developed by Jalixon — https://jalixon.vercel.app/ ', 'color:#3b82f6;font-size:11px;');
})();
