# ADR 001 — Frontend Stack and Design Language

## Status
Accepted

## Context
We need a modern, performance-forward stack and a distinctive UI direction aligned with "liquid glass + cyberpunk minimalism" while remaining timeless and accessible.

## Decision
- Next.js 15 (App Router) + TypeScript
- shadcn/ui + Tailwind with design tokens
- Framer Motion for micro-interactions
- tRPC + WebSockets for realtime
- Dark-first theme with glass surfaces, neon accents

## Consequences
- Strong developer velocity with type safety
- Clear design language; avoids hard-coded colors via tokens
- Need careful performance tuning for blur effects; provide reduced-motion & solid fallback
