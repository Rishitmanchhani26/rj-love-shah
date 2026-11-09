/* Event pages: opening scroll, event cards, full-screen opener. GSAP is an enhancement. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wide = matchMedia('(min-width: 960px)');
  const hasGsap = !!window.gsap && !reduceMotion;
  const WA = '917383972757';

  /* ---------- header + menu ---------- */
  const header = $('[data-header]');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const menuBtn = $('[data-menu-btn]'), menu = $('[data-menu]');
  const setMenu = (open) => { menuBtn.setAttribute('aria-expanded', String(open)); menu.hidden = !open; document.body.classList.toggle('menu-open', open); };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

  /* ---------- helpers ---------- */
  const loadVideo = (v) => {
    if (!v || v.dataset.loaded) return;
    v.dataset.loaded = '1';
    v.src = v.dataset.src;
    v.addEventListener('playing', () => v.classList.add('is-playing'), { once: true });
  };
  const play = (v) => { if (!v || reduceMotion) return; loadVideo(v); v.play().catch(() => {}); };
  const pause = (v) => { if (v && v.dataset.loaded) v.pause(); };

  /* ---------- 1 · opening ---------- */
  const heroVideo = $('[data-hero-video]');
  if (heroVideo && !reduceMotion && !(navigator.connection && navigator.connection.saveData)) {
    const start = () => setTimeout(() => play(heroVideo), 250);
    document.readyState === 'complete' ? start() : addEventListener('load', start, { once: true });
  }
  if (hasGsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.ep-hero', start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
    tl.to('.ep-hero__frame', { scale: 0.74, borderRadius: 28, yPercent: -4, ease: 'none' }, 0)
      .to('.ep-hero__copy', { yPercent: -40, opacity: 0, ease: 'none' }, 0)
      .to('.ep-hero__cue', { opacity: 0, ease: 'none', duration: 0.2 }, 0)
      .to('.ep-hero__dim', { opacity: 0.55, ease: 'none' }, 0.2);
    gsap.from('[data-ep-intro]', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.15 });
    gsap.from('.stage__head > *', { opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: '.stage', start: 'top 75%' } });
  }

  /* ---------- 2 · event cards ---------- */
  const casesEl = $('[data-cases]');
  const cases = $$('.case', casesEl);
  cases.forEach((c, i) => c.addEventListener('click', () => openAt(i)));
  if (hasGsap) {
    gsap.from(cases, { opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: casesEl, start: 'top 85%' } });
  }

  /* ---------- 3 · opener ---------- */
  const op = $('[data-opener]');
  const opImg = $('[data-op-img]', op), opVid = $('[data-op-video]', op);
  const opKicker = $('[data-op-kicker]', op), opTitle = $('[data-op-title]', op), opText = $('[data-op-text]', op);
  const opTags = $('[data-op-tags]', op), opBook = $('[data-op-book]', op), opCount = $('[data-op-count]', op), opSoon = $('[data-op-soon]', op);
  const opClose = $('[data-op-close]', op);
  const opWatch = $('[data-op-watch]', op), opYt = $('[data-op-yt]', op), opYtFrame = $('[data-op-yt-frame]', op);
  let current = 0, lastFocus = null;

  // YouTube player (Love's own channel). Loaded only when "Watch the full clip" is pressed.
  const stopYt = () => { opYtFrame.replaceChildren(); opYt.hidden = true; };
  const playYt = () => {
    const c = cases[current];
    if (!c.dataset.yt) return;
    opVid.pause();
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(c.dataset.yt)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    f.title = `${c.dataset.title}: RJ Love Shah on YouTube`;
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    opYtFrame.className = `opener__yt-frame opener__yt-frame--${c.dataset.ytShape || 'wide'}`;
    opYtFrame.replaceChildren(f);
    opYt.hidden = false;
    $('[data-op-yt-close]', op).focus({ preventScroll: true });
  };
  opWatch.addEventListener('click', playYt);
  $('[data-op-yt-close]', op).addEventListener('click', () => { stopYt(); opWatch.focus({ preventScroll: true }); if (!reduceMotion) opVid.play().catch(() => {}); });

  const fillOpener = (i) => {
    const c = cases[i];
    current = i;
    stopYt();
    opWatch.hidden = !c.dataset.yt;
    op.style.setProperty('--pos', c.style.getPropertyValue('--pos') || '50%');
    opImg.src = c.dataset.poster; opImg.alt = $('img', c).alt;
    opVid.pause(); opVid.classList.remove('is-playing'); opVid.removeAttribute('src');
    if (c.dataset.video) {
      opVid.src = c.dataset.video;
      opVid.addEventListener('playing', () => opVid.classList.add('is-playing'), { once: true });
      if (!reduceMotion) opVid.play().catch(() => {});
    }
    opSoon.hidden = !!(c.dataset.video || c.dataset.yt);
    opKicker.textContent = `${String(i + 1).padStart(2, '0')} · ${c.dataset.kicker}`;
    opTitle.textContent = c.dataset.title;
    opText.textContent = $('.case__text', c).textContent;
    opTags.replaceChildren(...$$('.case__tags span', c).map((s) => {
      const li = document.createElement('li'); li.textContent = s.textContent; return li;
    }));
    opBook.href = `https://wa.me/${WA}?text=${encodeURIComponent(`Hi Love, I'd like to book you for a ${c.dataset.title} event.`)}`;
    opBook.querySelector('span').textContent = `Book Love for ${c.dataset.title}`;
    opCount.textContent = `${String(i + 1).padStart(2, '0')} / ${String(cases.length).padStart(2, '0')}`;
  };

  const rectInset = (el) => {
    const r = $('.case__media', el).getBoundingClientRect();
    return `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 10px)`;
  };

  function openAt(i) {
    lastFocus = document.activeElement;
    fillOpener(i);
    op.classList.add('is-open'); op.setAttribute('aria-hidden', 'false');
    document.body.classList.add('opener-open');
    if (hasGsap) {
      gsap.fromTo(op, { clipPath: rectInset(cases[i]) }, { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 0.85, ease: 'power3.inOut' });
      gsap.fromTo($('.opener__media', op), { scale: 1.15 }, { scale: 1, duration: 1.2, ease: 'power3.out' });
      gsap.fromTo($$('[data-op-anim]', op), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07, delay: 0.45 });
    }
    opClose.focus({ preventScroll: true });
  }

  const closeOpener = () => {
    const done = () => {
      op.classList.remove('is-open'); op.setAttribute('aria-hidden', 'true');
      op.style.clipPath = '';
      document.body.classList.remove('opener-open');
      opVid.pause();
      stopYt();
      (lastFocus || cases[current]).focus({ preventScroll: true });
    };
    if (!hasGsap) return done();
    gsap.to($$('[data-op-anim]', op), { opacity: 0, y: 16, duration: 0.25, ease: 'power2.in' });
    gsap.to(op, { clipPath: rectInset(cases[current]), duration: 0.7, ease: 'power3.inOut', delay: 0.1, onComplete: done });
  };

  const go = (dir) => {
    const next = (current + dir + cases.length) % cases.length;
    if (!hasGsap) { fillOpener(next); return; }
    const tl = gsap.timeline();
    tl.to($$('[data-op-anim]', op), { opacity: 0, x: -30 * dir, duration: 0.25, ease: 'power2.in', stagger: 0.03 })
      .to($('.opener__media', op), { opacity: 0, duration: 0.25 }, 0)
      .add(() => fillOpener(next))
      .fromTo($('.opener__media', op), { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' })
      .fromTo($$('[data-op-anim]', op), { opacity: 0, x: 30 * dir }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05 }, '<0.1');
  };

  opClose.addEventListener('click', closeOpener);
  $('[data-op-prev]', op).addEventListener('click', () => go(-1));
  $('[data-op-next]', op).addEventListener('click', () => go(1));
  addEventListener('keydown', (e) => {
    if (!op.classList.contains('is-open')) return;
    if (e.key === 'Escape') { if (!opYt.hidden) { stopYt(); opWatch.focus({ preventScroll: true }); } else closeOpener(); return; }
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'Tab') { // keep focus inside the opener
      const f = $$('button, a[href]', op).filter((el) => el.offsetParent !== null);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  // swipe on phones
  let sx = null;
  op.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  op.addEventListener('touchend', (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1); sx = null; });

  /* ---------- reveals ---------- */
  const reveals = $$('[data-reveal]');
  if (!hasGsap) { reveals.forEach((el) => { el.style.opacity = 1; }); return; }
  const io = new IntersectionObserver((entries) => {
    const batch = entries.filter((e) => e.isIntersecting).map((e) => e.target);
    if (!batch.length) return;
    batch.forEach((el) => io.unobserve(el));
    gsap.fromTo(batch, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07, clearProps: 'transform' });
  }, { rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((el) => io.observe(el));
})();
