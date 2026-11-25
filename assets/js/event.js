/* RJ Love Shah – event page script (deferred): header, menu, his clips playing silently, full video in a pop-up. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // header turns solid once the page scrolls
  const header = $('[data-header]');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // mobile menu
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

  // his clips play silently while they are on screen
  const clips = $$('.chapter__clip video');
  if (clips.length && !reduceMotion && !(navigator.connection && navigator.connection.saveData)) {
    const roll = new IntersectionObserver((entries) => entries.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) { if (!v.src) v.src = v.dataset.srcPreview; v.play().catch(() => {}); } else v.pause();
    }), { threshold: 0.25 });
    clips.forEach((v) => roll.observe(v));
  }

  // "All events": back to the exact place on the homepage the visitor came from
  // (straight back when they came from the homepage; the cover or the video folders after moving between events)
  const back = $('.chapter__back a');
  if (back) back.addEventListener('click', (ev) => {
    const home = new URL('../../', location.href);
    const ref = document.referrer ? new URL(document.referrer) : null;
    if (ref && ref.origin === home.origin && ref.pathname === home.pathname && history.length > 1) { ev.preventDefault(); history.back(); return; }
    let from = null;
    try { from = sessionStorage.getItem('rjl-from'); } catch (err) { /* keep the link's own target */ }
    if (from === 'cover') { ev.preventDefault(); location.href = home.href; }
  });

  // pressing a clip opens the full video with sound
  const modal = $('[data-modal]');
  const frame = $('[data-modal-frame]');
  $$('[data-video-open]').forEach((b) => b.addEventListener('click', () => {
    if (typeof modal.showModal !== 'function') { window.open(b.dataset.src, '_blank', 'noopener'); return; }
    const v = document.createElement('video');
    v.src = b.dataset.src; v.controls = true; v.autoplay = true; v.playsInline = true; v.preload = 'auto';
    if (b.dataset.poster) v.poster = b.dataset.poster;
    v.setAttribute('aria-label', b.dataset.title || 'Video');
    modal.classList.toggle('is-tall', b.dataset.shape === 'tall');
    frame.replaceChildren(v);
    modal.showModal();
    v.play().catch(() => {});
  }));
  $('[data-modal-close]').addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
  modal.addEventListener('close', () => frame.replaceChildren());
})();
