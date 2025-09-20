# 08 — Testing and Evals

## Unit & Contract Tests
- Slack event normalization (golden fixtures)
- MCP adapters with recorded HTTP replays
- API contract tests with fixed error shape

## Eval Harness
- Labeled Slack threads with ground-truth insights and tasks
- Metrics: F1_task_extraction, decision_precision, latency, cost per event

## Red-team
- Prompt injection in docs/messages; ensure policy check precedes tool calls

## Load
- Burst events (reaction storms), large doc indexing; nightly soak tests
