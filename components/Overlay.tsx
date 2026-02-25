"use client";

import { EngineVersion } from "@/lib/engines/types";
import VersionToggle from "./VersionToggle";

interface OverlayProps {
  version: EngineVersion;
  onVersionChange: (version: EngineVersion) => void;
}

export default function Overlay({ version, onVersionChange }: OverlayProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Title - bottom left */}
      <div className="absolute bottom-6 left-6">
        <h1 className="text-sm text-white/50 tracking-[0.15em] font-light select-none">
          WorldWideWoo
        </h1>
      </div>

      {/* Version toggle - bottom right */}
      <div className="absolute bottom-6 right-6 pointer-events-auto">
        <VersionToggle current={version} onChange={onVersionChange} />
      </div>
    </div>
  );
}
