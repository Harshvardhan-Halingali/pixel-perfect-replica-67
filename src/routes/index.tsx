import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Nav, Hero, Mission, Systems, Orbit, Footer } from "@/components/space/Sections";
import { SmoothScroll, Cursor } from "@/components/space/ui";

const SpaceScene = lazy(() => import("@/components/space/SpaceScene"));

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "VOIDLINE — Explore the Unknown" },
      { name: "description", content: "A cinematic, scroll-driven journey through deep space. Explore new worlds with VOIDLINE." },
      { property: "og:title", content: "VOIDLINE — Explore the Unknown" },
      { property: "og:description", content: "A cinematic, scroll-driven journey through deep space." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative">
      <Suspense fallback={null}><SpaceScene /></Suspense>
      <SmoothScroll />
      <Cursor />
      <Nav />
      <Hero />
      <Mission />
      <Systems />
      <Orbit />
      <Footer />
    </main>
  );
}
