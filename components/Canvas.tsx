"use client";

import { useRef, useEffect, useCallback } from "react";
import { GenerativeEngine, EngineVersion } from "@/lib/engines/types";
import { GameOfLifeEngine } from "@/lib/engines/gameOfLife";
import { FlowFieldEngine } from "@/lib/engines/flowField";
import { ReactionDiffusionEngine } from "@/lib/engines/reactionDiffusion";

function createEngine(version: EngineVersion): GenerativeEngine {
  switch (version) {
    case "v1":
      return new GameOfLifeEngine();
    case "v2":
      return new FlowFieldEngine();
    case "v3":
      return new ReactionDiffusionEngine();
  }
}

interface CanvasProps {
  version: EngineVersion;
  opacity: number;
}

export default function Canvas({ version, opacity }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GenerativeEngine | null>(null);
  const rafRef = useRef<number>(0);

  const animate = useCallback(() => {
    const engine = engineRef.current;
    const canvas = canvasRef.current;
    if (!engine || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    engine.update();
    engine.render(ctx);
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas to viewport size (1:1 pixels, no DPR scaling for generative art)
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const engine = createEngine(version);
    engineRef.current = engine;
    engine.init(canvas);

    rafRef.current = requestAnimationFrame(animate);

    // Mouse/touch events on canvas only (not window) to avoid toggle interference
    const handleMouseMove = (e: MouseEvent) => {
      engine.onMouseMove(e.clientX, e.clientY);
    };
    const handleClick = (e: MouseEvent) => {
      engine.onMouseClick(e.clientX, e.clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        engine.onMouseMove(e.touches[0].clientX, e.touches[0].clientY);
        engine.onMouseClick(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        engine.onMouseClick(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    // Debounced resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        engine.resize(window.innerWidth, window.innerHeight);

        // Recreate imageData for engines that need it
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }, 150);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer);
      engine.destroy();
      engineRef.current = null;
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("resize", handleResize);
    };
  }, [version, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{
        opacity,
        transition: "opacity 0.5s ease",
      }}
    />
  );
}
