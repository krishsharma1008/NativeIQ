# 04 — API Contracts

> All APIs are JSON over HTTPS, versioned under `/v1`. Errors:
```json
{ "error": { "code": "STRING", "message": "HUMAN_READABLE", "details": {} } }
```

## Gateway (Slack)
```
POST /v1/events/slack
Body: raw Slack payload + headers
200: { "ok": true, "dedup": boolean }
```

## Insights
```
GET /v1/insights?tenant_id&since=ISO&team=STRING&type=decision|risk|blocker|trend|summary
200: { "items": Insight[] }
```

Example Insight
```json
{
  "id":"ins_123",
  "tenant_id":"t_1",
  "type":"decision",
  "title":"Database migration approved",
  "summary":"Consensus in #eng-core on plan X.",
  "sources":[{"kind":"slack","channel":"C123","ts":"1726501.123"}],
  "owners":["U1","U2"],
  "team":"platform",
  "impact":"high",
  "state":"open",
  "created_at":"2025-09-20T15:00:00Z",
  "acl":["C123","U1","U2"]
}
```

## Tasks
```
GET  /v1/tasks?assignee=me&state=open
POST /v1/tasks/from-thread
Body: { "channel":"C123", "thread_ts":"17265.22" }
```

Example Task
```json
{
  "id":"task_456",
  "tenant_id":"t_1",
  "title":"Ship hotfix 4.2.1",
  "assignees":["U3"],
  "due":"2025-09-21",
  "priority":"P1",
  "source":{"kind":"slack","channel":"C999","thread_ts":"...","message_ts":"..."},
  "destination":{"kind":"jira","key":"PROJ-101"},
  "status":"todo",
  "watchers":["U1","U2"],
  "created_at":"2025-09-20T16:00:00Z"
}
```

## Policy
```
POST /v1/policy/check
Body: { "actor":"U1", "action":"tasks.create", "resource":{"type":"channel","id":"C123"}, "context":{"tenant_id":"t_1"} }
200: { "allow":true, "policy_id":"pol_9", "rationale":"manager of team platform" }
```

## MCP Tool Specs (subset)

slack-mcp-server
```json
{
  "name":"send_message",
  "description":"Post a message to a channel or thread.",
  "input_schema":{
    "type":"object",
    "properties":{
      "channel_id":{"type":"string"},
      "text":{"type":"string"},
      "thread_ts":{"type":"string"}
    },
    "required":["channel_id","text"]
  }
}
```

tasks-mcp-server
```json
{
  "name":"create_task",
  "description":"Create a task in the connected system.",
  "input_schema":{
    "type":"object",
    "properties":{
      "title":{"type":"string"},
      "assignees":{"type":"array","items":{"type":"string"}},
      "due":{"type":"string","format":"date"},
      "priority":{"type":"string","enum":["P0","P1","P2","P3"]},
      "project":{"type":"string"}
    },
    "required":["title"]
  }
}
```
