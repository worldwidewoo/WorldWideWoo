"use client";

import { useRef, useEffect, useCallback } from "react";
import { GenerativeEngine } from "@/lib/engines/types";
import { AspectRatio, aspectRatioToNumber } from "@/lib/lab/types";

interface LabCanvasProps {
  createEngine: () => GenerativeEngine;
  aspectRatio: AspectRatio;
  className?: string;
}

function calcSize(
  containerW: number,
  containerH: number,
  ratio: number,
): { width: number; height: number } {
  if (containerW / containerH > ratio) {
    const h = containerH;
    return { width: Math.floor(h * ratio), height: Math.floor(h) };
  }
  const w = containerW;
  return { width: Math.floor(w), height: Math.floor(w / ratio) };
}

export default function LabCanvas({ createEngine, aspectRatio, className }: LabCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ratio = aspectRatioToNumber(aspectRatio);
    const rect = container.getBoundingClientRect();
    const { width, height } = calcSize(rect.width, rect.height, ratio);

    canvas.width = width;
    canvas.height = height;

    const engine = createEngine();
    engineRef.current = engine;
    engine.init(canvas);
    rafRef.current = requestAnimationFrame(animate);

    // Mouse events with coordinate translation
    const handleMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      engine.onMouseMove(e.clientX - r.left, e.clientY - r.top);
    };
    const handleClick = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      engine.onMouseClick(e.clientX - r.left, e.clientY - r.top);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const r = canvas.getBoundingClientRect();
        const t = e.touches[0];
        engine.onMouseMove(t.clientX - r.left, t.clientY - r.top);
        engine.onMouseClick(t.clientX - r.left, t.clientY - r.top);
      }
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const r = canvas.getBoundingClientRect();
        const t = e.touches[0];
        engine.onMouseClick(t.clientX - r.left, t.clientY - r.top);
      }
    };

    // Resize via ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width: cw, height: ch } = entry.contentRect;
      const s = calcSize(cw, ch, ratio);
      canvas.width = s.width;
      canvas.height = s.height;
      engine.resize(s.width, s.height);
    });
    resizeObserver.observe(container);

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      engine.destroy();
      engineRef.current = null;
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
    };
  }, [createEngine, aspectRatio, animate]);

  return (
    <div ref={containerRef} className={`flex items-center justify-center ${className ?? ""}`}>
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
