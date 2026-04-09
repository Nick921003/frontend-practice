---
name: ui-ux-pro-max
description: "Use when: UI/UX design tasks, landing page design, visual system planning, color/typography selection, and implementation guidance for web/mobile interfaces."
---

# UI UX Pro Max

## Purpose

Provide a reusable multi-step UI/UX workflow with project assets and repeatable output quality.

## Use When

- User asks to design or improve UI/UX.
- User asks for style system, color palette, typography, or UX checklist.
- User asks for implementation-ready design direction for web/mobile.

## Workflow

1. Analyze request context
- Product type
- Industry
- Style keywords
- Target stack (if missing, ask or use project default)

2. Generate baseline design system
- Run search script with design-system mode first.
- Capture pattern, color, typography, spacing, interaction guidance, and anti-patterns.

3. Add focused deep-dive only when needed
- Domain style: alternative visual directions
- Domain ux: accessibility, motion, interaction risks
- Domain typography/color/chart/landing: only for missing details

4. Produce implementation guidance
- Provide concrete UI structure, component hierarchy, and behavior notes.
- Keep recommendations consistent with existing project design language.

5. Validate before delivery
- Contrast, accessibility, responsive breakpoints, interaction feedback, no layout shift.

## Project Assets

This skill can use existing assets under:
- .github/skills/ui-ux-pro-max/scripts/
- .github/skills/ui-ux-pro-max/data/

If needed, run commands from project root using the script in that folder.

## Required Commands

Always use project-root relative paths:

```bash
python3 .github/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system
```

```bash
python3 .github/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain>
```

```bash
python3 .github/skills/ui-ux-pro-max/scripts/search.py "<query>" --stack <stack>
```

### Design System First

Run this before domain-specific searches:

```bash
python3 .github/skills/ui-ux-pro-max/scripts/search.py "<product> <industry> <style>" --design-system -p "Project Name"
```

Optional persistence:

```bash
python3 .github/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```

Page override persistence:

```bash
python3 .github/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" --page "dashboard"
```

## Domain Reference

- product: Product type recommendations
- style: UI style and visual direction
- typography: Font pairing and hierarchy
- color: Palette suggestions by product type
- landing: Hero/section/CTA structure
- chart: Chart and visualization guidance
- ux: Interaction and accessibility best practices
- react: React and Next.js performance guidance
- web: Web interface and accessibility guidance
- prompt: AI prompt keywords for design direction

## Stack Reference

- html-tailwind (default)
- react
- nextjs
- vue
- svelte
- swiftui
- react-native
- flutter
- shadcn
- jetpack-compose

If stack is not provided, default to html-tailwind.

## Quality Rules

- Use consistent SVG icon sets; do not use emoji as UI icons.
- Ensure hover feedback without layout shift.
- Keep text and border contrast readable in light mode.
- Ensure clickable elements have clear affordance and pointer cursor.
- Verify responsive behavior at 375px, 768px, 1024px, and 1440px.
- Include accessibility checks: labels, alt text, keyboard focus, and reduced motion.

## Output Contract

- Start with a concise visual direction summary.
- Provide actionable implementation steps.
- Include a short QA checklist for handoff.
- Avoid generic styling; keep output intentional and specific.

## Delivery Checklist

- Design direction includes palette, typography, spacing, and interaction principles.
- Component hierarchy is concrete and implementation-ready.
- Accessibility and responsive risks are called out explicitly.
- Anti-patterns to avoid are listed before final handoff.
