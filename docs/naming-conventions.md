# Naming Conventions

## Services and Packages
- kebab-case for service folders (e.g., `insight-engine`)
- packages: kebab-case; exported symbols in PascalCase for classes, camelCase for functions

## APIs
- `/v1/...` paths; nouns plural; actions as sub-resources (e.g., `/insights/summarize-thread`)
- JSON keys snake_case for persisted DB columns; camelCase for TypeScript models

## Database
- snake_case table and column names; singular tables for entities like `insight`
- Foreign keys named `<table>_id`

## Frontend
- React components in PascalCase; files in kebab-case; hooks `useX`
- Design tokens: `--color-accent-cyan`, `--radius-xxl`
