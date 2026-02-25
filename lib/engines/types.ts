export interface GenerativeEngine {
  init(canvas: HTMLCanvasElement): void;
  update(): void;
  render(ctx: CanvasRenderingContext2D): void;
  onMouseMove(x: number, y: number): void;
  onMouseClick(x: number, y: number): void;
  resize(width: number, height: number): void;
  destroy(): void;
}

export type EngineVersion = "v1" | "v2" | "v3";

export const ENGINE_LABELS: Record<EngineVersion, string> = {
  v1: "Life",
  v2: "Flow",
  v3: "Diffusion",
};
