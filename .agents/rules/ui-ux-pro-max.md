# UI/UX Pro Max Design Rule

## Scope
This rule applies to all user requests involving UI, UX, styling, component design, responsive design, animations, and page construction in this project.

## Requirements
1. **Always Use `ui-ux-pro-max`**:
   - Activate and consult the installed skill at [`.agents/skills/ui-ux-pro-max/SKILL.md`](file:///d:/darfat/.agents/skills/ui-ux-pro-max/SKILL.md).
2. **Query the Local Knowledge Base**:
   - Run `python .agents/skills/ui-ux-pro-max/scripts/search.py` before and during UI implementation.
   - For new screens/pages: `python .agents/skills/ui-ux-pro-max/scripts/search.py "<type> <keywords>" --design-system`
   - For domain-specific rules (color, style, typography, chart, icons, ux): `python .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" -d <domain>`
   - For stack-specific implementations: `python .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --stack nextjs`
3. **Design Standards**:
   - WCAG AA/AAA compliant color contrast (minimum 4.5:1).
   - Thoughtful, consistent spacing scales (8px grid / Tailwind spacing scale).
   - Micro-interactions, accessible touch targets (≥44px), smooth transitions (150-300ms).
   - High visual aesthetic, rich gradients/glassmorphism/typography, zero placeholder looks.
