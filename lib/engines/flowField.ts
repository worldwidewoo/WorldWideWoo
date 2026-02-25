import { GenerativeEngine } from "./types";
import { noise3D } from "../noise";

interface Particle {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
}

export class FlowFieldEngine implements GenerativeEngine {
  private particles: Particle[] = [];
  private width = 0;
  private height = 0;
  private time = 0;
  private mouseX = -1;
  private mouseY = -1;
  private noiseScale = 0.003;
  private particleCount = 3000;
  private ctx: CanvasRenderingContext2D | null = null;

  init(canvas: HTMLCanvasElement): void {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext("2d");
    this.time = 0;

    // Adjust particle count for mobile
    this.particleCount = Math.min(3000, Math.floor((this.width * this.height) / 300));

    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle());
    }

    // Fill background
    if (this.ctx) {
      this.ctx.fillStyle = "#000008";
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  update(): void {
    this.time += 0.003;

    for (const p of this.particles) {
      p.prevX = p.x;
      p.prevY = p.y;

      // Get flow angle from noise
      let angle = noise3D(p.x * this.noiseScale, p.y * this.noiseScale, this.time) * Math.PI * 4;

      // Mouse influence: create vortex near cursor
      if (this.mouseX >= 0 && this.mouseY >= 0) {
        const dx = p.x - this.mouseX;
        const dy = p.y - this.mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const influence = 1 - dist / 200;
          const mouseAngle = Math.atan2(dy, dx) + Math.PI * 0.5;
          angle = angle * (1 - influence * 0.7) + mouseAngle * influence * 0.7;
        }
      }

      p.vx = p.vx * 0.95 + Math.cos(angle) * 0.5;
      p.vy = p.vy * 0.95 + Math.sin(angle) * 0.5;

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      p.hue = (speed * 40 + this.time * 20) % 360;

      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      // Wrap or respawn
      if (p.x < 0 || p.x > this.width || p.y < 0 || p.y > this.height || p.life <= 0) {
        this.resetParticle(p);
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Trail effect: semi-transparent overlay
    ctx.fillStyle = "rgba(0, 0, 8, 0.04)";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.lineWidth = 1;

    // Batch particles by hue bucket for fewer strokeStyle changes
    const bucketSize = 30;
    const buckets: Map<number, Particle[]> = new Map();

    for (const p of this.particles) {
      const bucket = Math.floor(p.hue / bucketSize) * bucketSize;
      let list = buckets.get(bucket);
      if (!list) {
        list = [];
        buckets.set(bucket, list);
      }
      list.push(p);
    }

    for (const [hue, list] of buckets) {
      ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.5)`;
      ctx.beginPath();
      for (const p of list) {
        if (p.life < 20) continue;
        ctx.moveTo(p.prevX, p.prevY);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }
  }

  onMouseMove(x: number, y: number): void {
    this.mouseX = x;
    this.mouseY = y;
  }

  onMouseClick(x: number, y: number): void {
    // Burst particles from click position
    const burstCount = Math.min(50, this.particles.length);
    for (let i = 0; i < burstCount; i++) {
      const p = this.particles[i];
      p.x = x + (Math.random() - 0.5) * 20;
      p.y = y + (Math.random() - 0.5) * 20;
      p.prevX = p.x;
      p.prevY = p.y;
      p.vx = (Math.random() - 0.5) * 4;
      p.vy = (Math.random() - 0.5) * 4;
      p.life = p.maxLife;
    }
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.particleCount = Math.min(3000, Math.floor((width * height) / 300));

    // Reset particles
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }

  destroy(): void {
    this.particles = [];
    this.ctx = null;
  }

  private createParticle(): Particle {
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      prevX: 0,
      prevY: 0,
      vx: 0,
      vy: 0,
      life: Math.floor(Math.random() * 200 + 50),
      maxLife: 250,
      hue: Math.random() * 360,
    };
  }

  private resetParticle(p: Particle): void {
    p.x = Math.random() * this.width;
    p.y = Math.random() * this.height;
    p.prevX = p.x;
    p.prevY = p.y;
    p.vx = 0;
    p.vy = 0;
    p.life = Math.floor(Math.random() * 200 + 50);
  }
}
