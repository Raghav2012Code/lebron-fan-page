# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

Edit the right-hand column to match whatever vocabulary you actually use.

## Existing labels in the tracker

`wontfix` already exists as a GitHub default. The other four do not exist yet and are created on first use.

The tracker also carries a **separate, non-triage** vocabulary added during the 2026-09 design
and correctness audit. These are severity and work-ordering labels, not triage states, and they
do not collide with the roles above:

- Severity: `critical`, `major`, `minor`
- Work ordering: `wave-0-verify`, `wave-1-data`, `wave-2-render`, `wave-3-motion`, `wave-4-a11y`, `wave-5-health`
- Confidence: `needs-verification`

An issue can legitimately carry one triage label *and* one severity label. Do not treat
`needs-verification` and `needs-info` as synonyms: the first means "our own claim is unproven",
the second means "we are waiting on the reporter".
