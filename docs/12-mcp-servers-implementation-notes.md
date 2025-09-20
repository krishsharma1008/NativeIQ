# 12 — MCP Servers Implementation Notes

## slack-mcp-server (TypeScript)
- Scopes: channels:history, groups:history, channels:read, groups:read, users:read, reactions:read, chat:write, commands, app_mentions:read, files:read, bookmarks:read
- Tools: send_message, reply, search_messages, get_thread, schedule_message, add_reaction, create_channel, invite_user
- All tool handlers call policy.check before Slack API

## tasks-mcp-server
- Provider adapters behind unified tool schema: create_task, update_task, get_task, search_tasks, transition_task

## docs-mcp-server
- Read-only MVP: search_docs, get_doc; append_section/share_doc guarded by policy

## mcp-hub
- Routes tools per tenant; injects actor context; emits OpenTelemetry spans
