import Link from "next/link";
import { LabExperiment } from "@/lib/lab/types";

interface ExperimentCardProps {
  experiment: LabExperiment;
}

export default function ExperimentCard({ experiment }: ExperimentCardProps) {
  const { slug, title, description, tags, thumbnail } = experiment;

  return (
    <Link href={`/lab/${slug}`} className="group block">
      <div
        className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]
                    transition-all duration-300
                    group-hover:border-white/20 group-hover:bg-white/[0.06]"
      >
        {/* Thumbnail - fixed 4:3 ratio */}
        <div className="relative w-full bg-black/50" style={{ aspectRatio: "4/3" }}>
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/10 text-xs tracking-wider">NO PREVIEW</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm text-white/80 group-hover:text-white transition-colors">
            {title}
          </h3>
          <p className="text-xs text-white/40 mt-1 line-clamp-2">{description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
