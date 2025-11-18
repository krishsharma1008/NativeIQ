# NativeIQ Dashboard (Nuxt)

Vue 3 + Nuxt 3 rewrite of the NativeIQ operator dashboard so every surface (insights, assistant, approvals, market trials) lives on one cohesive page. The new experience layers in the requested UX touches:

- **Barlow** as the global font stack
- First-run onboarding placeholder that queues team invites before the workspace goes live
- Light/Dark themes with a toggle that persists to `localStorage`
- Assistant pane auto-scroll fixes and differentiated chat bubble colors
- Sharper cards plus dynamic `Native &lt;Company&gt;` hero copy

## Getting Started

```bash
pnpm install
pnpm --filter @nativeiq/dashboard dev
```

## Scripts

- `pnpm --filter @nativeiq/dashboard dev` – Nuxt dev server with hot module reloading
- `pnpm --filter @nativeiq/dashboard build` – production build
- `pnpm --filter @nativeiq/dashboard start` – preview the production build locally
- `pnpm --filter @nativeiq/dashboard lint` – run ESLint against `.vue`/`.ts`
- `pnpm --filter @nativeiq/dashboard typecheck` – Nuxt type checking (vue-tsc)
- `pnpm --filter @nativeiq/dashboard test` – Vitest (jsdom) placeholder

## Architecture Notes

- Nuxt auto-imports composables (see `composables/useTheme.ts`) so shared state is trivial
- Sections live under `sections/` to keep the `pages/` entry lean; “atoms” (e.g., `ThemeToggle`) sit in `components/`
- Global tokens + theming live in `assets/css/main.css`
- Mock data remains in `lib/mock-data.ts` until live services are ready
