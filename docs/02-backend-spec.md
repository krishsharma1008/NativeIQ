# 02 — Backend Spec

## Monorepo Layout (pnpm workspaces)
```
nativeiq/
  apps/
    dashboard/            # Next.js
  services/
    gateway/              # Slack Events & Interactions
    idm/                  # Identity & roles (SCIM/HRIS + Slack)
    policy/               # Cedar service
    insight-engine/       # Retrieval + analyzers
    task-miner/           # Action item extraction + routing
    kb-indexer/           # Connectors → chunks + embeddings
  mcp/
    hub/
    slack/
    tasks/
    docs/
    git/
  packages/
    sdk/                  # typed client for services
    prompts/              # all prompts (versioned)
    schemas/              # zod/JSON Schemas
  infra/
    terraform/
    k8s/
```

## Services and Contracts

### gateway (Slack)
- Inbound: `/slack/events`, `/slack/interactive`
- Verify Slack signature; drop duplicate `event_id` (idempotent)
- Enqueue to `events.slack`

### idm
- Inputs: Slack SCIM, Audit Logs, optional Okta/Azure AD
- API:
  - `GET /v1/users/:slack_user_id → {user_id, attrs{role,dept,level}, memberships[channel_ids[]]}`
  - `GET /v1/acl/resource/:rid → {allow:boolean, rationale}` (delegates to policy)

### policy (Cedar)
- Input: actor, action, resource, context(tenant)
- API: `POST /v1/check {actor, action, resource, context} → {allow, rationale, policy_id}`

### kb-indexer
- Functions: fetch (MCP Docs/Git), parse (md/html/pdf/code), chunk, DLP redact, embed, store
- API: `POST /v1/index {source, resource_id, acl, url?} → {doc_id, chunks}`

### insight-engine
- Pipeline: retrieve → re-rank → classify (decision|risk|blocker|trend|summary) → persist with sources + ACL
- API:
  - `GET /v1/insights?since&team?&type?`
  - `POST /v1/insights/summarize-thread {channel, thread_ts} → Insight[]`

### task-miner
- Pipeline: LLM JSON extraction → dedup (normalized title + source msg id) → route
  - destination present → MCP Tasks `create_task`
  - slack-only → MCP Slack `schedule_message`/reminder
- API:
  - `POST /v1/tasks/from-thread {channel, thread_ts} → Task[]`
  - `GET /v1/tasks?assignee=me&state=open`

### mcp/*
- All servers expose tool manifests; see 04-api-contracts.md

## Retrieval & Embeddings
- Embedder: `text-embedding-3-large`
- Chunking: 800–1200 tokens, 200 overlap
- Keys: `(tenant_id, resource_type, resource_id, chunk_id)`; store `acl` tag for filtered search

## Semantic Cache (Redis)
- Key: `sha256(model|prompt|retrieval_set_ids|tools_enabled)` → response + TTL 1–6h

## Cross-cutting
- OpenTelemetry: traces across gateway → workflows → MCP
- Error shape: `{ error: { code, message, details } }`
- RLS at DB layer; policy enforced at service layer before tool calls
