export function init() {
  const root = document.querySelector('#features');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = 'true';
  const items = [...root.querySelectorAll('.features-item')], preview = root.querySelector('.features-preview'), image = preview.querySelector('img'), caption = preview.querySelector('figcaption');
  const desktop = matchMedia('(min-width:1024px) and (hover:hover) and (pointer:fine)'), reduce = matchMedia('(prefers-reduced-motion:reduce)');
  let timer, active = -1, inView = false, preloadDone = false, preloadQueued = false;
  let hovered = null, lastScroll = scrollY, scrollFrame = 0;
  root.classList.add('features-enhanced');
  const sync = () => { preview.hidden = !desktop.matches; root.classList.toggle('features-desktop',desktop.matches); };
  sync(); desktop.addEventListener('change', () => { sync(); queueScroll(); });
  function select(i) {
    if (active === i || !desktop.matches || document.hidden) return;
    active = i;
    items.forEach((item, j) => { item.classList.toggle('features-active', i === j); item.querySelector('button').setAttribute('aria-pressed', String(i === j)); });
    const source = items[i].querySelector('img');
    const next = new Image();
    next.src = source.src.replace('-640.webp','.webp');
    next.decode().catch(() => {}).then(() => {
      if (active !== i) return;
      const swap = () => {
        image.srcset = source.srcset; image.src = source.src; image.alt = source.alt;
        if (!reduce.matches && inView && !document.hidden) image.animate([{opacity:.3}, {opacity:1}], {duration:220});
      };
      if (!reduce.matches && inView && !document.hidden) {
        const fade=image.animate([{opacity:1},{opacity:.3}],{duration:120});
        fade.finished.then(()=>{if(active===i)swap();}).catch(()=>{});
      } else swap();
      caption.textContent = items[i].querySelector('figcaption').textContent;
    });
  }
  items.forEach((item, i) => {
    const schedule = () => { clearTimeout(timer); timer = setTimeout(() => select(i), 60); };
    item.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { hovered = item; schedule(); } });
    item.addEventListener('pointerleave', () => { hovered = null; clearTimeout(timer); });
    item.addEventListener('focusin', schedule);
    item.querySelector('button').addEventListener('click', () => select(i));
    item.querySelector('button').addEventListener('keydown', e => {
      if (!['ArrowUp','ArrowDown','Home','End'].includes(e.key)) return;
      e.preventDefault();
      const n = e.key === 'Home' ? 0 : e.key === 'End' ? items.length-1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items[n].querySelector('button').focus(); select(n);
    });
  });
  const workshop=root.querySelector('.features-workshop');
  let workshopTimer;
  const showWorkshop=()=>{clearTimeout(workshopTimer);if(desktop.matches)workshop.open=true;};
  const hideWorkshop=()=>{clearTimeout(workshopTimer);workshopTimer=setTimeout(()=>{if(desktop.matches&&!workshop.contains(document.activeElement))workshop.open=false;},60);};
  workshop.addEventListener('pointerenter',showWorkshop);workshop.addEventListener('focusin',showWorkshop);
  workshop.addEventListener('pointerleave',hideWorkshop);workshop.addEventListener('focusout',hideWorkshop);
  root.querySelectorAll('img').forEach(img => img.addEventListener('error', () => {
    if (img.dataset.fallback) return;
    img.dataset.fallback = 'true'; img.removeAttribute('srcset');
    img.src = items[1].querySelector('img').getAttribute('src');
  }));
  function scrollSelect() {
    scrollFrame = 0;
    const direction = Math.sign(scrollY - lastScroll);
    lastScroll = scrollY;
    if (!inView || !desktop.matches || document.hidden || hovered || root.contains(document.activeElement)) return;
    const line = innerHeight * .5, hysteresis = 12;
    const headingCenter = i => {
      const bounds = items[i].querySelector('h3').getBoundingClientRect();
      return bounds.top + bounds.height / 2;
    };
    let next = Math.max(0, active);
    if (direction >= 0) while (next < items.length - 1 && headingCenter(next + 1) <= line - hysteresis) next++;
    if (direction <= 0) while (next > 0 && headingCenter(next) > line + hysteresis) next--;
    select(next);
  }
  function queueScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(scrollSelect);
  }
  function schedulePreload() {
    if (!inView || document.hidden || preloadDone || preloadQueued) return;
    preloadQueued = true;
    const load = () => {
      preloadQueued = false;
      if (!inView || document.hidden) return;
      preloadDone = true;
      items.slice(1).forEach(item => { const im = new Image(); im.src = item.querySelector('img').src.replace('-640.webp','.webp'); });
    };
    if ('requestIdleCallback' in window) requestIdleCallback(load, {timeout:2000}); else setTimeout(load, 500);
  }
  const observer = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting && entries[0].intersectionRatio > 0;
    if (inView) { if (active < 0) select(0); schedulePreload(); queueScroll(); }
  }, {rootMargin:'0px', threshold:[0,.01]});
  observer.observe(root);
  addEventListener('scroll', queueScroll, {passive:true});
  addEventListener('resize', queueScroll, {passive:true});
  document.addEventListener('visibilitychange', () => { if (document.hidden) { clearTimeout(timer); image.getAnimations().forEach(a => a.cancel()); } else schedulePreload(); });
  reduce.addEventListener('change', () => image.getAnimations().forEach(a => a.cancel()));
}
