# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root, or
- **`CONTEXT-MAP.md`** at the repo root if it exists: it points at one `CONTEXT.md` per context. Read each one relevant to the topic.
- **`docs/adr/`**: read ADRs that touch the area you're about to work in. In multi-context repos, also check `src/<context>/docs/adr/` for context-scoped decisions.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## Layout: single-context

This is a single-context repo. There are no monorepo signals — no workspace manifest, no
`packages/`, and the app is one Next.js project rooted at the repo root with `app/`,
`components/` and `lib/` as sibling directories.

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-<decision>.md
│   └── 0002-<decision>.md
├── app/
├── components/
└── lib/
```

Note there is no `src/` directory — `app/`, `components/` and `lib/` sit at the root, and the
`@/*` path alias maps to `./*`. Multi-context layout (`CONTEXT-MAP.md` plus per-context
`CONTEXT.md`) does not apply here.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders), but worth reopening because…_

## House vocabulary that already exists

`CONTEXT.md` has not been created yet, but this repo already documents a coherent domain
vocabulary in two places. Prefer these terms over inventing new ones:

- **`AGENTS.md`** — the design system (the "hardwood" aesthetic: maple, wine, ochre, leather,
  chalk; Oswald for display, Plus Jakarta Sans for text), the data-integrity rules, the section
  registry, and the quality gates.
- **`lib/lebron-data.ts`** — named as the single source of truth for every fact on the page.
  Domain terms like *stint*, *series*, *shot zone*, *room*, *the ledger* and *the span* are
  defined by its exported types.

If a skill needs one of these terms defined precisely, `lib/lebron-data.ts` is the authority
rather than prose.
