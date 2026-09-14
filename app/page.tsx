import { CourtShell } from "@/components/court-shell";
import { CenterCourt } from "@/components/center-court";
import { SeasonRuler } from "@/components/season-ruler";
import { HonoursBoard } from "@/components/honours-board";
import { TheLine } from "@/components/the-line";
import { TheRooms } from "@/components/the-rooms";
import { TheLedger } from "@/components/the-ledger";
import { TwentyThree } from "@/components/twenty-three";
import { LastShot } from "@/components/last-shot";
import { FourNights } from "@/components/four-nights";
import { TheBlock } from "@/components/the-block";
import { Baseline } from "@/components/baseline";

export default function Page() {
  return (
    <CourtShell>
      <CenterCourt />
      <SeasonRuler />
      <HonoursBoard />
      <TheLine />
      <TheRooms />
      <TheLedger />
      <TwentyThree />
      <LastShot />
      <FourNights />
      <TheBlock />
      <Baseline />
    </CourtShell>
  );
}
