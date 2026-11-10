import { CAR_FIELDS } from './query.js';
import { parseCarQuery, matchingConfigs } from './match.js';
export function init() {
  const root = document.querySelector('#cars');
  if (!root || root.dataset.ready) return;
  const cars=JSON.parse(root.querySelector('.cars-data').textContent), m=JSON.parse(root.querySelector('.cars-messages').textContent);
  root.querySelectorAll('.cars-preview').forEach(img=>{const fallback=()=>{img.hidden=true;};img.addEventListener('error',fallback);if(img.complete&&!img.naturalWidth)fallback();});
  root.dataset.ready='true'; root.classList.add('cars-enhanced');
  const input=root.querySelector('.cars-input'), overlay=root.querySelector('.cars-highlight'), list=root.querySelector('.cars-suggestions'), help=root.querySelector('.cars-help'), syntax=root.querySelector('.cars-syntax'), diagnostic=root.querySelector('.cars-diagnostic'), clear=root.querySelector('.cars-clear'), count=root.querySelector('.cars-count'), live=root.querySelector('.cars-announcement'), empty=root.querySelector('.cars-empty');
  const cards=[...root.querySelectorAll('.cars-card')], reduce=matchMedia('(prefers-reduced-motion:reduce)');
  let debounce, announcement, typing, suggestions=[], selected=-1, lastAnnouncement=0, request=0, inView=false, human=null;
  const grid=root.querySelector('.cars-grid');
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;},{rootMargin:'0px'}).observe(root);
  root.querySelectorAll('button,input').forEach(el=>el.disabled=false);
  syntax.hidden=true; help.setAttribute('aria-expanded','false');
  function close() { list.hidden=true; input.setAttribute('aria-expanded','false'); input.removeAttribute('aria-activedescendant'); selected=-1; }
  function diagnostics(q) {
    const p=parseCarQuery(q), unknown=q.match(/(?:^|\s)-?[\p{L}_]+\s*(?:<=|>=|:|=|<|>)\s*[^\s]*/gu)??[];
    return [...new Set([...p.invalid,...unknown.filter(token=>!Object.hasOwn(CAR_FIELDS,token.trim().replace(/^-/,'').split(/\s*[:=<>]/)[0].toLowerCase()))])].map(s=>s.trim());
  }
  function highlight() {
    overlay.replaceChildren();
    if(human!==null){overlay.textContent=input.value;overlay.scrollLeft=input.scrollLeft;diagnostic.hidden=true;diagnostic.textContent='';return;}
    const invalid=diagnostics(input.value);
    for(const token of input.value.split(/(\s+)/)) {
      const span=document.createElement('span'), match=/^(-?[\p{L}_]+)(<=|>=|:|=|<|>)(.*)$/u.exec(token);
      if(invalid.includes(token)) {span.className='cars-invalid';span.textContent=token;}
      else if(match) {for(let i=1;i<4;i++){const part=document.createElement('span');part.className=['','cars-key','cars-op','cars-value'][i];part.textContent=match[i];span.append(part);}}
      else span.textContent=token;
      overlay.append(span);
    }
    overlay.scrollLeft=input.scrollLeft;
    diagnostic.hidden=!invalid.length; diagnostic.textContent=invalid.length?`${m.ignored} ${invalid.join(', ')}`:'';
  }
  function update() {
    clearTimeout(debounce);
    const parsed=parseCarQuery(human??input.value), before=new Map(cards.filter(el=>!el.hidden).map(el=>[el,el.getBoundingClientRect()]));
    let n=0;
    root.querySelectorAll('.cars-exit').forEach(el=>el.remove());
    const gridRect=grid.getBoundingClientRect();
    cards.forEach(card=>{
      if(!reduce.matches&&inView&&!document.hidden&&before.has(card)&&!matchingConfigs(cars[cards.indexOf(card)],parsed,m.lang).length){
        const rect=before.get(card), ghost=card.cloneNode(true);ghost.classList.add('cars-exit');ghost.setAttribute('aria-hidden','true');ghost.style.cssText=`position:absolute;left:${rect.left-gridRect.left}px;top:${rect.top-gridRect.top}px;width:${rect.width}px;height:${rect.height}px;pointer-events:none`;grid.append(ghost);
        ghost.animate([{opacity:1},{opacity:0}],{duration:120}).finished.catch(()=>{}).finally(()=>ghost.remove());
      }
    });
    cards.forEach((card,i)=>{
      const configs=matchingConfigs(cars[i],parsed,m.lang), show=!!configs.length, wasHidden=card.hidden;
      card.getAnimations().forEach(a=>a.cancel()); card.hidden=!show;
      if(show) {
        n++;const cfg=configs[0];
        card.querySelector('.cars-power').textContent=cfg.power??'—';card.querySelector('.cars-class').textContent=cfg.perfClass??cars[i].perfClass??'—';card.querySelector('.cars-config-name').textContent=cfg.title?.[m.lang]??m.selected;card.querySelector('.cars-config-label').hidden=!cfg.title?.[m.lang]||cfg.title[m.lang]===m.selected;
        if(!reduce.matches&&inView&&!document.hidden) {
          const old=before.get(card), next=card.getBoundingClientRect();
          if(old) card.animate([{transform:`translate(${old.left-next.left}px,${old.top-next.top}px)`},{transform:'none'}],{duration:200,easing:'ease-out'});
          else if(wasHidden) card.animate([{opacity:0},{opacity:1}],{duration:120});
        }
      }
    });
    count.textContent=m.count.replace('{n}',n);empty.hidden=n!==0;clear.hidden=!input.value;
    clearTimeout(announcement); const text=count.textContent;
    announcement=setTimeout(()=>{live.textContent=text;lastAnnouncement=performance.now();},Math.max(0,500-(performance.now()-lastAnnouncement)));
    highlight();
  }
  function suggest() {
    if(human!==null){close();return;}
    const fragment=input.value.slice(0,input.selectionStart).match(/(?:^|\s)(-?[^\s]*)$/)?.[1]??'';
    if(!fragment){close();return;}
    const neg=fragment.startsWith('-')?'-':'', part=fragment.slice(neg.length), field=/^([\p{L}_]+)(:|=|<=|>=|<|>)(.*)$/u.exec(part);
    let options=[];
    if(field) {
      const kind=CAR_FIELDS[field[1].toLowerCase()], prefix=field[1]+field[2], v=field[3].toLowerCase();
      const values=kind==='country'?[...new Set(cars.map(c=>c.countryName[m.lang].toLowerCase()))]:kind==='class'?['D','C','B','A','S','X']:kind==='drive'?['awd','rwd','fwd','4wd']:[];
      options=values.filter(s=>s.toLowerCase().startsWith(v)).map(s=>prefix+(s.includes(' ')?`"${s}"`:s));
    } else {
      options=Object.keys(CAR_FIELDS).filter(k=>(m.lang==='ru'?/[а-я]/i.test(k):!/[^a-z_]/i.test(k))&&k.startsWith(part.toLowerCase())).flatMap(k=>['power','weight','year','class'].includes(CAR_FIELDS[k])?[`${k}:`,`${k}>`,`${k}>=`,`${k}<`,`${k}<=`]:[`${k}:`]);
    }
    suggestions=options.slice(0,10).map(s=>neg+s); selected=-1;list.replaceChildren();
    suggestions.forEach((s,i)=>{const li=document.createElement('li');li.id=`cars-option-${i}`;li.role='option';li.setAttribute('aria-selected','false');li.textContent=s;li.addEventListener('pointerdown',e=>{e.preventDefault();insert(i,e);});list.append(li);});
    list.hidden=!suggestions.length;input.setAttribute('aria-expanded',String(!!suggestions.length));input.removeAttribute('aria-activedescendant');
  }
  function insert(i, sourceEvent) {
    const pos=input.selectionStart, start=input.value.slice(0,pos).search(/-?[^\s]*$/), value=suggestions[i];
    input.setRangeText(value,start,pos,'end');close();input.focus();highlight();update();
    if (sourceEvent?.isTrusted) document.dispatchEvent(new CustomEvent('nm:sound',{detail:{kind:'chip',sourceEvent}}));
    if(/[:=<>]$/.test(value)) suggest();
  }
  function leaveHuman(e) {
    if(human===null)return;
    clearTimeout(typing);request++;
    const q=human, deleting=e.inputType?.startsWith('delete');
    human=null;
    if(deleting){e.preventDefault();input.value=q;}
    else input.value=q+' ';
    input.setSelectionRange(input.value.length,input.value.length);
    highlight();if(deleting){suggest();update();}
  }
  input.addEventListener('beforeinput',leaveHuman);
  input.addEventListener('input',()=>{clearTimeout(typing);request++;highlight();suggest();clearTimeout(debounce);debounce=setTimeout(update,80);});
  input.addEventListener('scroll',()=>overlay.scrollLeft=input.scrollLeft);
  input.addEventListener('focus',suggest);input.addEventListener('blur',()=>setTimeout(close,120));
  input.addEventListener('keydown',e=>{
    if(e.key==='Escape'){close();return;}
    if((e.key==='ArrowDown'||e.key==='ArrowUp')&&!list.hidden){e.preventDefault();selected=selected<0?(e.key==='ArrowDown'?0:suggestions.length-1):(selected+(e.key==='ArrowDown'?1:-1)+suggestions.length)%suggestions.length;[...list.children].forEach((el,i)=>el.setAttribute('aria-selected',String(i===selected)));input.setAttribute('aria-activedescendant',`cars-option-${selected}`);list.children[selected].scrollIntoView({block:'nearest'});}
    else if((e.key==='Enter'||e.key==='Tab')&&!list.hidden&&suggestions.length){e.preventDefault();insert(selected>=0?selected:0,e);}
    else if(e.key==='Enter'){e.preventDefault();close();update();}
  });
  root.querySelectorAll('.cars-chip').forEach(button=>button.addEventListener('click',()=>{
    clearTimeout(typing);clearTimeout(debounce);close();input.focus(); const q=button.dataset.localQuery??button.dataset.query, label=button.textContent.trim(), id=++request;
    human=q;
    const finish=()=>{input.value=label;close();highlight();update();};
    if(reduce.matches){finish();return;}
    const start=performance.now();
    function step(){if(id!==request)return;input.value=label.slice(0,Math.ceil((performance.now()-start)/300*label.length));highlight();if(performance.now()-start<300)typing=setTimeout(step,20);else finish();}
    step();
  }));
  clear.addEventListener('click',()=>{clearTimeout(typing);request++;human=null;input.value='';close();update();input.focus();});
  help.addEventListener('click',()=>{syntax.hidden=!syntax.hidden;help.setAttribute('aria-expanded',String(!syntax.hidden));});
  const stopMotion=()=>{cards.forEach(el=>el.getAnimations().forEach(a=>a.cancel()));root.querySelectorAll('.cars-exit').forEach(el=>el.remove());};
  reduce.addEventListener('change',stopMotion);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopMotion();clearTimeout(typing);if(input.value)update();}});
  update();
}
