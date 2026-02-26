import { LabExperiment } from "./types";
import { GameOfLifeEngine } from "@/lib/engines/gameOfLife";
import { FlowFieldEngine } from "@/lib/engines/flowField";
import { ReactionDiffusionEngine } from "@/lib/engines/reactionDiffusion";

export const experiments: LabExperiment[] = [
  {
    slug: "game-of-life",
    title: "Conway's Game of Life",
    description:
      "Classic cellular automaton. Cell age maps to a color gradient, with mouse interaction spawning new life.",
    date: "2025-02-25",
    tags: ["cellular-automata", "simulation", "classic"],
    aspectRatio: "16:9",
    createEngine: () => new GameOfLifeEngine(),
  },
  {
    slug: "flow-field",
    title: "Perlin Flow Field",
    description:
      "Thousands of particles trace paths through a Perlin noise vector field. Mouse creates a vortex effect.",
    date: "2025-02-25",
    tags: ["particles", "perlin-noise", "flow-field"],
    aspectRatio: "16:9",
    createEngine: () => new FlowFieldEngine(),
  },
  {
    slug: "reaction-diffusion",
    title: "Reaction-Diffusion",
    description:
      "Gray-Scott model producing organic patterns. Click to inject chemicals and watch structures emerge.",
    date: "2025-02-25",
    tags: ["reaction-diffusion", "simulation", "gray-scott"],
    aspectRatio: "1:1",
    createEngine: () => new ReactionDiffusionEngine(),
  },
];

export function getExperiment(slug: string): LabExperiment | undefined {
  return experiments.find((e) => e.slug === slug);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  experiments.forEach((e) => e.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}
