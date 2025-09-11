# Contributing

## Coding Standards

- Use TypeScript and 2-space indentation.
- Format with `pnpm format` and lint with `pnpm lint`.

## Commit Conventions

- Begin commit messages with the related ticket ID (e.g., `MP-7: short description`).
- Keep messages concise and in the imperative mood.

## Testing Guidelines

- Ensure `pnpm lint`, `pnpm test`, and `pnpm typecheck` all pass before pushing.
- A pre-push hook automatically runs these checks.
