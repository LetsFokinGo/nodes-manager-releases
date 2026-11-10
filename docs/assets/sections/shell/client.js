export function init() {
 if(document.documentElement.dataset.shellReady)return;
 document.documentElement.dataset.shellReady='1';
 const legacy=!!document.querySelector('.app-window');
 const t=JSON.parse(document.querySelector('#shell-i18n').textContent);
 const links=[...document.querySelectorAll('[data-shell-language]')];
 const sync=()=>links.forEach(link=>{const url=new URL(link.getAttribute('href'),location.href);url.hash=location.hash;link.href=url.href;});
 sync();addEventListener('hashchange',sync);
 if(!legacy){
  document.documentElement.classList.add('js');
  links.forEach(link=>link.addEventListener('click',()=>{try{localStorage.setItem('nm.lang',link.lang);}catch{}}));
  try{const saved=localStorage.getItem('nm.lang');if(document.documentElement.lang===t.defaultLanguage&&saved&&saved!==t.defaultLanguage){const link=links.find(a=>a.lang===saved);if(link)location.replace(link.href);}}catch{}
  const theme=()=>{const light=document.documentElement.dataset.theme==='light';document.querySelectorAll('.theme').forEach(b=>{b.title=light?t.dark:t.light;b.setAttribute('aria-label',b.title);});document.querySelector('meta[name=theme-color]').content=light?'#f3f1ed':'#0d0d0e';};
  document.querySelectorAll('.theme').forEach(b=>b.addEventListener('click',()=>{const el=document.documentElement;el.dataset.theme=el.dataset.theme==='light'?'dark':'light';try{localStorage.setItem('nm.theme',el.dataset.theme);}catch{}theme();}));theme();
  const dialog=document.querySelector('#settings'), menu=document.querySelector('.menu');
  menu.addEventListener('click',()=>{if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','');menu.setAttribute('aria-expanded','true');});
  dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  dialog.addEventListener('close',()=>{menu.setAttribute('aria-expanded','false');menu.focus();});
  addEventListener('scroll',()=>document.querySelector('header').classList.toggle('scrolled',scrollY>24),{passive:true});
 }
 const dialog=document.querySelector('#settings'), menu=document.querySelector('.menu');
 dialog.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>dialog.close()));
 if(typeof MutationObserver!=='undefined')new MutationObserver(()=>menu.setAttribute('aria-expanded',String(dialog.open))).observe(dialog,{attributes:true,attributeFilter:['open']});
 const targets=[...document.querySelectorAll('main section[id]')];
 if(typeof IntersectionObserver!=='undefined'){
  const observer=new IntersectionObserver(entries=>{const active=entries.find(entry=>entry.isIntersecting);if(!active)return;document.querySelectorAll('.shell-nav a').forEach(link=>{if(new URL(link.href).hash==='#'+active.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});},{rootMargin:'-15% 0px -65% 0px'});targets.forEach(target=>observer.observe(target));
 }
}
