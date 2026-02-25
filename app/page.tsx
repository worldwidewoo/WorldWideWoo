"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { EngineVersion } from "@/lib/engines/types";
import Canvas from "@/components/Canvas";
import Overlay from "@/components/Overlay";

export default function Home() {
  const [version, setVersion] = useState<EngineVersion>("v1");
  const [opacity, setOpacity] = useState(1);
  const [activeVersion, setActiveVersion] = useState<EngineVersion>("v1");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleVersionChange = useCallback(
    (newVersion: EngineVersion) => {
      if (newVersion === version) return;

      // Fade out
      setOpacity(0);

      // After fade out, switch engine and fade in
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setActiveVersion(newVersion);
        setVersion(newVersion);
        // Small delay for engine init before fade in
        requestAnimationFrame(() => {
          setOpacity(1);
        });
      }, 500);
    },
    [version],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      <Canvas version={activeVersion} opacity={opacity} />
      <Overlay version={version} onVersionChange={handleVersionChange} />
    </main>
  );
}
