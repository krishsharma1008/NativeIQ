# NativeIQ Monorepo

This folder houses the application workspace for DeepNative / NativeIQ. It uses pnpm workspaces and Turbo to manage apps, services, and shared packages.

## Layout

- `apps/dashboard` — Next.js App Router frontend implementing the AI canvas
- `packages/ui` — design system, glass components, command palette, and theming
- `packages/types` — shared domain models
- `packages/utils` — formatting and helper functions

Additional services (`services/`) and infrastructure (`infra/`) directories are scaffolded for future expansion.

## Installing Dependencies

```bash
pnpm install
```

## Running the Dashboard

```bash
pnpm --filter @nativeiq/dashboard dev
```

The dashboard consumes the shared UI package and mock data. Replace `lib/mock-data.ts` with real data-fetching hooks when wiring to backend services or MCP workflows.
