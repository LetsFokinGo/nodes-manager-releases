const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const t = JSON.parse($('#i18n').textContent);
const languageLinks = $$('a[lang][href]');
function syncLanguageLinks() {
 languageLinks.forEach(link => {
  const target = new URL(link.getAttribute('href'), location.href);
  target.hash = location.hash;
  link.href = target.href;
 });
}
syncLanguageLinks();
addEventListener('hashchange',syncLanguageLinks);
languageLinks.forEach(link=>link.addEventListener('click',()=>{
 try {localStorage.setItem('nm.lang',link.lang);} catch {}
}));
try {
 if(document.documentElement.lang==='en' && localStorage.getItem('nm.lang')==='ru') {
  const target = new URL('ru/',location.href);
  target.search=location.search;target.hash=location.hash;
  location.replace(target.href);
 }
} catch {}
document.documentElement.classList.add('js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const mobile = matchMedia('(max-width: 767px)');
const app = $('.app-window');
const tabs = $$('.tabs [role=tab]');
tabs.forEach(tab=>tab.disabled=false);
app.after($('.mobile-tabs-note'));
const switches = $$('.switch');
let state = [true,true,true,true,true,false,false,false];
let touched = false, active = 'play', launching = false, launchTimer, resetTimer, hintTimer, hintEndTimer;
let previousCount = 5;
function status() {
 const count = state.filter(Boolean).length;
 $$('.counter b').forEach(el => {
  el.textContent = count;
  el.classList.remove('tick-up','tick-down');
  if (count !== previousCount && !reduce.matches) {
   void el.offsetWidth;
   el.classList.add(count > previousCount ? 'tick-up' : 'tick-down');
  }
 });
 previousCount = count;
 if (!launching) $('.status').textContent = count ? `${t.ready} · ${t.enabled}: ${count}` : t.clean;
 switches.forEach((button,i) => button.setAttribute('aria-checked', String(state[i])));
}
function selectTab(name, focus = false) {
 if (mobile.matches && name !== 'mods') { openDialog($('#settings')); return; }
 active = name;
 tabs.forEach(tab => {
  const selected = tab.id === `tab-${name}`;
  tab.setAttribute('aria-selected',String(selected));
  tab.tabIndex = selected ? 0 : -1;
  $(`#${tab.getAttribute('aria-controls')}`).hidden = !selected;
  if (selected && focus) tab.focus();
 });
}
tabs.forEach((tab,index) => {
 tab.addEventListener('click',()=>selectTab(tab.id.slice(4)));
 tab.addEventListener('keydown',event=>{
  const keys = ['ArrowLeft','ArrowRight','Home','End'];
  if (!keys.includes(event.key)) return;
  event.preventDefault();
  if (mobile.matches) {selectTab('mods',true); return;}
  const next = event.key==='Home'?0:event.key==='End'?2:(index+(event.key==='ArrowRight'?1:2))%3;
  selectTab(tabs[next].id.slice(4),true);
 });
});
function responsive() {
 const focused = document.activeElement;
 const movingFocus = focused && app.contains(focused) && !focused.closest('#panel-mods');
 selectTab(mobile.matches?'mods':active);
 tabs.forEach(tab=>{
  tab.hidden = mobile.matches && tab.id !== 'tab-mods';
 });
 $('.mobile-tabs-note').hidden = !mobile.matches;
 if (movingFocus && mobile.matches) $('#tab-mods').focus();
 syncHeaderDownload();
}
switches.forEach((button,i)=>button.addEventListener('click',()=>{state[i]=!state[i];status();}));
$('#profile').addEventListener('change',event=>{
 state = event.target.value==='demo' ? [true,true,true,true,true,false,false,false] : [false,true,false,false,true,true,true,false];
 $$('.mod-row').forEach((row,i)=>{
  row.classList.remove('changed'); void row.offsetWidth;
  row.style.setProperty('--delay',`${i*40}ms`); row.classList.add('changed');
 });
 status();
});
$('.play-button').disabled = false;
$('.play-button').addEventListener('click',()=>{
 clearTimeout(launchTimer);clearTimeout(resetTimer);
 launching = true;
 $('.play-button').textContent = t.launching;
 $('.play-button').setAttribute('aria-disabled','true');
 $('.launch-message').hidden = false;
 $('.status').textContent = t.would;
 const progress = $('progress');progress.value=0;
 launchTimer=setTimeout(()=>{progress.value=1;$('.play-button').textContent=t.play;$('.play-button').removeAttribute('aria-disabled');},600);
 resetTimer=setTimeout(()=>{launching=false;$('.launch-message').hidden=true;status();},4000);
});
function syncTheme() {
 const light = document.documentElement.dataset.theme === 'light';
 $$('.theme').forEach(button=>{button.setAttribute('aria-label',light?t.dark:t.light);button.title=light?t.dark:t.light;});
 $('meta[name=theme-color]').content = light?'#f3f1ed':'#0d0d0e';
}
$$('.theme').forEach(button=>button.addEventListener('click',()=>{
 document.documentElement.dataset.theme = document.documentElement.dataset.theme==='light'?'dark':'light';
 try {localStorage.setItem('nm.theme',document.documentElement.dataset.theme);} catch {}
 syncTheme();
}));
let returnFocus;
function openDialog(dialog) {returnFocus=document.activeElement;dialog.showModal();}
$$('dialog').forEach(dialog=>{
 $('.close',dialog).addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>returnFocus?.focus());
});
$('.menu').addEventListener('click',()=>openDialog($('#settings')));
$$('.download').forEach(link=>link.addEventListener('click',event=>{if(mobile.matches){event.preventDefault();openDialog($('#mobile-download'));}}));
$('#mobile-download .copy').addEventListener('click',async()=>{
 try {await navigator.clipboard.writeText(t.release);$('#mobile-download .copy-status').textContent=t.copied;}
 catch {$('#mobile-download .copy-status').textContent=t.copyError;}
});
if(navigator.share){$('#mobile-download .share').hidden=false;$('#mobile-download .share').addEventListener('click',async()=>{try{await navigator.share({title:'Nodes Manager',url:t.release});}catch(error){if(error.name!=='AbortError')$('#mobile-download .copy-status').textContent=t.copyError;}});}
const header = $('header');
function syncHeaderDownload() {
 const rect=$('.intro .download').getBoundingClientRect();
 const visible=rect.bottom>0&&rect.top<innerHeight;
 $('.header-download').style.setProperty('display',mobile.matches||!visible?'inline-flex':'none','important');
}
addEventListener('scroll',()=>{header.classList.toggle('scrolled',scrollY>24);syncHeaderDownload();},{passive:true});
const ctaObserver = typeof IntersectionObserver==='function' && new IntersectionObserver(syncHeaderDownload);
ctaObserver?.observe($('.intro .download'));

