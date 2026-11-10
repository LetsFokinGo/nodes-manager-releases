import { mesh, advance } from './physics.js';
import { synthesizer } from './synth.js';

let initialized = false;
const fallback = {
 en: { on: 'Sound: on', off: 'Sound: off', hint: 'Sound on — click to mute' },
 ru: { on: 'Звук: вкл', off: 'Звук: выкл', hint: 'Звук включён — нажмите, чтобы выключить' },
};

function background(hero, reduce) {
 const target = hero.querySelector('.beam-grid');
 if (!target) return;
 const coarse = matchMedia('(pointer: coarse)');
 const connection = navigator.connection;
 let autoLite = false, visible = false, raf = 0, pointer = null, lastMove = 0;
 let model, width, height, colors, slow = 0, pulse = null, introStart = null;
 const INTRO = 3600;
 const canvas = document.createElement('canvas');
 canvas.className = 'motion-canvas'; canvas.setAttribute('aria-hidden', 'true');
 const ctx = canvas.getContext('2d');
 if (!ctx) return;
 target.append(canvas); target.classList.add('motion-grid');
 if (!matchMedia('(prefers-reduced-motion: reduce)').matches) canvas.animate([{opacity:0},{opacity:1}],{duration:1400,easing:'cubic-bezier(.22,.61,.36,1)'});
 const lite = () => autoLite || connection?.saveData || navigator.deviceMemory <= 4 || navigator.hardwareConcurrency <= 4;
 const staticMode = () => reduce.matches || coarse.matches || lite();
 function publishMode() {
  document.documentElement.classList.toggle('motion-lite', !!lite());
  document.dispatchEvent(new CustomEvent('nm:motion-mode', { detail: { lite: !!lite(), reduced: reduce.matches } }));
 }
 function stop() { cancelAnimationFrame(raf); raf = 0; pointer = null; pulse = null; }
 function heat(x, y, now) {
  let h = 0;
  if (pointer) { const d = Math.hypot(x - pointer.x, y - pointer.y); if (d < 170) h = 1 - d / 170; }
  if (pulse) {
   const t = (now - pulse.t0) / 1300, r = t * pulse.reach, d = Math.hypot(x - pulse.x, y - pulse.y);
   const band = 1 - Math.abs(d - r) / 46;
   if (band > 0) h = Math.max(h, band * band * (1 - t) * .8);
  }
  return h;
 }
 const introT = now => introStart === null ? (staticMode() ? 1 : 0) : Math.min(1, (now - introStart) / INTRO);
 function reveal(n, t) {
  const cx = width * .62, cy = height * .46, far = Math.hypot(Math.max(cx, width - cx), Math.max(cy, height - cy)) || 1;
  const delay = Math.hypot(n.ox - cx, n.oy - cy) / far * .5 + n.r * .22;
  const s = Math.max(0, Math.min(1, (t - delay) / .28));
  return 1 - Math.pow(1 - s, 3);
 }
 function paint(now = performance.now()) {
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;
  const t = introT(now), live = !!(pointer || pulse), N = model.nodes;
  const heats = N.map(n => live ? heat(n.x, n.y, now) : 0);
  const vis = N.map((n, i) => t >= 1 ? 1 : Math.max(reveal(n, t), Math.min(1, heats[i] * 2)));
  const hot = [];
  ctx.strokeStyle = colors.tx;
  if (t >= 1) ctx.beginPath();
  for (const [a, b] of model.edges) {
   const n = N[a], m = N[b];
   const h = live ? heat((n.x + m.x) / 2, (n.y + m.y) / 2, now) : 0;
   const v = t >= 1 ? 1 : Math.max(Math.min(vis[a], vis[b]), Math.min(1, h * 2));
   if (v <= .01) continue;
   if (h > .04) hot.push([n, m, h, v]);
   else if (t >= 1) { ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); }
   else { ctx.globalAlpha = colors.beam * v; ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke(); }
  }
  if (t >= 1) { ctx.globalAlpha = colors.beam; ctx.stroke(); }
  ctx.strokeStyle = colors.ac;
  for (const [n, m, h, v] of hot) { ctx.globalAlpha = (.06 + h * .55) * Math.max(v, .5); ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke(); }
  N.forEach((n, i) => {
   const h = heats[i], v = vis[i];
   if (v <= .01) return;
   ctx.fillStyle = h > .04 ? colors.ac : colors.tx;
   ctx.globalAlpha = (h > .04 ? .35 + h * .65 : colors.node) * (h > .04 ? Math.max(v, .6) : v);
   ctx.beginPath(); ctx.arc(n.x, n.y, (1.3 + h * 1.4) * (.5 + .5 * v), 0, Math.PI * 2); ctx.fill();
  });
  ctx.globalAlpha = 1;
 }
 function reset() {
  stop();
  const rect = target.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
  width = rect.width; height = rect.height;
  canvas.width = Math.ceil(width*dpr);canvas.height = Math.ceil(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  const css = getComputedStyle(hero), light = document.documentElement.dataset.theme === 'light';
  colors = {tx:css.getPropertyValue('--tx3'),ac:css.getPropertyValue('--ac'),beam:light ? .16 : .13,node:light ? .45 : .38};
  model = mesh(width, height, innerWidth); paint(); publishMode();
 }
 function settle() { for(const n of model.nodes){n.x=n.px=n.ox;n.y=n.py=n.oy;} pulse = null; paint(); }
 function frame(now) {
  raf = 0;
  if (!visible || document.hidden || staticMode()) return;
  if (introStart === null) introStart = now;
  const start = performance.now();
  if (pulse && now - pulse.t0 > 1300) pulse = null;
  if (now - lastMove > 120) pointer = null;
  const speed = advance(model, pointer);
  paint(now);
  const ms = performance.now()-start;
  slow = ms > 8 ? slow+1 : 0;
  hero.dispatchEvent(new CustomEvent('nm:motion-frame',{detail:{ms,nodes:model.nodes.length}}));
  if (slow >= 30) { autoLite=true; reset(); return; }
  if (pointer || pulse || speed > .08 || introT(now) < 1) raf = requestAnimationFrame(frame);
  else settle();
 }
 const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
 hero.addEventListener('pointermove', event => {
  if (event.pointerType === 'touch' || !visible || document.hidden || staticMode()) return;
  const rect = target.getBoundingClientRect();
  pointer={x:event.clientX-rect.left,y:event.clientY-rect.top};lastMove=performance.now();
  kick();
 }, {passive:true});
 hero.addEventListener('pointerleave',()=>{pointer=null;});
 hero.addEventListener('nm:pulse', event => {
  if (!visible || document.hidden || staticMode() || !model) return;
  const rect = target.getBoundingClientRect(), {x, y} = event.detail;
  const px = x - rect.left, py = y - rect.top;
  pulse = { x: px, y: py, t0: performance.now(), reach: Math.hypot(Math.max(px, width - px), Math.max(py, height - py)) };
  for (const n of model.nodes) {
   const dx = n.ox - px, dy = n.oy - py, d = Math.hypot(dx, dy) || 1;
   const k = Math.max(0, 1 - d / 700) * 5;
   n.px = n.x - dx / d * k; n.py = n.y - dy / d * k;
  }
  lastMove = 0; kick();
 });
 const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries=>{
  visible=entries[0].isIntersecting;
  if(!visible) reset(); else if(model && introT(performance.now())<1) kick();
 }) : null;
 observer?.observe(hero); visible=!observer;
 document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
 addEventListener('pagehide',stop);
 reduce.addEventListener('change',reset);coarse.addEventListener('change',reset);
 connection?.addEventListener?.('change',reset);
 new MutationObserver(reset).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 if(typeof ResizeObserver==='function') new ResizeObserver(reset).observe(target);
 else addEventListener('resize',reset,{passive:true});
 reset(); if(visible) kick();
}

