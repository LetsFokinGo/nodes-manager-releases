export function mesh(width, height, viewport = width) {
 const step = Math.max(56, Math.min(72, 56 + (viewport - 1280) / 80));
 const nodes = [], edges = [];
 const cols = Math.ceil(width / step) + 1, rows = Math.ceil(height / (step * .866)) + 1;
 for (let row = 0; row < rows && nodes.length < 700; row++) {
  for (let col = 0; col < cols && nodes.length < 700; col++) {
   const x = col * step + (row % 2) * step / 2, y = row * step * .866;
   const i = nodes.length;
   nodes.push({ x, y, ox: x, oy: y, px: x, py: y, r: ((i * 2654435761) >>> 0) / 4294967296 });
   if (col) edges.push([i - 1, i]);
   if (row) {
    edges.push([i - cols, i]);
    const diagonal = col + (row % 2 ? 1 : -1);
    if (diagonal >= 0 && diagonal < cols) edges.push([i - cols + (row % 2 ? 1 : -1), i]);
   }
  }
 }
 return { nodes, edges };
}

export function advance({ nodes, edges }, pointer) {
 const forces = nodes.map(n => [(n.ox - n.x) * .12, (n.oy - n.y) * .12]);
 for (const [a, b] of edges) {
  const n = nodes[a], m = nodes[b];
  const dx = (m.x - n.x) - (m.ox - n.ox), dy = (m.y - n.y) - (m.oy - n.oy);
  forces[a][0] += dx * .025; forces[a][1] += dy * .025;
  forces[b][0] -= dx * .025; forces[b][1] -= dy * .025;
 }
 let speed = 0;
 nodes.forEach((n, i) => {
  let [fx, fy] = forces[i];
  if (pointer) {
   const dx = pointer.x - n.ox, dy = pointer.y - n.oy, d = Math.hypot(dx, dy);
   if (d < 180 && d > 0) {
    const pull = (1 - d / 180) * 1.5;
    fx += dx / d * pull; fy += dy / d * pull;
   }
  }
  let x = n.x + (n.x - n.px) * .9 + fx, y = n.y + (n.y - n.py) * .9 + fy;
  const distance = Math.hypot(x - n.ox, y - n.oy);
  if (distance > 14) { x = n.ox + (x - n.ox) * 14 / distance; y = n.oy + (y - n.oy) * 14 / distance; }
  speed += Math.abs(x - n.x) + Math.abs(y - n.y);
  n.px = n.x; n.py = n.y; n.x = x; n.y = y;
 });
 return speed;
}
