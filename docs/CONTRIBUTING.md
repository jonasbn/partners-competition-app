# Contributing

## Branch Strategy

- `main` is the production branch. All merges to `main` trigger a deployment.
- Create a feature branch for every change: `<type>/<short-description>`.

Common branch prefixes:

| Prefix | Use for |
|--------|---------|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation changes |
| `test/` | Test additions or fixes |
| `chore/` | Dependency updates, build config |

## Commit Style

Use a short imperative subject line with a type prefix:

```text
feat: add 2027 season data
fix: correct win-rate calculation in SimpleLeaderboard
docs: update DEPLOYMENT_GUIDE with doctl instructions
test: add SimpleGamesList component tests
chore: bump vitest to 3.x
```

Keep the subject under 72 characters. Add a body if the motivation isn't obvious from the title.

## Pull Requests

1. Open a PR against `main`.
2. Give the PR a clear title (same style as commit messages).
3. Describe **what** changed and **why** in the PR body.
4. Ensure all CI checks pass before requesting a review.

## CI Checks

The CI pipeline runs on every push and PR:

- **Tests**: `npm test` (Vitest, must all pass)
- **Build**: `npm run build` (must succeed)
- **Code quality**: formatting and lint checks

Fix any failing checks before the PR can be merged.

## Local Development

```bash
npm start          # Dev server on http://localhost:3000
npm test           # Run tests once
npm run test:watch # Watch mode
npm run build      # Production build
```

See the root [README.md](../README.md) for full setup instructions.
