"use client";

export type FunStop = {
  id: string;
  title: string;
  subtitle?: string;
  body?: string[];
  images?: string[];
  house: { x: number; y: number; w: number; h: number };
  knight: { x: number; y: number };
};

export type FunNpc = {
  id: string;
  name: string;
  avatar?: string;
  message: string;
  x: number;
  y: number;
  kind?: "kid" | "cat" | "dog";
};

export type FunNeighborhood = {
  id: string;
  name: string;
  bounds: { x: number; y: number; w: number; h: number };
  stops: FunStop[];
};

export type FunWorld = {
  seed?: number;
  size: { w: number; h: number };
  playerSpawn?: { x: number; y: number };
  neighborhoods: FunNeighborhood[];
  npcs: FunNpc[];
};

type InitVillageArgs = {
  canvas: HTMLCanvasElement;
  world: FunWorld;
  isPaused: () => boolean;
  onOpenStop: (stopId: string) => void;
  onOpenNpc: (npcId: string) => void;
};

type Vec2 = { x: number; y: number };

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
function dist2(a: Vec2, b: Vec2) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}
function rectsOverlap(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function inView(wx: number, wy: number, ww: number, wh: number, vx: number, vy: number, vw: number, vh: number, pad = 180) {
  return wx < vx + vw + pad && wx + ww > vx - pad && wy < vy + vh + pad && wy + wh > vy - pad;
}

type DecorTree = { x: number; y: number; s: number; tint: number };
type DecorPond = { x: number; y: number; rx: number; ry: number; rot: number };

type RuntimeNpc = {
  id: string;
  name: string;
  avatar?: string;
  message: string;
  kind: "kid" | "cat" | "dog";
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  decisionT: number;
  radius: number;
  speed: number;
};

export async function initVillage(args: InitVillageArgs): Promise<() => void> {
  const { canvas, world, isPaused, onOpenNpc, onOpenStop } = args;

  const ctxMaybe = canvas.getContext("2d") as CanvasRenderingContext2D | null;
  if (!ctxMaybe) return () => {};
  const ctx: CanvasRenderingContext2D = ctxMaybe;

  const W = Math.max(800, world?.size?.w ?? 3600);
  const H = Math.max(600, world?.size?.h ?? 2400);
  const neighborhoods = Array.isArray(world?.neighborhoods) ? world.neighborhoods : [];
  const npcsRaw = Array.isArray(world?.npcs) ? world.npcs : [];
  const stops: FunStop[] = neighborhoods.flatMap((n) => (Array.isArray(n.stops) ? n.stops : []));

  // --- Neighborhood sign text (edit freely) ---
  const NB_SIGNS: Record<string, { title: string; subtitle: string }> = {
    nb1: { title: "ROOTS", subtitle: "Padma • School • University admission" },
    nb2: { title: "RUET & RAPL", subtitle: "Friends • IUPC • ICPC" },
    nb3: { title: "PROFESSIONAL", subtitle: "Vivasoft • Side Quests" },
    nb4: { title: "FUTURE", subtitle: "Higher studies • Build • Give back" }
  };

  const rand = mulberry32((world.seed ?? 1337) >>> 0);

  const spawn = world?.playerSpawn ?? { x: 320, y: 380 };
  const player = {
    x: clamp(spawn.x, 16, W - 16),
    y: clamp(spawn.y, 16, H - 16),
    r: 14,
    faceX: 1,
    faceY: 0
  };

  const cam = { x: 0, y: 0 };

  const keys = new Set<string>();
  const onKeyDown = (e: KeyboardEvent) => {
    keys.add(e.key.toLowerCase());
    if (e.repeat) return;

    if (e.key.toLowerCase() === "e") {
      if (isPaused()) return;
      const hit = findNearestInteractable({ x: player.x, y: player.y });
      if (!hit) return;
      hit.kind === "stop" ? onOpenStop(hit.id) : onOpenNpc(hit.id);
    }
  };
  const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  let viewW = 0;
  let viewH = 0;

  const doResize = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    viewW = Math.max(1, Math.floor(r.width));
    viewH = Math.max(1, Math.floor(r.height));
    canvas.width = Math.floor(viewW * dpr);
    canvas.height = Math.floor(viewH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  doResize();

  let ro: ResizeObserver | null = null;
  const onWinResize = () => doResize();
  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(doResize);
    ro.observe(canvas);
  } else {
    window.addEventListener("resize", onWinResize);
  }

  const solidRects = stops.map((s) => s.house);

  // ---- Ponds + collision ----
  const ponds: DecorPond[] = [];
  for (let i = 0; i < 9; i++) {
    const x = 220 + rand() * (W - 440);
    const y = 220 + rand() * (H - 440);
    ponds.push({
      x,
      y,
      rx: 75 + rand() * 120,
      ry: 38 + rand() * 90,
      rot: (rand() - 0.5) * 0.75
    });
  }

  function pointInRotatedEllipse(x: number, y: number, p: DecorPond, pad: number) {
    const dx = x - p.x;
    const dy = y - p.y;

    const c = Math.cos(-p.rot);
    const s = Math.sin(-p.rot);

    const lx = dx * c - dy * s;
    const ly = dx * s + dy * c;

    const rx = Math.max(8, p.rx + pad);
    const ry = Math.max(8, p.ry + pad);

    const v = (lx * lx) / (rx * rx) + (ly * ly) / (ry * ry);
    return v <= 1;
  }

  function collidesCircle(nextX: number, nextY: number, radius: number) {
    if (nextX < radius || nextY < radius || nextX > W - radius || nextY > H - radius) return true;

    const px = nextX - radius;
    const py = nextY - radius;
    const pw = radius * 2;
    const ph = radius * 2;

    for (const r of solidRects) {
      if (rectsOverlap(px, py, pw, ph, r.x, r.y, r.w, r.h)) return true;
    }

    for (const p of ponds) {
      if (pointInRotatedEllipse(nextX, nextY, p, radius * 0.85)) return true;
    }

    return false;
  }

  function collidesPlayer(nextX: number, nextY: number) {
    return collidesCircle(nextX, nextY, player.r);
  }

  type Hit = { kind: "stop" | "npc"; id: string; d2: number };

  const npcs: RuntimeNpc[] = npcsRaw.map((n) => {
    const kind: RuntimeNpc["kind"] = n.kind ?? "kid";
    const radius = kind === "kid" ? 11 : 10;
    const speed =
      kind === "kid"
        ? 40 + rand() * 35
        : kind === "cat"
        ? 55 + rand() * 40
        : 65 + rand() * 50;

    return {
      id: n.id,
      name: n.name,
      avatar: n.avatar,
      message: n.message,
      kind,
      x: n.x,
      y: n.y,
      homeX: n.x,
      homeY: n.y,
      vx: (rand() - 0.5) * 60,
      vy: (rand() - 0.5) * 60,
      decisionT: 0,
      radius,
      speed
    };
  });

  function findNearestInteractable(p: Vec2): Hit | null {
    const radius = 76;
    const r2 = radius * radius;

    let best: Hit | null = null;

    for (const s of stops) {
      const d = dist2(p, s.knight);
      if (d <= r2 && (!best || d < best.d2)) best = { kind: "stop", id: s.id, d2: d };
    }
    for (const n of npcs) {
      const d = dist2(p, { x: n.x, y: n.y });
      if (d <= r2 && (!best || d < best.d2)) best = { kind: "npc", id: n.id, d2: d };
    }
    return best;
  }

  function worldToScreen(wx: number, wy: number) {
    return { x: wx - cam.x, y: wy - cam.y };
  }

  function updateCamera() {
    cam.x = clamp(player.x - viewW / 2, 0, Math.max(0, W - viewW));
    cam.y = clamp(player.y - viewH / 2, 0, Math.max(0, H - viewH));
  }

  // Ground pattern
  let grassPattern: CanvasPattern | null = null;
  function ensureGrassPattern() {
    if (grassPattern) return;

    const tile = document.createElement("canvas");
    tile.width = 220;
    tile.height = 220;
    const t = tile.getContext("2d") as CanvasRenderingContext2D | null;
    if (!t) return;

    const g = t.createLinearGradient(0, 0, 220, 220);
    g.addColorStop(0, "rgba(206, 244, 214, 1)");
    g.addColorStop(1, "rgba(173, 230, 196, 1)");
    t.fillStyle = g;
    t.fillRect(0, 0, 220, 220);

    for (let i = 0; i < 1900; i++) {
      const x = Math.floor(rand() * 220);
      const y = Math.floor(rand() * 220);
      const a = 0.05 + rand() * 0.09;
      t.fillStyle = `rgba(16, 90, 50, ${a})`;
      t.fillRect(x, y, 1, 1);
    }

    t.strokeStyle = "rgba(15, 110, 60, 0.08)";
    t.lineWidth = 1;
    for (let i = 0; i < 190; i++) {
      const x = rand() * 220;
      const y = rand() * 220;
      t.beginPath();
      t.moveTo(x, y);
      t.lineTo(x + (rand() - 0.5) * 8, y - (3 + rand() * 9));
      t.stroke();
    }

    grassPattern = ctx.createPattern(tile, "repeat");
  }

  function drawShadowEllipse(wx: number, wy: number, rx: number, ry: number, alpha: number) {
    const p = worldToScreen(wx, wy);
    ctx.save();
    ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Trees
  const trees: DecorTree[] = [];
  function isTreeSpotOK(x: number, y: number, s: number) {
    for (const p of ponds) {
      if (pointInRotatedEllipse(x, y, p, 48 * s)) return false;
    }
    for (const st of stops) {
      const hx = st.house.x + st.house.w / 2;
      const hy = st.house.y + st.house.h / 2;
      if (dist2({ x, y }, { x: hx, y: hy }) < 140 * 140) return false;
    }
    for (const t of trees) {
      const md = 52 * (t.s + s);
      if (dist2({ x, y }, { x: t.x, y: t.y }) < md * md) return false;
    }
    return true;
  }

  let tries = 0;
  while (trees.length < 260 && tries < 260 * 18) {
    tries++;
    const x = 80 + rand() * (W - 160);
    const y = 80 + rand() * (H - 160);
    const s = 0.85 + rand() * 1.3;
    if (!isTreeSpotOK(x, y, s)) continue;
    trees.push({ x, y, s, tint: (rand() * 3) | 0 });
  }

  // ---- Beautiful hut (door + windows + better grounding) ----
  function drawHut(stop: FunStop) {
    const h = stop.house;
    const p = worldToScreen(h.x, h.y);

    drawShadowEllipse(h.x + h.w * 0.52, h.y + h.h + 10, h.w * 0.58, h.h * 0.18, 0.16);

    ctx.save();

    // foundation dirt patch
    ctx.fillStyle = "rgba(90, 55, 25, 0.18)";
    ctx.beginPath();
    ctx.ellipse(p.x + h.w * 0.52, p.y + h.h + 6, h.w * 0.52, h.h * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();

    // walls
    const wallX = p.x;
    const wallY = p.y + 14;
    const wallW = h.w;
    const wallH = h.h - 14;

    // roof
    const roofX = p.x - 12;
    const roofY = p.y - 28;
    const roofW = h.w + 24;
    const roofH = 70 + h.h * 0.18;

    const roofGrad = ctx.createLinearGradient(roofX, roofY, roofX, roofY + roofH);
    roofGrad.addColorStop(0, "rgba(204, 160, 96, 1)");
    roofGrad.addColorStop(1, "rgba(132, 92, 48, 1)");

    ctx.fillStyle = roofGrad;
    ctx.beginPath();
    ctx.moveTo(roofX, roofY + roofH * 0.62);
    ctx.quadraticCurveTo(roofX + roofW * 0.5, roofY - roofH * 0.18, roofX + roofW, roofY + roofH * 0.62);
    ctx.lineTo(roofX + roofW * 0.88, roofY + roofH * 0.98);
    ctx.quadraticCurveTo(roofX + roofW * 0.5, roofY + roofH * 1.10, roofX + roofW * 0.12, roofY + roofH * 0.98);
    ctx.closePath();
    ctx.fill();

    // roof underside shadow
    ctx.fillStyle = "rgba(15, 23, 42, 0.10)";
    ctx.beginPath();
    ctx.ellipse(p.x + wallW * 0.5, roofY + roofH * 0.78, roofW * 0.40, roofH * 0.10, 0, 0, Math.PI * 2);
    ctx.fill();

    // straw lines
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = "rgba(55, 33, 12, 1)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 28; i++) {
      const t = i / 27;
      const y = roofY + roofH * (0.64 + t * 0.28);
      ctx.beginPath();
      ctx.moveTo(roofX + 12, y);
      ctx.lineTo(roofX + roofW - 12, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // wall fill
    const wallGrad = ctx.createLinearGradient(wallX, wallY, wallX + wallW, wallY + wallH);
    wallGrad.addColorStop(0, "rgba(246, 235, 214, 1)");
    wallGrad.addColorStop(1, "rgba(204, 178, 145, 1)");

    ctx.fillStyle = wallGrad;
    roundRectPath(ctx, wallX, wallY, wallW, wallH, 12);
    ctx.fill();

    ctx.strokeStyle = "rgba(90, 55, 25, 0.26)";
    ctx.lineWidth = 2;
    roundRectPath(ctx, wallX, wallY, wallW, wallH, 12);
    ctx.stroke();

    // grass occlusion strip
    const stripH = 12;
    const stripGrad = ctx.createLinearGradient(wallX, wallY + wallH - stripH, wallX, wallY + wallH + 2);
    stripGrad.addColorStop(0, "rgba(34, 197, 94, 0.00)");
    stripGrad.addColorStop(1, "rgba(34, 197, 94, 0.26)");
    ctx.fillStyle = stripGrad;
    roundRectPath(ctx, wallX + 2, wallY + wallH - stripH, wallW - 4, stripH + 5, 10);
    ctx.fill();

    // door
    const doorW = Math.max(18, wallW * 0.22);
    const doorH = Math.max(26, wallH * 0.36);
    const doorX = wallX + wallW * 0.5 - doorW / 2;
    const doorY = wallY + wallH - doorH - 7;

    const doorGrad = ctx.createLinearGradient(doorX, doorY, doorX, doorY + doorH);
    doorGrad.addColorStop(0, "rgba(132, 84, 44, 1)");
    doorGrad.addColorStop(1, "rgba(74, 42, 18, 1)");
    ctx.fillStyle = doorGrad;
    roundRectPath(ctx, doorX, doorY, doorW, doorH, 9);
    ctx.fill();

    // step
    ctx.fillStyle = "rgba(15,23,42,0.10)";
    ctx.beginPath();
    ctx.ellipse(doorX + doorW * 0.5, doorY + doorH + 5, doorW * 0.55, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // knob
    ctx.fillStyle = "rgba(226, 232, 240, 0.8)";
    ctx.beginPath();
    ctx.arc(doorX + doorW * 0.78, doorY + doorH * 0.55, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // windows (1-2)
    const winCount = wallW > 120 ? 2 : 1;
    for (let i = 0; i < winCount; i++) {
      const winW = wallW * 0.18;
      const winH = wallH * 0.18;
      const cx = i === 0 ? wallX + wallW * 0.25 : wallX + wallW * 0.75;
      const winX = cx - winW / 2;
      const winY = wallY + wallH * 0.42 - winH / 2;

      // subtle glow
      ctx.fillStyle = "rgba(250, 204, 21, 0.10)";
      ctx.beginPath();
      ctx.ellipse(winX + winW / 2, winY + winH / 2, winW * 0.9, winH * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(15, 23, 42, 0.26)";
      roundRectPath(ctx, winX, winY, winW, winH, 7);
      ctx.fill();

      ctx.strokeStyle = "rgba(90, 55, 25, 0.30)";
      ctx.lineWidth = 2;
      roundRectPath(ctx, winX, winY, winW, winH, 7);
      ctx.stroke();

      // cross
      ctx.strokeStyle = "rgba(226, 232, 240, 0.60)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(winX + winW / 2, winY + 3);
      ctx.lineTo(winX + winW / 2, winY + winH - 3);
      ctx.moveTo(winX + 3, winY + winH / 2);
      ctx.lineTo(winX + winW - 3, winY + winH / 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawKnight(pos: Vec2) {
    const p = worldToScreen(pos.x, pos.y);

    drawShadowEllipse(pos.x, pos.y + 12, 14, 6, 0.15);

    ctx.save();
    ctx.fillStyle = "rgba(55, 65, 81, 1)";
    roundRectPath(ctx, p.x - 8, p.y - 2, 16, 22, 7);
    ctx.fill();

    ctx.fillStyle = "rgba(148, 163, 184, 1)";
    ctx.beginPath();
    ctx.arc(p.x, p.y - 8, 9, Math.PI, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(101, 70, 35, 1)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(p.x + 10, p.y + 2);
    ctx.lineTo(p.x + 26, p.y - 18);
    ctx.stroke();
    ctx.restore();
  }

  function drawTree(t: DecorTree) {
    const p = worldToScreen(t.x, t.y);
    const s = t.s;

    drawShadowEllipse(t.x, t.y + 18 * s, 16 * s, 6 * s, 0.10);

    const trunk = ctx.createLinearGradient(p.x, p.y - 10 * s, p.x, p.y + 24 * s);
    trunk.addColorStop(0, "rgba(120, 74, 40, 1)");
    trunk.addColorStop(1, "rgba(78, 45, 20, 1)");
    ctx.fillStyle = trunk;
    roundRectPath(ctx, p.x - 6 * s, p.y - 6 * s, 12 * s, 30 * s, 6 * s);
    ctx.fill();

    const canopy =
      t.tint === 0
        ? "rgba(34, 197, 94, 0.95)"
        : t.tint === 1
        ? "rgba(22, 163, 74, 0.95)"
        : "rgba(16, 185, 129, 0.92)";

    ctx.fillStyle = canopy;
    const blobs = [
      { dx: -18, dy: -18, r: 18 },
      { dx: 0, dy: -28, r: 22 },
      { dx: 18, dy: -18, r: 18 },
      { dx: -6, dy: -10, r: 20 },
      { dx: 10, dy: -8, r: 18 }
    ];
    for (const b of blobs) {
      ctx.beginPath();
      ctx.arc(p.x + b.dx * s, p.y + b.dy * s, b.r * s, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawPond(pd: DecorPond) {
    const p = worldToScreen(pd.x, pd.y);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(pd.rot);

    ctx.fillStyle = "rgba(15,23,42,0.10)";
    ctx.beginPath();
    ctx.ellipse(3, 6, pd.rx * 1.02, pd.ry * 1.02, 0, 0, Math.PI * 2);
    ctx.fill();

    const g = ctx.createRadialGradient(-pd.rx * 0.2, -pd.ry * 0.2, 8, 0, 0, Math.max(pd.rx, pd.ry) * 1.1);
    g.addColorStop(0, "rgba(147, 197, 253, 0.75)");
    g.addColorStop(1, "rgba(37, 99, 235, 0.25)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, pd.rx, pd.ry, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(34, 124, 78, 0.24)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(0, 0, pd.rx, pd.ry, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  function drawNpc(n: RuntimeNpc) {
    const p = worldToScreen(n.x, n.y);

    if (n.kind === "kid") {
      drawShadowEllipse(n.x, n.y + 13, 12, 5, 0.12);
      ctx.save();
      ctx.fillStyle = "rgba(253, 224, 180, 1)";
      ctx.beginPath();
      ctx.arc(p.x, p.y - 2, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(51, 65, 85, 1)";
      roundRectPath(ctx, p.x - 8, p.y + 7, 16, 14, 6);
      ctx.fill();
      ctx.restore();
      return;
    }

    // cat / dog (map icon)
    drawShadowEllipse(n.x, n.y + 10, 12, 5, 0.12);
    ctx.save();

    const body = n.kind === "cat" ? "rgba(100,116,139,1)" : "rgba(120,74,40,1)";
    const face = n.kind === "cat" ? "rgba(148,163,184,1)" : "rgba(253,224,180,1)";

    ctx.fillStyle = body;
    roundRectPath(ctx, p.x - 10, p.y + 2, 20, 10, 6);
    ctx.fill();

    ctx.fillStyle = face;
    ctx.beginPath();
    ctx.arc(p.x + 12, p.y + 4, 6, 0, Math.PI * 2);
    ctx.fill();

    if (n.kind === "cat") {
      ctx.fillStyle = face;
      ctx.beginPath();
      ctx.moveTo(p.x + 9, p.y - 2);
      ctx.lineTo(p.x + 11, p.y + 2);
      ctx.lineTo(p.x + 7, p.y + 2);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(p.x + 15, p.y - 2);
      ctx.lineTo(p.x + 17, p.y + 2);
      ctx.lineTo(p.x + 13, p.y + 2);
      ctx.closePath();
      ctx.fill();
    }

    ctx.strokeStyle = body;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(p.x - 10, p.y + 8);
    ctx.quadraticCurveTo(p.x - 18, p.y + 2, p.x - 12, p.y - 2);
    ctx.stroke();

    ctx.restore();
  }

  function drawHint(hit: Hit | null) {
    if (!hit) return;

    let target: Vec2 | null = null;
    let text = "Press E";

    if (hit.kind === "stop") {
      const s = stops.find((x) => x.id === hit.id);
      if (s) target = s.knight;
      text = "Press E to read story";
    } else {
      const n = npcs.find((x) => x.id === hit.id);
      if (n) target = { x: n.x, y: n.y };
      text = "Press E to interact";
    }
    if (!target) return;

    const tp = worldToScreen(target.x, target.y);
    ctx.save();
    ctx.font = "14px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    const padX = 10;
    const w = ctx.measureText(text).width + padX * 2;
    const h = 26;
    const bx = tp.x - w / 2;
    const by = tp.y - 22 - h;

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.strokeStyle = "rgba(15,23,42,0.18)";
    ctx.lineWidth = 1;
    roundRectPath(ctx, bx, by, w, h, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(15,23,42,0.86)";
    ctx.fillText(text, tp.x, by + h - 7);
    ctx.restore();
  }

  function drawVignette() {
    ctx.save();
    const g = ctx.createRadialGradient(
      viewW * 0.5,
      viewH * 0.45,
      Math.min(viewW, viewH) * 0.2,
      viewW * 0.5,
      viewH * 0.5,
      Math.max(viewW, viewH) * 0.88
    );
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.12)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, viewW, viewH);
    ctx.restore();
  }

  function drawNeighborhoodSigns() {
    for (const nb of neighborhoods) {
      const s = NB_SIGNS[nb.id];
      if (!s) continue;

      const x = nb.bounds.x + nb.bounds.w * 0.5;
      const y = nb.bounds.y + 72;

      if (!inView(x - 340, y - 160, 680, 220, cam.x, cam.y, viewW, viewH, 60)) continue;

      const p = worldToScreen(x, y);

      ctx.save();
      // shadow
      ctx.fillStyle = "rgba(15,23,42,0.18)";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 68, 150, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // posts
      ctx.fillStyle = "rgba(101, 70, 35, 1)";
      roundRectPath(ctx, p.x - 130, p.y + 8, 14, 70, 7);
      ctx.fill();
      roundRectPath(ctx, p.x + 116, p.y + 8, 14, 70, 7);
      ctx.fill();

      // board
      const boardW = 320;
      const boardH = 92;
      const boardX = p.x - boardW / 2;
      const boardY = p.y - boardH / 2;

      const wood = ctx.createLinearGradient(boardX, boardY, boardX, boardY + boardH);
      wood.addColorStop(0, "rgba(234, 210, 170, 1)");
      wood.addColorStop(1, "rgba(196, 165, 118, 1)");

      ctx.fillStyle = wood;
      roundRectPath(ctx, boardX, boardY, boardW, boardH, 18);
      ctx.fill();

      ctx.strokeStyle = "rgba(90,55,25,0.35)";
      ctx.lineWidth = 3;
      roundRectPath(ctx, boardX, boardY, boardW, boardH, 18);
      ctx.stroke();

      // wood grain lines
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = "rgba(90,55,25,1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 9; i++) {
        const yy = boardY + 10 + i * 9;
        ctx.beginPath();
        ctx.moveTo(boardX + 14, yy);
        ctx.lineTo(boardX + boardW - 14, yy);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // text
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillStyle = "rgba(15,23,42,0.90)";
      ctx.font = "700 22px system-ui, -apple-system, Segoe UI, Roboto";
      ctx.fillText(s.title, p.x, boardY + 34);

      ctx.fillStyle = "rgba(15,23,42,0.70)";
      ctx.font = "600 13px system-ui, -apple-system, Segoe UI, Roboto";
      ctx.fillText(s.subtitle, p.x, boardY + 62);

      ctx.restore();
    }
  }

  // ---- Loop ----
  let raf = 0;
  let last = performance.now();

  function tick(now: number) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    try {
      if (!viewW || !viewH) return;
      ensureGrassPattern();

      if (!isPaused()) {
        const up = keys.has("w") || keys.has("arrowup");
        const down = keys.has("s") || keys.has("arrowdown");
        const left = keys.has("a") || keys.has("arrowleft");
        const right = keys.has("d") || keys.has("arrowright");

        let dx = 0;
        let dy = 0;
        if (up) dy -= 1;
        if (down) dy += 1;
        if (left) dx -= 1;
        if (right) dx += 1;

        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;

        if (Math.abs(dx) + Math.abs(dy) > 0.001) {
          player.faceX = dx === 0 ? player.faceX : dx;
          player.faceY = dy === 0 ? player.faceY : dy;
        }

        // SPEED: change multiplier here if you want (currently 1.5x)
        const speed = 230 * 1.5;

        const nx = player.x + dx * speed * dt;
        const ny = player.y + dy * speed * dt;

        if (!collidesPlayer(nx, player.y)) player.x = nx;
        if (!collidesPlayer(player.x, ny)) player.y = ny;

        player.x = clamp(player.x, player.r, W - player.r);
        player.y = clamp(player.y, player.r, H - player.r);

        // NPC wandering
        for (const n of npcs) {
          n.decisionT -= dt;
          if (n.decisionT <= 0) {
            const ang = rand() * Math.PI * 2;
            n.vx = Math.cos(ang);
            n.vy = Math.sin(ang);
            n.decisionT = 0.7 + rand() * 1.8;
          }

          const hx = n.homeX - n.x;
          const hy = n.homeY - n.y;

          const steerX = hx * 0.002;
          const steerY = hy * 0.002;

          let vx = n.vx + steerX;
          let vy = n.vy + steerY;
          const vlen = Math.hypot(vx, vy) || 1;
          vx /= vlen;
          vy /= vlen;

          const nnx = n.x + vx * n.speed * dt;
          const nny = n.y + vy * n.speed * dt;

          if (!collidesCircle(nnx, n.y, n.radius)) n.x = nnx;
          else n.vx = -n.vx;

          if (!collidesCircle(n.x, nny, n.radius)) n.y = nny;
          else n.vy = -n.vy;

          n.x = clamp(n.x, n.radius, W - n.radius);
          n.y = clamp(n.y, n.radius, H - n.radius);
        }
      }

      updateCamera();
      const vx = cam.x;
      const vy = cam.y;

      // draw
      ctx.clearRect(0, 0, viewW, viewH);

      if (grassPattern) {
        ctx.fillStyle = grassPattern;
        ctx.fillRect(0, 0, viewW, viewH);
      } else {
        ctx.fillStyle = "#e9f7ea";
        ctx.fillRect(0, 0, viewW, viewH);
      }

      // ponds (behind)
      for (const pd of ponds) {
        if (inView(pd.x - pd.rx, pd.y - pd.ry, pd.rx * 2, pd.ry * 2, vx, vy, viewW, viewH)) drawPond(pd);
      }

      // depth-sorted queue
      type DrawItem = { y: number; draw: () => void };
      const q: DrawItem[] = [];

      for (const t of trees) {
        if (!inView(t.x - 70, t.y - 90, 140, 160, vx, vy, viewW, viewH)) continue;
        q.push({ y: t.y, draw: () => drawTree(t) });
      }

      for (const s of stops) {
        const h = s.house;
        if (!inView(h.x - 30, h.y - 120, h.w + 60, h.h + 240, vx, vy, viewW, viewH)) continue;
        q.push({ y: h.y + h.h, draw: () => drawHut(s) });
        q.push({ y: s.knight.y, draw: () => drawKnight(s.knight) });
      }

      for (const n of npcs) {
        if (!inView(n.x - 40, n.y - 40, 80, 80, vx, vy, viewW, viewH)) continue;
        q.push({ y: n.y, draw: () => drawNpc(n) });
      }

      // player
      q.push({
        y: player.y,
        draw: () => {
          const p = worldToScreen(player.x, player.y);
          drawShadowEllipse(player.x, player.y + 16, 14, 6, 0.12);

          ctx.fillStyle = "rgba(30, 41, 59, 1)";
          roundRectPath(ctx, p.x - 10, p.y + 2, 20, 18, 8);
          ctx.fill();

          ctx.fillStyle = "rgba(253, 224, 180, 1)";
          ctx.beginPath();
          ctx.arc(p.x, p.y - 6, 9, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "rgba(15,23,42,0.85)";
          ctx.beginPath();
          ctx.arc(p.x + player.faceX * 3, p.y - 7, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      q.sort((a, b) => a.y - b.y);
      for (const it of q) it.draw();

      // ✅ big neighborhood signs on top (world-anchored)
      drawNeighborhoodSigns();

      const hit = !isPaused() ? findNearestInteractable({ x: player.x, y: player.y }) : null;
      drawHint(hit);

      drawVignette();
    } catch {
      // fail-safe
    }
  }

  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    if (ro) ro.disconnect();
    else window.removeEventListener("resize", onWinResize);
  };
}
