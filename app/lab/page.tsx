import type { Metadata } from "next";
import Link from "next/link";
import { experiments } from "@/lib/lab/registry";
import ExperimentCard from "@/components/ExperimentCard";

export const metadata: Metadata = {
  title: "Lab | WorldWideWoo",
  description: "Visual coding experiments and generative art archive",
};

export default function LabPage() {
  return (
    <div className="min-h-screen bg-black px-6 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-xs text-white/25 hover:text-white/50 transition-colors"
        >
          WorldWideWoo
        </Link>
        <h1 className="text-lg text-white/80 mt-1">Lab</h1>
        <p className="text-xs text-white/35 mt-1">
          {experiments.length} experiments
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {experiments
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((exp) => (
            <ExperimentCard key={exp.slug} experiment={exp} />
          ))}
      </div>
    </div>
  );
}
