# 05 — Data Models and Storage

## Postgres DDL (baseline)
```sql
create table tenants(
  id uuid primary key, name text not null, kms_key_id text not null,
  created_at timestamptz default now()
);

create table users(
  id uuid primary key, tenant_id uuid references tenants(id),
  slack_user_id text not null, email text, role text not null,
  attrs jsonb default '{}',
  unique(tenant_id, slack_user_id)
);

create table channels(
  id uuid primary key, tenant_id uuid references tenants(id),
  slack_channel_id text not null, name text, private boolean,
  acl jsonb default '[]'::jsonb
);

create table messages(
  id bigserial primary key, tenant_id uuid references tenants(id),
  channel_id uuid references channels(id), slack_ts text not null,
  author uuid references users(id), text text, meta jsonb, created_at timestamptz default now()
);

create table insights(
  id uuid primary key, tenant_id uuid references tenants(id),
  type text check (type in ('decision','risk','blocker','trend','summary')),
  title text, summary text, state text default 'open',
  impact text, owners uuid[], team text, sources jsonb, acl jsonb,
  created_at timestamptz default now()
);

create table tasks(
  id uuid primary key, tenant_id uuid references tenants(id),
  title text not null, status text check (status in ('todo','in_progress','blocked','done')) default 'todo',
  priority text check (priority in ('P0','P1','P2','P3')) default 'P2',
  due date, assignees uuid[], watchers uuid[], source jsonb, destination jsonb,
  created_at timestamptz default now()
);

create table tool_calls(
  id uuid primary key, tenant_id uuid references tenants(id),
  actor uuid references users(id), tool text, input jsonb, output jsonb,
  allow boolean, rationale text, created_at timestamptz default now()
);
```

## Vector Store
- Table `embeddings(message_id bigint null, doc_chunk_id uuid null, tenant_id uuid, acl jsonb, embedding vector(3072))`
- Index: IVFFLAT over `embedding`, GIN over ACL
- Filter: `tenant_id` and ACL before similarity search

## Object Store
- Bucket prefix `tenants/{id}/…` for raw and redacted artifacts
- Redaction vault stores tokenization map `{placeholder → secure vault entry}`

## RLS Policies (sketch)
- `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;`
- Policies restrict to `current_setting('app.tenant_id')::uuid`