let frameTimer, observer, entranceAnims=[];
const TS=/[?&]slow\b/.test(location.search)?6:1;
function finishEntrance() {
 clearTimeout(frameTimer);
 entranceAnims.forEach(a=>{try{a.finish();}catch{a.cancel();}});entranceAnims=[];
 $('.frame-svg')?.remove();
 document.documentElement.classList.remove('boot');
 if(app.classList.contains('entering')){
  app.classList.remove('entering');
  const r=app.getBoundingClientRect();
  $('.hero')?.dispatchEvent(new CustomEvent('nm:pulse',{detail:{x:r.left+r.width/2,y:r.top+r.height/2}}));
 }
 status();
}
function stopHint(){touched=true;app.classList.remove('hint');clearTimeout(hintTimer);clearTimeout(hintEndTimer);finishEntrance();}
app.addEventListener('pointerdown',stopHint,{once:true});
app.addEventListener('keydown',stopHint,{once:true});
function entrance(){
 let seen=false;try{seen=sessionStorage.getItem('nm.hero.seen')==='1';}catch{}
 if(seen||reduce.matches||touched||!Element.prototype.animate||mobile.matches){document.documentElement.classList.remove('boot');return false;}
 try{sessionStorage.setItem('nm.hero.seen','1');}catch{}
 const rect=app.getBoundingClientRect();
 const ns='http://www.w3.org/2000/svg';
 const svg=document.createElementNS(ns,'svg');svg.classList.add('frame-svg');svg.setAttribute('aria-hidden','true');svg.setAttribute('viewBox',`0 0 ${rect.width} ${rect.height}`);
 const parts=[app,$('.titlebar',app),$('.tabs',app),...$$('#panel-play .preview-card',app),$('.play-button',app),$('.status',app)].filter(el=>el&&el.getBoundingClientRect().height);
 const nodes=[],beams=[];
 const node=(x,y)=>{let n=nodes.find(p=>Math.abs(p.x-x)<4&&Math.abs(p.y-y)<4);if(!n){n={x,y};nodes.push(n);}return n;};
 parts.forEach(el=>{
  const r=el.getBoundingClientRect(),x=r.left-rect.left,y=r.top-rect.top,w=r.width,h=r.height;
  const c=[node(x+.5,y+.5),node(x+w-.5,y+.5),node(x+w-.5,y+h-.5),node(x+.5,y+h-.5)];
  for(let k=0;k<4;k++)beams.push([c[k],c[(k+1)%4]]);
  if(el.matches('.preview-card,.play-button'))beams.push([c[0],c[2]]);
 });
 const dist=p=>Math.hypot(p.x,p.y)/Math.hypot(rect.width,rect.height);
 const anim=(el,kf,o)=>{const a=el.animate(kf,{fill:'both',easing:'cubic-bezier(.2,.8,.2,1)',...o,duration:o.duration*TS,delay:(o.delay||0)*TS});entranceAnims.push(a);return a;};
 beams.sort((a,b)=>dist(a[0])+dist(a[1])-dist(b[0])-dist(b[1])).forEach(([a,b],i)=>{
  const l=document.createElementNS(ns,'line'),len=Math.hypot(b.x-a.x,b.y-a.y);
  l.setAttribute('x1',a.x);l.setAttribute('y1',a.y);l.setAttribute('x2',b.x);l.setAttribute('y2',b.y);
  l.style.strokeDasharray=len;svg.append(l);
  anim(l,[{strokeDashoffset:len},{strokeDashoffset:0}],{duration:240,delay:180+i/(beams.length-1||1)*140});
 });
 nodes.forEach(p=>{
  const c=document.createElementNS(ns,'circle');c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r','2.4');svg.append(c);
  anim(c,[{opacity:0,transform:'scale(0)'},{opacity:1,transform:'scale(1.8)',offset:.6},{opacity:1,transform:'scale(1)'}],{duration:200,delay:dist(p)*200});
 });
 anim(svg,[{opacity:1},{opacity:1,offset:.75},{opacity:0}],{duration:1100,easing:'linear'});
 app.append(svg);app.classList.add('entering');
 anim(app,[{backgroundColor:'transparent',borderColor:'transparent'},{backgroundColor:'transparent',borderColor:'transparent',offset:.68},{}],{duration:780,easing:'ease-out'});
 [$('.titlebar',app),$('.tabs',app),$('.status',app)].forEach((el,i)=>el&&anim(el,[{opacity:0},{opacity:0,offset:.7},{opacity:1}],{duration:760+i*40}));
 $$('#panel-play .preview-card',app).forEach((el,i)=>{
  anim(el,[{opacity:0},{opacity:0,offset:.72},{opacity:1}],{duration:720+i*40});
  const media=$('img',el);
  if(media)anim(media,[{opacity:0,transform:'scale(.94)',filter:'blur(6px)'},{opacity:1,transform:'none',filter:'none'}],{duration:320,delay:700+i*70});
  $$('span',el).forEach((s,k)=>anim(s,[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:260,delay:720+i*70+k*40}));
 });
 const pb=$('.play-bottom',app);
 if(pb)anim(pb,[{opacity:0},{opacity:0,offset:.75},{opacity:1}],{duration:800});
 const btn=$('.play-button',app);
 if(btn)anim(btn,[{boxShadow:'0 0 0 0 rgba(255,140,40,.55)'},{boxShadow:'0 0 0 14px rgba(255,140,40,0)'}],{duration:600,delay:940,easing:'ease-out'});
 const counter=$('.counter b',app),target=state.filter(Boolean).length;
 if(counter){const t0=performance.now()+760*TS;const tick=now=>{const k=Math.min(1,Math.max(0,(now-t0)/(240*TS)));counter.textContent=Math.round(k*target);if(k<1&&app.classList.contains('entering'))requestAnimationFrame(tick);};counter.textContent='0';requestAnimationFrame(tick);}
 $('.status',app).textContent=t.scanning;
 document.documentElement.classList.remove('boot');
 frameTimer=setTimeout(finishEntrance,1100*TS);
 return true;
}
observer=typeof IntersectionObserver==='function' && new IntersectionObserver(entries=>{if(entries[0].intersectionRatio>=.3){observer.disconnect();if(entrance())hintTimer=setTimeout(()=>{if(!touched&&!reduce.matches&&!document.hidden){app.classList.add('hint');hintEndTimer=setTimeout(()=>app.classList.remove('hint'),1500);}},1200);}}, {threshold:.3});
observer?.observe(app);
reduce.addEventListener('change',()=>{if(reduce.matches)stopHint();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopHint();});
addEventListener('pagehide',stopHint);
mobile.addEventListener('change',()=>{finishEntrance();responsive();});
responsive();status();syncTheme();
$('.hero-filter')?.addEventListener('click',async event=>{
 if(!document.getElementById('cars'))return;
 event.preventDefault();
 await initSection('cars');
 document.getElementById('cars').scrollIntoView({behavior:reduce.matches?'instant':'smooth'});
 $('#cars input')?.focus({preventScroll:true});
});

const sectionModules = {features:'features',cars:'cars',security:'security',closing:'faq'};
const sectionPromises=new Map();
function initSection(name) {
 if(!sectionPromises.has(name))sectionPromises.set(name,import(`./sections/${name}/client.js`).then(module=>module.init()));
 return sectionPromises.get(name);
}
for(const [name,id] of Object.entries(sectionModules)) {
 const target=document.getElementById(id);
 if(!target)continue;
 const load=()=>initSection(name);
 if(typeof IntersectionObserver!=='function'){load();continue;}
 const lazy=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){lazy.disconnect();load();}},{rootMargin:'600px'});
 lazy.observe(target);
}
const loadRelease=()=>import('./sections/download/client.js').then(module=>module.init());
if(document.readyState==='complete')loadRelease();else addEventListener('load',loadRelease,{once:true});
