# 07 — Deployment and Observability

## Environments
- dev, staging, prod (separate projects, keys, KMS)
- Blue/green deploys; DB migrations gated by checklist

## Infra
- K8s (GKE/EKS), Terraform IaC, API Gateway + WAF, service mesh (mTLS)
- Secrets in Cloud Secret Manager; 24h rotation for bot tokens

## Telemetry
- OpenTelemetry on all services → Grafana (metrics), Tempo (traces), Loki (logs)
- SLOs: P95 dashboard render < 3s; event-to-insight < 5m

## Alerts & Runbooks
- Error rate spike, consumer lag, embedding queue backlog
- On-call rotation; link to runbooks in 09-rollout-and-ops.md
