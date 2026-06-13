# Security Review — Full Codebase Baseline

**Reviewed:** All production source files in `src/`, CI/CD workflows, build configuration, and dependency state.
**Date:** 2026-06-12

---

## Overall Posture

The application has a narrow attack surface: it is a fully static, client-side-only SPA with no backend, no database, no authentication, no user-supplied input, and no server-side code. The game data is bundled at build time from static JSON files. No network requests are made from application code (only the Logtail SDK sends outbound telemetry).

Positive baseline findings:

- No `dangerouslySetInnerHTML`, `innerHTML`, `eval()`, or `document.write` anywhere — React's default XSS protection is intact throughout
- No SQL, shell command, or template injection surface
- `localStorage` reads are strictly validated before use (`savedTheme === 'light' || savedTheme === 'dark'` before acting on the value)
- Error boundaries do **not** render stack traces or error messages in the UI — only translated strings are shown to users
- No hardcoded credentials or tokens in source code
- `.env` and `.env.test` are correctly gitignored; no `.env*` files appear in git history
- `npm audit` reports **0 known vulnerabilities**
- All GitHub Actions are pinned to commit SHAs (supply chain integrity)
- Dependabot is active for both npm and Actions

---

## Findings

### Finding 1: Browser fingerprinting data sent to third-party on every page load

- **File:** `src/App.jsx:50–55`
- **Severity:** Low
- **Category:** Data exposure / Privacy

**Description:** On every application mount, `navigator.userAgent` and `navigator.language` are collected and sent to Logtail (a third-party SaaS logging service) unconditionally and without any user consent mechanism. Under GDPR and similar privacy regulations, `User-Agent` strings combined with timestamp and language constitute browser fingerprinting data, which is classified as personal data when it can be used to single out individuals.

```js
Logger.info('Partners Competition App started', {
  userAgent: navInfo.userAgent,   // browser fingerprint data
  language: navInfo.language,     // preference data
  viewport: viewportInfo
});
```

**Exploit Scenario:** A user visiting the app from the EU has their browser fingerprint silently exfiltrated to BetterStack/Logtail (`https://in.logs.betterstack.com`) without consent. If the Logtail account is ever breached or subpoenaed, this data is held by a third party. There is no privacy notice, consent banner, or data processing disclosure visible anywhere in the application.

**Recommendation:** Remove `userAgent` and `language` from the startup log payload. If telemetry is required, log only non-identifying operational data (e.g., viewport dimensions, app version). If fingerprinting data must be collected, add a consent mechanism and update the privacy policy to disclose the third-party recipient.

---

### Finding 2: Logtail ingestion token is exposed in the client-side bundle

- **File:** `src/utils/logger.js:5`, Vite build pipeline
- **Severity:** Low
- **Category:** Credentials exposure

**Description:** `VITE_LOGTAIL_KEY` is read via `import.meta.env.VITE_LOGTAIL_KEY`. Vite statically inlines all `VITE_*` variables into the JavaScript bundle at build time, meaning the token is plaintext-visible to anyone who opens DevTools or downloads the JS bundle. While Logtail's browser source tokens are write-only by design (they cannot read existing log data), the exposed token allows any third party to:

1. Write arbitrary log entries to the project's Logtail account, polluting incident response and monitoring
2. Consume the project's Logtail ingest quota

**Recommendation:** This is an accepted trade-off when using browser-side logging SDKs — there is no way to keep a client-side token secret. Mitigate by:

- Scoping the Logtail source token to the specific source only (no cross-source write permissions)
- Setting ingest rate limits on the Logtail source if the service supports it
- Treating the token as rotatable and rotating it if abuse is detected

---

## No Findings In

| Area | Result |
|---|---|
| XSS | Clean — no unsafe HTML injection points |
| Injection (SQL / shell / template) | Not applicable — no backend |
| Authentication / authorisation bypass | Not applicable — no auth layer |
| Secrets in source or git history | None found |
| Dependency vulnerabilities | 0 per `npm audit` |
| Unsafe `localStorage` usage | Properly validated before use |
| Error information disclosure | Stack traces go to Logtail only, not rendered in UI |
| CI secrets handling | Correctly using `${{ secrets.* }}` — no plaintext |
| Supply chain (Actions pinning) | All actions pinned to SHAs |
