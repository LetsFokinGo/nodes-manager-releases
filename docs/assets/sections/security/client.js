export function init(){
 const root=document.querySelector('#security');
 if(!root||root.dataset.ready)return;
 root.dataset.ready='true';
 const m=JSON.parse(root.querySelector('[data-security-messages]').textContent),buttons=[...root.querySelectorAll('[data-security-folder]')],panel=root.querySelector('#security-panel'),map=root.querySelector('[data-security-map]'),g=root.querySelector('.security-lines g');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:767px)'),ns='http://www.w3.org/2000/svg';
 let selected=buttons[0];
 function choose(b){
  if(selected===b)return;
  selected=b;
  const f=m.folders.find(x=>x.id===b.dataset.securityFolder);
  buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  panel.replaceChildren();
  const h=document.createElement('h3');h.textContent=f.title;panel.append(h);
  const dl=document.createElement('dl');
  for(const k of ['reads','writes','never']){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=m[k];dd.textContent=f[k];row.append(dt,dd);dl.append(row);}
  panel.append(dl);draw(true);
 }
 function draw(animate=false){
  const box=root.querySelector('.security-lines').getBoundingClientRect(),app=root.querySelector('.security-app').getBoundingClientRect();
  g.replaceChildren();
  buttons.forEach(b=>{
   const folder=b.getBoundingClientRect(),active=b===selected;
   for(const kind of (b.dataset.securityFolder==='game'?['read']:['read','write'])){
    const write=kind==='write',offset=write?5:-5;
    let a,f,route;
    if(mobile.matches){
     a=[app.left-box.left,app.top+app.height/2-box.top+offset];
     f=[folder.left-box.left,folder.top+folder.height/2-box.top+offset];
     const lane=write?22:10;
     route=write?`M ${a} H ${lane} V ${f[1]} H ${f[0]}`:`M ${f} H ${lane} V ${a[1]} H ${a[0]}`;
    }else{
     a=[app.left+app.width/2-box.left+offset,app.bottom-box.top];
     f=[folder.left+folder.width/2-box.left+offset,folder.top-box.top];
     const mid=(a[1]+f[1])/2;
     route=write?`M ${a} C ${a[0]} ${mid} ${f[0]} ${mid} ${f}`:`M ${f} C ${f[0]} ${mid} ${a[0]} ${mid} ${a}`;
    }
    const path=document.createElementNS(ns,'path');
    path.setAttribute('d',route);
    path.setAttribute('class',`security-line security-${kind}${active?' security-selected':''}`);
    path.setAttribute('marker-end',`url(#security-arrow-${kind})`);
    path.dataset.folder=b.dataset.securityFolder;path.dataset.direction=kind;g.append(path);
    if(animate&&active&&!reduced.matches){
     const pulse=document.createElementNS(ns,'path'),length=path.getTotalLength();
     pulse.setAttribute('d',route);pulse.setAttribute('class',`security-pulse security-${kind}`);
     pulse.style.strokeDasharray=`12 ${length}`;g.append(pulse);
     const motion=pulse.animate([{strokeDashoffset:12},{strokeDashoffset:-length}],{duration:900,easing:'ease-in-out'});
     motion.onfinish=()=>pulse.remove();
    }
   }
  });
 }
 buttons.forEach(b=>{b.addEventListener('click',()=>choose(b));b.addEventListener('focus',()=>choose(b));b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')choose(b);});});
 const table=root.querySelector('.security-table'),mq=matchMedia('(min-width:768px)');
 table.open=!mq.matches;mq.addEventListener('change',()=>{table.open=!mq.matches;draw();});
 if(typeof ResizeObserver!=='undefined'){const ro=new ResizeObserver(()=>draw());ro.observe(map);ro.observe(root.querySelector('.security-app'));buttons.forEach(b=>ro.observe(b));}
 window.addEventListener('resize',()=>draw());reduced.addEventListener('change',()=>draw());draw();
 if(!reduced.matches&&typeof IntersectionObserver!=='undefined'){
  const io=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){draw(true);io.disconnect();}},{threshold:.2});io.observe(map);
 }
}
