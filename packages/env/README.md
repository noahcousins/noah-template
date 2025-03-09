# Environment Variables Package

This package provides a safe, type-checked way to access environment variables across the monorepo.

## Usage

```typescript
// Server-side code (API, database access)
import { serverEnv } from '@repo/env';

// Use environment variables
const dbUrl = serverEnv.database.url;
const isProduction = serverEnv.environment.isProduction;

// Client-side code (only safe variables)
import { clientEnv } from '@repo/env';

// Use client-safe environment variables
const authUrl = clientEnv.auth.url;
```

## Environment Variable Files

- `.env`: Base environment variables
- `.env.development`: Development variables
- `.env.production`: Production variables (not committed)
- `.dev.vars`: Local secrets (not committed)

## Security

**IMPORTANT**: Never commit real credentials or secrets to the repository. The default values in this package are for development only and must be replaced in production.

For production deployment:

1. Use Wrangler secrets: `wrangler secret put SECRET_NAME`
2. Set environment variables in your CI/CD pipeline
3. Use `.env.production` files that are not committed to version control

## Environment-specific Deployments

```bash
# Development
pnpm dev

# Staging
pnpm deploy:staging  

# Production
pnpm deploy:prod
```