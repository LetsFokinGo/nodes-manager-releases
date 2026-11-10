const cards = [
  '.features-preview', '.cars-card', '.cars-controls',
  '.security-app', '.security-folder', '.security-panel', '.security-network', '.security-facts article',
  '.download-card', '.download-warning',
].join(',');
const rows = [
  '.features-item', '.features-also li', '.cars-syntax', '.cars-count-row',
  '.security-table summary', '.security-links',
  '.download-steps > li', '.closing-questions > details', '.closing-actions > *', '.closing-page',
  '.shell-footer nav', '.shell-footer-meta',
].join(',');
const atoms = `${cards},${rows}`;
const scope = '#features, #cars, #security, #download, #faq, #support, .shell-footer';
const NS = 'http://www.w3.org/2000/svg';
const EASE = 'cubic-bezier(.2,.8,.2,1)';
let initialized = false;

export function init() {
  if (initialized) return;
  initialized = true;
  const root = document.documentElement;
  const TS = parseFloat(getComputedStyle(root).getPropertyValue('--ts')) || 1;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const staticMode = () => reduce.matches || connection?.saveData || root.classList.contains('motion-lite');
  try {
    if (sessionStorage.getItem('nm.reveal.seen')) return;
    sessionStorage.setItem('nm.reveal.seen', '1');
  } catch { /* без хранилища — один раз за документ */ }
  if (staticMode() || typeof IntersectionObserver !== 'function' || !Element.prototype.animate) return;

  const seen = new WeakSet(), tracked = new Set(), running = new Map();
  const visible = el => el.isConnected && !el.closest('[hidden], [inert]') && el.getClientRects().length > 0;
  const show = el => el.classList.remove('rv-wait');
  function finish(el) {
    for (const a of running.get(el) ?? []) a.cancel();
    running.delete(el);
    el.querySelector(':scope > .rv-frame')?.remove();
    show(el);
  }
  const anim = (list, el, kf, o) => {
    const a = el.animate(kf, { fill: 'backwards', easing: EASE, ...o, duration: o.duration * TS, delay: (o.delay ?? 0) * TS });
    list.push(a);
    return a;
  };

  function card(el, delay, list) {
    const r = el.getBoundingClientRect();
    const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'rv-frame'); svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
    const rect = document.createElementNS(NS, 'rect');
    for (const [k, v] of Object.entries({ x: .5, y: .5, width: r.width - 1, height: r.height - 1, rx: radius, pathLength: 1 })) rect.setAttribute(k, v);
    svg.append(rect);
    const o = radius * .29;
    const corners = [[o, o], [r.width - o, o], [r.width - o, r.height - o], [o, r.height - o]];
    const dots = corners.map(([x, y]) => {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 2.2);
      svg.append(c);
      return c;
    });
    el.append(svg);
    dots.forEach((c, i) => anim(list, c, [
      { opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'scale(1.9)', offset: .5 }, { opacity: 1, transform: 'scale(1)' },
    ], { duration: 260, delay: delay + i * 70 }));
    anim(list, rect, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 520, delay: delay + 40, easing: 'cubic-bezier(.6,.05,.3,1)' });
    anim(list, svg, [{ opacity: 1 }, { opacity: 1, offset: .7 }, { opacity: 0 }], { duration: 1000, delay, easing: 'linear', fill: 'both' })
      .finished.then(() => svg.remove(), () => {});
    anim(list, el, [{ opacity: 0, backgroundColor: 'transparent', borderColor: 'transparent' }, { opacity: 1, offset: .25 }, {}], { duration: 620, delay });
    [...el.children].filter(c => c !== svg).slice(0, 6).forEach((child, i) => {
      const media = child.matches('img, picture, video') || child.querySelector(':scope > img');
      anim(list, child, media
        ? [{ opacity: 0, transform: 'scale(1.06)', filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'none' }]
        : [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
      { duration: media ? 560 : 420, delay: delay + 260 + i * 60 });
    });
  }
  function text(el, delay, list) {
    const heading = /^H[1-3]$/.test(el.tagName);
    anim(list, el, heading
      ? [{ opacity: 0, transform: 'translateY(.45em)', clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, transform: 'none', clipPath: 'inset(0 0 -20% 0)' }]
      : [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
    { duration: heading ? 700 : 520, delay });
  }
  function row(el, delay, list) {
    anim(list, el, [{ opacity: 0, transform: 'translateX(-14px)' }, { opacity: 1, transform: 'none' }], { duration: 480, delay });
  }

  const observer = new IntersectionObserver(entries => {
    const batch = [];
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting || !visible(target)) { if (running.has(target) && !isIntersecting) finish(target); continue; }
      if (seen.has(target) || document.hidden || staticMode()) { show(target); continue; }
      seen.add(target);
      observer.unobserve(target);
      if (target.contains(document.activeElement)) { show(target); continue; }
      batch.push(target);
    }
    batch.sort((a, b) => {
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      return Math.abs(ra.top - rb.top) > 24 ? ra.top - rb.top : ra.left - rb.left;
    });
    let tops = [], nText = 0;
    batch.forEach(el => {
      const list = [];
      let delay;
      if (el.matches(cards)) {
        const t = el.getBoundingClientRect().top;
        let row = tops.findIndex(v => Math.abs(v - t) < 24);
        if (row < 0) { tops.push(t); row = tops.length - 1; }
        const col = batch.filter(b => b !== el && b.matches(cards) && Math.abs(b.getBoundingClientRect().top - t) < 24 && b.getBoundingClientRect().left < el.getBoundingClientRect().left).length;
        delay = Math.min(row * 120 + col * 70, 560);
      } else delay = Math.min(nText++, 6) * 70;
      show(el);
      if (el.matches(cards)) card(el, delay, list);
      else if (el.matches(rows)) row(el, delay, list);
      else text(el, delay, list);
      running.set(el, list);
      Promise.all(list.map(a => a.finished)).then(() => { running.delete(el); el.querySelector(':scope > .rv-frame')?.remove(); }, () => {});
    });
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });

  function scan() {
    for (const area of document.querySelectorAll(scope)) {
      for (const el of area.querySelectorAll(`${atoms}, h2, h3, p`)) {
        if (tracked.has(el) || el.parentElement?.closest(atoms) ||
          el.closest('[role="status"], .cars-nojs, .cars-exit, [aria-hidden="true"]') || !el.textContent.trim()) continue;
        tracked.add(el);
        if (el.getBoundingClientRect().top > innerHeight * .92) el.classList.add('rv-wait');
        observer.observe(el);
      }
    }
  }
  scan();
  const changes = new MutationObserver(() => {
    for (const el of running.keys()) if (!visible(el)) finish(el);
    scan();
  });
  for (const area of document.querySelectorAll(scope)) {
    changes.observe(area, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'open'] });
  }
  const settle = () => {
    for (const el of [...running.keys()]) finish(el);
    for (const el of tracked) show(el);
    observer.disconnect();
    changes.disconnect();
  };
  reduce.addEventListener('change', () => { if (reduce.matches) settle(); });
  connection?.addEventListener('change', () => { if (staticMode()) settle(); });
  document.addEventListener('nm:motion-mode', () => { if (staticMode()) settle(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) settle(); });
  addEventListener('pagehide', settle);
  document.addEventListener('focusin', event => {
    for (const el of tracked) if (el.contains(event.target)) { finish(el); seen.add(el); }
  });
}
