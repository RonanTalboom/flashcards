Build and deploy the flashcards app to Cloudflare Workers.

Steps:
1. Run `npm run deploy` (which runs `tsc -b && vite build && wrangler deploy`)
2. Report the deployment URL and version ID
3. If the build fails, diagnose and fix the issue, then retry
