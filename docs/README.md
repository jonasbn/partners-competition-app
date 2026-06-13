# Documentation

This directory contains documentation for the Partners Competition App.

## Documentation Index

### Core Documentation

- **[TESTING.md](./TESTING.md)** - Test setup, conventions, and coverage goals
- **[LOGGING.md](./LOGGING.md)** - Logging implementation and configuration
- **[Z_INDEX_DOCUMENTATION.md](./Z_INDEX_DOCUMENTATION.md)** - CSS z-index management and layering strategy
- **[TODO.md](./TODO.md)** - Improvement backlog from codebase review (2026-06-12)
- **[security-review-baseline-2026-06-12.md](./security-review-baseline-2026-06-12.md)** - Security review baseline

### SDLC Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - How to deploy to Digital Ocean App Platform
- **[DATA_UPDATE.md](./DATA_UPDATE.md)** - How to add game results or a new season
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Branch strategy, commit style, PR conventions

### Archive

- **[archive/](./archive/)** - Historical documents for resolved incidents (see `archive/README.md`)

## Application Architecture

The application is built with:

- **React 18.3.1** - Core framework
- **Vite 8.0.14** - Build tool and development server
- **Bootstrap** - UI framework for responsive design
- **i18next** - Internationalisation (Danish default, English available)
- **Vitest** - Testing framework

## Contributing

When adding new documentation:

1. Follow markdown best practices
2. Ensure files pass markdown linting checks (see `.markdownlint.json`)
3. Update this index when adding new documentation files
