# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

AWS Lambda repo hosting EventBridge-triggered functions for the `chapa-tu-venta` platform, using Serverless Framework v4, TypeScript, and Node.js 24. Each Lambda lives in its own `src/<name>/` directory. This repo is scoped to event-driven (EventBridge rule) Lambdas — HTTP and Cognito triggers live in sibling repos under `lambdas/`.

## Commands

```bash
# Install dependencies
npm install

# Local development (serverless-offline)
npm run dev   # http://localhost:3000

# Type check
npm run typecheck

# Lint / format
npm run lint
npm run lint:fix
npm run format
npm run format:check

# Tests
npm test
npm run test:watch

# Build for Terraform deploy (outputs to .build/<name>/)
npm run build

# Package each .build/<name>/ into <name>.zip for Terraform upload
npm run package

# Deploy via Serverless Framework (not the primary deploy path)
serverless deploy --stage dev   # or staging / prod
```

## Architecture

| Function | Trigger | Purpose |
|----------|---------|---------|
| `event-rule-products` | EventBridge rule (`product.created`, `product.image.added`) | Persists new products and merges uploaded product images into DynamoDB |

Each function follows the same pattern:
- `src/<name>/<name>.controller.ts` — Lambda handler entry; receives the AWS event type and dispatches to a service based on `detail-type`
- `src/<name>/index.ts` — re-exports the handler; this is what `config/functions.yml` and `esbuild.config.js` reference
- `src/<name>/services/` — business logic per event type
- `src/<name>/repositories/` — DynamoDB data access

Other key files:
- **`config/functions.yml`** — all Lambda function declarations (handler path + HTTP event for local dev); imported by `serverless.yml`
- **`config/dev.yml`** — environment variables for local dev (`STAGE`, `REGION`, `DYNAMODB_TABLE_PRODUCTS`); injected via `provider.environment`
- **`esbuild.config.js`** — auto-discovers entry points by reading `src/` subdirectories; outputs minified bundles to `.build/<name>/index.js`
- **`serverless.yml`** — provider config; service `event-rule-lambdas`, runtime `nodejs24.x`; esbuild bundles TypeScript with `@aws-sdk/*` excluded

## Terraform infrastructure

The `terraform/` directory manages the AWS resources. The primary deploy path for production is Terraform (not `serverless deploy`):

- **`terraform/main.tf`** — root module; instantiates the `event-rule-products` child module
- **`terraform/locals.tf`** — resolves stage/project locals and common resource tags
- **`terraform/event-rule-products/`** — defines the Lambda function resource, the IAM permission for EventBridge to invoke it, and the `aws_cloudwatch_event_target` wiring it to the shared `ctv-rule-products-<stage>` rule

Lambda role ARN and the EventBridge rule ARN are read from SSM (`data.aws_ssm_parameter`), and the EventBridge bus/rule themselves are managed outside this repo (shared platform infra).

## Key conventions

- All source files go under `src/`
- Tests live under `test/` and must match `**/*.test.ts`
- Prefix unused Lambda parameters with `_` (e.g. `_event`) to satisfy TypeScript strict mode
- Adding a new Lambda: create `src/<name>/index.ts` + handler file, add an entry to `config/functions.yml`, and add a new Terraform child module under `terraform/<name>/`
- Stage is set via `--stage` flag (Serverless) or `var.environment` (Terraform); defaults to `dev`
- Terraform state lives in S3 at key `lambdas/event-rule/<stage>/terraform.tfstate` (bucket `ctv-terraform-state-<stage>`) — do not reuse this key for other lambda repos
