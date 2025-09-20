# NativeIQ Dashboard

Next.js 14 dashboard implementing the NativeIQ AI canvas: insights, approvals, live metrics, and command palette.

## Getting Started

```bash
pnpm install
pnpm --filter @nativeiq/dashboard dev
```

The dashboard imports shared tokens and components from `@nativeiq/ui`. Update mock data in `lib/mock-data.ts` and swap providers with real tRPC clients when backends are ready.

## Scripts

- `pnpm --filter @nativeiq/dashboard dev` — run the Next.js development server
- `pnpm --filter @nativeiq/dashboard build` — compile production assets
- `pnpm lint` — run monorepo lint pipeline (Next.js + custom rules)
- `pnpm --filter @nativeiq/dashboard test` — execute Vitest unit tests (placeholder)

## Architecture Notes

- Dark-first theme with glassmorphism tokens defined in `@nativeiq/ui`
- Command palette (`⌘K`) available everywhere via `@nativeiq/ui/CommandPalette`
- High-contrast and reduced-motion toggles persist per visitor via `ThemeProvider`
- Mock data is colocated in `lib/` while awaiting live MCP + service integrations
