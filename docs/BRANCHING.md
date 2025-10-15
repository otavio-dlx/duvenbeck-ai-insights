# Branching strategy

This document explains the branching strategy for the duvenbeck-ai-insights repository.

## Main rules

- `main` is the primary branch and will be kept deployable. If you prefer to work directly on `main`, keep changes small and open a PR for review.
- For feature work or fixes, prefer creating a short-lived branch using the naming convention below.

## Branch naming

- Feature branches: `feat/<short-description>` e.g. `feat/prioritization-matrix`
- Bugfix branches: `fix/<short-description>` e.g. `fix/overview-label-visibility`

## Pull requests

- Open a PR against `main` and include a concise description, the files changed, and any testing steps.
- Use draft PRs for early or large changes to invite feedback.

## Testing and CI

- Run `pnpm install && pnpm build && pnpm test` locally before opening a PR.
- Keep commits small and focused; include tests for behavioral changes.

## Working directly on `main`

If you prefer to commit directly to `main`, follow these additional rules:

1. Pull the latest main: `git fetch origin && git rebase origin/main`.
2. Make one small change and run the build/tests locally.
3. Push and open a PR (or push directly if you have permission), and request a quick review.

## Notes

- Avoid large, multi-purpose commits. If a change touches many unrelated files, split it into multiple PRs.
- If a change affects sensitive configuration or secrets, stop and ask a maintainer.
