# GitHub Actions CI/CD Workflows

This repository contains three GitHub Actions workflows to ensure code quality and reliability:

## 🚀 Workflows Overview

### 1. **CI Workflow** (`.github/workflows/ci.yml`)

**Comprehensive CI pipeline with multiple jobs**

- **Test Matrix**: Tests on Node.js 18.x, 20.x, and 22.x
- **Security Auditing**: Runs `npm audit` to check for vulnerabilities
- **Performance Testing**: Lighthouse CI integration (when configured)
- **Code Coverage**: Codecov integration for coverage reporting
- **Build Artifacts**: Uploads build artifacts for deployment
- **Deployment Preview**: Creates preview deployments for pull requests

**Triggers**: Push to `main`/`develop`, Pull requests to `main`

### 2. **Test Workflow** (`.github/workflows/test.yml`)

**Focused testing pipeline**

- **Core Testing**: Runs the complete Vitest test suite (`npm run test:run`)
- **Build Verification**: Ensures the app builds successfully
- **Multi-Node Testing**: Tests across Node.js versions 18.x, 20.x, 22.x
- **Artifact Validation**: Verifies build output integrity

**Triggers**: Push to `main`/`develop`, Pull requests to `main`

### 3. **Code Quality Workflow** (`.github/workflows/quality.yml`)

**Code quality and coverage analysis**

- **Test Coverage**: Generates coverage reports using `npm run test:coverage`
- **Coverage Artifacts**: Uploads coverage reports with 30-day retention
- **Lint Checking**: Runs linting if available in package.json
- **Format Checking**: Runs format checking if available in package.json
- **Build Analysis**: Analyzes build output and file sizes

**Triggers**: Push to `main`, Pull requests to `main`

## 📊 Test Suite Integration

All workflows use the existing Vitest test suite:

```bash
# Run tests in CI mode (single run, no watch)
npm run test:run

# Run tests with coverage
npm run test:coverage

# Build the application
npm run build
```

## 🔧 Available npm Scripts

- `npm start` / `npm run dev` - Start development server with Vite
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once (CI mode)
- `npm run test:coverage` - Run tests with coverage report

## 📈 Test Coverage

The workflows automatically generate and store test coverage reports:

- **Current Test Files**: 13 test files
- **Current Test Count**: 67 tests
- **Test Categories**:
  - Component tests (App, ErrorBoundary, SummaryCards, Leaderboard)
  - Integration tests (full app rendering and behavior)
  - Utility tests (data processing, avatar selection, theme context)
  - Smoke tests (basic component rendering)

## 🔒 Security Features

- **Dependency Auditing**: Automatic security vulnerability scanning
- **Production Audits**: High-severity vulnerability checks
- **Artifact Security**: Secure upload and storage of build artifacts

## 🚨 Status Badges

Add these to your README.md to show CI status:

```markdown
![CI](https://github.com/jonasbn/partners-competition-app/workflows/CI/badge.svg)
![Tests](https://github.com/jonasbn/partners-competition-app/workflows/Tests/badge.svg)
![Code Quality](https://github.com/jonasbn/partners-competition-app/workflows/Code%20Quality/badge.svg)
```

## 🛠️ Configuration

### Required Secrets (Optional)

- `CODECOV_TOKEN` - For coverage reporting integration
- `LHCI_GITHUB_APP_TOKEN` - For Lighthouse CI integration

### Node.js Requirements

- **Minimum**: Node.js 16.0.0
- **Tested On**: Node.js 18.x, 20.x, 22.x
- **Package Manager**: npm 8.0.0+

## 📋 Workflow Status

| Workflow | Purpose | Node Versions | Coverage | Artifacts |
|----------|---------|---------------|----------|-----------|
| CI | Complete pipeline | 18, 20, 22 | ✅ | ✅ |
| Tests | Core testing | 18, 20, 22 | ❌ | ❌ |
| Code Quality | Quality analysis | 20 | ✅ | ✅ |

## 🏃‍♂️ Local Testing

To run the same tests locally that run in CI:

```bash
# Install dependencies
npm ci

# Run all tests (CI mode)
npm run test:run

# Run tests with coverage
npm run test:coverage

# Build and verify
npm run build
```

These workflows ensure that every commit and pull request maintains high code quality and passes all tests before merging.
