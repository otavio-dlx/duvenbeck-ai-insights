## Agent Instructions — duvenbeck-ai-insights

## Purpose

These instructions are intended to help automated agents (including CI bots and AI programming assistants) interact productively and safely with this repository. Follow them to make edits, create pull requests, and run checks.

## Quick rules

- Always run tests and typechecks locally (or via CI) before opening a PR.
- Make minimal, focused changes. Prefer small commits with descriptive messages.
- Never commit secrets (API keys, credentials, tokens) or add them to history. If you find a secret, stop and notify the maintainers.
- When adding or modifying code, prefer adding tests that cover the new behavior.

## Editing and commit guidance

- Edit only the files necessary to implement the requested change. Avoid mechanical reformatting across many files.
- Preserve the repository's style and patterns. This project uses TypeScript, React and Tailwind; follow existing conventions (e.g. file naming, component structure, hooks).
- Use concise commit messages. Format: "<area>: short description". Examples:
  - "components: add LoginGate fallback state"
  - "fix(types): narrow user type for metric card"
- Create a branch for each change and open a PR against `main`. Include a short description and link to any related issue.

## Code review and PR checklist

Before marking a PR ready for review, ensure:

1. Code builds with no TypeScript errors (tsc) and no lint warnings relevant to the change.
2. Unit tests pass (if present) and new tests are added for new behavior.
3. Changes include small, focused commits and a clear PR description.
4. No secrets, credentials, or sensitive data were added.
5. Package.json / dependency changes are intentional and minimal. Explain why in the PR body.

## Agent-specific best practices

- Safety-first edits: If unsure whether a change affects security, permissions, or production flows, add a short note in the PR and request a human reviewer.
- Prefer to create a draft PR when making larger changes so maintainers can give early feedback.
- When modifying UI components, make small visual changes and include screenshots or a short gif in the PR.
- If the change affects public APIs or types, bump/review the relevant versioning notes and document the change in the changelog or PR description.

## Testing and verification steps for agents

- Install dependencies using the project's package manager (pnpm or npm). Example (local dev):

  pnpm install

- Run typecheck and build:

  pnpm build

- Run tests (if configured):

  pnpm test

- Run linters/formatters only when necessary to keep diffs minimal:

  pnpm lint

## How to propose changes

- Branch from `main` using a descriptive name: `fix/login-gate-null-state` or `feat/metrics-filter`.
- Add a short description and list of files changed in the PR body.
- If you introduce any new script, document it in the README or package.json scripts block.

## Example prompts for an automated agent

- "Add a fallback UI to `src/components/LoginGate.tsx` when the auth provider returns null. Include a unit test and update the storybook entry."
- "Refactor `MetricCard` to accept an optional `onClick` handler. Update types and add tests covering the click behavior."

## Security and secrets

- Never commit secrets. Use environment variables and `.env` files excluded by `.gitignore` for local testing only.
- If a secret is accidentally committed, create an issue or contact the maintainers immediately and follow the repository policy for secret rotation.

## Maintainer contact

If an automated change is risky or you need guidance, open a draft PR and ping @otavio-dlx or another project maintainer.

## Acceptance criteria for agent edits

- Changes are limited to the requested scope and do not introduce unrelated formatting or dependency upgrades.
- Typecheck and tests pass locally.
- PR includes a clear description and small commits.

## Appendix: small checklist for scripted runs

1. Fetch the latest main: `git fetch origin && git rebase origin/main`
2. Create branch: `git checkout -b feat/describe-change`
3. Make edits and run `pnpm build` and `pnpm test`
4. Commit and push: `git commit -m "<area>: <short summary>" && git push -u origin HEAD`
5. Open a PR and set it to draft if unsure.

---

Thank you for helping maintain a safe, testable, and review-friendly repo!
