# 06 — Security and Compliance

## Isolation
- Per-tenant KMS keys for application-level encryption of sensitive columns
- Postgres RLS with policies on `tenant_id` and ACL evaluation

## DLP & PII
- Regex + ML detectors for emails, phones, keys, payment IDs
- Replace with vault tokens; reversible only for authorized actors

## Policy Model (Cedar)
- Actions: `insights.read`, `tasks.create`, `tasks.assign`, `messages.post`, `automation.run`
- Resources: `channel:{id}`, `doc:{id}`, `task:{id}`
- Actors: user attrs `{role,dept,level}`; context `{tenant}`
- Deny by default; explicit allow via ABAC rules

## Auditability
- Log every tool call with retrieved source IDs and policy result
- Immutable log export to cold storage

## Compliance Posture
- SOC2 control mapping, data residency, right-to-be-forgotten workflows
- No training on customer content; only derived metrics stored
