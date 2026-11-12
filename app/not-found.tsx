import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-start gap-5 py-24">
      <p className="font-mono text-xs tracking-widest text-primary uppercase">404</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        This page went off-call.
      </h1>
      <p className="text-lg text-muted-foreground">
        The page you were looking for doesn&apos;t exist or has moved.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg" className="h-11 px-4">
          <Link href="/">Home</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-11 px-4">
          <Link href="/work">Case studies</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-11 px-4">
          <Link href="/contact">Contact</Link>
        </Button>
      </div>
    </div>
  );
}
