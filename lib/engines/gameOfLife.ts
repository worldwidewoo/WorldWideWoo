import { GenerativeEngine } from "./types";

export class GameOfLifeEngine implements GenerativeEngine {
  private grid: Float32Array = new Float32Array(0);
  private nextGrid: Float32Array = new Float32Array(0);
  private age: Float32Array = new Float32Array(0);
  private cols = 0;
  private rows = 0;
  private cellSize = 6;
  private width = 0;
  private height = 0;
  private mouseX = -1;
  private mouseY = -1;
  private frameCount = 0;

  init(canvas: HTMLCanvasElement): void {
    this.width = canvas.width;
    this.height = canvas.height;
    this.cellSize = Math.max(4, Math.min(8, Math.floor(Math.min(this.width, this.height) / 150)));
    this.cols = Math.ceil(this.width / this.cellSize);
    this.rows = Math.ceil(this.height / this.cellSize);

    const size = this.cols * this.rows;
    this.grid = new Float32Array(size);
    this.nextGrid = new Float32Array(size);
    this.age = new Float32Array(size);

    // Random seed - sparse initial state
    for (let i = 0; i < size; i++) {
      this.grid[i] = Math.random() < 0.15 ? 1 : 0;
    }
  }

  update(): void {
    this.frameCount++;
    // Run update every 3 frames for visible pace
    if (this.frameCount % 3 !== 0) return;

    const { cols, rows, grid, nextGrid, age } = this;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const idx = y * cols + x;
        let neighbors = 0;

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = (x + dx + cols) % cols;
            const ny = (y + dy + rows) % rows;
            neighbors += grid[ny * cols + nx] > 0 ? 1 : 0;
          }
        }

        const alive = grid[idx] > 0;
        if (alive) {
          // Survival: 2 or 3 neighbors
          nextGrid[idx] = neighbors === 2 || neighbors === 3 ? 1 : 0;
        } else {
          // Birth: exactly 3 neighbors
          nextGrid[idx] = neighbors === 3 ? 1 : 0;
        }

        // Update age
        if (nextGrid[idx] > 0) {
          age[idx] = Math.min(age[idx] + 1, 255);
        } else {
          // Fade out dead cells
          age[idx] = Math.max(age[idx] - 8, 0);
        }
      }
    }

    // Swap grids
    const temp = this.grid;
    this.grid = this.nextGrid;
    this.nextGrid = temp;

    // Mouse hover: activate cells near cursor
    if (this.mouseX >= 0 && this.mouseY >= 0) {
      this.activateCells(this.mouseX, this.mouseY, 3);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { cols, rows, cellSize, grid, age } = this;

    ctx.fillStyle = "rgba(0, 0, 8, 0.3)";
    ctx.fillRect(0, 0, this.width, this.height);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const idx = y * cols + x;
        const a = age[idx];
        if (a <= 0) continue;

        const alive = grid[idx] > 0;
        if (alive) {
          // Color gradient based on age: blue → cyan → green → yellow → red
          const t = Math.min(a / 120, 1);
          const r = Math.floor(t * 255);
          const g = Math.floor(t < 0.5 ? t * 2 * 200 : (1 - t) * 2 * 200 + 55);
          const b = Math.floor((1 - t) * 255);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
        } else {
          // Fading ghost
          const alpha = a / 255 * 0.4;
          ctx.fillStyle = `rgba(60,80,120,${alpha})`;
        }

        ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }

  onMouseMove(x: number, y: number): void {
    this.mouseX = x;
    this.mouseY = y;
  }

  onMouseClick(x: number, y: number): void {
    this.activateCells(x, y, 8);
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.cellSize = Math.max(4, Math.min(8, Math.floor(Math.min(width, height) / 150)));
    this.cols = Math.ceil(width / this.cellSize);
    this.rows = Math.ceil(height / this.cellSize);

    const size = this.cols * this.rows;
    this.grid = new Float32Array(size);
    this.nextGrid = new Float32Array(size);
    this.age = new Float32Array(size);

    for (let i = 0; i < size; i++) {
      this.grid[i] = Math.random() < 0.15 ? 1 : 0;
    }
  }

  destroy(): void {
    this.grid = new Float32Array(0);
    this.nextGrid = new Float32Array(0);
    this.age = new Float32Array(0);
  }

  private activateCells(px: number, py: number, radius: number): void {
    const cx = Math.floor(px / this.cellSize);
    const cy = Math.floor(py / this.cellSize);

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy > radius * radius) continue;
        if (Math.random() > 0.6) continue;
        const nx = (cx + dx + this.cols) % this.cols;
        const ny = (cy + dy + this.rows) % this.rows;
        this.grid[ny * this.cols + nx] = 1;
        this.age[ny * this.cols + nx] = 1;
      }
    }
  }
}
