# Portfolio Maintenance Guide

This repository contains Timothy Liu Kaihui's static professional portfolio website for GitHub Pages.

## Site Structure

- `index.html` contains the full page content and section ordering.
- `styles.css` contains the responsive layout, light/dark color tokens, and component styling.
- `script.js` contains the theme toggle, current-year footer logic, Render chat prewarm, cold-start messaging, and chat widget behavior.
- `assets/ai-portfolio-hero.png` is the generated hero image used by the page.
- `assets/timothy-liu-kaihui-profile.jpeg` is the profile image used by the hero.
- `../chat-proxy-render/` contains the Render-hosted serverless chat proxy and its `prompt.txt` system prompt.

## Editing Principles

- Keep the site static and dependency-free unless the user explicitly asks for a build system.
- Keep source files ASCII-only where practical.
- Preserve the neutral + blue visual direction and the system-default theme behavior.
- When updating content, prefer the latest resume or user-provided source as the source of truth.
- LinkedIn is the main contact path; do not re-add a visible email address or downloadable CV unless explicitly requested.
- Keep the hero contact/profile links in a single button row: LinkedIn, GitHub, Google Scholar, and Semantic Scholar.
- Verify unstable public metrics before changing them, especially Google Scholar citations, GitHub stars, current roles, dates, awards, or publication status.
- Keep selected publications sorted by citation count, highest first.
- Do not add or change Google Scholar or Semantic Scholar profile links unless the exact profile URL is confirmed.
- Keep the Open Source section below the "Research and engineering toolkit" section.
- Avoid unrelated edits to the existing `telegram_bot/` project in this repository.

## Recommended Update Workflow

1. Read the latest resume or user-provided profile updates.
2. Update the affected section in `index.html`.
3. Verify public metrics when editing publication citations or GitHub star counts.
4. Run a quick local check by serving the folder with a simple static server.
5. Test light mode, dark mode, desktop width, and mobile width.
6. For chat changes, confirm the Render proxy URL, allowed origins, cold-start fallback, and LinkedIn fallback still work.

## Deployment Notes

GitHub Pages can serve this from the repository root. No package install or build step is required.
