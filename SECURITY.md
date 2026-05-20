# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| Latest `main` branch | Yes |

TestLab 29119 is a static browser game (GitHub Pages). Only the current deployment on `main` is maintained.

## Reporting a vulnerability

If you discover a security issue, please **do not** open a public GitHub issue.

**Preferred:** Use [GitHub private vulnerability reporting](https://github.com/ismaiidogan/TestLab-29119/security/advisories/new) (Security → Advisories → Report a vulnerability).

**Alternative:** Email the repository owner with:

- Description of the issue and impact
- Steps to reproduce
- Affected URL or file paths (if known)

We aim to acknowledge reports within **7 days** and provide a fix or mitigation plan when applicable.

## Scope notes

- Client-side `localStorage` data is not validated server-side by design.
- Third-party CDN resources (e.g. Google Fonts) follow their respective providers’ security models.

Thank you for helping keep this project secure.
