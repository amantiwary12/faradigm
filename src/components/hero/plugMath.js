// Geometry and colour maths for the plug-in scene. All coordinates are in the SVG's 640x400 space.

export const PORT = { x: 254.6, y: 291.3 }; // the capacitor's input port, where the cable starts
export const REST = { x: 370, y: 326 }; // where the plug hangs when unplugged
export const SOCKET = { x: 517.5, y: 180.7 }; // the socket on the switchboard
export const BOARD = { x1: 462, y1: 82, x2: 619, y2: 249 }; // dropping the plug anywhere on the board plugs it in
export const CABLE = 440; // fixed cable length: the slack sags as the plug moves
export const TAIL = 22.5; // from the plug's origin to where the cable attaches

export const CHARGE_MS = 3200;
export const HOLD_MS = 900;
export const DRAIN_MS = 1400;

// State-of-charge ramp: empty reads red, mid reads amber, full reads green. [level, lo, hi]
const STOPS = [
  [0, [232, 90, 74], [193, 45, 32]],
  [0.5, [245, 166, 53], [215, 120, 10]],
  [1, [82, 200, 122], [26, 150, 79]],
];
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;

export function chargeColors(level) {
  const i = level <= 0.5 ? 0 : 1;
  const t = Math.max(0, Math.min(1, (level - STOPS[i][0]) / (STOPS[i + 1][0] - STOPS[i][0])));
  return { lo: rgb(mix(STOPS[i][1], STOPS[i + 1][1], t)), hi: rgb(mix(STOPS[i][2], STOPS[i + 1][2], t)) };
}

/** A slack cable of fixed length hanging between the port and the plug. */
export function cablePath(pos) {
  const b = { x: pos.x, y: pos.y + TAIL };
  const d = Math.hypot(b.x - PORT.x, b.y - PORT.y);
  const slack = Math.max(0, CABLE - d);
  const sag = Math.min(150, Math.sqrt(slack * d * 0.25 + slack * slack * 0.02));
  const cy = Math.min(362, Math.max(PORT.y, b.y) + sag);
  const c1x = PORT.x + (b.x - PORT.x) * 0.25 + 18;
  const c2x = PORT.x + (b.x - PORT.x) * 0.75;
  return `M${PORT.x} ${PORT.y}C${c1x.toFixed(1)} ${cy.toFixed(1)} ${c2x.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

export const inBoard = (p) => p.x > BOARD.x1 && p.x < BOARD.x2 && p.y > BOARD.y1 && p.y < BOARD.y2;
