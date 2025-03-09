# CLAUDE.md - Project Guidelines

## Build & Development
- Root build: `turbo build`
- Web build: `next build`
- DB build: `tsc`
- Web dev: `next dev`
- API dev: `wrangler dev` or `wrangler dev --env development`

## Linting & Type Checking
- Lint all: `turbo lint`
- Lint web: `next lint` or `next lint --fix`
- Lint UI: `eslint . --max-warnings 0`
- Type check: `tsc --noEmit`

## Database Commands
- Push schema: `drizzle-kit push:pg`
- Studio: `drizzle-kit studio`
- Generate migration: `drizzle-kit generate`
- Apply migration: `drizzle-kit migrate`

## Environment Variables
- Development: Use `.env.development` for local dev
- Staging: `wrangler deploy --env staging`
- Production: `wrangler deploy --env production`
- Secrets: `wrangler secret put SECRET_NAME`

## Deployment
- API: `pnpm -F api deploy:prod`
- Web: `pnpm -F web build` then deploy the build output

## Code Style
- **Imports:** React first, then packages, then internal (@repo/)
- **Naming:** PascalCase components, camelCase variables/functions, snake_case DB columns
- **Components:** Function components with explicit returns, props destructuring
- **Types:** Explicit type annotations, React.ComponentProps extension
- **Styling:** Tailwind with cn utility for class merging
- **Formatting:** 2-space indentation, double quotes for JSX/strings