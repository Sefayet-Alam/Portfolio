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
function rectsOverlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number
) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
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
function inView(
  wx: number,
  wy: number,
  ww: number,
  wh: number,
  vx: number,
  vy: number,
  vw: number,
  vh: number,
  pad = 180
) {
  return (
    wx < vx + vw + pad &&
    wx + ww > vx - pad &&
    wy < vy + vh + pad &&
    wy + wh > vy - pad
  );
}

// ===============================
// NEW: Decorations / Wildlife
// ===============================
type DecorTree = { x: number; y: number; s: number; tint: number };
type DecorPond = { x: number; y: number; rx: number; ry: number; rot: number };
type DecorWell = { x: number; y: number; r: number; roof: number };
type DecorFlowerPatch = { x: number; y: number; r: number; k: number };
type DecorBird = { x: number; y: number; s: number; phase: number; kind: "bird" | "butterfly" };
type DecorAnimal = {
  x: number;
  y: number;
  s: number;
  phase: number;
  kind: "deer" | "peacock";
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  decisionT: number;
};

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

function hashStr(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export async function initVillage(args: InitVillageArgs): Promise<() => void> {
  const { canvas, world, isPaused, onOpenNpc, onOpenStop } = args;

  const ctxMaybe = canvas.getContext("2d") as CanvasRenderingContext2D | null;
  if (!ctxMaybe) return () => { };
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

  // --- Input (robust across Windows layouts + prevents caret/scroll stealing keys) ---
  const keys = new Set<string>();

  const isMoveOrActionCode = (code: string) =>
    code === "KeyW" ||
    code === "KeyA" ||
    code === "KeyS" ||
    code === "KeyD" ||
    code === "ArrowUp" ||
    code === "ArrowDown" ||
    code === "ArrowLeft" ||
    code === "ArrowRight" ||
    code === "Space" ||
    code === "KeyE";

  const onKeyDown = (e: KeyboardEvent) => {
    // Prevent default browser behavior (scrolling / caret navigation) for game keys
    if (isMoveOrActionCode(e.code)) e.preventDefault();

    keys.add(e.code);
    if (e.repeat) return;

    if (e.code === "KeyE") {
      if (isPaused()) return;
      const hit = findNearestInteractable({ x: player.x, y: player.y });
      if (!hit) return;
      hit.kind === "stop" ? onOpenStop(hit.id) : onOpenNpc(hit.id);
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    keys.delete(e.code);
  };

  // If the tab loses focus, clear pressed keys so movement doesn't get stuck.
  const onBlur = () => keys.clear();

  window.addEventListener("keydown", onKeyDown, { passive: false });
  window.addEventListener("keyup", onKeyUp, { passive: false });
  window.addEventListener("blur", onBlur);

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

  // NEW: also block wells (circle collision)
  const wells: DecorWell[] = [];

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

    // NEW: wells as solid circles
    for (const w of wells) {
      const d = Math.hypot(nextX - w.x, nextY - w.y);
      if (d < w.r + radius * 0.92) return true;
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

  // ===============================
  // NEW: place wells / flowers / birds / animals (no new huts)
  // ===============================
  const flowers: DecorFlowerPatch[] = [];
  const birds: DecorBird[] = [];
  const animals: DecorAnimal[] = [];

  function isFeatureSpotOK(x: number, y: number, pad: number) {
    for (const p of ponds) {
      if (pointInRotatedEllipse(x, y, p, pad)) return false;
    }
    for (const st of stops) {
      const r = st.house;
      if (rectsOverlap(x - pad, y - pad, pad * 2, pad * 2, r.x - 12, r.y - 12, r.w + 24, r.h + 24)) return false;
    }
    for (const w of wells) {
      if (Math.hypot(x - w.x, y - w.y) < w.r + pad) return false;
    }
    return true;
  }

  // Wells (solid)
  let wTry = 0;
  while (wells.length < 7 && wTry < 400) {
    wTry++;
    const x = 220 + rand() * (W - 440);
    const y = 220 + rand() * (H - 440);
    const r = 18 + rand() * 10;
    if (!isFeatureSpotOK(x, y, 90)) continue;
    wells.push({ x, y, r, roof: 26 + rand() * 12 });
  }

  // Flower patches (visual only)
  let fTry = 0;
  while (flowers.length < 95 && fTry < 1200) {
    fTry++;
    const x = 120 + rand() * (W - 240);
    const y = 120 + rand() * (H - 240);
    if (!isFeatureSpotOK(x, y, 40)) continue;
    flowers.push({ x, y, r: 14 + rand() * 22, k: (rand() * 1000) | 0 });
  }

  // Birds + butterflies (visual only)
  for (let i = 0; i < 42; i++) {
    const x = 120 + rand() * (W - 240);
    const y = 120 + rand() * (H - 240);
    birds.push({
      x,
      y,
      s: 0.8 + rand() * 1.15,
      phase: rand() * Math.PI * 2,
      kind: rand() < 0.78 ? "bird" : "butterfly"
    });
  }

  // Deer / peacocks (slow wandering, visual only)
  const animalCount = 7;
  for (let i = 0; i < animalCount; i++) {
    const kind: DecorAnimal["kind"] = i < 4 ? "deer" : "peacock";
    let ax = 260 + rand() * (W - 520);
    let ay = 260 + rand() * (H - 520);
    let guard = 0;
    while (!isFeatureSpotOK(ax, ay, 120) && guard++ < 120) {
      ax = 260 + rand() * (W - 520);
      ay = 260 + rand() * (H - 520);
    }
    animals.push({
      x: ax,
      y: ay,
      s: 0.85 + rand() * 1.15,
      phase: rand() * Math.PI * 2,
      kind,
      vx: (rand() - 0.5),
      vy: (rand() - 0.5),
      homeX: ax,
      homeY: ay,
      decisionT: 0.4 + rand() * 1.6
    });
  }

  // ---- Beautiful hut (door + windows + better grounding) ----
  // (kept your original hut; only added a few tasteful details: chimney + tiny fence + roof highlight)
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

    // roof highlight
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = "rgba(255,255,255,1)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(roofX + roofW * 0.16, roofY + roofH * 0.70);
    ctx.quadraticCurveTo(roofX + roofW * 0.5, roofY + roofH * 0.42, roofX + roofW * 0.84, roofY + roofH * 0.70);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // chimney
    ctx.fillStyle = "rgba(101,70,35,0.55)";
    roundRectPath(ctx, roofX + roofW * 0.72, roofY + roofH * 0.32, 16, 34, 6);
    ctx.fill();
    ctx.fillStyle = "rgba(15,23,42,0.08)";
    roundRectPath(ctx, roofX + roofW * 0.72, roofY + roofH * 0.30, 16, 8, 4);
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

    // tiny fence (front)
    ctx.globalAlpha = 0.65;
    ctx.strokeStyle = "rgba(101,70,35,0.8)";
    ctx.lineWidth = 2;
    const fy = wallY + wallH + 6;
    ctx.beginPath();
    ctx.moveTo(wallX + 14, fy);
    ctx.lineTo(wallX + wallW - 14, fy);
    ctx.stroke();
    for (let i = 0; i < 6; i++) {
      const xx = wallX + 18 + (i * (wallW - 36)) / 5;
      ctx.beginPath();
      ctx.moveTo(xx, fy - 2);
      ctx.lineTo(xx, fy + 10);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

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

  // ===============================
  // NEW: draw well / flowers / birds / animals
  // ===============================
  function drawWell(w: DecorWell) {
    const p = worldToScreen(w.x, w.y);
    drawShadowEllipse(w.x, w.y + 16, w.r * 1.25, w.r * 0.45, 0.12);

    ctx.save();
    // stone ring
    const g = ctx.createLinearGradient(p.x - w.r, p.y - w.r, p.x + w.r, p.y + w.r);
    g.addColorStop(0, "rgba(226,232,240,0.95)");
    g.addColorStop(1, "rgba(148,163,184,0.95)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 6, w.r, w.r * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();

    // inner hole
    ctx.fillStyle = "rgba(15,23,42,0.35)";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 6, w.r * 0.62, w.r * 0.40, 0, 0, Math.PI * 2);
    ctx.fill();

    // water shine
    ctx.fillStyle = "rgba(147,197,253,0.18)";
    ctx.beginPath();
    ctx.ellipse(p.x - w.r * 0.18, p.y + 3, w.r * 0.28, w.r * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();

    // posts + roof
    ctx.strokeStyle = "rgba(101,70,35,0.85)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(p.x - w.r * 0.55, p.y - 14);
    ctx.lineTo(p.x - w.r * 0.55, p.y - 14 - w.roof);
    ctx.moveTo(p.x + w.r * 0.55, p.y - 14);
    ctx.lineTo(p.x + w.r * 0.55, p.y - 14 - w.roof);
    ctx.stroke();

    ctx.fillStyle = "rgba(204,160,96,0.95)";
    ctx.beginPath();
    ctx.moveTo(p.x - w.r * 0.75, p.y - 14 - w.roof + 8);
    ctx.quadraticCurveTo(p.x, p.y - 14 - w.roof - 18, p.x + w.r * 0.75, p.y - 14 - w.roof + 8);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function drawFlowerPatch(fp: DecorFlowerPatch, tNow: number) {
    const p = worldToScreen(fp.x, fp.y);
    ctx.save();
    const sway = Math.sin(tNow * 1.2 + fp.k) * 0.6;

    ctx.globalAlpha = 0.85;
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      const rr = fp.r * (0.25 + (i % 3) * 0.08);
      const x = p.x + Math.cos(a) * (fp.r * 0.55) + sway;
      const y = p.y + Math.sin(a) * (fp.r * 0.35);
      ctx.fillStyle =
        i % 3 === 0 ? "rgba(251, 113, 133, 0.85)" : i % 3 === 1 ? "rgba(250, 204, 21, 0.82)" : "rgba(34, 197, 94, 0.85)";
      ctx.beginPath();
      ctx.ellipse(x, y, rr, rr * 0.75, a, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawBird(b: DecorBird, tNow: number) {
    const p = worldToScreen(b.x, b.y);
    ctx.save();

    const flap = Math.sin(tNow * (b.kind === "bird" ? 6 : 8) + b.phase);
    const lift = (b.kind === "bird" ? 2.0 : 3.0) * flap;
    const s = b.s;

    // tiny shadow
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "rgba(15,23,42,1)";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 14, 6 * s, 2.3 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    if (b.kind === "bird") {
      // body
      ctx.fillStyle = "rgba(30,41,59,0.85)";
      roundRectPath(ctx, p.x - 5 * s, p.y + lift, 10 * s, 6 * s, 3 * s);
      ctx.fill();

      // wings
      ctx.strokeStyle = "rgba(30,41,59,0.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x - 4 * s, p.y + 2 + lift);
      ctx.quadraticCurveTo(p.x - 10 * s, p.y - 3 - flap * 2, p.x - 14 * s, p.y + 2 + lift);
      ctx.moveTo(p.x + 4 * s, p.y + 2 + lift);
      ctx.quadraticCurveTo(p.x + 10 * s, p.y - 3 - flap * 2, p.x + 14 * s, p.y + 2 + lift);
      ctx.stroke();

      // beak
      ctx.fillStyle = "rgba(251,191,36,0.9)";
      ctx.beginPath();
      ctx.moveTo(p.x + 6 * s, p.y + 3 + lift);
      ctx.lineTo(p.x + 10 * s, p.y + 2 + lift);
      ctx.lineTo(p.x + 6 * s, p.y + 5 + lift);
      ctx.closePath();
      ctx.fill();
    } else {
      // butterfly
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "rgba(168,85,247,0.65)";
      ctx.beginPath();
      ctx.ellipse(p.x - 5 * s, p.y + lift, 6 * s, (5 + flap * 2) * s, 0, 0, Math.PI * 2);
      ctx.ellipse(p.x + 5 * s, p.y + lift, 6 * s, (5 + flap * 2) * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(30,41,59,0.75)";
      roundRectPath(ctx, p.x - 1 * s, p.y + lift - 4 * s, 2 * s, 8 * s, 2 * s);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  function drawAnimal(a: DecorAnimal, tNow: number) {
    const p = worldToScreen(a.x, a.y);
    const s = a.s;
    const bob = Math.sin(tNow * 2.2 + a.phase) * 0.8;

    if (a.kind === "deer") {
      drawShadowEllipse(a.x, a.y + 14, 16 * s, 6 * s, 0.12);
      ctx.save();

      // body
      ctx.fillStyle = "rgba(120,74,40,0.95)";
      roundRectPath(ctx, p.x - 14 * s, p.y + bob, 28 * s, 14 * s, 8 * s);
      ctx.fill();

      // legs
      ctx.strokeStyle = "rgba(74,42,18,0.9)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(p.x - 8 * s, p.y + 12 * s + bob);
      ctx.lineTo(p.x - 10 * s, p.y + 22 * s + bob);
      ctx.moveTo(p.x + 8 * s, p.y + 12 * s + bob);
      ctx.lineTo(p.x + 10 * s, p.y + 22 * s + bob);
      ctx.stroke();

      // head
      ctx.fillStyle = "rgba(253,224,180,0.95)";
      ctx.beginPath();
      ctx.ellipse(p.x + 18 * s, p.y + 3 * s + bob, 9 * s, 7 * s, 0, 0, Math.PI * 2);
      ctx.fill();

      // ears
      ctx.fillStyle = "rgba(253,224,180,0.9)";
      ctx.beginPath();
      ctx.ellipse(p.x + 20 * s, p.y - 4 * s + bob, 3 * s, 5 * s, 0.5, 0, Math.PI * 2);
      ctx.ellipse(p.x + 14 * s, p.y - 4 * s + bob, 3 * s, 5 * s, -0.5, 0, Math.PI * 2);
      ctx.fill();

      // antlers
      ctx.strokeStyle = "rgba(101,70,35,0.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x + 16 * s, p.y - 6 * s + bob);
      ctx.lineTo(p.x + 10 * s, p.y - 16 * s + bob);
      ctx.lineTo(p.x + 12 * s, p.y - 20 * s + bob);
      ctx.moveTo(p.x + 20 * s, p.y - 6 * s + bob);
      ctx.lineTo(p.x + 26 * s, p.y - 16 * s + bob);
      ctx.lineTo(p.x + 24 * s, p.y - 20 * s + bob);
      ctx.stroke();

      ctx.restore();
      return;
    }

    // peacock
    drawShadowEllipse(a.x, a.y + 14, 16 * s, 6 * s, 0.12);
    ctx.save();

    // tail fan
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = "rgba(16,185,129,0.65)";
    ctx.beginPath();
    ctx.ellipse(p.x - 10 * s, p.y - 2 * s + bob, 22 * s, 18 * s, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // eye spots
    ctx.globalAlpha = 0.7;
    for (let i = 0; i < 7; i++) {
      const ang = -0.7 + (i / 6) * 1.2;
      const ex = p.x - 18 * s + Math.cos(ang) * 12 * s;
      const ey = p.y - 8 * s + bob + Math.sin(ang) * 10 * s;
      ctx.fillStyle = "rgba(59,130,246,0.55)";
      ctx.beginPath();
      ctx.arc(ex, ey, 3.6 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(250,204,21,0.55)";
      ctx.beginPath();
      ctx.arc(ex, ey, 1.6 * s, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // body
    ctx.fillStyle = "rgba(30,64,175,0.9)";
    roundRectPath(ctx, p.x - 10 * s, p.y + bob, 20 * s, 12 * s, 7 * s);
    ctx.fill();

    // neck + head
    ctx.fillStyle = "rgba(16,185,129,0.9)";
    roundRectPath(ctx, p.x + 6 * s, p.y - 10 * s + bob, 6 * s, 16 * s, 4 * s);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p.x + 10 * s, p.y - 12 * s + bob, 5 * s, 0, Math.PI * 2);
    ctx.fill();

    // beak
    ctx.fillStyle = "rgba(251,191,36,0.9)";
    ctx.beginPath();
    ctx.moveTo(p.x + 15 * s, p.y - 12 * s + bob);
    ctx.lineTo(p.x + 22 * s, p.y - 14 * s + bob);
    ctx.lineTo(p.x + 15 * s, p.y - 10 * s + bob);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function drawNpc(n: RuntimeNpc, tNow: number) {
    const p = worldToScreen(n.x, n.y);
    const h = hashStr(n.id + n.name);
    const bob = Math.sin(tNow * 2.1 + (h % 1000)) * 0.8;

    if (n.kind === "kid") {
      drawShadowEllipse(n.x, n.y + 13, 12, 5, 0.12);
      ctx.save();

      // skin
      ctx.fillStyle = "rgba(253, 224, 180, 1)";
      ctx.beginPath();
      ctx.arc(p.x, p.y - 2 + bob, 9, 0, Math.PI * 2);
      ctx.fill();

      // hair (varied)
      const hairTone = h % 3 === 0 ? "rgba(15,23,42,0.92)" : h % 3 === 1 ? "rgba(51,65,85,0.92)" : "rgba(30,41,59,0.90)";
      ctx.fillStyle = hairTone;
      ctx.beginPath();
      ctx.arc(p.x, p.y - 6 + bob, 9.2, Math.PI, Math.PI * 2);
      ctx.closePath();
      ctx.fill();

      // bangs / pony / side
      ctx.globalAlpha = 0.9;
      if ((h & 1) === 0) {
        ctx.beginPath();
        ctx.ellipse(p.x - 4, p.y - 8 + bob, 4.2, 3.4, 0.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.ellipse(p.x + 4, p.y - 9 + bob, 4.6, 3.2, -0.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // eyes
      ctx.fillStyle = "rgba(15,23,42,0.85)";
      ctx.beginPath();
      ctx.arc(p.x - 3, p.y - 2 + bob, 1.3, 0, Math.PI * 2);
      ctx.arc(p.x + 3, p.y - 2 + bob, 1.3, 0, Math.PI * 2);
      ctx.fill();

      // smile
      ctx.strokeStyle = "rgba(15,23,42,0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y + 1.5 + bob, 3.6, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();

      // outfit color (varied)
      const shirt =
        h % 4 === 0
          ? "rgba(30,64,175,0.92)"
          : h % 4 === 1
            ? "rgba(15,118,110,0.92)"
            : h % 4 === 2
              ? "rgba(99,102,241,0.90)"
              : "rgba(51,65,85,0.92)";

      ctx.fillStyle = shirt;
      roundRectPath(ctx, p.x - 9, p.y + 7 + bob, 18, 14, 7);
      ctx.fill();

      // belt / stripe
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "rgba(255,255,255,1)";
      roundRectPath(ctx, p.x - 8, p.y + 12 + bob, 16, 3, 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // tiny hands
      ctx.fillStyle = "rgba(253,224,180,0.9)";
      ctx.beginPath();
      ctx.arc(p.x - 10, p.y + 13 + bob, 2.2, 0, Math.PI * 2);
      ctx.arc(p.x + 10, p.y + 13 + bob, 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      return;
    }

    // cat / dog (map icon) — upgraded a bit
    drawShadowEllipse(n.x, n.y + 10, 12, 5, 0.12);
    ctx.save();

    const body = n.kind === "cat" ? "rgba(100,116,139,1)" : "rgba(120,74,40,1)";
    const face = n.kind === "cat" ? "rgba(148,163,184,1)" : "rgba(253,224,180,1)";

    // body
    ctx.fillStyle = body;
    roundRectPath(ctx, p.x - 10, p.y + 2 + bob * 0.4, 20, 10, 6);
    ctx.fill();

    // tail
    ctx.strokeStyle = body;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(p.x - 10, p.y + 8 + bob * 0.4);
    ctx.quadraticCurveTo(p.x - 18, p.y + 2 + bob * 0.4, p.x - 12, p.y - 2 + bob * 0.4);
    ctx.stroke();

    // head
    ctx.fillStyle = face;
    ctx.beginPath();
    ctx.arc(p.x + 12, p.y + 4 + bob * 0.4, 6, 0, Math.PI * 2);
    ctx.fill();

    // ears for cat, floppy ears for dog
    ctx.fillStyle = face;
    if (n.kind === "cat") {
      ctx.beginPath();
      ctx.moveTo(p.x + 9, p.y - 2 + bob * 0.4);
      ctx.lineTo(p.x + 11, p.y + 2 + bob * 0.4);
      ctx.lineTo(p.x + 7, p.y + 2 + bob * 0.4);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(p.x + 15, p.y - 2 + bob * 0.4);
      ctx.lineTo(p.x + 17, p.y + 2 + bob * 0.4);
      ctx.lineTo(p.x + 13, p.y + 2 + bob * 0.4);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.ellipse(p.x + 9, p.y + 1 + bob * 0.4, 3, 5, 0.4, 0, Math.PI * 2);
      ctx.ellipse(p.x + 16, p.y + 1 + bob * 0.4, 3, 5, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // eyes
    ctx.fillStyle = "rgba(15,23,42,0.75)";
    ctx.beginPath();
    ctx.arc(p.x + 10.5, p.y + 3 + bob * 0.4, 0.9, 0, Math.PI * 2);
    ctx.arc(p.x + 13.5, p.y + 3 + bob * 0.4, 0.9, 0, Math.PI * 2);
    ctx.fill();

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

    const tNow = now / 1000;

    try {
      if (!viewW || !viewH) return;
      ensureGrassPattern();

      if (!isPaused()) {
        const up = keys.has("KeyW") || keys.has("ArrowUp");
        const down = keys.has("KeyS") || keys.has("ArrowDown");
        const left = keys.has("KeyA") || keys.has("ArrowLeft");
        const right = keys.has("KeyD") || keys.has("ArrowRight");

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

        // NEW: animals wander + lightly avoid player
        for (const a of animals) {
          a.decisionT -= dt;
          if (a.decisionT <= 0) {
            const ang = rand() * Math.PI * 2;
            a.vx = Math.cos(ang);
            a.vy = Math.sin(ang);
            a.decisionT = 0.9 + rand() * 2.2;
          }

          const pdx = a.x - player.x;
          const pdy = a.y - player.y;
          const pd = Math.hypot(pdx, pdy);
          if (pd < 160) {
            // flee a bit
            const fx = (pdx / (pd || 1)) * 0.9;
            const fy = (pdy / (pd || 1)) * 0.9;
            a.vx = a.vx * 0.25 + fx * 0.75;
            a.vy = a.vy * 0.25 + fy * 0.75;
          }

          // gentle home pull
          const hx = a.homeX - a.x;
          const hy = a.homeY - a.y;
          a.vx += hx * 0.0008;
          a.vy += hy * 0.0008;

          const vlen = Math.hypot(a.vx, a.vy) || 1;
          const vx = a.vx / vlen;
          const vy = a.vy / vlen;
          const sp = a.kind === "deer" ? 22 : 18;

          const ax = a.x + vx * sp * dt;
          const ay = a.y + vy * sp * dt;

          // avoid solids a bit (animals are non-solid, but keep them from clipping too much)
          if (!collidesCircle(ax, a.y, 10)) a.x = ax;
          if (!collidesCircle(a.x, ay, 10)) a.y = ay;

          a.x = clamp(a.x, 18, W - 18);
          a.y = clamp(a.y, 18, H - 18);
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

      // flowers (low)
      for (const fp of flowers) {
        if (!inView(fp.x - fp.r - 20, fp.y - fp.r - 20, fp.r * 2 + 40, fp.r * 2 + 40, vx, vy, viewW, viewH)) continue;
        q.push({ y: fp.y + 2, draw: () => drawFlowerPatch(fp, tNow) });
      }

      for (const t of trees) {
        if (!inView(t.x - 70, t.y - 90, 140, 160, vx, vy, viewW, viewH)) continue;
        q.push({ y: t.y, draw: () => drawTree(t) });
      }

      // wells
      for (const w of wells) {
        if (!inView(w.x - 80, w.y - 120, 160, 220, vx, vy, viewW, viewH)) continue;
        q.push({ y: w.y + 20, draw: () => drawWell(w) });
      }

      // huts + knights
      for (const s of stops) {
        const h = s.house;
        if (!inView(h.x - 30, h.y - 120, h.w + 60, h.h + 240, vx, vy, viewW, viewH)) continue;
        q.push({ y: h.y + h.h, draw: () => drawHut(s) });
        q.push({ y: s.knight.y, draw: () => drawKnight(s.knight) });
      }

      // animals
      for (const a of animals) {
        if (!inView(a.x - 60, a.y - 80, 120, 160, vx, vy, viewW, viewH)) continue;
        q.push({ y: a.y + 10, draw: () => drawAnimal(a, tNow) });
      }

      // NPCs
      for (const n of npcs) {
        if (!inView(n.x - 40, n.y - 40, 80, 80, vx, vy, viewW, viewH)) continue;
        q.push({ y: n.y, draw: () => drawNpc(n, tNow) });
      }

      // birds / butterflies (draw high so they feel "above" the world a bit)
      for (const b of birds) {
        if (!inView(b.x - 60, b.y - 80, 120, 160, vx, vy, viewW, viewH)) continue;
        // fly layer: y sort slightly above ground objects
        q.push({ y: b.y - 120, draw: () => drawBird(b, tNow) });
      }

      // player (kept original, upgraded details but same mechanics)
      q.push({
        y: player.y,
        draw: () => {
          const p = worldToScreen(player.x, player.y);
          drawShadowEllipse(player.x, player.y + 16, 14, 6, 0.12);

          // body
          ctx.save();
          ctx.fillStyle = "rgba(30, 41, 59, 1)";
          roundRectPath(ctx, p.x - 10, p.y + 2, 20, 18, 8);
          ctx.fill();

          // belt highlight
          ctx.globalAlpha = 0.18;
          ctx.fillStyle = "rgba(255,255,255,1)";
          roundRectPath(ctx, p.x - 9, p.y + 10, 18, 3, 2);
          ctx.fill();
          ctx.globalAlpha = 1;

          // head
          ctx.fillStyle = "rgba(253, 224, 180, 1)";
          ctx.beginPath();
          ctx.arc(p.x, p.y - 6, 9, 0, Math.PI * 2);
          ctx.fill();

          // hair
          ctx.fillStyle = "rgba(15, 23, 42, 0.90)";
          ctx.beginPath();
          ctx.arc(p.x - 1, p.y - 10.5, 8.5, Math.PI * 1.05, Math.PI * 1.95);
          ctx.fill();

          // eyes (directional)
          ctx.fillStyle = "rgba(15,23,42,0.85)";
          ctx.beginPath();
          ctx.arc(p.x + player.faceX * 2.8 - 2.2, p.y - 7, 1.3, 0, Math.PI * 2);
          ctx.arc(p.x + player.faceX * 2.8 + 2.2, p.y - 7, 1.3, 0, Math.PI * 2);
          ctx.fill();

          // tiny mouth
          ctx.strokeStyle = "rgba(15,23,42,0.35)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y - 3.3, 3.2, 0.15 * Math.PI, 0.85 * Math.PI);
          ctx.stroke();

          ctx.restore();
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
    window.removeEventListener("blur", onBlur);
    if (ro) ro.disconnect();
    else window.removeEventListener("resize", onWinResize);
  };
}
