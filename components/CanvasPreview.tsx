"use client";

import { useRef, useEffect, useCallback } from "react";
import { GenerativeEngine } from "@/lib/engines/types";

interface CanvasPreviewProps {
  createEngine: () => GenerativeEngine;
}

export default function CanvasPreview({ createEngine }: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GenerativeEngine | null>(null);
  const rafRef = useRef<number>(0);
  const frameCount = useRef(0);

  const animate = useCallback(() => {
    const engine = engineRef.current;
    const canvas = canvasRef.current;
    if (!engine || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Throttle to ~20fps for preview performance
    frameCount.current++;
    if (frameCount.current % 3 === 0) {
      engine.update();
      engine.render(ctx);
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    canvas.width = Math.floor(rect.width);
    canvas.height = Math.floor(rect.height);

    const engine = createEngine();
    engineRef.current = engine;
    engine.init(canvas);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      engine.destroy();
      engineRef.current = null;
    };
  }, [createEngine, animate]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
