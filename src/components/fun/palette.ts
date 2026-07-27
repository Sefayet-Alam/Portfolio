/**
 * Village colors for the /fun canvas.
 *
 * Dark theme is a dusk village rather than a recolored day village —
 * village.ts already draws lit windows, so night is the natural fit and
 * keeps the scene readable instead of muddy.
 */
export type VillagePalette = {
  isDark: boolean;

  grassTop: string;
  grassBottom: string;
  grassTuft: string;
  grassStroke: string;

  path: string;
  pathEdge: string;
  shadow: string;

  roofTop: string;
  roofBottom: string;
  wallTop: string;
  wallBottom: string;
  wallStroke: string;
  strip: string;
  wood: string;
  woodDark: string;
  door: string;
  doorShade: string;

  windowGlass: string;
  windowFrame: string;
  windowLit: string;

  trunk: string;
  canopy: string;

  water: string;
  waterEdge: string;
  stone: string;
  stoneDark: string;

  outline: string;
  ink: string;

  signBg: string;
  signText: string;
  hintBg: string;
  hintText: string;
  vignette: string;

  flowerA: string;
  flowerB: string;
  bird: string;
};

const DAY: VillagePalette = {
  isDark: false,

  grassTop: "#8fbf70",
  grassBottom: "#6ea355",
  grassTuft: "rgba(16, 90, 50, 0.16)",
  grassStroke: "rgba(15, 110, 60, 0.08)",

  path: "rgba(204, 160, 96, 0.95)",
  pathEdge: "rgba(150, 112, 60, 0.5)",
  shadow: "rgba(15, 23, 42, 0.16)",

  roofTop: "#c0603f",
  roofBottom: "#8c3f2c",
  wallTop: "#f6ead3",
  wallBottom: "#e0cfae",
  wallStroke: "rgba(90, 55, 25, 0.26)",
  strip: "rgba(101, 70, 35, 0.5)",
  wood: "rgba(101, 70, 35, 0.85)",
  woodDark: "rgba(55, 33, 12, 1)",
  door: "rgba(120, 74, 40, 0.95)",
  doorShade: "rgba(15, 23, 42, 0.10)",

  windowGlass: "rgba(226, 232, 240, 0.85)",
  windowFrame: "rgba(90, 55, 25, 0.30)",
  windowLit: "rgba(250, 204, 21, 0.10)",

  trunk: "rgba(101, 70, 35, 1)",
  canopy: "rgba(56, 122, 66, 1)",

  water: "rgba(147, 197, 253, 0.55)",
  waterEdge: "rgba(34, 124, 78, 0.24)",
  stone: "rgba(148, 163, 184, 1)",
  stoneDark: "rgba(55, 65, 81, 1)",

  outline: "rgba(15, 23, 42, 0.85)",
  ink: "rgba(15, 23, 42, 1)",

  signBg: "rgba(255, 255, 255, 0.9)",
  signText: "#0b0b0c",
  hintBg: "rgba(11, 11, 12, 0.82)",
  hintText: "#f4f1ea",
  vignette: "rgba(0, 0, 0, 0.16)",

  flowerA: "rgba(59, 130, 246, 0.55)",
  flowerB: "rgba(250, 204, 21, 0.55)",
  bird: "rgba(30, 41, 59, 0.85)",
};

const NIGHT: VillagePalette = {
  isDark: true,

  grassTop: "#365d48",
  grassBottom: "#274434",
  grassTuft: "rgba(140, 210, 165, 0.09)",
  grassStroke: "rgba(150, 220, 175, 0.05)",

  path: "rgba(112, 92, 62, 0.85)",
  pathEdge: "rgba(60, 48, 30, 0.6)",
  shadow: "rgba(0, 0, 0, 0.45)",

  roofTop: "#6b3a2c",
  roofBottom: "#3d1f1a",
  wallTop: "#766d5b",
  wallBottom: "#554c3f",
  wallStroke: "rgba(20, 14, 8, 0.5)",
  strip: "rgba(30, 22, 12, 0.55)",
  wood: "rgba(52, 38, 22, 0.9)",
  woodDark: "rgba(24, 16, 8, 1)",
  door: "rgba(74, 46, 24, 0.95)",
  doorShade: "rgba(0, 0, 0, 0.3)",

  windowGlass: "rgba(70, 82, 100, 0.75)",
  windowFrame: "rgba(20, 14, 8, 0.5)",
  windowLit: "rgba(255, 179, 71, 0.75)",

  trunk: "rgba(46, 33, 19, 1)",
  canopy: "rgba(34, 82, 59, 1)",

  water: "rgba(68, 111, 186, 0.62)",
  waterEdge: "rgba(40, 80, 110, 0.3)",
  stone: "rgba(92, 100, 114, 1)",
  stoneDark: "rgba(38, 44, 54, 1)",

  outline: "rgba(0, 0, 0, 0.8)",
  ink: "rgba(232, 230, 225, 1)",

  signBg: "rgba(11, 11, 12, 0.85)",
  signText: "#f4f1ea",
  hintBg: "rgba(244, 241, 234, 0.92)",
  hintText: "#0b0b0c",
  vignette: "rgba(0, 0, 0, 0.55)",

  flowerA: "rgba(120, 160, 220, 0.45)",
  flowerB: "rgba(230, 190, 110, 0.45)",
  bird: "rgba(200, 205, 215, 0.6)",
};

export function getVillagePalette(isDark: boolean): VillagePalette {
  return isDark ? NIGHT : DAY;
}
