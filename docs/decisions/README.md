# Architecture Decision Records (ADR)

An Architecture Decision Record (ADR) captures an important architecture decision along with its context and consequences.

## Conventions

- Directory: `docs/decisions`
- Naming:
  - Prefer numbered files when starting fresh: `0001-choose-database.md`
  - If the repo already uses slug-only names, keep that: `choose-database.md`
- Status values: `proposed`, `accepted`, `rejected`, `deprecated`, `superseded`

## Workflow

- Create a new ADR as `proposed`.
- Discuss and iterate.
- When the team commits: mark it `accepted` (or `rejected`).
- If replaced later: create a new ADR and mark the old one `superseded` with a link.

## ADRs

- [Adopt architecture decision records](0001-adopt-architecture-decision-records.md) (accepted, 2026-03-05)
- [Upgrade next-mdx-remote from v4.4.1 to v6.0.0+](0002-upgrade-next-mdx-remote-to-v6.md) (proposed, 2026-03-05)
- [Direct PG course shell for `/courses/[course]`](0003-direct-pg-course-shell.md) (accepted, 2026-03-10)
