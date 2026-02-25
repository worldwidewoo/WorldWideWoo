import { GenerativeEngine } from "./types";

export class ReactionDiffusionEngine implements GenerativeEngine {
  private a: Float32Array = new Float32Array(0);
  private b: Float32Array = new Float32Array(0);
  private nextA: Float32Array = new Float32Array(0);
  private nextB: Float32Array = new Float32Array(0);
  private offscreen: OffscreenCanvas | null = null;
  private offCtx: OffscreenCanvasRenderingContext2D | null = null;
  private imageData: ImageData | null = null;
  private width = 0;
  private height = 0;
  private scale = 2;
  private gridW = 0;
  private gridH = 0;

  // Gray-Scott parameters - "coral growth" preset
  private feed = 0.055;
  private kill = 0.062;
  private dA = 1.0;
  private dB = 0.5;
  private dt = 1.0;

  init(canvas: HTMLCanvasElement): void {
    this.width = canvas.width;
    this.height = canvas.height;
    this.scale = this.width > 1000 ? 3 : 2;
    this.gridW = Math.ceil(this.width / this.scale);
    this.gridH = Math.ceil(this.height / this.scale);

    const size = this.gridW * this.gridH;
    this.a = new Float32Array(size).fill(1);
    this.b = new Float32Array(size).fill(0);
    this.nextA = new Float32Array(size);
    this.nextB = new Float32Array(size);

    this.seedRandom();
    this.initOffscreen();
  }

  update(): void {
    const { gridW, gridH, feed, kill, dA, dB, dt } = this;

    // Run multiple simulation steps per frame for speed
    for (let step = 0; step < 8; step++) {
      const a = this.a;
      const b = this.b;
      const nextA = this.nextA;
      const nextB = this.nextB;

      for (let y = 1; y < gridH - 1; y++) {
        for (let x = 1; x < gridW - 1; x++) {
          const idx = y * gridW + x;

          const laplaceA =
            a[idx - 1] + a[idx + 1] + a[idx - gridW] + a[idx + gridW] - 4 * a[idx];
          const laplaceB =
            b[idx - 1] + b[idx + 1] + b[idx - gridW] + b[idx + gridW] - 4 * b[idx];

          const aVal = a[idx];
          const bVal = b[idx];
          const abb = aVal * bVal * bVal;

          nextA[idx] = aVal + (dA * laplaceA - abb + feed * (1 - aVal)) * dt;
          nextB[idx] = bVal + (dB * laplaceB + abb - (kill + feed) * bVal) * dt;

          nextA[idx] = Math.max(0, Math.min(1, nextA[idx]));
          nextB[idx] = Math.max(0, Math.min(1, nextB[idx]));
        }
      }

      // Swap buffers
      this.a = nextA;
      this.b = nextB;
      this.nextA = a;
      this.nextB = b;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.imageData || !this.offCtx || !this.offscreen) return;

    const { gridW, gridH } = this;
    const b = this.b;
    const data = this.imageData.data;

    for (let y = 0; y < gridH; y++) {
      for (let x = 0; x < gridW; x++) {
        const idx = y * gridW + x;
        const pixIdx = idx * 4;
        const bVal = b[idx];

        // Color mapping: dark → teal → white
        const t = Math.min(1, bVal * 2.5);
        data[pixIdx] = Math.floor(t * t * 200);
        data[pixIdx + 1] = Math.floor(t * 220 + (1 - t) * 8);
        data[pixIdx + 2] = Math.floor(t * 180 + (1 - t) * 15);
        data[pixIdx + 3] = 255;
      }
    }

    // Draw to offscreen canvas at grid resolution, then scale to main canvas
    this.offCtx.putImageData(this.imageData, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.offscreen, 0, 0, this.width, this.height);
  }

  onMouseMove(x: number, y: number): void {
    // Drag to continuously inject chemical B
    this.addSeed(Math.floor(x / this.scale), Math.floor(y / this.scale), 4);
  }

  onMouseClick(x: number, y: number): void {
    this.addSeed(Math.floor(x / this.scale), Math.floor(y / this.scale), 8);
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.scale = width > 1000 ? 3 : 2;
    this.gridW = Math.ceil(width / this.scale);
    this.gridH = Math.ceil(height / this.scale);

    const size = this.gridW * this.gridH;
    this.a = new Float32Array(size).fill(1);
    this.b = new Float32Array(size).fill(0);
    this.nextA = new Float32Array(size);
    this.nextB = new Float32Array(size);

    this.seedRandom();
    this.initOffscreen();
  }

  destroy(): void {
    this.a = new Float32Array(0);
    this.b = new Float32Array(0);
    this.nextA = new Float32Array(0);
    this.nextB = new Float32Array(0);
    this.imageData = null;
    this.offscreen = null;
    this.offCtx = null;
  }

  private initOffscreen(): void {
    this.offscreen = new OffscreenCanvas(this.gridW, this.gridH);
    this.offCtx = this.offscreen.getContext("2d");
    if (this.offCtx) {
      this.imageData = this.offCtx.createImageData(this.gridW, this.gridH);
    }
  }

  private seedRandom(): void {
    const spots = 5 + Math.floor(Math.random() * 5);
    for (let i = 0; i < spots; i++) {
      const cx = Math.floor(Math.random() * (this.gridW - 20) + 10);
      const cy = Math.floor(Math.random() * (this.gridH - 20) + 10);
      this.addSeed(cx, cy, 6);
    }
  }

  private addSeed(cx: number, cy: number, radius: number): void {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy > radius * radius) continue;
        const x = cx + dx;
        const y = cy + dy;
        if (x >= 0 && x < this.gridW && y >= 0 && y < this.gridH) {
          this.b[y * this.gridW + x] = 1;
        }
      }
    }
  }
}
