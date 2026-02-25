"use client";

import { EngineVersion, ENGINE_LABELS } from "@/lib/engines/types";

const VERSIONS: EngineVersion[] = ["v1", "v2", "v3"];

interface VersionToggleProps {
  current: EngineVersion;
  onChange: (version: EngineVersion) => void;
}

export default function VersionToggle({ current, onChange }: VersionToggleProps) {
  return (
    <div className="flex gap-1 rounded-full bg-white/5 p-1 backdrop-blur-sm border border-white/10">
      {VERSIONS.map((v) => (
        <button
          key={v}
          onClick={(e) => { e.stopPropagation(); onChange(v); }}
          className={`px-3 py-1.5 text-xs rounded-full transition-all duration-300 ${
            current === v
              ? "bg-white/15 text-white/90"
              : "text-white/40 hover:text-white/60"
          }`}
        >
          {ENGINE_LABELS[v]}
        </button>
      ))}
    </div>
  );
}
