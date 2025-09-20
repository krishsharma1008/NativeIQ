# 03A — Frontend Design System (Liquid Glass, Cyberpunk Minimalism)

## Design Philosophy
- Minimal yet expressive: information-dense without clutter
- Liquid glass aesthetics: translucent layers, soft bloom, micro-reflections
- Cyberpunk accents: neon edge glows, magenta/coral highlights, subtle scanlines
- Timeless: avoid skeuomorphism; rely on geometry, motion, and typography

## Visual Language
- Color tokens
  - fg.primary, fg.muted, bg.surface, bg.glass, accent.primary, accent.secondary, status.ok, status.warn, status.error
- Elevation
  - e0 (flat), e1 (glass card), e2 (floating), e3 (modal)
- Typography
  - Inter or Satoshi; numeric tabular for KPIs; letter-spacing for headings

## Components
- GlassCard
  - rounded-2xl, backdrop-blur-lg, 1px inner border with linear-gradient(white 10%, transparent), subtle noise texture
  - hover: scale 1.01, y-translate -1px, shadow-fuchsia-500/10
- InsightCard
  - header: type pill with neon accent; body: summary and source chips; footer: actions
- CommandBar
  - full-width overlay, glass background, neon caret cursor
- RiskRadar, SLAHeatmap
  - use canvas/WebGL; neon gridlines with low alpha; tooltips as glass chips

## Motion
- Framer Motion presets: fadeInUp, glassPop, neonPulse
- Duration 120–220ms, cubic-bezier(0.2, 0.8, 0.2, 1)

## Layout
- 12-col grid, gutters 16
- Sticky ActionPanel on the right; responsive down to 1280px

## Accessibility & Performance
- Minimum contrast 4.5:1; provide solid-color fallback for glass
- Prefer CSS filters over heavy blurs on low-end; reduceMotion mode

## Example Tokens (Tailwind)
```ts
export const tokens = {
  colors: {
    bg: {
      base: '#0a0c10',
      glass: 'rgba(255,255,255,0.04)'
    },
    fg: {
      primary: '#e9eef2',
      muted: '#a7b3c3'
    },
    accent: {
      primary: '#ff3ea5', // neon magenta (complements sage #768863)
      secondary: '#ff8a5b', // coral/orange (complements seafoam #93b6b4)
      glow: 'rgba(255,62,165,0.45)'
    },
    brand: {
      sage: '#768863',
      seafoam: '#93b6b4'
    },
    status: {
      ok: '#4ade80',
      warn: '#f59e0b',
      error: '#ef4444',
      info: '#38bdf8'
    }
  },
  radii: { xl: '1.25rem', xxl: '1.5rem' },
  shadows: {
    glass: '0 6px 30px rgba(255,62,165,0.12)'
  }
}
```

## UX Heuristics
- One primary action per view; destructive actions secondary
- Keyboard-first; every action available via ⌘K
- "Why you see this" present on every insight/task
