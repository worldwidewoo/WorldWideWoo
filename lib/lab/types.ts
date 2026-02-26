import { GenerativeEngine } from "@/lib/engines/types";

export type AspectRatio = "1:1" | "4:3" | "3:4" | "16:9" | "9:16" | "3:2" | "2:3";

export interface LabExperiment {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  aspectRatio: AspectRatio;
  thumbnail?: string;
  createEngine: () => GenerativeEngine;
}

export function aspectRatioToNumber(ratio: AspectRatio): number {
  const [w, h] = ratio.split(":").map(Number);
  return w / h;
}
