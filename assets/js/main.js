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
  const heroActions = $('.hero__actions');
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

  /* ---------- video gallery per event type (all clips are on Love's own YouTube channel @loveshah117) ---------- */
  // [YouTube id, caption, 'tall' for a vertical Short]
  const VIDEOS = {
    corporate: { title: 'Corporate shows', list: [
      ['5snu1xwpI0g', 'Warm-up, team building and awards night'],
      ['ZQAv5U1U4D8', 'Awards night and annual meet', 'tall'],
      ['yZI6Ggl9RTM', 'Corporate engagement games on stage'],
      ['iUI_PwmD6fM', 'Team building for Litera Group', 'tall'],
      ['Ofxxoki3l04', 'Team building with the whole audience in play'],
      ['qUmF9uT589A', 'Annual celebration: awards and entertainment', 'tall'],
      ['_P_vm0k9ypc', 'Team building and awards: a full corporate show'],
      ['FeeG_F9NJeI', 'Corporate event games', 'tall'],
    ] },
    weddings: { title: 'Luxury weddings', list: [
      ['5kKDOfhS_mk', 'Sangeet warm-up: getting both families on their feet'],
      ['YVkzI0gv_Rc', 'An Indo-Italian NRI wedding', 'tall'],
      ['RUrSS4cqIF0', 'The varmala challenge at a wedding carnival', 'tall'],
      ['s4PsYV704ns', 'Haldi ceremony games'],
      ['yBJ0mJpY1ek', 'Sangeet night, full energy', 'tall'],
      ['4apaIc3am6k', 'The craziest baraat', 'tall'],
      ['U92Ut7h2N6o', 'Squid Game-style wedding carnival', 'tall'],
      ['KT73FH9sE1c', 'Sangeet sandhya with the family'],
    ] },
    live: { title: 'Sports & live events', list: [
      ['h3TcUziqsVs', 'The Ambani family’s entrance at Reliance Navratri', 'tall'],
      ['_6wW9BsNKt0', 'Hosting The Neha Kakkar Show'],
      ['AM9vLF0upcg', 'Rashmika Mandanna at Reliance Navratri', 'tall'],
      ['bOjP3X-52Ls', 'Sardar Patel Jayanti with Amit Shah and CM Bhupendra Patel'],
      ['bxlkcbgJNlQ', 'Disha Patani at Reliance Navratri', 'tall'],
      ['Yh3U-ENDIT0', 'Jigardan Gadhvi live in concert'],
      ['58TsaOrJzeQ', 'Marathon run with our soldiers'],
      ['HoIf919WMuM', 'Hosting a public gathering', 'tall'],
    ] },
  };
  const gallery = $('[data-gallery]');
  const gGrid = $('[data-gallery-grid]');
  const gPlayer = $('[data-gallery-player]');
  const gFrame = $('[data-gallery-frame]');
  const gNow = $('[data-gallery-now]');
  const ytFrame = (id) => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    f.title = 'RJ Love Shah on YouTube';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    return f;
  };
  const showGrid = () => { gFrame.replaceChildren(); gPlayer.hidden = true; gGrid.hidden = false; };
  const play = ([id, caption, shape]) => {
    gFrame.className = `gallery__frame${shape === 'tall' ? ' is-tall' : ''}`;
    gFrame.replaceChildren(ytFrame(id));
    gNow.textContent = caption;
    gGrid.hidden = true; gPlayer.hidden = false;
    $('[data-gallery-back]').focus();
  };
  const openGallery = (key) => {
    const cat = VIDEOS[key];
    $('[data-gallery-title]').textContent = cat.title;
    gGrid.replaceChildren(...cat.list.map((v) => {
      const [id, caption, shape] = v;
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `vcard${shape === 'tall' ? ' vcard--tall' : ''}`;
      const src = shape === 'tall' ? `https://i.ytimg.com/vi/${id}/oardefault.jpg` : `https://i.ytimg.com/vi/${id}/sddefault.jpg`;
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
  $$('[data-gallery-open]').forEach((b) => b.addEventListener('click', () => {
    if (typeof gallery.showModal !== 'function') { window.open('https://www.youtube.com/@loveshah117', '_blank', 'noopener'); return; }
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

  /* ---------- about: portraits crossfade as you read the intro text (same behaviour as the reference) ---------- */
  const aboutPhoto = $('[data-about-photo]');
  const aboutText = $('.about__text');
  if (aboutPhoto && aboutText) {
    const layers = $$('.about__layer', aboutPhoto);
    let shown = 0;
    const show = (i) => {
      if (i === shown) return;
      shown = i;
      layers.forEach((l, k) => l.classList.toggle('is-active', k === i));
    };
    // Same progress as the word highlight: the photo only changes while the text is being read.
    const pick = () => {
      const r = aboutText.getBoundingClientRect();
      const start = innerHeight * 0.85, end = innerHeight * 0.35;
      const p = Math.max(0, Math.min(1, (start - r.top) / (start - end + r.height * 0.6)));
      const i = p < 0.35 ? 0 : p < 0.7 ? 1 : 2;
      show(Math.max(0, Math.min(layers.length - 1, i)));
    };
    if (!reduceMotion) {
      addEventListener('scroll', () => requestAnimationFrame(pick), { passive: true });
      addEventListener('resize', pick);
      pick();
    }
  }

  /* ---------- experience: pinned while scrolling, one quality per quarter of the scroll (desktop) ---------- */
  const expTrack = $('[data-exp-track]');
  if (expTrack) {
    const expSec = $('#experience');
    const items = $$('li', expTrack);
    const imgs = $$('.exp__frame > img', expTrack);
    const clips = $$('.exp__clip', expTrack);
    const glows = $$('.exp__glow', expTrack);
    const texts = $$('p', $('[data-exp-texts]').content);
    const desc = $('[data-exp-desc]');
    const num = $('[data-exp-num]');
    let current = -1;
    const show = (i) => {
      if (i === current) return;
      current = i;
      [items, imgs, clips, glows].forEach((set) => set.forEach((el, k) => el.classList.toggle('is-active', k === i)));
      expSec.style.setProperty('--tint', items[i].style.getPropertyValue('--tint'));
      desc.textContent = texts[i].textContent;
      desc.classList.remove('is-in'); void desc.offsetWidth; desc.classList.add('is-in');
      num.textContent = String(i + 1).padStart(2, '0');
    };
    const pick = () => {
      if (!desktop.matches) return;
      const r = expTrack.getBoundingClientRect();
      const run = r.height - innerHeight;
      const p = run > 0 ? Math.min(0.999, Math.max(0, -r.top / run)) : 0;
      show(Math.floor(p * items.length));
    };
    show(0);
    let queued = false;
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; pick(); }); } }, { passive: true });
    addEventListener('resize', pick);
    pick();
    // clicking a word scrolls to that word's part of the section
    $$('button', expTrack.querySelector('[data-exp-list]')).forEach((b) => b.addEventListener('click', () => {
      const run = expTrack.offsetHeight - innerHeight;
      const top = expTrack.getBoundingClientRect().top + scrollY + run * ((+b.dataset.exp + 0.5) / items.length);
      scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    }));
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
    const pin = $('[data-hscroll]');
    const track = $('[data-hscroll-track]');
    const section = $('#events');
    const mm = gsap.matchMedia();
    mm.add('(min-width: 960px)', () => {
      // The browser keeps the panel in place with CSS `position: sticky` (no JS pinning, so no blank
      // frame when scrolling back up). The section is made tall enough to scroll the cards sideways.
      pin.classList.add('is-pinned');
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const setHeight = () => { section.style.height = `${pin.offsetHeight + dist()}px`; };
      setHeight();
      ScrollTrigger.addEventListener('refreshInit', setHeight);
      gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.4, invalidateOnRefresh: true },
      });
      // gsap.matchMedia reverts the tween + ScrollTrigger itself; undo our own changes here.
      return () => {
        ScrollTrigger.removeEventListener('refreshInit', setHeight);
        section.style.height = '';
        pin.classList.remove('is-pinned');
      };
    });
    addEventListener('load', () => ScrollTrigger.refresh());
  }
})();
