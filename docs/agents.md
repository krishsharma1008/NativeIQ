# Agents.md — Native IQ Engineering Agents (Hyperspecific Guidance)

This document instructs AI/codegen/automation agents working in this repo. It encodes DeepNative conventions, security guardrails, and quality bars so agents ship production-grade, minimal-diff PRs that never surprise humans.

## Golden Rules
- Ship smallest safe change. Prefer surgical edits over rewrites.
- Enforce security and privacy by default: RLS, ACLs, PII redaction, policy checks before any tool call.
- Deterministic contracts first: update schemas and docs before code.
- Dark-first, minimal UI; reduce clicks and support keyboard-first (⌘K) flows.
- Robust error handling and structured logging to `logs/` with tenant + request correlation IDs.

## Repo Expectations
- Language/runtime: Node.js 20 + TypeScript; Next.js 15 for UI.
- Workspace: pnpm workspaces; packages in `packages/`, services in `services/`.
- LLM usage: OpenAI Responses API (JSON mode) + Assistants for tools; cache via Redis.
- Workflows: Temporal TS SDK. MCP Hub mediates tool calls with policy checks.

## Security Guardrails
- Before any external call (Slack, Jira, Notion, GitHub), POST `/v1/policy/check`.
- Log tool calls to `tool_calls` with `{actor, tool, input, output, allow, rationale}`.
- Never store raw PII. Use DLP redaction; keep reversible mapping only in the vault.
- Respect tenant isolation: set `app.tenant_id` in DB session; rely on RLS policies.

## API & Error Shape
- All HTTP APIs under `/v1`. Errors strictly:
```json
{ "error": { "code": "STRING", "message": "HUMAN_READABLE", "details": {} } }
```
- Do not leak stack traces to clients; include trace id in `details`.

## Frontend Directives
- Implement surfaces per `docs/03-frontend-spec.md`.
- Use tokens and components from `docs/03A-frontend-design-system.md`.
- Colors: complementary neon accents (magenta `#ff3ea5`, coral `#ff8a5b`) over deep glass backgrounds; do not match brand greens/seafoam; use them subtly in data viz only.
- Accessibility: WCAG AA, reduced-motion fallbacks, high-contrast toggle.

## Data & Retrieval
- Embeddings: `text-embedding-3-large`; chunks 800–1200 tokens with 200 overlap.
- Filter retrieval by tenant and ACL before similarity search.
- Semantic cache key: `sha256(model|prompt|retrieval_set_ids|tools_enabled)`.

## Testing & Evals
- Unit tests for normalization, MCP adapters; contract tests for `/v1`.
- Eval harness: labeled Slack threads → F1 for task extraction ≥0.85.
- Add red-team tests for prompt injection; verify policy check before tool use.

## Observability
- OpenTelemetry traces across gateway → workflows → MCP servers.
- Metrics and logs must include tenant_id, user_id (if available), request_id.

## Commit & PR Rules
- Keep PRs < 400 lines when possible; split otherwise.
- Update relevant docs in `docs/` with every behavior change.
- Include a changelog excerpt in PR description and reference any ADR.

## Style
- TypeScript: strict mode; no `any`, no implicit `any`. Prefer zod schemas.
- Naming: follow `docs/naming-conventions.md`.
- Logging: JSON lines; error paths include `code`, `message`, `details`.

## MCP Tooling Conventions
- slack-mcp-server: prefer `send_message`, `reply`, `schedule_message` with policy check.
- tasks-mcp-server: `create_task`, `update_task`, `transition_task` with idempotency keys.
- docs-mcp-server: read-only by default; mutating ops require explicit approval path.

## Local Dev Setup
- Always use a Python 3.11 venv `.venv311` for data/eval scripts; activate in `scripts/`.
- Node: use Volta or nvm to pin Node 20; `pnpm i` at root.
- Create `.env.local` per `docs/10-config-and-secrets.md`.

## UX Quality Bars
- Each interactive view exposes a single dominant primary action.
- Explainability: every insight/task shows "Why you see this" with source links.
- Animation timing 120–220ms; subtle neon pulse for active elements.

## Definition of Done
- Feature flagged if risky; telemetry added; docs updated; tests passing; no linter errors; rollout plan noted in `docs/09-rollout-and-ops.md`.

## Footguns to Avoid
- Hard-coding colors instead of tokens.
- Skipping policy checks before tool calls.
- Writing to object store without tenant-prefixed paths.
- Returning non-deterministic shapes from APIs.

## Quick Checklist (pre-merge)
- [ ] Contracts updated (`schemas/`, `docs/04-api-contracts.md`).
- [ ] Policy checks present for all external calls.
- [ ] Logs + traces with tenant/request IDs.
- [ ] UI uses design tokens and meets contrast rules.
- [ ] Tests + evals updated (if applicable).
- [ ] `docs/` updated, including ADR if a decision changed.
