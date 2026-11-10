import {normalizeRelease, fromApi, formatRelease, hashCommand, API} from './release.js';
let initialized=false;
export async function init(){
 const section=document.querySelector('#download'), data=section?.querySelector('[data-download-messages]');
 if(!data||initialized)return; initialized=true;
 const {lang,messages:m,release:fallback}=JSON.parse(data.textContent); let release=normalizeRelease(fallback);
 const all=s=>document.querySelectorAll(s), status=section.querySelector('[data-release-status]');
 const page=()=>{const u=new URL(location.href);u.hash='download';return u.href;};
 const update=(r,api=false)=>{release=r;const v=formatRelease(r,lang,m);for(const k of ['summary','version','date','size','assetName','sha256','command'])all('[data-release-'+k.replace(/[A-Z]/g,x=>'-'+x.toLowerCase())+']').forEach(el=>el.textContent=v[k]);
 if(r.sha256)all('code[data-release-sha256]').forEach(code=>{code.replaceChildren();for(const [i,text] of [r.sha256.slice(0,12),r.sha256.slice(12,-12),r.sha256.slice(-12)].entries()){const span=document.createElement('span');span.textContent=text;if(i===1)span.className='download-hash-middle';code.append(span);}});
 for(const [key,value] of [['direct',r.directDownloadUrl],['virustotal',r.virustotal]])all('[data-release-'+key+']').forEach(el=>{el.hidden=!value;if(value)el.href=value;});
 if(r.directDownloadUrl)all('[data-release-cta],a.download,a.header-download').forEach(el=>{el.href=r.directDownloadUrl;});
 all('[data-release-copy]').forEach(b=>{b.hidden=b.dataset.releaseCopy==='hash'?!r.sha256:b.dataset.releaseCopy==='command'?!hashCommand(r):false;});
 all('[data-release-source]').forEach(el=>el.textContent=api?m.apiSource:m.source);
 all('[data-release-page]').forEach(a=>{a.href=page();a.textContent=page();});};
 update(release);
 all('[data-release-copy]').forEach(b=>b.addEventListener('click',async()=>{const type=b.dataset.releaseCopy,text=type==='hash'?release.sha256:type==='command'?hashCommand(release):page();if(!text)return;try{await navigator.clipboard.writeText(text);status.textContent=m.copied;}catch{status.textContent=m.failed;const target=section.querySelector(type==='hash'?'[data-release-sha256]':type==='command'?'[data-release-command]':'[data-release-page]');if(target){const range=document.createRange();range.selectNodeContents(target);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);target.focus();}}}));
 if(navigator.share)all('[data-release-share]').forEach(b=>{b.hidden=false;b.addEventListener('click',async()=>{try{await navigator.share({title:m.shareTitle,url:page()});}catch(e){if(e.name!=='AbortError')status.textContent=m.failed;}});});
 const key='nm.release.v1';try{const cache=JSON.parse(sessionStorage.getItem(key));if(cache&&Number.isFinite(cache.time)&&Date.now()>=cache.time&&Date.now()-cache.time<3600000){const cached=normalizeRelease(cache.release);if(cached.version){update(cached,true);return;}}}catch{}
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),4000);
 try{const response=await fetch(API,{signal:controller.signal,headers:{Accept:'application/vnd.github+json'},credentials:'omit',referrerPolicy:'no-referrer'});if(!response.ok)return;const next=fromApi(await response.json());if(!next.version||!next.assetName||!next.date||!next.size)return;if(next.version===release.version&&next.assetName===release.assetName){next.sha256 ||= release.sha256;next.virustotal ||= release.virustotal;}update(next,true);try{sessionStorage.setItem(key,JSON.stringify({time:Date.now(),release:next}));}catch{}}catch{}finally{clearTimeout(timer);}
}
