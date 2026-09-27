"use client";

import * as React from "react";

import { Caption, PaintRule, RiseWords } from "@/components/typeset";

/**
 * The error boundary.
 *
 * A page of fifteen client components with no boundary at all: one render-time
 * throw took the whole document, including the skip link and the footer index,
 * because there was nothing above the section to catch it. Six unguarded index
 * expressions could do exactly that on a data change — `PEAK_ERAS[1]`,
 * `SEASONS[index]`, `SHOT_ZONES.eras[selectedEraIndex]`, `LEDGER[0].id` and two
 * siblings — and a data change is the normal way this file is edited.
 *
 * The boundary is the net for all of them, including any added later, rather than
 * six clamps. It is deliberately in the page's own language: this is still the
 * tribute, not a stack trace, and the reader gets a way forward rather than a
 * dead end.
 *
 * `digest` is Next's own identifier for the server-side error and is shown
 * because it is the one piece of information that makes a report actionable.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // A boundary that swallows the error is a boundary that hides the bug from
    // the next person. `no-console` is not enabled in this project's lint rules.
    console.error(error);
  }, [error]);

  return (
    <section className="floor flex min-h-[70svh] items-center py-24">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 md:px-14">
        <PaintRule color="var(--rule-strong)" />
        <div className="pt-8">
          <Caption className="text-muted">The court is not reachable</Caption>
          <h2 className="headline mt-3 text-[1.75rem] text-wine sm:text-[2.25rem]">
            <RiseWords text="Something broke on the way to the floor." />
          </h2>
          <p className="prose-copy mt-5 max-w-[52ch] text-[1.0625rem] text-muted">
            One of the sections failed to render, which took the rest of the page
            with it. Trying it again usually clears it; if it does not, the
            reference below identifies the failure.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={reset}
            className="narrow-bold rounded-none border border-wine bg-wine px-5 py-3 text-chalk transition-colors duration-150 hover:bg-wine-deep"
          >
            Try again
          </button>
          {error.digest ? (
            <p className="text-[0.8125rem] text-muted">
              Reference{" "}
              <span className="text-ink">{error.digest}</span>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
