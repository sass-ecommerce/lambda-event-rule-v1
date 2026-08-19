# lambda-event-rule-v1

AWS Lambda repo for EventBridge-triggered functions in `chapa-tu-venta`. Built with Serverless Framework v4 (local dev only), TypeScript, and Node.js 24; deployed via Terraform.

## Functions

| Function | Trigger | Purpose |
|----------|---------|---------|
| `event-rule-products` | EventBridge rule — `product.created`, `product.image.added` | Persists new products and merges uploaded product images into DynamoDB |

## Development

```bash
npm install
npm run dev          # serverless-offline on http://localhost:3000
npm run typecheck
npm run lint
npm test
```

## Build & package

```bash
npm run build        # esbuild -> .build/<name>/index.js
npm run package       # zips each .build/<name>/ into <name>.zip
```

## Deploy

Deployment is handled by Terraform (see `terraform/`), driven by `.github/workflows/terraform.yml` on push/PR to `develop`, `staging`, and `main`. Terraform state is stored in S3 at `lambdas/event-rule/<stage>/terraform.tfstate`.