function sound() {
 const controls = [...document.querySelectorAll('.sound')];
 let enabled=true, announced=false, timer;
 try {enabled=localStorage.getItem('nm.sound')!=='off';} catch {}
 let copy=fallback[document.documentElement.lang] || fallback.en;
 try {copy=JSON.parse(document.querySelector('#motion-messages').textContent);} catch {}
 const audio=synthesizer();
 const blocked=new WeakSet();
 document.addEventListener('click',event=>{
  const button=event.target instanceof Element && event.target.closest('button');
  if(button?.matches(':disabled,[aria-disabled=true]'))blocked.add(event);
 },true);
 function sync() {
  controls.forEach(button=>{button.disabled=false;button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',enabled?copy.on:copy.off);button.title=enabled?copy.on:copy.off;});
 }
 function hint() {
  if(announced || !controls.length)return;
  announced=true;
  const host=controls.find(button=>button.getClientRects().length)||controls[0];
  const note=document.createElement('span');note.className='motion-sound-hint';note.role='status';note.textContent=copy.hint;
  host.parentElement.append(note);timer=setTimeout(()=>note.remove(),2000);
 }
 document.addEventListener('click',event=>{
  if(!event.isTrusted || document.hidden || !(event.target instanceof Element))return;
  const button=event.target.closest('.sound,[data-nm-sound],.switch,.tabs [role=tab],.play-button,.copy');
  if(!button || blocked.has(event) || button.matches(':disabled'))return;
  if(button.matches('.sound')) {
   enabled=!enabled;audio.stop();
   try{localStorage.setItem('nm.sound',enabled?'on':'off');}catch{}
   sync();
   if(enabled && audio.play('on'))hint();
   if(!enabled){clearTimeout(timer);document.querySelectorAll('.motion-sound-hint').forEach(n=>n.remove());}
   return;
  }
  if(!enabled)return;
  const kind=button.dataset.nmSound || (button.matches('.switch')?(button.getAttribute('aria-checked')==='true'?'modOn':'modOff'):button.matches('[role=tab]')?'tab':button.matches('.play-button')?'play':'copy');
  if(audio.play(kind))hint();
 });
 document.addEventListener('keydown',event=>{
  if(enabled && event.isTrusted && !event.repeat && !document.hidden && event.target instanceof Element && event.target.matches('.tabs [role=tab]') && ['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
   if(audio.play('tab'))hint();
  }
 });
 document.addEventListener('nm:sound',event=>{
  const {kind,sourceEvent}=event.detail || {};
  if(!enabled || document.hidden || kind!=='chip' || !sourceEvent?.isTrusted)return;
  const allowed=sourceEvent.type==='pointerdown' || (sourceEvent.type==='keydown' && !sourceEvent.repeat && ['Enter','Tab'].includes(sourceEvent.key));
  if(allowed && audio.play('chip'))hint();
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.suspend();});
 addEventListener('pagehide',()=>audio.suspend());
 sync();
}

export function init() {
 if(initialized || typeof document==='undefined')return;
 initialized=true;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const hero=document.querySelector('.hero');
 if(hero)background(hero,reduce);
 sound();
}
