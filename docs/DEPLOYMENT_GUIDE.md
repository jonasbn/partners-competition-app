# Deployment Guide

The app is hosted as a static site on **Digital Ocean App Platform** and auto-deploys on every push to `main`.

## How It Works

1. Push commits to `main` (or merge a PR into `main`).
2. Digital Ocean detects the push via the GitHub integration and triggers a build.
3. Build command: `npm run build` — output goes to `build/`.
4. The static site is served from the `build/` directory.

Configuration lives in `.do/partners-competition-app.yaml`.

## Environment Variables

Set these in the Digital Ocean App Platform dashboard under **Settings → App-Level Environment Variables**:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_LOGTAIL_KEY` | No | Logtail/Better Stack ingestion token. Logging is silently disabled if absent. |
| `VITE_ECHO` | No | Debug string logged at app mount. Useful for verifying which build is live. |

Variables prefixed with `VITE_` are inlined into the browser bundle at build time.
**Never commit secrets to the repository.**

## Manual Deploy (doctl)

To trigger a deploy without pushing code (e.g. to pick up a new env var):

```bash
# Install doctl if needed: https://docs.digitalocean.com/reference/doctl/how-to/install/
doctl auth init

# List apps to find the app ID
doctl apps list

# Trigger a deploy
doctl apps create-deployment <APP_ID>
```

## Checking Deploy Status

- Open the app in the [Digital Ocean dashboard](https://cloud.digitalocean.com/apps).
- The **Activity** tab shows recent deploys and their logs.
- Failed deploys send an alert per the `DEPLOYMENT_FAILED` rule in `.do/partners-competition-app.yaml`.

## Region

The app is deployed to Amsterdam (`ams`).
