# Skill Onboarding Workflow

This document defines the standard process for adding a new skill with bundled assets.

## Goal

Keep each skill self-contained so it is easy to maintain in GitHub and easy to reuse.

## Required Structure

Create each skill under:

- .github/skills/<skill-name>/SKILL.md
- .github/skills/<skill-name>/scripts/
- .github/skills/<skill-name>/data/
- .github/skills/<skill-name>/templates/ (optional)

If you also want a lightweight chat entrypoint, add:

- .github/prompts/<skill-name>/PROMPT.md

## Step-by-Step

1. Create the skill folder
- Create .github/skills/<skill-name>/

2. Create SKILL.md with frontmatter
- Required frontmatter keys:
  - name: must match folder name
  - description: include "Use when:" and trigger keywords

3. Place all assets in the same skill folder
- scripts, data, templates all stay under .github/skills/<skill-name>/
- Avoid placing skill assets under .github/prompts/

4. Use project-root relative paths in commands
- Example:
  - python3 .github/skills/<skill-name>/scripts/search.py "<query>" --design-system

5. Optional prompt entrypoint
- Keep .github/prompts/<skill-name>/PROMPT.md short
- Prompt should route users to the skill, not duplicate full workflow docs

6. Validate before commit
- Check all paths resolve
- Check frontmatter syntax is valid YAML
- Check description is specific enough for discovery

7. Commit in isolated scope
- Stage only new skill files and related prompt updates

## Migration Rule

If a skill currently stores assets in .github/prompts/<skill-name>/, migrate to .github/skills/<skill-name>/ and update all command paths.

## Naming Conventions

- skill folder: kebab-case (example: ui-ux-pro-max)
- skill file: SKILL.md
- prompt entrypoint file: PROMPT.md
- script files: snake_case.py or kebab-case.js (be consistent per skill)

## Quick Checklist

- [ ] SKILL.md exists under .github/skills/<skill-name>/
- [ ] SKILL.md has valid frontmatter
- [ ] All assets are co-located under the same skill folder
- [ ] All command examples use .github/skills/<skill-name>/...
- [ ] Prompt file (if used) is short and points to the skill
- [ ] No stale path references remain
