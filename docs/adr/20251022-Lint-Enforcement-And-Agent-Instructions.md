# ADR: Enforcing Linting on Commit and CI/CD

## Status

Accepted

## Context

Lint errors were causing CI/CD failures and reducing code quality. To address this, we implemented both local and remote lint enforcement:

- **Pre-commit linting**: Using Husky and lint-staged, all commits are blocked if lint errors exist. This provides instant feedback and prevents bad code from entering the repository.
- **CI/CD linting**: The main GitHub Actions workflow runs `pnpm lint` and fails the build if errors are found, ensuring no lint errors reach production or main branches.
- **Husky setup**: The recommended modern workflow is to manually create hook files in `.husky/` and use `husky install` to initialize. The deprecated `husky add` and `husky set` commands are no longer used.
- **Automation**: The `postinstall` script in `package.json` ensures Husky hooks are installed after every dependency install.

## Decision

- Add Husky and lint-staged as devDependencies.
- Add a `lint-staged` config to `package.json`:
  ```json
  "lint-staged": {
    "src/**/*.{ts,tsx}": "eslint"
  }
  ```
- Add a Husky pre-commit hook in `.husky/pre-commit`:
  ```sh
  #!/bin/sh
  . "$(dirname "$0")/_/husky.sh"
  pnpm lint-staged
  ```
- Add `"postinstall": "husky install"` to `package.json` scripts.
- Ensure CI/CD workflow runs `pnpm lint` and fails on errors.

## Consequences

- Commits with lint errors are blocked locally.
- CI/CD fails if lint errors are present, even if bypassed locally.
- Developer experience and code quality are improved.
- Husky setup is future-proof and compatible with latest versions.

---

# Agent Instructions Update

## Lint Enforcement

- Always ensure linting is enforced both locally (pre-commit) and in CI/CD.
- Use Husky and lint-staged for pre-commit linting. Do not use deprecated Husky commands.
- Add a `postinstall` script for Husky installation.
- Document these steps in ADRs and onboarding guides.
- When updating or bootstrapping projects, always add these linting steps.

## Example Workflow

1. Install Husky and lint-staged:
   ```sh
   pnpm add -D husky lint-staged
   ```
2. Add lint-staged config to `package.json`.
3. Create `.husky/pre-commit` hook file with lint-staged command.
4. Add `postinstall` script to `package.json`.
5. Ensure CI/CD workflow runs lint checks.

## Best Practices

- Never use deprecated Husky CLI commands (`add`, `set`).
- Always use manual hook file creation and `husky install`.
- Block commits and CI/CD deployments with lint errors.
- Keep ADRs and agent instructions up to date with these conventions.
