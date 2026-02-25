// Simplex-style Perlin noise implementation
// Based on improved Perlin noise algorithm

const PERM = new Uint8Array(512);
const GRAD3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
];

function initPerm() {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  // Shuffle
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
}

initPerm();

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

function dot3(g: number[], x: number, y: number, z: number): number {
  return g[0] * x + g[1] * y + g[2] * z;
}

export function noise3D(x: number, y: number, z: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;

  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const zf = z - Math.floor(z);

  const u = fade(xf);
  const v = fade(yf);
  const w = fade(zf);

  const A = PERM[X] + Y;
  const AA = PERM[A] + Z;
  const AB = PERM[A + 1] + Z;
  const B = PERM[X + 1] + Y;
  const BA = PERM[B] + Z;
  const BB = PERM[B + 1] + Z;

  return lerp(
    lerp(
      lerp(dot3(GRAD3[PERM[AA] % 12], xf, yf, zf), dot3(GRAD3[PERM[BA] % 12], xf - 1, yf, zf), u),
      lerp(dot3(GRAD3[PERM[AB] % 12], xf, yf - 1, zf), dot3(GRAD3[PERM[BB] % 12], xf - 1, yf - 1, zf), u),
      v,
    ),
    lerp(
      lerp(dot3(GRAD3[PERM[AA + 1] % 12], xf, yf, zf - 1), dot3(GRAD3[PERM[BA + 1] % 12], xf - 1, yf, zf - 1), u),
      lerp(dot3(GRAD3[PERM[AB + 1] % 12], xf, yf - 1, zf - 1), dot3(GRAD3[PERM[BB + 1] % 12], xf - 1, yf - 1, zf - 1), u),
      v,
    ),
    w,
  );
}
