# Portfolio Maintenance Guide

This repository contains Timothy Liu Kaihui's static professional portfolio website for GitHub Pages.

## Site Structure

- `index.html` contains the full page content and section ordering.
- `styles.css` contains the responsive layout, light/dark color tokens, and component styling.
- `script.js` contains the theme toggle, current-year footer logic, Render chat prewarm, cold-start messaging, and chat widget behavior.
- `assets/ai-portfolio-hero.png` is the retained social sharing image; the visible hero uses the portrait.
- `assets/timothy-liu-kaihui-profile.jpeg` is the profile image used by the hero.
- `../chat-proxy-render/` contains the Render-hosted serverless chat proxy and its `prompt.txt` system prompt.

## Editing Principles

- Keep the site static and dependency-free unless the user explicitly asks for a build system.
- Keep source files ASCII-only where practical.
- Preserve the neutral + blue visual direction and the system-default theme behavior.
- When updating content, prefer the latest resume or user-provided source as the source of truth.
- LinkedIn is the main contact path; do not re-add a visible email address or downloadable CV unless explicitly requested.
- Keep Explore selected work as the hero primary action, with LinkedIn, GitHub, and Google Scholar together as secondary profile links. Keep Semantic Scholar in Research.
- Verify unstable public metrics before changing them, especially Google Scholar citations, GitHub stars, current roles, dates, awards, or publication status.
- Keep selected publications sorted by citation count, highest first.
- Do not add or change Google Scholar or Semantic Scholar profile links unless the exact profile URL is confirmed.
- Keep homepage order: Hero, Selected work, Experience, Selected research, More open source, Speaking and partnerships, Selected coverage, About, Contact. Keep the compact capability groups and full toolkit disclosure within About.
- Preserve complete publications, repositories, event gallery, coverage, and supporting biography through native disclosures; keep existing hash destinations functional.
- FedDrip attribution: research direction, ideation, and evaluation setup as co-supervisor of a master's thesis project; distinguish this from the team's implementation and results.
- Do not display undated popularity metrics. Keep assistant knowledge updates separate from frontend-only changes and report any consistency gaps.
- Do not add dated citation-count qualifiers or notes such as “Google Scholar citation counts as of …” to the frontend.
- Avoid unrelated edits to the existing `telegram_bot/` project in this repository.

## Task-scoped workflow

Read only the files needed for the task. Use the site structure above as a map rather than a checklist: inspect `index.html` for content and ordering, `styles.css` for visual changes, `script.js` for behavior, and `../chat-proxy-render/prompt.txt` only when the chat prompt or proxy contract is in scope.

Choose validation in proportion to the change:

- Copy, metadata, or asset updates: inspect the affected markup and run `git diff --check`.
- CSS or responsive changes: serve the folder locally and check the affected theme and viewport; use the full 320px, 390px, 768px, 1024px, and 1440px matrix only for broad layout changes.
- JavaScript or chat changes: run `node --check script.js` and `git diff --check`, then exercise the affected flow with mocked Render `/health` and `/api/chat` responses. Confirm the cold-start/error fallback, LinkedIn fallback, and launcher focus behavior when those paths are touched.

When updating profile content, use the latest resume or user-provided source when one is in scope. Verify public metrics and exact profile URLs only when changing them. Keep browser audit scripts and screenshots outside the repository.

Complete the requested implementation, inspect the result, fix failures caused by the change, and report any remaining consistency gap. Safe local edits and checks within this repository can proceed without pausing for approval; do not deploy, publish, or modify the unrelated `telegram_bot/` project unless requested.

## Deployment Notes

GitHub Pages can serve this from the repository root. No package install or build step is required.
