import { caseStudyStaticParams } from "@/lib/content/static-params";
import { formatMetric, getCaseStudy, getProfile } from "@/lib/content";
import { renderShareImage } from "@/lib/og";

// Share image for one case study, written to share-image.png at build time.
export const dynamic = "force-static";

export async function generateStaticParams() {
  return caseStudyStaticParams();
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  const profile = getProfile();
  if (!study) {
    return renderShareImage({ eyebrow: "Case study", title: profile.name });
  }
  return renderShareImage({
    eyebrow: `Case study · ${profile.name}`,
    title: study.title,
    metric: { value: formatMetric(study.heroMetric), label: study.heroMetric.label },
  });
}
