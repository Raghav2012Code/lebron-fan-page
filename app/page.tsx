import { EditorialShell } from "@/components/editorial-shell";
import { HeroSection } from "@/components/hero-section";
import { MarqueeStrip } from "@/components/marquee-strip";
import { RecordsGrid } from "@/components/records-grid";
import { ErasTunnel } from "@/components/eras-tunnel";
import { StatExplorer } from "@/components/stat-explorer";
import { NumberInterlude } from "@/components/number-interlude";
import { ShotChallenge } from "@/components/shot-challenge";
import { LegacyTimeline } from "@/components/legacy-timeline";
import { SiteFooter } from "@/components/site-footer";

export default function Page() {
  return (
    <EditorialShell>
      <HeroSection />
      <MarqueeStrip />
      <RecordsGrid />
      <ErasTunnel />
      <StatExplorer />
      <NumberInterlude />
      <ShotChallenge />
      <LegacyTimeline />
      <SiteFooter />
    </EditorialShell>
  );
}
