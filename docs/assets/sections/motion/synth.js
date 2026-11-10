export const tones = {
 on: [90, -20, 800, 1100], off: [60, -20, 600],
 modOn: [40, -24, 1200], modOff: [40, -24, 850],
 tab: [30, -28, 300], chip: [25, -28, 1300], folder: [35, -28, 180],
 play: [180, -22, 280, 440], copy: [50, -26, 950],
};
export function synthesizer(host = globalThis) {
 let context, sources = [], last = -Infinity;
 function stop() {
  sources.forEach(source => { try { source.stop(); source.disconnect(); } catch {} });
  sources = [];
 }
 function play(kind) {
  const tone = tones[kind], now = host.performance.now();
  if (!tone || now - last < 40) return false;
  try {
   const Audio = host.AudioContext || host.webkitAudioContext;
   if (!Audio) return false;
   context ||= new Audio();
   if (context.state === 'closed') return false;
   last = now; stop();
   if (context.state === 'suspended') context.resume().catch(() => {});
   schedule(kind, tone);
   return true;
  } catch { stop(); return false; }
 }
 function schedule(kind, tone) {
  try {
   const [ms, db, ...frequencies] = tone, start = context.currentTime;
   frequencies.forEach((frequency, i) => {
    const at = start + i * ms / 1000 / frequencies.length;
    const end = start + (i + 1) * ms / 1000 / frequencies.length;
    const voice = context.createOscillator(), gain = context.createGain();
    voice.type = kind.startsWith('mod') ? 'triangle' : 'sine';
    voice.frequency.setValueAtTime(frequency, at);
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(10 ** (db / 20), at + .002);
    gain.gain.exponentialRampToValueAtTime(.00001, end - .001);
    gain.gain.setValueAtTime(0, end);
    voice.connect(gain); gain.connect(context.destination);
    let half;
    if(kind.startsWith('mod')) {
     const noise=context.createBufferSource(), buffer=context.createBuffer(1,Math.ceil(context.sampleRate*.012),context.sampleRate);
     const data=buffer.getChannelData(0);
     for(let j=0;j<data.length;j++)data[j]=(Math.random()*2-1)*.5;
     noise.buffer=buffer;noise.connect(gain);sources.push(noise);
     voice.disconnect();half=context.createGain();half.gain.value=.5;
     voice.connect(half);half.connect(gain);
     noise.onended=()=>noise.disconnect();
     noise.start(at);noise.stop(at+.012);
    }
    sources.push(voice); voice.onended = () => { sources = sources.filter(s => s !== voice); voice.disconnect(); gain.disconnect(); half?.disconnect(); };
    voice.start(at); voice.stop(end);
   });
  } catch { stop(); }
 }
 return { play, stop, suspend() { stop(); try { context?.suspend().catch(() => {}); } catch {} } };
}
