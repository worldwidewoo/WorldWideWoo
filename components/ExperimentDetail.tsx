"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getExperiment } from "@/lib/lab/registry";
import LabCanvas from "./LabCanvas";

interface ExperimentDetailProps {
  slug: string;
}

export default function ExperimentDetail({ slug }: ExperimentDetailProps) {
  const experiment = getExperiment(slug);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setIsFullscreen(false);
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [isFullscreen, handleEsc]);

  if (!experiment) return null;

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <LabCanvas
          createEngine={experiment.createEngine}
          aspectRatio={experiment.aspectRatio}
          className="w-full h-full"
        />
        <button
          onClick={() => setIsFullscreen(false)}
          className="fixed top-4 right-4 z-50 text-xs text-white/30 hover:text-white/60
                     transition-colors px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm"
        >
          ESC
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <Link
          href="/lab"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          &larr; Lab
        </Link>
        <button
          onClick={() => setIsFullscreen(true)}
          className="text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          Fullscreen
        </button>
      </div>

      {/* Canvas */}
      <div className="w-full" style={{ height: "calc(100vh - 220px)", minHeight: "300px" }}>
        <LabCanvas
          createEngine={experiment.createEngine}
          aspectRatio={experiment.aspectRatio}
          className="w-full h-full"
        />
      </div>

      {/* Metadata */}
      <div className="px-6 py-6 max-w-2xl border-t border-white/[0.06]">
        <h1 className="text-base text-white/90">{experiment.title}</h1>
        <p className="text-sm text-white/45 mt-2">{experiment.description}</p>
        <div className="flex gap-2 mt-3">
          {experiment.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/35"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-xs text-white/20 mt-4">{experiment.date}</p>
      </div>
    </div>
  );
}
