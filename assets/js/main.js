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
      bar.classList.toggle('is-hidden', r.top < innerHeight * 0.6 && r.bottom > 0);
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
    modalFrame.replaceChildren(f);
    modal.showModal();
  }));
  const closeModal = () => modal.close();
  $('[data-modal-close]').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  modal.addEventListener('close', () => modalFrame.replaceChildren());

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

  /* ---------- experience switcher ---------- */
  const expList = $('[data-exp-list]');
  if (expList) {
    const items = $$('li', expList);
    const imgs = $$('.exp__frame img');
    const texts = $$('p', $('[data-exp-texts]').content);
    const desc = $('[data-exp-desc]');
    const num = $('[data-exp-num]');
    let current = 0, timer;
    const show = (i) => {
      current = i;
      items.forEach((li, k) => li.classList.toggle('is-active', k === i));
      imgs.forEach((im, k) => im.classList.toggle('is-active', k === i));
      desc.textContent = texts[i].textContent;
      num.textContent = String(i + 1).padStart(2, '0');
    };
    const auto = () => { clearInterval(timer); if (!reduceMotion) timer = setInterval(() => show((current + 1) % items.length), 4200); };
    $$('button', expList).forEach((b) => {
      b.addEventListener('click', () => { show(+b.dataset.exp); auto(); });
      b.addEventListener('mouseenter', () => { show(+b.dataset.exp); clearInterval(timer); });
      b.addEventListener('mouseleave', auto);
    });
    new IntersectionObserver(([e]) => { e.isIntersecting ? auto() : clearInterval(timer); }).observe(expList);
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
