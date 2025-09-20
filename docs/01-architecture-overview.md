# 01 — Architecture Overview

## Tech stack
- Services: Node.js 20 + TypeScript, pnpm workspaces
- LLM: OpenAI Responses API (JSON mode) + Assistants for tools
- Workflows: Temporal (TypeScript SDK)
- Data: Postgres 16 (RLS), Redis 7, S3-compatible object store, pgvector
- Vectors: OpenAI text-embedding-3-large → pgvector
- Policy: Cedar (cedar-js), ABAC
- Frontend: Next.js 15 (App Router), shadcn/ui + Tailwind, Framer Motion, tRPC, WebSockets
- MCP: Hub + servers (Slack, Tasks, Docs, Git)

## Diagram
```mermaid
flowchart LR
  subgraph Slack
    E1[Events API]
    E2[Interactions]
    E3[Web API]
    E4[SCIM/Audit Logs]
  end

  subgraph Ingest
    GW[Event Gateway\n(verify+idempotent)]
    Q[(Queue)]
    ETL[Normalizer + PII Redactor]
  end

  subgraph Core
    IDM[Identity & Role Resolver]
    POL[Policy Engine (Cedar)]
    KB[KB Indexer]
    VDB[(pgvector)]
    SQL[(Postgres)]
    OBJ[(Object Store)]
    WF[Temporal Workflows]
    INS[Insight Engine]
    TSK[Task Miner & Router]
    CACHE[(Redis Semantic Cache)]
  end

  subgraph LLM & Tools
    HUB[MCP Hub]
    MCPSlack[slack-mcp-server]
    MCPTasks[tasks-mcp-server]
    MCPDocs[docs-mcp-server]
    MCPGit[git-mcp-server]
    OAI[OpenAI API]
  end

  subgraph UX
    Web[Next.js Dashboard]
    WS[WS/tRPC]
    Home[Slack Home Tab + Modals]
  end

  E1 --> GW --> Q --> ETL --> SQL
  ETL --> KB --> VDB
  E2 --> GW
  E3 --> MCPSlack
  E4 --> IDM

  SQL --> INS
  VDB --> INS
  INS <--> WF
  TSK <--> WF

  WF <--> HUB
  HUB --> MCPSlack & MCPTasks & MCPDocs & MCPGit
  HUB <--> OAI

  IDM --> POL
  POL --> INS
  POL --> WF

  INS --> Web
  TSK --> Web
  Web <--> WS
  Home <--> INS
```

## Principles
- Deterministic contracts between services; schema-first.
- Idempotency and replay safety at ingest.
- Policy checks precede tool calls; audit all decisions.
