/* ---------------------------------------------------------------------------
 * THE BLOCK — June 19, 2016
 * ------------------------------------------------------------------------- */

export interface BlockKeyframe {
  time: number;
  lebron: { x: number; y: number; elevation: number };
  iguodala: { x: number; y: number };
  jrSmith: { x: number; y: number };
  ball: { x: number; y: number };
  annotation: string;
  /**
   * Distance still to close, and the height of the contest.
   *
   * There is deliberately no per-keyframe SPEED. There was one, reading 11.2 /
   * 17.4 / 20.1 / 19.3 / 14.8 / 0.0 mph, and it was arithmetic fiction: no
   * source reports a speed at those six instants, and every one of the five
   * segments contradicted its own endpoints. 0.7s to 1.4s covers 23 ft, which is
   * 22.4 mph averaged, against tiles reading 17.4 then 20.1 — an average above
   * both endpoints, which is impossible. All five segments had it, the scrubber
   * printed it live, and a reader with a calculator could catch it in one drag.
   *
   * A speed readout is only honest if the speed is measured. The two figures
   * here that ARE sourced — the 88 ft gap and the 2.8 s to the block — are
   * printed as tiles, and the 20.1 mph peak stays in the annotation that
   * attributes it. See the note on THE_BLOCK.stats for why those three do not
   * divide into one another.
   */
  telemetry: {
    distance: string;
    elevation: string;
  };
}

export const THE_BLOCK = {
  heading: "The Block",
  subheading: "Game 7, 2016 NBA Finals. 89–89. 1:52 remaining.",
  copy: "Eighty-eight feet of hardwood closed in 2.8 seconds, ending with both hands on the glass at eleven feet five inches. Spread over the whole chase that gap works out at 21.4 mph, while Sport Science’s own tracking puts his top speed inside it at 20.1. Two measurements taken over different windows, so the page does not present them as one.",
  quote:
    "“Back comes Iguodala to Curry, back to Iguodala, up for the layup... Oh! BLOCKED BY JAMES! LeBron James with the rejection!”",
  caller: "Mike Breen, ABC Sports",
  duration: 2.8,
  stats: [
    // ESPN Sport Science reports that LeBron began the play trailing Iguodala
    // by 88 FEET, and separately puts his top speed in the chase at 20.1 mph.
    // Both are reproduced here, and so is the 2.8 s to the block from the game
    // clock (1:52 to the rejection).
    //
    // These three DO NOT RECONCILE, and the page must not imply that they do:
    //
    //   88 ft / 2.8 s  =  31.4 ft/s  =  21.4 mph AVERAGE
    //
    // An average cannot exceed the peak, so 21.4 > 20.1 means the gap and the
    // speed are measured over different windows — the gap is the separation at
    // the catch, while the speed is sampled inside the chase. The copy above
    // states this rather than leaving a reader to find it.
    //
    // The previously recorded "93 ft" was rejected for a version of this
    // argument ("93ft in 2.8s is a 22.7 mph AVERAGE, which cannot exceed the
    // peak"). That reasoning was right and the figure still went in, because
    // 88 ft in 2.8 s is 21.4 mph — the same violation, one point smaller. The
    // real error was treating three separately-measured figures as one
    // reconciled set, not the number.
    { label: "Chase distance", value: "88 ft" },
    { label: "Peak sprint speed", value: "20.1 mph" },
    { label: "Impact elevation", value: "11' 5\"" },
    { label: "Time to glass", value: "2.8 sec" },
  ],
  keyframes: [
    {
      time: 0.0,
      lebron: { x: 38, y: 8, elevation: 0 },
      iguodala: { x: 42, y: 16 },
      jrSmith: { x: 48, y: 36 },
      ball: { x: 42, y: 16 },
      annotation:
        "Kyrie Irving misses a floater. Andre Iguodala secures the defensive rebound and ignites the Golden State 2-on-1.",
      telemetry: { distance: "88 ft", elevation: "0' 0\"" },
    },
    {
      time: 0.7,
      lebron: { x: 42, y: 26, elevation: 0 },
      iguodala: { x: 44, y: 36 },
      jrSmith: { x: 49, y: 52 },
      ball: { x: 44, y: 36 },
      annotation:
        "LeBron crosses the half-court stripe, accelerating past everyone else on the floor.",
      telemetry: { distance: "68 ft", elevation: "0' 0\"" },
    },
    {
      time: 1.4,
      lebron: { x: 46, y: 48, elevation: 0 },
      iguodala: { x: 47, y: 56 },
      jrSmith: { x: 50, y: 68 },
      ball: { x: 47, y: 56 },
      annotation:
        "LeBron reaches top sprint speed: 20.1 mph, faster than any sprint recorded in the entire 2016 Finals.",
      telemetry: { distance: "45 ft", elevation: "0' 0\"" },
    },
    {
      time: 2.1,
      lebron: { x: 48, y: 72, elevation: 0 },
      iguodala: { x: 48, y: 74 },
      jrSmith: { x: 51, y: 80 },
      ball: { x: 48, y: 74 },
      annotation:
        "JR Smith retreats and contests straight up without fouling, forcing Iguodala to double-clutch and extend high.",
      telemetry: { distance: "21 ft", elevation: "0' 0\"" },
    },
    {
      time: 2.5,
      lebron: { x: 49, y: 83, elevation: 2.8 },
      iguodala: { x: 49, y: 84 },
      jrSmith: { x: 52, y: 85 },
      ball: { x: 49, y: 85 },
      annotation:
        "LeBron launches off two feet outside the charge circle, rising toward the glass with eyes level with the rim.",
      telemetry: { distance: "8 ft", elevation: "8' 9\"" },
    },
    {
      time: 2.8,
      lebron: { x: 50, y: 87.5, elevation: 3.5 },
      iguodala: { x: 49, y: 87.5 },
      jrSmith: { x: 53, y: 87 },
      ball: { x: 49.5, y: 87.5 },
      annotation:
        "“BLOCKED BY JAMES!” Both hands pin the ball flush against the backboard at eleven feet five inches.",
      telemetry: { distance: "0 ft", elevation: "11' 5\"" },
    },
  ] as BlockKeyframe[],
} as const;
