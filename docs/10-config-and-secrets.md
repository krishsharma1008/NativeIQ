# 10 — Config and Secrets

## Required Environment Variables

### Slack
- SLACK_CLIENT_ID, SLACK_CLIENT_SECRET
- SLACK_SIGNING_SECRET
- SLACK_BOT_TOKEN (per workspace/enterprise)
- SLACK_SCIM_TOKEN (if SCIM enabled)
- SLACK_AUDIT_TOKEN (enterprise)

### OpenAI
- OPENAI_API_KEY (org/project scoped)

### Tasks (choose one)
- Jira: JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN
- Linear: LINEAR_API_KEY
- Asana: ASANA_ACCESS_TOKEN

### Docs/Wiki
- Notion: NOTION_TOKEN
- Confluence: ATLASSIAN_API_TOKEN
- Google Drive: GOOGLE_SERVICE_ACCOUNT_JSON

### Git
- GitHub App: GITHUB_APP_ID, GITHUB_PRIVATE_KEY, GITHUB_INSTALLATION_ID
- GitLab: GITLAB_TOKEN

### Infra & Data
- DATABASE_URL
- REDIS_URL
- OBJECT_STORE_ENDPOINT, OBJECT_STORE_ACCESS_KEY, OBJECT_STORE_SECRET_KEY
- KMS_KEY_ALIAS_TENANT_DEFAULT

## Configuration Strategy
- Twelve-Factor: env-driven with typed loaders per service
- Secrets in Secret Manager; mount as env at runtime
- Per-tenant keys and bot tokens; rotate every 24h for bots
