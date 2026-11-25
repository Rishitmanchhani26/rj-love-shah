/* RJ Love Shah – homepage script (deferred). GSAP + ScrollTrigger are optional enhancements. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = matchMedia('(min-width: 960px)');
  const WA = '917383972757';

  /* ---------- header, rail, action bar ---------- */
  const header = $('[data-header]');
  const railFill = $('[data-rail]');
  const railMic = $('[data-rail-mic]');
  const bar = $('.action-bar');
  const contact = $('#contact');
  const heroActions = $('.cover__actions');
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, y / max) : 0;
    railFill.style.height = `${p * 100}%`;
    railMic.style.top = `${p * 100}%`;
    if (contact && bar) {
      const r = contact.getBoundingClientRect();
      // hidden while the hero's own Book / Watch buttons are still on screen, and again at the booking form
      const heroBtns = heroActions ? heroActions.getBoundingClientRect().bottom > 0 : false;
      bar.classList.toggle('is-hidden', heroBtns || (r.top < innerHeight * 0.6 && r.bottom > 0));
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- hero: two photos (live shows / corporate) slowly crossfade ---------- */
  const slideWrap = $('[data-hero-slides]');
  if (slideWrap && !reduceMotion) {
    const slides = $$('.hero__slide', slideWrap);
    const HOLD = 5000; // ms each photo stays on screen
    let i = 0, timer = null;
    const cuts = $$('.hero__cut', $('[data-hero-cuts]') || document.createElement('div'));
    const show = (n) => { i = n % slides.length; [slides, cuts].forEach((set) => set.forEach((s, k) => s.classList.toggle('is-active', k === i))); };
    const start = () => { stop(); timer = setInterval(() => show(i + 1), HOLD); };
    const stop = () => { clearInterval(timer); timer = null; };
    // only rotate while the hero is on screen and the tab is visible
    let heroVisible = true;
    new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; heroVisible && !document.hidden ? start() : stop(); }).observe($('.hero'));
    document.addEventListener('visibilitychange', () => { !document.hidden && heroVisible ? start() : stop(); });
    // load the second photo once the page has settled, so the first paint stays fast
    addEventListener('load', () => { slides.forEach((s) => { const img = s.querySelector('img'); if (img) img.loading = 'eager'; }); cuts.forEach((img) => { img.loading = 'eager'; }); });
    start();
  }

  /* ---------- Reliance Navratri reel: silent teaser loops while on screen; the button opens the full video in the popup ---------- */
  const rnav = $('[data-rnav]');
  if (rnav && !reduceMotion) {
    const teaser = $('[data-rnav-teaser]', rnav);
    const popup = $('[data-modal]');
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !popup.open) { teaser.preload = 'auto'; teaser.play().catch(() => {}); } else teaser.pause();
    }, { threshold: 0.35 }).observe(rnav);
    popup.addEventListener('close', () => { if (rnav.getBoundingClientRect().top < innerHeight) teaser.play().catch(() => {}); });
  }

  /* ---------- mobile menu ---------- */
  const menuBtn = $('[data-menu-btn]');
  const menu = $('[data-menu]');
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });

  /* ---------- background loop video (watch section) ---------- */
  const saveData = navigator.connection && navigator.connection.saveData;
  $$('[data-lazy-video]').forEach((video) => {
    if (reduceMotion || saveData) return;
    let loaded = false;
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loaded) {
        loaded = true;
        [['webm', video.dataset.srcWebm], ['mp4', video.dataset.srcMp4]].forEach(([t, src]) => {
          const s = document.createElement('source'); s.src = src; s.type = `video/${t}`; video.appendChild(s);
        });
        video.load();
        video.addEventListener('playing', () => video.classList.add('is-playing'), { once: true });
      }
      if (loaded) entry.isIntersecting ? video.play().catch(() => {}) : video.pause();
    }, { rootMargin: '200px' }).observe(video);
  });

  /* ---------- showreel modal ---------- */
  // Videos come from Love's own YouTube channel; the player only loads when someone presses play.
  const modal = $('[data-modal]');
  const modalFrame = $('[data-modal-frame]');
  $$('[data-video-open]').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.src) { // our own video file (e.g. the Reliance Navratri reel)
      if (typeof modal.showModal !== 'function') { window.open(b.dataset.src, '_blank', 'noopener'); return; }
      const v = document.createElement('video');
      v.src = b.dataset.src; v.controls = true; v.autoplay = true; v.playsInline = true; v.preload = 'auto';
      if (b.dataset.poster) v.poster = b.dataset.poster;
      v.setAttribute('aria-label', b.dataset.title || 'Video');
      modal.classList.toggle('is-tall', b.dataset.shape === 'tall');
      modalFrame.replaceChildren(v);
      modal.showModal();
      const t = $('[data-rnav-teaser]'); if (t) t.pause();
      v.play().catch(() => {});
      return;
    }
    const id = b.dataset.yt || 'E7U9Dcw59yk';
    if (typeof modal.showModal !== 'function') { window.open(`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`, '_blank', 'noopener'); return; }
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    f.title = 'RJ Love Shah on YouTube';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    modal.classList.toggle('is-tall', b.dataset.shape === 'tall');
    modalFrame.replaceChildren(f);
    modal.showModal();
  }));
  const closeModal = () => modal.close();
  $('[data-modal-close]').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  modal.addEventListener('close', () => modalFrame.replaceChildren());

  /* ---------- video gallery per event type (clips from Love's own Drive, served from the site) ---------- */
  // [file under assets/video (no .mp4), caption, 'tall' for a vertical phone clip]
  const VIDEOS = {
    corporate: { title: "Corporate shows", list: [
      ["watch/corporate/kotak-annual-day", "Kotak Mahindra Bank annual day", "tall"],
      ["watch/corporate/meteoric-awards-night", "Meteoric awards night", "tall"],
      ["watch/corporate/zydus-diwali-party", "Zydus Diwali party", "tall"],
      ["watch/corporate/family-day", "Corporate family day", "tall"],
      ["watch/corporate/litera-microsystems-team-building", "Team building for Litera Microsystems", "tall"],
      ["watch/corporate/litera-team-building", "Litera team-building games", "tall"],
    ] },
    weddings: { title: "Luxury weddings", list: [
      ["watch/weddings/grand-sangeet-night", "Grand sangeet night", "tall"],
      ["watch/weddings/nisarg-francesca-carnival", "Nisarg & Francesca: an Indo-Italian wedding", "tall"],
      ["watch/weddings/varmala-challenge", "The varmala challenge", "tall"],
      ["watch/weddings/gujarati-haldi", "An energetic Gujarati haldi", "tall"],
      ["watch/weddings/baraat-2", "A baraat in full swing", "tall"],
      ["watch/weddings/carnival-1", "Wedding carnival", "tall"],
      ["watch/weddings/ca-sangeet", "A CA’s sangeet", "tall"],
      ["watch/weddings/sangeet-1", "Sangeet night", "tall"],
      ["watch/weddings/baraat-1", "The baraat entry", "tall"],
    ] },
    sports: { title: "Sports events", list: [
      ["watch/sports/kapil-dev-pgti", "Adani PGTI golf pre-tournament event with Kapil Dev", "tall"],
      ["watch/sports/bmw-womens-day", "BMW Women’s Day", "tall"],
    ] },
    navratri: { title: "Reliance Navratri", list: [
      ["reliance-navratri", "The Ambani family at Reliance Navratri", "tall"],
      ["watch/navratri/kriti-sanon", "Introducing Kriti Sanon", "tall"],
      ["watch/navratri/vicky-kaushal", "Introducing Vicky Kaushal", "tall"],
      ["watch/navratri/varun-dhawan", "Introducing Varun Dhawan", "tall"],
      ["watch/navratri/disha-patani", "Introducing Disha Patani", "tall"],
      ["stars/rashmika-mandanna", "Introducing Rashmika Mandanna", "tall"],
      ["stars/malaika-arora", "Malaika Arora on the Navratri stage", "tall"],
      ["watch/navratri/jio-signature-step", "The Jio signature step with Shiamak Davar’s team", "tall"],
    ] },
  };
  const gallery = $('[data-gallery]');
  const gGrid = $('[data-gallery-grid]');
  const gPlayer = $('[data-gallery-player]');
  const gFrame = $('[data-gallery-frame]');
  const gNow = $('[data-gallery-now]');
  const posterOf = (file) => `./assets/img/watch/${file.replace(/^watch\//, '').replace('/', '-')}.webp`;
  const showGrid = () => { gFrame.replaceChildren(); gPlayer.hidden = true; gGrid.hidden = false; };
  const play = ([file, caption, shape]) => {
    gFrame.className = `gallery__frame${shape === 'tall' ? ' is-tall' : ''}`;
    const v = document.createElement('video');
    v.src = `./assets/video/${file}.mp4`;
    v.poster = posterOf(file);
    v.controls = true; v.autoplay = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('aria-label', caption);
    gFrame.replaceChildren(v);
    v.play().catch(() => {});
    gNow.textContent = caption;
    gGrid.hidden = true; gPlayer.hidden = false;
    $('[data-gallery-back]').focus();
  };
  const openGallery = (key) => {
    const cat = VIDEOS[key];
    $('[data-gallery-title]').textContent = cat.title;
    gGrid.replaceChildren(...cat.list.map((v) => {
      const [file, caption, shape] = v;
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `vcard${shape === 'tall' ? ' vcard--tall' : ''}`;
      const src = posterOf(file);
      b.innerHTML = `<span class="vcard__media">${shape === 'tall' ? `<img class="vcard__blur" src="${src}" alt="" loading="lazy" decoding="async">` : ''}<img class="vcard__img" src="${src}" alt="" loading="lazy" decoding="async"></span><span class="vcard__play" aria-hidden="true"></span><span class="vcard__cap"></span>`;
      b.querySelector('.vcard__cap').textContent = caption;
      b.setAttribute('aria-label', `Play video: ${caption}`);
      b.addEventListener('click', () => play(v));
      li.append(b);
      return li;
    }));
    showGrid();
    gallery.showModal();
    gallery.scrollTop = 0;
  };
  $$('[data-gallery-open]').forEach((b) => b.addEventListener('click', (e) => {
    if (typeof gallery.showModal !== 'function') return; // old browsers: the #watch link still scrolls to the videos
    e.preventDefault();
    openGallery(b.dataset.galleryOpen);
  }));
  $('[data-gallery-back]').addEventListener('click', showGrid);
  $('[data-gallery-close]').addEventListener('click', () => gallery.close());
  gallery.addEventListener('click', (e) => { if (e.target === gallery) gallery.close(); });
  gallery.addEventListener('close', showGrid);

  /* ---------- about: words light up while scrolling ---------- */
  const words = $('[data-words]');
  if (words && !reduceMotion) {
    const wrap = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) wrap(n);
      });
    };
    wrap(words);
    const spans = $$('.w', words);
    const light = () => {
      const r = words.getBoundingClientRect();
      const start = innerHeight * 0.85, end = innerHeight * 0.35;
      const p = Math.max(0, Math.min(1, (start - r.top) / (start - end + r.height * 0.6)));
      const n = Math.round(p * spans.length);
      spans.forEach((s, i) => s.classList.toggle('on', i < n));
    };
    addEventListener('scroll', () => requestAnimationFrame(light), { passive: true });
    light();
  }

  /* ---------- about: on desktop the intro heading moves into the pinned story panel ---------- */
  const aboutIntro = $('[data-about-intro]');
  const introSlot = $('[data-intro-slot]');
  const introHome = $('.about__head');
  if (aboutIntro && introSlot && introHome) {
    const place = () => { (desktop.matches ? introSlot : introHome).appendChild(aboutIntro); };
    place();
    desktop.addEventListener('change', place);
  }

  /* ---------- about: the CA to RJ story told on scroll (year rolls 2011 > Today, chapter and photo change) ---------- */
  const story = $('[data-story]');
  if (story) {
    const steps = $$('.story__step', story);
    const ticks = $$('.story__ticks li', story);
    const layers = $$('.about__layer', story);
    const fill = $('[data-story-fill]', story);
    let cur = -1;
    const set = (i) => {
      if (i === cur) return;
      cur = i;
      steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
      ticks.forEach((t, k) => t.classList.toggle('is-active', k <= i));
      const photo = +(steps[i].dataset.photo || 0);
      layers.forEach((l, k) => l.classList.toggle('is-active', k === photo));
    };
    const update = () => {
      const r = story.getBoundingClientRect();
      const run = r.height - innerHeight;
      const p = run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
      if (fill) fill.style.setProperty('--story-p', p.toFixed(3));
      set(Math.min(steps.length - 1, Math.floor(p * steps.length)));
    };
    let queued = false;
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; update(); }); } }, { passive: true });
    addEventListener('resize', update);
    update();
  }

  /* ---------- across-India carousel ---------- */
  const car = $('[data-carousel]');
  if (car) {
    const step = () => (car.querySelector('.place')?.offsetWidth || 300) + 16;
    $('[data-car-prev]').addEventListener('click', () => car.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    $('[data-car-next]').addEventListener('click', () => car.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  }

  /* ---------- stats count-up ---------- */
  const counters = $$('[data-count]');
  const fmt = (n) => n.toLocaleString('en-IN');
  if (!reduceMotion) {
    counters.forEach((c) => { c.textContent = '0'; });
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const end = +e.target.dataset.count, t0 = performance.now(), dur = 1400;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        e.target.textContent = fmt(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), { threshold: 0.5 });
    counters.forEach((c) => io.observe(c));
  }

  /* ---------- booking form ---------- */
  const form = $('[data-book-form]');
  const status = $('[data-form-status]');
  const waMessage = () => {
    const d = new FormData(form);
    const lines = [
      'Hi Love, I would like to book you.',
      d.get('name') && `Name: ${d.get('name')}`,
      d.get('organisation') && `Company / family: ${d.get('organisation')}`,
      d.get('event_type') && `Event: ${d.get('event_type')}`,
      d.get('event_date') && `Date: ${d.get('event_date')}`,
      d.get('city') && `City / venue: ${d.get('city')}`,
      d.get('audience') && `Audience: ${d.get('audience')}`,
      d.get('message') && `Details: ${d.get('message')}`,
    ].filter(Boolean);
    return `https://wa.me/${WA}?text=${encodeURIComponent(lines.join('\n'))}`;
  };
  $('[data-wa-submit]').addEventListener('click', () => window.open(waMessage(), '_blank', 'noopener'));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    status.textContent = 'Sending…';
    try {
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      status.textContent = 'Thank you! Love will get back to you shortly. For a faster reply, WhatsApp him.';
    } catch {
      status.textContent = 'Could not send right now. Opening WhatsApp with your details instead…';
      setTimeout(() => window.open(waMessage(), '_blank', 'noopener'), 600);
    }
  });

  /* ---------- 1 · cover: masthead fitted to the screen, opening card, the doors, his voice ---------- */
  const cover = $('[data-cover]');
  if (cover) {
    const nameEl = $('[data-cover-name]', cover);
    const wide = matchMedia('(min-width: 960px)');

    // his name, letter by letter: one line on wide screens, "RJ LOVE / SHAH" on phones
    const letters = [];
    ['RJ', 'Love', 'Shah'].forEach((word) => {
      const w = document.createElement('span');
      w.className = 'w';
      [...word].forEach((c) => {
        const ch = document.createElement('span');
        ch.className = 'ch';
        ch.textContent = c;
        ch.style.setProperty('--i', letters.length);
        w.append(ch);
        letters.push(ch);
      });
      nameEl.append(w);
    });
    const fit = () => {
      cover.style.setProperty('--name-size', '100px');
      const words = $$('.w', nameEl).map((w) => w.getBoundingClientRect().width);
      const gap = 26; // .13em either side of each word at 100px
      const side = parseFloat(getComputedStyle(nameEl).paddingLeft) || 0;
      const room = nameEl.getBoundingClientRect().width - side * 2;
      const line = wide.matches ? words[0] + words[1] + words[2] + gap * 2 : Math.max(words[0] + gap + words[1], words[2]);
      let size = (room / line) * 100;
      size = wide.matches ? Math.min(size * 0.965, innerHeight * 0.24) : size * 0.9;
      cover.style.setProperty('--name-size', `${size.toFixed(1)}px`);
      // the events either side of him: placed from his edges, spaced apart when there is room,
      // tucked behind each other when there is less, and only shrunk (--ds) when even that does not fit
      if (wide.matches) {
        const H = innerHeight;
        const hw = Math.min(0.75 * H, 0.56 * innerWidth) * 0.391;
        const side = $('.cover__pick', cover).getBoundingClientRect().width / 2 - hw - 14;
        const w = [0.84 * 0.47 * H * 597 / 914, 0.9 * 0.47 * H * 529 / 987, 0.9 * 0.47 * H * 398 / 1033, 0.84 * 0.47 * H * 511 / 977];
        // ...and their heads stay below the Book / Watch buttons and the "choose your event" line
        const above = Math.max(...['.cover__actions', '.cover__hint'].map((q) => { const e = $(q, cover); return e ? e.offsetTop + e.offsetHeight : 0; }));
        const room = cover.offsetHeight - above - 18;
        const ds = Math.min(1.12, side / (w[0] + 0.62 * w[1]), side / (w[3] + 0.62 * w[2]), room / (0.9 * 0.47 * H));
        // with room to spare, the two photos on a side share it evenly: equal gaps from him, between them and to the edge
        const place = (outer, inner) => {
          const free = side - (outer + inner) * ds;
          if (free >= 0) { const g = free / 3; return [g, 2 * g + inner * ds]; }
          return [0, Math.max(0.62 * inner * ds, side - outer * ds)];
        };
        const [i1, o1] = place(w[0], w[1]);
        const [i4, o4] = place(w[3], w[2]);
        cover.style.setProperty('--ds', ds.toFixed(3));
        cover.style.setProperty('--i1', `${i1.toFixed(1)}px`);
        cover.style.setProperty('--o1', `${o1.toFixed(1)}px`);
        cover.style.setProperty('--i4', `${i4.toFixed(1)}px`);
        cover.style.setProperty('--o4', `${o4.toFixed(1)}px`);
        // two labels meeting: lift the outer ones above the inner ones
        cover.classList.toggle('cover--stagger', false);
        const lab = $$('.cover__door .cover__label', cover).map((l) => l.getBoundingClientRect());
        cover.classList.toggle('cover--stagger', lab[0].right > lab[1].left - 8 || lab[2].right > lab[3].left - 8);
        // the mic beside his head never runs into the "11+ years" stamp
        const mic = $('.cover__mic', cover);
        mic.style.marginLeft = '0px';
        const clash = mic.getBoundingClientRect().right + 12 - $('.cover__stamps', cover).getBoundingClientRect().left;
        if (clash > 0) mic.style.marginLeft = `${-Math.min(clash, 70).toFixed(0)}px`;
      }
    };
    fit();
    addEventListener('resize', fit);

    // opening card: his logo on ink, lifted once the photo and fonts are ready (never longer than 4s)
    const opener = $('[data-cover-opener]');
    const hostImg = $('[data-cover-host] img', cover);
    const wait = (ms) => new Promise((done) => setTimeout(done, ms));
    const imageReady = hostImg.complete ? Promise.resolve() : new Promise((done) => { hostImg.onload = hostImg.onerror = done; });
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.race([Promise.all([imageReady, fontsReady, wait(reduceMotion ? 0 : 700)]), wait(4000)]).then(() => {
      fit();
      if (opener) { opener.classList.add('is-up'); setTimeout(() => opener.classList.add('is-gone'), 1100); }
      document.body.classList.remove('cover-loading');
    });

    // the header reads in ink while it sits on the ivory cover
    let coverSeen = true;
    const setInk = () => document.body.classList.toggle('on-cover', coverSeen && (!cover.dataset.hover || cover.dataset.hover === 'navratri'));
    new IntersectionObserver(([e]) => { coverSeen = e.intersectionRatio > 0.12; setInk(); }, { threshold: [0, 0.12, 0.5] }).observe(cover);

    // doors: the stage takes the colour of the one you point at
    $$('.cover__door', cover).forEach((door) => {
      const enter = () => { if (!wide.matches) return; cover.dataset.hover = door.dataset.door; setInk(); };
      const leave = () => { if (cover.dataset.hover !== door.dataset.door) return; delete cover.dataset.hover; setInk(); };
      door.addEventListener('pointerenter', enter);
      door.addEventListener('focus', enter);
      door.addEventListener('pointerleave', leave);
      door.addEventListener('blur', leave);
    });

    // depth: the line-up leans a little with the pointer
    if (!reduceMotion && matchMedia('(hover: hover) and (min-width: 960px)').matches) {
      const layers = [
        [$('.cover__host', cover), -18], [nameEl, 10], [$('.cover__sign', cover), 16],
        ...$$('.cover__doors li', cover).map((li, i) => [li, i === 1 || i === 2 ? -11 : -6]),
      ];
      let raf = 0;
      cover.addEventListener('pointermove', (e) => {
        const k = e.clientX / innerWidth - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => layers.forEach(([el, depth]) => el.style.setProperty('--lean', `${(k * depth).toFixed(1)}px`)));
      });
    }

    // hand him the mic: each tap plays the next clip of his voice, and the letters of his name jump with it
    const TRACKS = [
      ['./assets/audio/love-vicky.m4a', 'introducing Vicky Kaushal at Reliance Navratri'],
      ['./assets/audio/love-kriti.m4a', 'introducing Kriti Sanon at Reliance Navratri'],
      ['./assets/audio/love-awards.m4a', 'hosting a corporate awards night'],
      ['./assets/audio/love-crowd.m4a', 'warming up a concert crowd before Neha Kakkar walks on'],
    ];
    const mic = $('[data-mic]', cover);
    const micLabel = $('[data-mic-label]', cover);
    const onair = $('[data-onair]', cover);
    let actx = null; let analyser = null; let freq = null; let audio = null; let track = -1;
    const playing = () => Boolean(audio && !audio.paused && !audio.ended);
    const setState = () => {
      const on = playing();
      mic.setAttribute('aria-pressed', String(on));
      mic.setAttribute('aria-label', on ? 'Stop his voice' : 'Hear his voice');
      micLabel.textContent = on ? 'On air' : 'Hear him';
      onair.hidden = !on;
      if (on) { onair.innerHTML = `<b>On air:</b> Love ${TRACKS[track][1]}`; jump(); }
    };
    const ensureAudio = () => {
      if (audio) return;
      audio = new Audio();
      audio.preload = 'auto';
      ['playing', 'pause', 'ended', 'error'].forEach((ev) => audio.addEventListener(ev, setState));
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      actx = new Ctx();
      analyser = actx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.78;
      freq = new Uint8Array(analyser.frequencyBinCount);
      actx.createMediaElementSource(audio).connect(analyser);
      analyser.connect(actx.destination);
    };
    mic.addEventListener('click', async () => {
      ensureAudio();
      if (playing()) { audio.pause(); return; }
      if (actx && actx.state === 'suspended') await actx.resume();
      track = (track + 1) % TRACKS.length;
      audio.src = TRACKS[track][0];
      audio.play().catch(setState);
    });
    // stop his voice when a video starts or the visitor leaves the tab
    document.addEventListener('play', (e) => { if (e.target !== audio && playing()) audio.pause(); }, true);
    document.addEventListener('visibilitychange', () => { if (document.hidden && playing()) audio.pause(); });

    const n = letters.length;
    const levels = new Float32Array(n); const floor = new Float32Array(n); const smooth = new Float32Array(n);
    let running = false;
    const frame = () => {
      const live = playing() && analyser;
      if (live) {
        analyser.getByteFrequencyData(freq);
        const per = 72 / n; // bins above ~72 are mostly hiss at this size
        for (let b = 0; b < n; b += 1) {
          let sum = 0; const from = Math.floor(b * per); const to = Math.max(from + 1, Math.floor((b + 1) * per));
          for (let k = from; k < to; k += 1) sum += freq[k];
          levels[b] = sum / (to - from) / 255;
        }
      }
      let moving = false;
      for (let i = 0; i < n; i += 1) {
        let target = 0;
        if (live) { floor[i] += (levels[i] - floor[i]) * 0.035; target = Math.min(1, Math.max(0, levels[i] - floor[i] * 0.92) * 5.5); }
        smooth[i] += (target - smooth[i]) * (target > smooth[i] ? 0.55 : 0.16);
        if (smooth[i] > 0.004) moving = true; else smooth[i] = 0;
        letters[i].style.setProperty('--s', smooth[i].toFixed(3));
      }
      if (live || moving) requestAnimationFrame(frame); else running = false;
    };
    function jump() { if (!running && !reduceMotion) { running = true; requestAnimationFrame(frame); } }
  }

  /* ---------- 1b · event chapters: his clips play silently while their chapter is on screen ---------- */
  const chapterClips = $$('.chapter__clip video');
  if (chapterClips.length && !reduceMotion && !(navigator.connection && navigator.connection.saveData)) {
    const roll = new IntersectionObserver((entries) => entries.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        if (!v.src) v.src = v.dataset.srcPreview;
        v.play().catch(() => {});
      } else v.pause();
    }), { threshold: 0.25 });
    chapterClips.forEach((v) => roll.observe(v));
  }

  /* ---------- GSAP: intro, reveals, horizontal events ---------- */
  const intro = $$('[data-intro]');
  const reveals = $$('[data-reveal]');
  if (reduceMotion || !window.gsap) {
    [...intro, ...reveals].forEach((el) => { el.style.opacity = 1; });
    return;
  }
  gsap.fromTo(intro, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09, delay: 0.1, clearProps: 'transform' });

  const io = new IntersectionObserver((entries) => {
    const batch = entries.filter((e) => e.isIntersecting).map((e) => e.target);
    if (!batch.length) return;
    batch.forEach((el) => io.unobserve(el));
    gsap.fromTo(batch, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07, clearProps: 'transform' });
  }, { rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((el) => io.observe(el));

  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    addEventListener('load', () => ScrollTrigger.refresh());
  }

  /* ---------- Instagram: live feed ----------
     Paste a Behold.so JSON feed URL into data-ig-feed on the Instagram section and the grid
     shows his 12 newest posts on every visit. If it is empty or the feed fails, the 12 posts
     already in the HTML stay. */
  const igSection = $('[data-ig-feed]');
  const igGrid = $('[data-ig-grid]');
  const igFeed = igSection && igSection.dataset.igFeed.trim();
  if (igFeed && igGrid) {
    fetch(igFeed, { mode: 'cors' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        const posts = (Array.isArray(data) ? data : data.posts || []).slice(0, 12);
        if (!posts.length) return;
        igGrid.replaceChildren(...posts.map((p) => {
          const sizes = p.sizes || {};
          const src = (sizes.medium && sizes.medium.mediaUrl) || p.thumbnailUrl || p.mediaUrl;
          if (!src || !p.permalink) return null;
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = p.permalink; a.target = '_blank'; a.rel = 'noopener';
          const img = document.createElement('img');
          img.src = src; img.width = 480; img.height = 640; img.loading = 'lazy'; img.decoding = 'async';
          img.alt = (p.prunedCaption || p.caption || 'RJ Love Shah on Instagram').replace(/\s+/g, ' ').slice(0, 120);
          a.append(img);
          if (p.mediaType === 'VIDEO' || p.isReel) {
            const icon = document.createElement('span');
            icon.className = 'insta__reel'; icon.setAttribute('aria-hidden', 'true');
            a.append(icon);
          }
          li.append(a);
          return li;
        }).filter(Boolean));
      })
      .catch(() => {});
  }
})();
