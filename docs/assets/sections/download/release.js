export const LATEST = 'https://github.com/LetsFokinGo/nodes-manager-releases/releases/latest';
export const API = 'https://api.github.com/repos/LetsFokinGo/nodes-manager-releases/releases/latest';
export const EMPTY = Object.freeze({version:null,date:null,assetName:null,size:null,sha256:null,directDownloadUrl:null,virustotal:null});
export function normalizeRelease(value = {}) {
 const r = value && typeof value === 'object' ? value : {};
 const name = typeof r.assetName === 'string' && /^[A-Za-z0-9_. -]+_x64-setup\.exe$/.test(r.assetName) ? r.assetName : null;
 const hash = typeof r.sha256 === 'string' ? r.sha256.replace(/^sha256:/i,'') : '';
 const version = typeof r.version === 'string' && /^v?\d+\.\d+\.\d+(?:\.\d+)?$/.test(r.version) ? r.version.replace(/^v/,'') : null;
 const date = typeof r.date === 'string' && /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(r.date) && Number.isFinite(Date.parse(r.date)) ? r.date : null;
 const direct = safeUrl(r.directDownloadUrl, 'github.com', '/LetsFokinGo/nodes-manager-releases/releases/download/');
 return {version,date,assetName:name,size:Number.isSafeInteger(r.size)&&r.size>0?r.size:null,sha256:/^[a-f0-9]{64}$/i.test(hash)?hash.toLowerCase():null,directDownloadUrl:name && direct && filenameMatches(direct,name)?direct:null,virustotal:safeUrl(r.virustotal,'www.virustotal.com','/gui/file/')};
}
function filenameMatches(url,name){try{return decodeURIComponent(new URL(url).pathname.split('/').at(-1))===name;}catch{return false;}}
function safeUrl(value, host, prefix) {try {const u=new URL(value);return u.protocol==='https:' && !u.username && !u.password && !u.port && u.hostname===host && u.pathname.startsWith(prefix) && !u.search && !u.hash && (host!=='www.virustotal.com'||/^\/gui\/file\/[a-f0-9]{64}\/?$/i.test(u.pathname)) ? u.href:null;}catch{return null;}}
export function fromApi(body) {
 if(!body || typeof body.tag_name!=='string' || body.draft || body.prerelease) return {...EMPTY};
 const a=Array.isArray(body.assets)?body.assets.find(x=>x && typeof x.name==='string' && /^[A-Za-z0-9_. -]+_x64-setup\.exe$/.test(x.name)):null;
 if(!a)return {...EMPTY};
 return normalizeRelease({version:body.tag_name,date:body.published_at,assetName:a?.name,size:a?.size,sha256:a?.digest,directDownloadUrl:a?.browser_download_url,virustotal:(typeof body.body==='string'?body.body:'').match(/https:\/\/www\.virustotal\.com\/gui\/file\/[a-f0-9]{64}(?![a-f0-9])/i)?.[0]});
}
export function hashCommand(r) {return r.assetName ? "Get-FileHash -LiteralPath '.\\"+r.assetName+"' -Algorithm SHA256" : null;}
export function formatRelease(r, lang, m) {const v={version:r.version ? 'v'+r.version:m.pending,date:r.date?new Intl.DateTimeFormat(lang,{dateStyle:'medium',timeZone:'UTC'}).format(new Date(r.date)):m.pending,size:r.size?new Intl.NumberFormat(lang,{maximumFractionDigits:1}).format(r.size/1048576)+' '+m.mb:m.pending,assetName:r.assetName||m.pending,sha256:r.sha256||m.hashPending,command:hashCommand(r)||m.commandPending};return {...v,summary:r.version?[v.version,r.size?v.size:null].filter(Boolean).join(' · '):m.pending};}
export const escapeHtml = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const json = value => JSON.stringify(value).replace(/</g,'\u003c');
