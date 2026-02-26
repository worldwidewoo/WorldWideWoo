"use client";

import { experiments } from "@/lib/lab/registry";
import ExperimentCard from "./ExperimentCard";

export default function LabGallery() {
  const sorted = [...experiments].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sorted.map((exp) => (
        <ExperimentCard key={exp.slug} experiment={exp} />
      ))}
    </div>
  );
}
