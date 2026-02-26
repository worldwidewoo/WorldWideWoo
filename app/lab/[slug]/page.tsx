import { experiments, getExperiment } from "@/lib/lab/registry";
import ExperimentDetail from "@/components/ExperimentDetail";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return experiments.map((exp) => ({ slug: exp.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const experiment = getExperiment(slug);
    if (!experiment) return {};
    return {
      title: `${experiment.title} | Lab | WorldWideWoo`,
      description: experiment.description,
    };
  });
}

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experiment = getExperiment(slug);
  if (!experiment) notFound();

  return <ExperimentDetail slug={slug} />;
}
