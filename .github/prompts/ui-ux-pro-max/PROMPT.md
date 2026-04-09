---
mode: ask
description: "UI/UX entry prompt that routes to the ui-ux-pro-max skill workflow."
---

# UI UX Pro Max Entry Prompt

Use the workspace skill at .github/skills/ui-ux-pro-max/SKILL.md.

## What to Ask

- Product type and industry
- Desired style keywords
- Target stack (default html-tailwind)
- Deliverable type (wireframe direction, full component plan, or review)

## Example Prompts

- Use ui-ux-pro-max to design a modern fintech dashboard with strong data hierarchy.
- Use ui-ux-pro-max to improve my landing page UX and provide implementation-ready changes.
- Use ui-ux-pro-max to define color, typography, and interaction rules for a portfolio site.

## Notes

- The detailed workflow, commands, and quality checklist live in the skill file.
- For script execution, use project-root paths such as:

```bash
python3 .github/skills/ui-ux-pro-max/scripts/search.py "fintech dashboard" --design-system
```
