# Repository Guidelines

## Project Structure & Module Organization
- `docs/` holds product, architecture, and ADR references; keep it current with code.
- Application code lives in the `nativeiq/` pnpm workspace: `apps/` (Next.js dashboard), `services/` (Node.js APIs), `packages/` (shared SDKs, schemas, prompts), and `infra/` (Terraform/K8s).
- Tests sit next to the modules they cover: service suites under `services/<name>/tests`, frontend specs in `apps/dashboard/__tests__`, shared fixtures in `packages/schemas/__fixtures__/`.
- Architectural decisions belong in `docs/ADRs/`; reference the ADR ID in related commits and PRs.

## Build, Test, and Development Commands
- Use Node.js 20 (via Volta or nvm) and install dependencies once with `pnpm install`.
- Frontend loop: `pnpm --filter @nativeiq/dashboard dev` runs the Next.js dashboard with hot reload.
- Service loop: `pnpm --filter gateway dev` starts the Slack gateway locally.
- Static analysis: `pnpm lint` runs ESLint and formatting checks.
- Test suites: `pnpm test` executes unit and contract tests; narrow scope with `pnpm --filter insight-engine test`.
- Production builds: `pnpm turbo run build` (or `pnpm build`).

## Coding Style & Naming Conventions
- TypeScript must stay in strict mode—replace `any` with zod-validated types before merging.
- Follow `docs/naming-conventions.md`: PascalCase React components, camelCase functions, snake_case database identifiers (e.g., `apps/dashboard/components/InsightCard.tsx`).
- Use 2-space indentation, Prettier defaults, and structured JSON logging `{code,message,details}`.
- Gate every external integration with `/v1/policy/check` before Slack, Jira, or MCP calls.

## Testing Guidelines
- Mirror scenarios from `docs/08-testing-and-evals.md`; keep golden fixtures in `__fixtures__/` directories.
- Contract tests must assert the canonical error envelope `{ error: { code, message, details } }` and tenant-aware behavior.
- Frontend specs cover keyboard-first flows; backend specs validate ACL/RLS enforcement and semantic cache keys.
- Run eval harnesses (`pnpm --filter evals test`) before shipping retrieval or LLM prompt changes; target ≥0.85 F1 for task extraction.

## Commit & Pull Request Guidelines
- Use Conventional Commits (`feat(gateway): verify slack signature`) so automated changelog tooling stays deterministic.
- Keep diffs under ~400 LOC; split feature flags, migrations, and infra work into focused PRs.
- PR descriptions must link ADR IDs, include screenshots or sample requests, and note rollback steps.
- Update impacted docs (`docs/`, API contracts, schemas) in the same PR and call out policy/scope changes explicitly.

## Security & Configuration Tips
- Provision `.env.local` from `docs/10-config-and-secrets.md` and never commit secrets.
- Prefix storage keys and telemetry with `tenant_id`; include request and correlation IDs in logs for tracing.
